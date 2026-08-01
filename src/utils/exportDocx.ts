import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  type ILevelsOptions,
} from "docx";
import type { DocMeta } from "../types";

interface ListCtx {
  listDepth: number;
}

interface ParaOpts {
  numbering?: { reference: string; level: number };
  indent?: { left: number; hanging?: number; right?: number };
  alignment?: (typeof AlignmentType)[keyof typeof AlignmentType];
  spacing?: { line: number };
  heading?: (typeof HeadingLevel)[keyof typeof HeadingLevel];
  border?: Record<string, any>;
}

const HEADING_LEVELS: Record<number, any> = {
  1: HeadingLevel.HEADING_1,
  2: HeadingLevel.HEADING_2,
  3: HeadingLevel.HEADING_3,
  4: HeadingLevel.HEADING_4,
  5: HeadingLevel.HEADING_5,
  6: HeadingLevel.HEADING_6,
};

function alignOf(v: string | undefined) {
  switch (v) {
    case "left": return AlignmentType.LEFT;
    case "center": return AlignmentType.CENTER;
    case "right": return AlignmentType.RIGHT;
    case "justify": return AlignmentType.JUSTIFIED;
    default: return undefined;
  }
}

function ptToHalfPt(size: string | null | undefined): number | undefined {
  if (!size) return undefined;
  const n = parseFloat(size);
  if (Number.isNaN(n)) return undefined;
  return Math.round(n * 2);
}

function hexColor(v: string | null | undefined): string | undefined {
  if (!v || v === "inherit") return undefined;
  return v.replace("#", "");
}

function lineHeightToSpacing(v: string | null | undefined): number | undefined {
  if (!v) return undefined;
  const n = parseFloat(v);
  if (Number.isNaN(n)) return undefined;
  return Math.round(n * 240);
}

/** Build a TextRun (or hyperlink) from a text node with marks. */
function buildRun(node: any): TextRun | ExternalHyperlink {
  const marks: Record<string, any> = {};
  for (const m of node.marks || []) marks[m.type] = m;
  const link = marks["link"];
  const ts = marks["textStyle"]?.attrs || {};
  const hl = marks["highlight"]?.attrs?.color;
  const run = new TextRun({
    text: node.text ?? "",
    bold: marks["bold"] ? true : undefined,
    italics: marks["italic"] ? true : undefined,
    underline: marks["underline"] ? {} : undefined,
    strike: marks["strike"] ? true : undefined,
    subScript: marks["subscript"] ? true : undefined,
    superScript: marks["superscript"] ? true : undefined,
    color: ts.color ? hexColor(ts.color) : undefined,
    font: ts.fontFamily || undefined,
    size: ptToHalfPt(ts.fontSize),
    shading: hl ? { type: "clear", fill: hexColor(hl) } : undefined,
  });
  if (link?.attrs?.href) {
    return new ExternalHyperlink({ link: link.attrs.href, children: [run] });
  }
  return run;
}

function buildRuns(node: any): Array<TextRun | ExternalHyperlink> {
  const runs: Array<TextRun | ExternalHyperlink> = [];
  for (const child of node.content || []) {
    if (child.type === "text") runs.push(buildRun(child));
    else if (child.type === "hardBreak") runs.push(new TextRun({ break: 1 }));
  }
  return runs;
}

function makePara(runs: Array<TextRun | ExternalHyperlink>, opts: ParaOpts = {}): Paragraph {
  return new Paragraph({
    children: runs,
    numbering: opts.numbering,
    indent: opts.indent,
    alignment: opts.alignment,
    spacing: opts.spacing,
    heading: opts.heading,
    border: opts.border,
  });
}

/** Load an image node into an ImageRun, scaled to the content width. */
async function buildImage(node: any): Promise<Paragraph[]> {
  const src: string | undefined = node.attrs?.src;
  if (!src) return [new Paragraph({ children: [] })];
  let data: string | ArrayBuffer;
  try {
    if (src.startsWith("data:")) {
      data = src.split(",")[1] || src;
    } else {
      const res = await fetch(src, { mode: "cors" });
      if (!res.ok) throw new Error("fetch failed");
      const blob = await res.blob();
      data = await blob.arrayBuffer();
    }
  } catch {
    return [new Paragraph({ children: [new TextRun({ text: "[image]", italics: true })] })];
  }

  let width = Number(node.attrs?.width) || 600;
  let height = Number(node.attrs?.height) || 400;
  if (!width || !height) {
    const dim = await loadImageDim(src);
    if (dim) { width = dim.width; height = dim.height; }
  }
  const maxW = 620;
  if (width > maxW) {
    const ratio = maxW / width;
    width = maxW;
    height = Math.round(height * ratio);
  }
  let type: any = "png";
  if (src.startsWith("data:image/")) {
    type = src.slice(5).split(";")[0] || "png";
  }
  return [
    new Paragraph({
      children: [new ImageRun({ data, type, transformation: { width: Math.round(width), height: Math.round(height) } })],
      spacing: { after: 120 },
    }),
  ];
}

function loadImageDim(src: string): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/** Convert a list container to numbered/bulleted paragraphs. */
function convertList(node: any, ctx: ListCtx): Paragraph[] {
  const ref = node.type === "orderedList" ? "ordered" : "bullet";
  const out: Paragraph[] = [];
  for (const item of node.content || []) {
    const depth = ctx.listDepth;
    const nested: any[] = [];
    const itemKids: any[] = [];
    for (const child of item.content || []) {
      if (child.type === "bulletList" || child.type === "orderedList") nested.push(child);
      else itemKids.push(child);
    }
    const indent = { left: 720 * (depth + 1) - 360, hanging: 360 };
    const numbering = { reference: ref, level: depth };
    let produced = false;
    for (const c of itemKids) {
      const paras = convertBlock(c, ctx);
      paras.forEach((p) => {
        if (!produced) {
          // Rebuild the first line with numbering + hanging indent so it lists correctly.
          out.push(
            makePara(buildRuns(c), { numbering, indent }),
          );
          produced = true;
        } else {
          out.push(p);
        }
      });
    }
    if (!produced) out.push(makePara([], { numbering, indent }));
    nested.forEach((child) => {
      ctx.listDepth += 1;
      out.push(...convertList(child, ctx));
      ctx.listDepth -= 1;
    });
  }
  return out;
}

