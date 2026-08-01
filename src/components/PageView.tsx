import { NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { Plus, Trash2 } from "lucide-react";

/**
 * A single "page" node — rendered as its own white page box, exactly like a
 * page in MS Word. The editor content inside is editable via NodeViewContent.
 */
export function PageView({ editor, getPos }: NodeViewProps) {
  const pos = getPos() ?? 0;

  // Page number = count of preceding page nodes + 1.
  let page = 1;
  let found = 0;
  editor.state.doc.descendants((n, p) => {
    if (n.type.name === "page" && p < pos) found++;
  });
  page = found + 1;

  const addPageAfter = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.commands.addPageAfterNode(pos);
  };

  const deletePage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    editor.commands.deletePage(pos);
  };

  const isOnly = (editor.state.doc.childCount === 1) as boolean;

  return (
    <NodeViewWrapper className="lk-page-view" data-page-num={page}>
      <div className="lk-page-sheet">
        <NodeViewContent className="lk-prose" />
      </div>

      {/* Page controls: add page (hover on any page) and delete (when >1) */}
      <div className="lk-page-tools">
        <button className="lk-page-add" title={`Add page after page ${page}`} onClick={addPageAfter}>
          <Plus size={14} />
        </button>
        {!isOnly && (
          <button className="lk-page-del" title={`Delete page ${page}`} onClick={deletePage}>
            <Trash2 size={13} />
          </button>
        )}
      </div>

      <div className="lk-page-footer">
        <span className="lk-page-num">{page}</span>
      </div>
    </NodeViewWrapper>
  );
}
