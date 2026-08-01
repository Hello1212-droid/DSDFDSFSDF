import { Extension, mergeAttributes, Node } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Fragment } from "@tiptap/pm/model";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { LanguageInputExtension } from "./languageInput";
import { PageBreakView } from "../components/PageBreakView";
import { PageView } from "../components/PageView";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import FontFamily from "@tiptap/extension-font-family";
import { Mathematics } from "@tiptap/extension-mathematics";
import { TableKit } from "@tiptap/extension-table";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import type { Node as PMNode } from "@tiptap/pm/model";

/* ---------------------------- Font size ---------------------------- */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return { types: ["textStyle"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (el) => el.style.fontSize?.replace(/['"]/g, "") || null,
            renderHTML: (attrs) =>
              attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (size: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain()
            .setMark("textStyle", { fontSize: null })
            .removeEmptyTextStyle()
            .run(),
    };
  },
});

/* ---------------------------- Line height ---------------------------- */
function setBlockAttr(attr: string, value: string | null) {
  return ({ tr, state, dispatch }: { tr: any; state: any; dispatch: any }) => {
    const { doc, selection } = state;
    const { from, to } = selection;
    const nodes: Array<{ pos: number }> = [];
    doc.nodesBetween(from, to, (node: PMNode, pos: number) => {
      if (node.type.name === "paragraph" || node.type.name === "heading") {
        nodes.push({ pos });
      }
    });
    if (!nodes.length) return false;
    nodes.forEach(({ pos }) => {
      tr.setNodeMarkup(pos, undefined, {
        ...state.doc.nodeAt(pos).attrs,
        [attr]: value,
      });
    });
    if (dispatch) dispatch(tr);
    return true;
  };
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (value: string) => ReturnType;
      unsetLineHeight: () => ReturnType;
    };
  }
}

export const LineHeight = Extension.create({
  name: "lineHeight",
  addOptions() {
    return { types: ["heading", "paragraph"] };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (el) => el.style.lineHeight || null,
            renderHTML: (attrs) =>
              attrs.lineHeight
                ? { style: `line-height: ${attrs.lineHeight}` }
                : {},
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setLineHeight: (value: string) => (args) => setBlockAttr("lineHeight", value)(args),
      unsetLineHeight: () => (args) => setBlockAttr("lineHeight", null)(args),
    };
  },
});

/* ---------------------------- Page node (multi-page like MS Word) ---------------------------- */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    page: {
      /** Split the current page at the cursor into two pages (like Word's page break). */
      insertPageBreak: () => ReturnType;
      /** Append a new empty page at the end of the document. */
      addPageAtEnd: () => ReturnType;
      /** Add a new empty page right after the page node at `pos`. */
      addPageAfterNode: (pos: number) => ReturnType;
      /** Delete the page node at `pos` (keeps at least one page). */
      deletePage: (pos: number) => ReturnType;
    };
  }
}

/** Split the page containing the cursor at the cursor position into two pages. */
function splitPageAtCursor(state: any, dispatch: any): boolean {
  const { from } = state.selection;
  const schema = state.schema;
  const $pos = state.doc.resolve(from);
  let pagePos = -1;
  let pageNode: any = null;
  for (let d = $pos.depth; d > 0; d--) {
    const n = $pos.node(d);
    if (n.type.name === "page") { pageNode = n; pagePos = $pos.before(d); break; }
  }
  if (!pageNode) return false;
  const contentStart = pagePos + 1;
  const contentEnd = contentStart + pageNode.content.size;
  const offset = from - contentStart;
  const ensure = (f: any) => (f.size ? f : Fragment.from(schema.nodes.paragraph.create()));
  const beforeFrag = ensure(pageNode.content.cut(0, offset));
  const afterFrag = ensure(pageNode.content.cut(offset, pageNode.content.size));
  const tr = state.tr;
  tr.replaceWith(contentStart, contentEnd, beforeFrag);
  const newPagePos = contentStart + beforeFrag.size + 1;
  const newPage = schema.nodes.page.create(null, afterFrag);
  tr.insert(newPagePos, newPage);
  // place cursor at start of the new page
  tr.setSelection(state.selection.constructor.near(tr.doc.resolve(newPagePos + 1)));
  if (dispatch) dispatch(tr);
  return true;
}

