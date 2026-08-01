import { useEditorState } from "@tiptap/react";
import { useLekhana } from "../editor/context";
import { ZoomIn, ZoomOut } from "lucide-react";

export function StatusBar() {
  const { editor, zoom, setZoom, doc, hasChanges } = useLekhana();

  const stats = useEditorState({
    editor,
    selector: ({ editor: e }) => {
      if (!e) return { words: 0, chars: 0, pages: 1 };
      const cc = e.storage.characterCount as { words: () => number; characters: () => number };
      let pages = 0;
      e.state.doc.descendants((n) => {
        if (n.type.name === "page") pages++;
      });
      return {
        words: cc.words(),
        chars: cc.characters(),
        paragraphs: e.state.doc.childCount,
        pages: pages || 1,
      };
    },
  }) ?? { words: 0, chars: 0, paragraphs: 0, pages: 1 };

  const pageLabel =
    doc.pageSize.toUpperCase() + (doc.orientation === "landscape" ? " (Landscape)" : "");

  return (
    <div className="lk-statusbar">
      <div className="lk-status-left">
        <span>{stats.words.toLocaleString("en-IN")} words</span>
        <span>{stats.chars.toLocaleString("en-IN")} characters</span>
        <span>{stats.pages} page{stats.pages > 1 ? "s" : ""}</span>
        <span className="hidden sm:inline">{pageLabel}</span>
        <span className="tabular text-gray-400">{hasChanges ? "Unsaved…" : "Saved ✓"}</span>
      </div>
      <div className="lk-status-right">
        <button className="lk-btn" title="Zoom out" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
          <ZoomOut size={14} />
        </button>
        <button className="tabular text-[12px] px-1 min-w-[52px] text-center" title="Zoom to 100%" onClick={() => setZoom(1)}>
          {Math.round(zoom * 100)}%
        </button>
        <button className="lk-btn" title="Zoom in" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
          <ZoomIn size={14} />
        </button>
      </div>
    </div>
  );
}
