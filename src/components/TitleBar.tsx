import { useState } from "react";
import { useLekhana } from "../editor/context";
import { FolderOpen, FileDown, Printer } from "lucide-react";

export function TitleBar() {
  const { doc, renameDoc, openDialog, exportDocx, hasChanges } = useLekhana();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(doc.name);

  const commit = () => {
    setEditing(false);
    renameDoc(name.trim());
  };

  return (
    <div className="lk-titlebar">
      <div className="lk-brand">
        <div className="lk-brand-badge">ले</div>
        <span>Lekhana</span>
        <span className="text-[11px] font-normal text-gray-400 hidden md:inline">Indian Word Processor</span>
      </div>

      <div className="flex-1 flex items-center gap-2 min-w-0">
        {editing ? (
          <input
            autoFocus
            className="lk-input !py-1 text-[13px] max-w-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => e.key === "Enter" && commit()}
          />
        ) : (
          <button
            className="px-2 py-1 rounded text-[13px] text-gray-700 hover:bg-gray-200/70 truncate max-w-[260px]"
            title="Rename document"
            onClick={() => { setName(doc.name); setEditing(true); }}
          >
            {doc.name}
          </button>
        )}
        <span className={`text-[11px] ${hasChanges ? "text-amber-500" : "text-green-600"}`}>
          {hasChanges ? "● Unsaved" : "● Saved"}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button className="lk-btn" title="Open (Ctrl+O)" onClick={() => openDialog("open")}><FolderOpen size={17} /></button>
        <button className="lk-btn" title="Export as Word (.docx)" onClick={exportDocx}><FileDown size={17} /></button>
        <button className="lk-btn" title="Print / Save as PDF (Ctrl+P)" onClick={() => window.print()}><Printer size={17} /></button>
      </div>
    </div>
  );
}
