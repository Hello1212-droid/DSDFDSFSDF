import katex from "katex";

/** Render a LaTeX string to KaTeX HTML (best-effort; empty on error). */
export function katexHtml(latex: string, display = false): string {
  if (!latex.trim()) return "";
  try {
    return katex.renderToString(latex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
    });
  } catch {
    return "";
  }
}

export function MathPreview({
  latex,
  display = true,
  fallback = "Equation preview",
}: {
  latex: string;
  display?: boolean;
  fallback?: string;
}) {
  const html = katexHtml(latex, display);
  return html ? (
    <div className="math-preview" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <div className="math-preview-empty" style={{ color: "var(--lk-text-faint)", fontSize: 13 }}>
      {latex.trim() ? "Equation preview" : fallback}
    </div>
  );
}
