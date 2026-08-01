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

  const padding = `${m.top * MM_TO_PX}px ${m.right * MM_TO_PX}px ${m.bottom * MM_TO_PX}px ${m.left * MM_TO_PX}px`;

  const focus = view === "focus";
  const web = view === "web";

  return (
    <div
      className={`lk-canvas ${web ? "items-stretch" : ""}`}
      style={focus ? { background: "#1b1e24" } : undefined}
    >
      <div
        style={{
          width: pageW,
          transform: `scale(${zoom})`,
          transformOrigin: "top center",
          height: pageH * zoom,
        }}
      >
        <div
          className="lk-page"
          style={{
            width: pageW,
            minHeight: pageH,
            padding,
            margin: "0 auto",
            boxShadow: web ? "none" : undefined,
          }}
        >
          {editor ? (
            <EditorContent editor={editor} className="lk-prose" />
          ) : (
            <p className="text-gray-400">Loading editor…</p>
          )}
        </div>
      </div>
    </div>
  );
}
