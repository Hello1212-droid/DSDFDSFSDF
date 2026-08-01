import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";

const SHORTCUTS: Array<[string, string]> = [
  ["Ctrl+B / Ctrl+I / Ctrl+U", "Bold / Italic / Underline"],
  ["Ctrl+Z / Ctrl+Y", "Undo / Redo"],
  ["Ctrl+F", "Find and replace"],
  ["Ctrl+H", "Find and replace (all)"],
  ["Ctrl+K", "Insert link"],
  ["Ctrl+S", "Save now"],
  ["Ctrl+P", "Print / Save as PDF"],
  ["Ctrl+Shift+S", "Export as .docx"],
  ["Enter", "New paragraph"],
  ["Shift+Enter", "Line break"],
];

export function AboutDialog() {
  const { closeDialog } = useLekhana();
  return (
    <Modal title="About Lekhana" onClose={closeDialog} size="lg">
      <div className="flex items-start gap-3 mb-4">
        <div className="lk-brand-badge" style={{ width: 44, height: 44, fontSize: 22 }}>ले</div>
        <div>
          <div className="font-semibold text-gray-900 text-[16px]">Lekhana — Indian Word Processor</div>
          <div className="text-[13px] text-gray-500">
            A production-ready word processor for India. Write in English, Hindi, and every major Indian language
            with the Noto Unicode fonts. Save automatically, then export to Word (.docx), PDF, or print.
          </div>
        </div>
      </div>

      <div className="lk-label">Keyboard shortcuts</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {SHORTCUTS.map(([k, d]) => (
          <div key={k} className="flex items-center justify-between py-1 border-b border-gray-50 text-[12px]">
            <span className="text-gray-700">{d}</span>
            <span className="kbd" style={{ fontFamily: "ui-monospace,monospace", color: "#6b7280" }}>{k}</span>
          </div>
        ))}
      </div>

      <p className="text-[11px] text-gray-400 mt-4">
        Lekhana · Version 1.0.0 · Your documents are stored locally in your browser and are never uploaded.
      </p>
    </Modal>
  );
}
