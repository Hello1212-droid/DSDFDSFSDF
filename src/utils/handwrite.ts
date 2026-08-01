/**
 * Lightweight, fully offline handwriting → LaTeX symbol recognizer.
 *
 * Approach: stroke-template matching. Each drawn symbol is resampled,
 * normalized (translated to its centroid, scaled to a unit box), and compared
 * point-by-point against a curated library of common math-symbol templates.
 * The best match is returned with a confidence score.
 *
 * This is best-effort for a curated set of everyday symbols; the in-panel
 * symbol palette and manual LaTeX box remain available for full precision.
 */

export interface Pt { x: number; y: number }
export type Stroke = Pt[];
export type SymbolInput = Stroke[];

export interface Recognition {
  latex: string;
  label: string;
  confidence: number; // 0..1
}

const RESAMPLE = 24;

/** Resample a stroke to exactly n evenly-spaced points along its length. */
function resample(stroke: Stroke, n: number): Pt[] {
  if (stroke.length < 2) {
    const p = stroke[0] || { x: 0, y: 0 };
    return Array.from({ length: n }, () => ({ x: p.x, y: p.y }));
  }
  let total = 0;
  const cum: number[] = [0];
  for (let i = 1; i < stroke.length; i++) {
    total += Math.hypot(stroke[i].x - stroke[i - 1].x, stroke[i].y - stroke[i - 1].y);
    cum.push(total);
  }
  if (total === 0) return Array.from({ length: n }, () => stroke[0]);
  const out: Pt[] = [];
  let target = 0;
  let seg = 1;
  for (let k = 0; k < n; k++) {
    target = (k * total) / (n - 1);
    while (seg < cum.length - 1 && cum[seg] < target) seg++;
    const segStart = cum[seg - 1];
    const segLen = cum[seg] - segStart || 1;
    const t = (target - segStart) / segLen;
    const a = stroke[seg - 1];
    const b = stroke[seg];
    out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  }
  return out;
}

/** Normalize a whole symbol: centroid to origin, scale so max extent = 1. */
function normalize(symbol: SymbolInput): Stroke[] {
  let cx = 0, cy = 0, count = 0;
  for (const s of symbol) for (const p of s) { cx += p.x; cy += p.y; count++; }
  if (!count) return [];
  cx /= count; cy /= count;
  let max = 0;
  for (const s of symbol) for (const p of s) {
    max = Math.max(max, Math.abs(p.x - cx), Math.abs(p.y - cy));
  }
  max = max || 1;
  const scale = 0.5 / max;
  return symbol.map((s) =>
    resample(s, RESAMPLE).map((p) => ({
      x: (p.x - cx) * scale,
      y: (p.y - cy) * scale,
    })),
  );
}

function dist(a: Pt, b: Pt): number {
  return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
}

/** Compare two normalized symbols (same stroke count). */
function compareDrawn(drawn: Stroke[], tmpl: Stroke[]): number {
  let d = 0;
  const n = Math.min(drawn.length, tmpl.length);
  for (let s = 0; s < n; s++) {
    const ds = drawn[s];
    const ts = tmpl[s];
    const m = Math.min(ds.length, ts.length);
    for (let k = 0; k < m; k++) d += dist(ds[k], ts[k]);
  }
  // penalty for stroke-count mismatch
  d += Math.abs(drawn.length - tmpl.length) * 2.0;
  return d / (n * RESAMPLE);
}

/* ----------------------- Template library ----------------------- */
interface Tpl { label: string; latex: string; strokes: Stroke[] }

// Templates authored in a 1x1 box (y increases downward), centroid ~ (0.5,0.5).
const P = (x: number, y: number): Pt => ({ x, y });
/** Combine points and/or arcs into a single stroke. */
const seg = (...parts: Array<Pt | Stroke>): Stroke => parts.flat();

const T = (label: string, latex: string, strokes: any): Tpl => ({ label, latex, strokes: strokes as Stroke[] });

const circle = (): Stroke => {
  const pts: Pt[] = [];
  for (let i = 0; i < RESAMPLE; i++) {
    const a = (i / RESAMPLE) * Math.PI * 2;
    pts.push(P(0.5 + 0.28 * Math.cos(a), 0.5 + 0.28 * Math.sin(a)));
  }
  return pts;
};
const arc = (r: number, cx: number, cy: number, a0: number, a1: number): Stroke => {
  const pts: Pt[] = [];
  const steps = RESAMPLE;
  for (let i = 0; i < steps; i++) {
    const a = a0 + ((a1 - a0) * i) / (steps - 1);
    pts.push(P(cx + r * Math.cos(a), cy + r * Math.sin(a)));
  }
  return pts;
};

