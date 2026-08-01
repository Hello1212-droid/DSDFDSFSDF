import type { FontDef } from "../types";

/**
 * Font catalogue optimised for the Indian market.
 * Includes the Unicode Noto family (excellent for all Indian scripts)
 * plus fonts commonly pre-installed on Windows (Mangal, Nirmala UI, Arial, Times New Roman).
 * Fallbacks guarantee correct rendering of Devanagari, Bengali, Tamil, Telugu, etc.
 */
export const FONTS: FontDef[] = [
  { label: "Calibri (Body)", value: "Calibri", stack: "'Calibri','Carlito',sans-serif" },
  { label: "Aptos (Body)", value: "Aptos", stack: "'Aptos','Segoe UI',sans-serif" },
  { label: "Arial", value: "Arial", stack: "'Arial','Helvetica Neue',sans-serif" },
  { label: "Times New Roman", value: "Times New Roman", stack: "'Times New Roman',Times,serif" },
  { label: "Georgia", value: "Georgia", stack: "Georgia,'Noto Serif',serif" },
  { label: "Verdana", value: "Verdana", stack: "Verdana,'Noto Sans',sans-serif" },
  { label: "Courier New", value: "Courier New", stack: "'Courier New',Courier,monospace" },
  { label: "Segoe UI", value: "Segoe UI", stack: "'Segoe UI','Nirmala UI',sans-serif" },
  { label: "Nirmala UI", value: "Nirmala UI", stack: "'Nirmala UI','Segoe UI',sans-serif", indian: true },
  { label: "Mangal", value: "Mangal", stack: "Mangal,'Nirmala UI','Noto Sans Devanagari',sans-serif", indian: true },
  { label: "Lohit Devanagari", value: "Lohit Devanagari", stack: "'Lohit Devanagari','Noto Sans Devanagari',sans-serif", indian: true },
  { label: "Noto Sans Devanagari", value: "Noto Sans Devanagari", stack: "'Noto Sans Devanagari','Nirmala UI',Mangal,sans-serif", indian: true },
  { label: "Noto Serif Devanagari", value: "Noto Serif Devanagari", stack: "'Noto Serif Devanagari','Noto Sans Devanagari',serif", indian: true },
  { label: "Shruti", value: "Shruti", stack: "Shruti,'Noto Sans Gujarati',sans-serif", indian: true },
  { label: "Vani", value: "Vani", stack: "Vani,'Noto Sans Kannada',sans-serif", indian: true },
  { label: "Meera", value: "Meera", stack: "Meera,'Noto Sans Malayalam',sans-serif", indian: true },
  { label: "Gautami", value: "Gautami", stack: "Gautami,'Noto Sans Telugu',sans-serif", indian: true },
  { label: "Latha", value: "Latha", stack: "Latha,'Noto Sans Tamil',sans-serif", indian: true },
  { label: "Vrinda", value: "Vrinda", stack: "Vrinda,'Noto Sans Bengali',sans-serif", indian: true },
  { label: "Gargi", value: "Gargi", stack: "Gargi,'Noto Sans Gurmukhi',sans-serif", indian: true },
  { label: "Kokila", value: "Kokila", stack: "Kokila,'Noto Sans Oriya',sans-serif", indian: true },
];

export const DEFAULT_FONT = FONTS[0];

export const FONT_SIZES = [
  "8pt", "9pt", "10pt", "10.5pt", "11pt", "12pt", "14pt", "16pt", "18pt",
  "20pt", "24pt", "28pt", "32pt", "36pt", "40pt", "48pt", "56pt", "72pt",
];

export const LINE_SPACINGS = [
  { label: "1.0", value: "1.0" },
  { label: "1.15", value: "1.15" },
  { label: "1.5", value: "1.5" },
  { label: "2.0", value: "2.0" },
  { label: "2.5", value: "2.5" },
  { label: "3.0", value: "3.0" },
];

export const HIGHLIGHT_COLORS = [
  { label: "None", value: "" },
  { label: "Yellow", value: "#fef08a" },
  { label: "Bright Green", value: "#bbf7d0" },
  { label: "Turquoise", value: "#99f6e4" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Red", value: "#fecaca" },
  { label: "Dark Yellow", value: "#fde047" },
  { label: "Gray", value: "#e5e7eb" },
  { label: "Black", value: "#111827" },
];

export const TEXT_COLORS = [
  { label: "Automatic", value: "inherit" },
  { label: "Black", value: "#000000" },
  { label: "Red", value: "#dc2626" },
  { label: "Orange", value: "#ea580c" },
  { label: "Yellow", value: "#ca8a04" },
  { label: "Green", value: "#16a34a" },
  { label: "Teal", value: "#0d9488" },
  { label: "Blue", value: "#2563eb" },
  { label: "Purple", value: "#7c3aed" },
  { label: "Pink", value: "#db2777" },
  { label: "Gray", value: "#6b7280" },
  { label: "Maroon", value: "#7f1d1d" },
];
