import type { DocMeta, Margins, Orientation, PageSize } from "../types";

const DOCS_KEY = "lekhana.documents";
const ACTIVE_KEY = "lekhana.active";

export const DEFAULT_MARGINS: Margins = { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4 };
export const DEFAULT_PAGE: PageSize = "a4";
export const DEFAULT_ORIENTATION: Orientation = "portrait";

export const EMPTY_DOC: string = "<p></p>";

function readDocs(): DocMeta[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDocs(docs: DocMeta[]) {
  try {
    localStorage.setItem(DOCS_KEY, JSON.stringify(docs));
  } catch {
    /* storage full — ignore */
  }
}

export function uid(): string {
  return "d" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function newDoc(name?: string, content?: string): DocMeta {
  const now = Date.now();
  return {
    id: uid(),
    name: name || "Untitled document",
    content: content ?? EMPTY_DOC,
    createdAt: now,
    updatedAt: now,
    pageSize: DEFAULT_PAGE,
    orientation: DEFAULT_ORIENTATION,
    margins: { ...DEFAULT_MARGINS },
  };
}

export function listDocs(): DocMeta[] {
  return readDocs().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getDoc(id: string): DocMeta | undefined {
  return readDocs().find((d) => d.id === id);
}

export function saveDoc(meta: DocMeta): DocMeta {
  const docs = readDocs();
  const idx = docs.findIndex((d) => d.id === meta.id);
  meta.updatedAt = Date.now();
  if (idx >= 0) docs[idx] = meta;
  else docs.unshift(meta);
  writeDocs(docs);
  return meta;
}

export function deleteDoc(id: string) {
  writeDocs(readDocs().filter((d) => d.id !== id));
}

export function getActiveId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}

export function setActiveId(id: string | null) {
  try {
    if (id) localStorage.setItem(ACTIVE_KEY, id);
    else localStorage.removeItem(ACTIVE_KEY);
  } catch {
    /* ignore */
  }
}

export function defaultDocName(): string {
  const n = readDocs().length + 1;
  return `Document ${n}`;
}