export const Page = Node.create({
  name: "page",
  group: "block",
  content: "block+",
  defining: true,
  selectable: false,
  draggable: false,
  parseHTML() {
    return [{ tag: "section[data-lekhana-page]" }];
  },
  renderHTML({ HTMLAttributes }) {
    return ["section", mergeAttributes({ "data-lekhana-page": "" }, HTMLAttributes)];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PageView);
  },
  addCommands() {
    const schemaAt = (state: any) => state.schema;
    return {
      insertPageBreak: () => ({ state, dispatch }) => splitPageAtCursor(state, dispatch),
      addPageAtEnd:
        () =>
        ({ state, dispatch }) => {
          const schema = schemaAt(state);
          const end = state.doc.content.size + 1;
          const newPage = schema.nodes.page.create(null, schema.nodes.paragraph.create());
          const tr = state.tr.insert(end, newPage).scrollIntoView();
          if (dispatch) dispatch(tr);
          return true;
        },
      addPageAfterNode:
        (pos) =>
        ({ state, dispatch }) => {
          const schema = schemaAt(state);
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== "page") return false;
          const newPage = schema.nodes.page.create(null, schema.nodes.paragraph.create());
          const tr = state.tr.insert(pos + node.nodeSize, newPage).scrollIntoView();
          if (dispatch) dispatch(tr);
          return true;
        },
      deletePage:
        (pos) =>
        ({ state, dispatch }) => {
          const node = state.doc.nodeAt(pos);
          if (!node || node.type.name !== "page") return false;
          if (state.doc.childCount <= 1) return false; // keep at least one page
          const tr = state.tr.delete(pos, pos + node.nodeSize);
          if (dispatch) dispatch(tr);
          return true;
        },
    };
  },
});

/* ---------------------------- Legacy page break (for importing old docs) ---------------------------- */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    pageBreak: {
      removePageBreak: (pos: number) => ReturnType;
    };
  }
}

export const PageBreak = Node.create({
  name: "pageBreak",
  group: "block",
  atom: true,
  selectable: false,
  draggable: false,
  parseHTML() {
    return [{ tag: 'hr[data-page-break]' }];
  },
  renderHTML() {
    return ["div", { "data-page-break": "true", class: "page-break" }];
  },
  addNodeView() {
    return ReactNodeViewRenderer(PageBreakView);
  },
});

/* ---------------------------- Text case transform ---------------------------- */
declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    textTransform: {
      toUpperCase: () => ReturnType;
      toLowerCase: () => ReturnType;
      toTitleCase: () => ReturnType;
      toSentenceCase: () => ReturnType;
    };
  }
}

function titleCase(s: string): string {
  return s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1).toLowerCase());
}
function sentenceCase(s: string): string {
  return s.replace(/(^\s*\w|[.!?]\s+\w)/g, (m) => m.toUpperCase());
}

export const TextTransform = Extension.create({
  name: "textTransform",
  addCommands() {
    const apply = (fn: (s: string) => string) => ({ state, dispatch }: any) => {
      const { from, to } = state.selection;
      if (from === to) return false;
      const tr = state.tr;
      const ranges: Array<[number, number, any]> = [];
      state.doc.nodesBetween(from, to, (node: any, pos: number) => {
        if (node.isText) {
          const rf = Math.max(from, pos);
          const rt = Math.min(to, pos + (node.text || "").length);
          if (rt > rf) ranges.push([rf, rt, node]);
        }
      });
      if (!ranges.length) return false;
      let changed = false;
      for (let i = ranges.length - 1; i >= 0; i--) {
        const [rf, rt, node] = ranges[i];
        const text = (node.text || "").slice(rf - node.pos, rt - node.pos);
        const out = fn(text);
        if (out !== text) {
          tr.insertText(out, rf, rt);
          changed = true;
        }
      }
      if (!changed) return false;
      if (dispatch) dispatch(tr);
      return true;
    };
    return {
      toUpperCase: () => apply((s) => s.toUpperCase()),
      toLowerCase: () => apply((s) => s.toLowerCase()),
      toTitleCase: () => apply(titleCase),
      toSentenceCase: () => apply(sentenceCase),
    };
  },
});