function convertBlock(node: any, ctx: ListCtx, json?: any): Paragraph[] {
  const children = () => buildRuns(node);
  switch (node.type) {
    case "paragraph":
      return [
        makePara(children(), {
          alignment: alignOf(node.attrs?.textAlign),
          spacing: (() => { const lh = lineHeightToSpacing(node.attrs?.lineHeight); return lh ? { line: lh } : undefined; })(),
        }),
      ];
    case "heading":
      return [
        makePara(children(), {
          alignment: alignOf(node.attrs?.textAlign),
          heading: HEADING_LEVELS[node.attrs?.level] || HeadingLevel.HEADING_1,
        }),
      ];
    case "blockquote":
      return (node.content || []).flatMap((c: any) => {
        if (c.type === "paragraph" || c.type === "heading") {
          return [
            makePara(buildRuns(c), {
              indent: { left: 720 },
              border: { left: { style: BorderStyle.SINGLE, size: 12, color: "CBD5E1", space: 8 } },
            }),
          ];
        }
        return convertBlock(c, ctx, json);
      });
    case "codeBlock":
      return [
        makePara([
          new TextRun({
            text: (node.content || []).map((c: any) => c.text || "").join(""),
            font: "Consolas",
            size: 20,
            shading: { type: "clear", fill: "F1F5F9" },
          }),
        ]),
      ];
    case "bulletList":
    case "orderedList":
      return convertList(node, ctx);
    case "taskList":
      return (node.content || []).flatMap((item: any) => {
        const checked = item.attrs?.checked ? "☒ " : "☐ ";
        const itemOut: Paragraph[] = [];
        let produced = false;
        for (const c of item.content || []) {
          convertBlock(c, ctx, json).forEach(() => {
            itemOut.push(makePara([new TextRun({ text: checked }), ...buildRuns(c)], {}));
            produced = true;
          });
        }
        if (!produced) itemOut.push(makePara([new TextRun({ text: checked })], {}));
        return itemOut;
      });
    case "table": {
      const rows = (node.content || []).map((row: any) =>
        new TableRow({
          children: (row.content || []).map((cell: any) => {
            const isHeader = cell.type === "tableHeader";
            const paras = (cell.content || []).flatMap((c: any) => convertBlock(c, ctx, json));
            return new TableCell({
              children: paras,
              shading: isHeader ? { type: "clear", fill: "F1F5F9" } : undefined,
              verticalAlign: VerticalAlign.TOP,
              width: cell.attrs?.colwidth
                ? { size: cell.attrs.colwidth[0], type: WidthType.DXA }
                : undefined,
            });
          }),
        }),
      );
      return [new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } }) as unknown as Paragraph];
    }
    case "horizontalRule":
      return [makePara([], { border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "D1D5DB" } } })];
    case "image":
      return [];
    default:
      return (node.content || []).flatMap((c: any) => convertBlock(c, ctx, json));
  }
}

/** Async traversal building the whole document (images handled asynchronously). */
async function buildChildrenAsync(node: any, ctx: ListCtx): Promise<Paragraph[]> {
  const out: Paragraph[] = [];
  for (const child of node.content || []) {
    if (child.type === "image") {
      out.push(...(await buildImage(child)));
    } else {
      out.push(...convertBlock(child, ctx, node));
    }
  }
  return out;
}

export async function jsonToDocx(json: any, meta: DocMeta): Promise<Blob> {
  const ctx: ListCtx = { listDepth: 0 };
  const body = await buildChildrenAsync(json, ctx);

  const toTwips = (mm: number) => Math.round((mm * 1440) / 25.4);
  const marginsTwips = {
    top: toTwips(meta.margins.top),
    right: toTwips(meta.margins.right),
    bottom: toTwips(meta.margins.bottom),
    left: toTwips(meta.margins.left),
  };

  const makeLevels = (format: (typeof LevelFormat)[keyof typeof LevelFormat], texts: string[]): ILevelsOptions[] =>
    texts.map((text, l) => ({
      level: l,
      format,
      text,
      alignment: AlignmentType.START,
      style: { paragraph: { indent: { left: 720 * (l + 1), hanging: 360 } } },
    }));

  const numbering = {
    config: [
      {
        reference: "ordered",
        levels: makeLevels(LevelFormat.DECIMAL, ["%1.", "%2.", "%3.", "%4."]),
      },
      {
        reference: "bullet",
        levels: makeLevels(LevelFormat.BULLET, ["•", "○", "▪", "•"]),
      },
    ],
  };

  const landscape = meta.orientation === "landscape";
  const letter = meta.pageSize === "letter";
  const width = letter ? 12240 : 11906;
  const height = letter ? 15840 : 16838;

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
    },
    numbering,
    sections: [
      {
        properties: {
          page: {
            margin: marginsTwips,
            size: {
              orientation: landscape
                ? "landscape"
                : "portrait",
              width: landscape ? height : width,
              height: landscape ? width : height,
            },
          },
        },
        children: body,
      },
    ],
  });

  return Packer.toBlob(doc);
}