const TEMPLATES: Tpl[] = [
  // digits
  T("0", "0", [circle()]),
  T("1", "1", [[P(0.55,0.1),P(0.5,0.3),P(0.46,0.42),P(0.46,0.9)],[P(0.3,0.9),P(0.62,0.9)]]),
  T("2", "2", [[P(0.2,0.3),P(0.35,0.15),P(0.62,0.15),P(0.78,0.32),P(0.75,0.5),P(0.25,0.85),P(0.2,0.9),P(0.8,0.9)]]),
  T("3", "3", [[seg(arc(0.3,0.5,0.35,Math.PI,0),P(0.2,0.35))],[seg(P(0.5,0.5),arc(0.3,0.5,0.68,Math.PI,0))]]),
  T("4", "4", [[P(0.72,0.9),P(0.72,0.15),P(0.28,0.62),P(0.82,0.62)],[P(0.28,0.12),P(0.28,0.9)]]),
  T("5", "5", [[P(0.78,0.12),P(0.22,0.12),P(0.22,0.42),P(0.7,0.42),P(0.8,0.55),P(0.78,0.78),P(0.6,0.9),P(0.35,0.88),P(0.25,0.75)]]),
  T("6", "6", [[seg(arc(0.28,0.5,0.5,0,Math.PI*1.2),P(0.28,0.8),P(0.4,0.88),P(0.62,0.86),P(0.76,0.72),P(0.72,0.55),P(0.5,0.5))]]),
  T("7", "7", [[P(0.18,0.15),P(0.8,0.15),P(0.6,0.45),P(0.52,0.9)]]),
  T("8", "8", [[arc(0.28,0.5,0.32,Math.PI*1.5,Math.PI*0.5), arc(0.28,0.5,0.68,Math.PI*0.5,Math.PI*1.5)]]),
  T("9", "9", [[seg(arc(0.28,0.5,0.5,Math.PI*1.2,Math.PI),P(0.72,0.5),P(0.6,0.15),P(0.35,0.16),P(0.24,0.3))]]),
  // letter x before × so the x-shape prefers the variable "x"
  T("x", "x", [[P(0.25,0.2),P(0.75,0.8)],[P(0.75,0.2),P(0.25,0.8)]]),
  // operators
  T("+", "+", [[P(0.2,0.5),P(0.8,0.5)],[P(0.5,0.2),P(0.5,0.8)]]),
  T("-", "-", [[P(0.2,0.5),P(0.8,0.5)]]),
  T("=", "=", [[P(0.2,0.38),P(0.8,0.38)],[P(0.2,0.62),P(0.8,0.62)]]),
  T("/", "/", [[P(0.3,0.15),P(0.7,0.85)]]),
  T("×", "\\times", [[P(0.25,0.2),P(0.75,0.8)],[P(0.75,0.2),P(0.25,0.8)]]),
  T("÷", "\\div", [[P(0.2,0.5),P(0.8,0.5)],[P(0.5,0.22),P(0.5,0.22)],[P(0.5,0.78),P(0.5,0.78)]]),
  T("(", "(", [[arc(0.28,0.5,0.5,Math.PI,0)]]),
  T(")", ")", [[arc(0.28,0.5,0.5,0,Math.PI)]]),
  // letters
  T("y", "y", [[P(0.3,0.15),P(0.5,0.55),P(0.7,0.2)],[P(0.5,0.55),P(0.42,0.85)]]),
  T("a", "a", [[seg(arc(0.2,0.5,0.42,Math.PI*1.2,Math.PI*0.5),P(0.72,0.5),P(0.5,0.5),P(0.5,0.78),P(0.3,0.78))]]),
  T("b", "b", [[seg(P(0.45,0.12),P(0.45,0.78),arc(0.25,0.6,0.5,Math.PI*0.6,-Math.PI*0.6))]]),
  T("c", "c", [[arc(0.28,0.55,0.5,Math.PI*0.25,Math.PI*1.75)]]),
  // special
  T("π", "\\pi", [[P(0.2,0.3),P(0.8,0.3)],[seg(P(0.3,0.3),P(0.3,0.75),arc(0.22,0.3,0.52,Math.PI,0))]]),
  T("√", "\\sqrt{}", [[P(0.22,0.5),P(0.38,0.8),P(0.5,0.25),P(0.6,0.25),P(0.6,0.25),P(0.85,0.25)]]),
  T("∞", "\\infty", [[seg(P(0.25,0.5),arc(0.15,0.4,0.5,Math.PI*1.5,Math.PI*0.5),P(0.75,0.5),arc(0.15,0.6,0.5,Math.PI*0.5,Math.PI*1.5))]]),
  T("∑", "\\sum", [[P(0.2,0.2),P(0.75,0.2),P(0.4,0.5),P(0.75,0.8),P(0.2,0.8)]]),
  T("Δ", "\\Delta", [[P(0.5,0.15),P(0.8,0.85),P(0.2,0.85),P(0.5,0.15)]]),
  T("θ", "\\theta", [[circle()],[P(0.25,0.5),P(0.75,0.5)]]),
  T("α", "\\alpha", [[seg(P(0.3,0.2),P(0.3,0.7),arc(0.24,0.32,0.5,Math.PI*0.6,-Math.PI*0.6))]]),
];

/** Recognize a drawn symbol (one or more strokes). */
export function recognizeSymbol(symbol: SymbolInput): Recognition {
  const drawn = normalize(symbol);
  if (!drawn.length) return { latex: "", label: "", confidence: 0 };

  let best: Tpl | null = null;
  let bestScore = Infinity;
  for (const t of TEMPLATES) {
    const tn = normalize(t.strokes);
    const score = compareDrawn(drawn, tn);
    if (score < bestScore) {
      bestScore = score;
      best = t;
    }
  }
  if (!best) return { latex: "", label: "", confidence: 0 };
  // heuristic: score ~0.02 or better is a good match
  const confidence = Math.max(0, Math.min(1, 1 - bestScore / 0.6));
  return { latex: best.latex, label: best.label, confidence };
}

/** Smart join of a sequence of recognized LaTeX tokens into an equation. */
export function buildEquation(tokens: string[]): string {
  const out: string[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];
    const prev = tokens[i - 1];
    // spacing between adjacent alphanumeric tokens
    if (i > 0) {
      const isAlpha = /[a-zA-Z0-9\\}]/.test(tok);
      const prevAlpha = /[a-zA-Z0-9\\}]/.test(prev || "");
      if (isAlpha && prevAlpha) out.push(" ");
    }
    out.push(tok);
  }
  return out.join("");
}