/* ---------------------------- Search & replace ---------------------------- */
export interface SearchMatch {
  from: number;
  to: number;
}

export interface SearchResultState {
  matches: SearchMatch[];
  current: number;
}

export const searchPluginKey = new PluginKey<SearchResultState>("lekhanaSearch");

function findMatches(
  doc: PMNode,
  query: string,
  caseSensitive: boolean,
  wholeWord: boolean,
): SearchMatch[] {
  const matches: SearchMatch[] = [];
  if (!query) return matches;
  const needle = caseSensitive ? query : query.toLowerCase();
  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return;
    const haystack = caseSensitive ? node.text : node.text.toLowerCase();
    let idx = haystack.indexOf(needle);
    while (idx !== -1) {
      const from = pos + idx;
      const to = from + query.length;
      if (!wholeWord || isWholeWord(haystack, idx, query.length)) {
        matches.push({ from, to });
      }
      idx = haystack.indexOf(needle, idx + query.length);
    }
  });
  return matches;
}

function isWholeWord(haystack: string, idx: number, len: number): boolean {
  const before = idx === 0 ? "" : haystack[idx - 1];
  const after = idx + len >= haystack.length ? "" : haystack[idx + len];
  return !/\w/.test(before) && !/\w/.test(after);
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    search: {
      find: (query: string, opts?: { caseSensitive?: boolean; wholeWord?: boolean }) => ReturnType;
      goToMatch: (index: number) => ReturnType;
      nextMatch: () => ReturnType;
      prevMatch: () => ReturnType;
      replaceCurrent: (replacement: string) => ReturnType;
      replaceAll: (replacement: string) => ReturnType;
      clearSearch: () => ReturnType;
    };
  }
}

