export type PageSize = "a4" | "letter" | "legal" | "a5";
export type Orientation = "portrait" | "landscape";

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface DocMeta {
  id: string;
  name: string;
  /** Editor HTML content */
  content: string;
  createdAt: number;
  updatedAt: number;
  pageSize: PageSize;
  orientation: Orientation;
  margins: Margins;
  /** India-specific info fields */
  authorName?: string;
}

export type EditorView = "print" | "focus" | "web";

export interface FontDef {
  label: string;
  value: string;
  /** CSS font-family stack */
  stack: string;
  /** Best suited for Indian scripts */
  indian?: boolean;
}

export interface TemplateDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  content: string;
}
