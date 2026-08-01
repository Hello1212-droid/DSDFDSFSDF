import { EditorContent } from "@tiptap/react";
import { useLekhana } from "../editor/context";

const SIZES: Record<string, { w: number; h: number }> = {
  a4: { w: 794, h: 1123 },
  letter: { w: 816, h: 1056 },
  legal: { w: 612, h: 1286 },
  a5: { w: 559, h: 793 },
};

const MM_TO_PX = 96 / 25.4;

export function PageArea() {
  const { editor, doc, zoom, view } = useLekhana();

  const base = SIZES[doc.pageSize] || SIZES.a4;
  const isLand = doc.orientation === "landscape";
  const pageW = isLand ? base.h : base.w;
  const pageH = isLand ? base.w : base.h;
  const m = doc.margins;

  const focus = view === "focus";
  const web = view === "web";

  return (
    <div
      className={`lk-canvas ${web ? "items-stretch" : ""}`}
      style={focus ? { background: "#1b1e24" } : undefined}
    >
      {/* CSS variables drive page geometry in the page NodeViews.
          We use the `zoom` property (not transform) so scaling affects layout
          and pages never overlap when zoomed in. */}
      <div
        className="lk-canvas-inner"
        style={{
          zoom: zoom,
          ["--lk-page-width" as any]: `${pageW}px`,
          ["--lk-page-height" as any]: `${pageH}px`,
          ["--lk-page-pad" as any]: `${m.top * MM_TO_PX}px ${m.right * MM_TO_PX}px ${m.bottom * MM_TO_PX}px ${m.left * MM_TO_PX}px`,
        }}
      >
        {editor ? (
          <EditorContent editor={editor} className="lk-prose" />
        ) : (
          <p className="lk-page-sheet" style={{ color: "var(--lk-text-faint)" }}>Loading editor…</p>
        )}
      </div>
    </div>
  );
}