export const SearchAndReplace = Extension.create({
  name: "searchAndReplace",
  addOptions() {
    return { searchTerm: "", caseSensitive: false, wholeWord: false };
  },
  addCommands() {
    return {
      find:
        (query, opts = {}) =>
        ({ editor }) => {
          this.options.searchTerm = query;
          this.options.caseSensitive = opts.caseSensitive ?? this.options.caseSensitive;
          this.options.wholeWord = opts.wholeWord ?? this.options.wholeWord;
          const tr = editor.state.tr
            .setMeta(searchPluginKey, "current")
            .setMeta("lekhana.current", 0);
          editor.view.dispatch(tr);
          const s = searchPluginKey.getState(editor.state);
          const m = s?.matches?.[0];
          if (m) {
            editor.commands.setTextSelection({ from: m.from, to: m.to });
            editor.commands.scrollIntoView();
          }
          return true;
        },
      clearSearch:
        () =>
        ({ editor }) => {
          this.options.searchTerm = "";
          const tr = editor.state.tr.setMeta(searchPluginKey, "clear");
          editor.view.dispatch(tr);
          return true;
        },
      goToMatch:
        (index) =>
        ({ editor }) => {
          const s = searchPluginKey.getState(editor.state);
          const matches = s?.matches || [];
          if (!matches.length) return true;
          const target = ((index % matches.length) + matches.length) % matches.length;
          const m = matches[target];
          const tr = editor.state.tr
            .setMeta(searchPluginKey, "current")
            .setMeta("lekhana.current", target);
          editor.view.dispatch(tr);
          editor.commands.setTextSelection({ from: m.from, to: m.to });
          editor.commands.scrollIntoView();
          return true;
        },
      nextMatch:
        () =>
        ({ editor }) => {
          const s = searchPluginKey.getState(editor.state);
          const matches = s?.matches || [];
          const current = s?.current || 0;
          if (!matches.length) return true;
          editor.commands.goToMatch(current + 1);
          return true;
        },
      prevMatch:
        () =>
        ({ editor }) => {
          const s = searchPluginKey.getState(editor.state);
          const matches = s?.matches || [];
          const current = s?.current || 0;
          if (!matches.length) return true;
          editor.commands.goToMatch(current - 1);
          return true;
        },
      replaceCurrent:
        (replacement) =>
        ({ editor }) => {
          const s = searchPluginKey.getState(editor.state);
          const matches = s?.matches || [];
          const current = s?.current || 0;
          const m = matches[current];
          if (!m) return true;
          const schema = editor.state.schema;
          const node = schema.text(replacement);
          const tr = editor.state.tr
            .replaceWith(m.from, m.to, node)
            .setMeta(searchPluginKey, "replace")
            .setMeta("lekhana.current", current);
          editor.view.dispatch(tr);
          editor.commands.setTextSelection({ from: m.from, to: m.from + replacement.length });
          return true;
        },
      replaceAll:
        (replacement) =>
        ({ editor, tr }) => {
          const s = searchPluginKey.getState(editor.state);
          const matches = s?.matches || [];
          if (!matches.length) return true;
          const schema = editor.state.schema;
          for (let i = matches.length - 1; i >= 0; i--) {
            const m = matches[i];
            tr.replaceWith(m.from, m.to, schema.text(replacement));
          }
          tr.setMeta(searchPluginKey, "replace");
          editor.view.dispatch(tr);
          return true;
        },
    };
  },
  addProseMirrorPlugins() {
    const ext = this;
    return [
      new Plugin<SearchResultState>({
        key: searchPluginKey,
        state: {
          init: () => ({ matches: [], current: 0 }),
          apply(tr, value, _oldState, newState: EditorState) {
            let current = value.current;
            const meta = tr.getMeta(searchPluginKey);
            if (meta === "clear") {
              ext.options.searchTerm = "";
              return { matches: [], current: 0 };
            }
            if (meta === "current" || meta === "replace") {
              current = tr.getMeta("lekhana.current") ?? current;
            }
            const q = ext.options.searchTerm;
            const matches = q
              ? findMatches(newState.doc, q, ext.options.caseSensitive, ext.options.wholeWord)
              : [];
            if (matches.length && current >= matches.length) current = 0;
            if (!matches.length) current = 0;
            return { matches, current };
          },
        },
        props: {
          decorations(state: EditorState) {
            const s = searchPluginKey.getState(state);
            const matches = s?.matches || [];
            const current = s?.current || 0;
            const decos = matches.map((m, i) =>
              Decoration.inline(m.from, m.to, {
                class: i === current ? "sarp-current" : "sarp-match",
              }),
            );
            return DecorationSet.create(state.doc, decos);
          },
        },
      }),
    ];
  },
});

/* ---------------------------- Shared extension set ---------------------------- */
export const EDITOR_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3, 4, 5, 6] },
  }),
  Underline,
  TextStyle,
  Color.configure({ types: ["textStyle"] }),
  Highlight.configure({ multicolor: true }),
  FontFamily,
  FontSize,
  LineHeight,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: "https",
    HTMLAttributes: { rel: "noopener noreferrer nofollow" },
  }),
  Image.configure({
    allowBase64: true,
    inline: false,
    resize: { enabled: true, minWidth: 40, minHeight: 40, alwaysPreserveAspectRatio: true },
  }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TableKit,
  TaskList,
  TaskItem.configure({ nested: true }),
  Subscript,
  Superscript,
  HorizontalRule,
  CharacterCount,
  Placeholder.configure({
    placeholder: ({ node }) =>
      node.type.name === "heading" ? "Heading…" : "Start typing or choose a template to begin…",
    emptyNodeClass: "is-empty",
  }),
  SearchAndReplace,
  Page,
  PageBreak,
  LanguageInputExtension,
  TextTransform,
  Mathematics.configure({}),
];

/* Helper to read plain text (for word count). */
export function extractText(doc: PMNode | null): string {
  if (!doc) return "";
  return doc.textContent;
}
