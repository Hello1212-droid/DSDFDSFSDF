import { saveAs } from "file-saver";
import { jsonToDocx } from "./exportDocx";
import type { DocMeta } from "../types";

export function downloadBlob(blob: Blob, filename: string) {
  saveAs(blob, filename);
}

export function downloadText(content: string, filename: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  saveAs(blob, filename);
}

export function downloadHtml(html: string, filename: string) {
  const wrapped =
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${filename}</title>` +
    `<style>body{font-family:Calibri,'Nirmala UI',sans-serif;max-width:794px;margin:40px auto;padding:0 24px;line-height:1.6;}` +
    `h1{font-size:24pt}h2{font-size:20pt}h3{font-size:16pt}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px 10px}th{background:#f1f5f9}blockquote{border-left:3px solid #ccc;padding-left:12px;color:#444}</style></head><body>${html}</body></html>`;
  downloadText(wrapped, filename, "text/html;charset=utf-8");
}

export async function exportAsDocx(json: any, meta: DocMeta) {
  const blob = await jsonToDocx(json, meta);
  const name = meta.name.replace(/[^\w\d\s-]/g, "").trim() || "document";
  downloadBlob(blob, `${name}.docx`);
}

export function exportAsTxt(json: any, meta: DocMeta) {
  const text = plainTextFromJson(json);
  const name = meta.name.replace(/[^\w\d\s-]/g, "").trim() || "document";
  downloadText(text, `${name}.txt`);
}

export function plainTextFromJson(json: any): string {
  let out = "";
  const walk = (node: any, block: boolean) => {
    if (node.type === "text") {
      out += node.text ?? "";
      return;
    }
    if (node.type === "hardBreak") {
      out += "\n";
      return;
    }
    const children = node.content || [];
    children.forEach((c: any) => walk(c, true));
    if (block && /paragraph|heading|listItem|blockquote|codeBlock|table|tableRow/.test(node.type || "")) {
      out += "\n";
    }
  };
  walk(json, true);
  return out;
}

export function downloadJson(json: any, name: string) {
  downloadText(JSON.stringify(json, null, 2), `${name}.lekhana.json`, "application/json");
}

export function printDocument() {
  window.print();
}
