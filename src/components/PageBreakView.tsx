import { NodeViewWrapper } from "@tiptap/react";
import type { NodeViewProps } from "@tiptap/react";
import { X } from "lucide-react";

/**
 * Renders a page break as a clear visual boundary with a page number and a
 * remove button. In print/PDF this element forces a real new page.
 */
export function PageBreakView({ editor, getPos, deleteNode }: NodeViewProps) {
  const pos = getPos() ?? -1;

  // Count how many page breaks precede this one to derive the page number.
  let page = 1;
  if (pos >= 0) {
    let found = 0;
    editor.state.doc.descendants((node, nodePos) => {
      if (node.type.name === "pageBreak" && nodePos < pos) found++;
    });
    page = found + 1;
  }

  const remove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    deleteNode();
  };

  return (
    <NodeViewWrapper className="page-break-view" contentEditable={false}>
      <div className="page-break-line" />
      <div className="page-break-tag">
        <span className="page-break-num">— Page {page + 1} —</span>
        <button className="page-break-remove" title="Remove page break" onClick={remove}>
          <X size={13} />
        </button>
      </div>
    </NodeViewWrapper>
  );
}
