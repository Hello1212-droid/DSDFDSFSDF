import { FileText, Plus, Trash2 } from "lucide-react";
import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";

export function OpenDialog() {
  const { closeDialog, docs, openDocById, removeDoc, createDoc } = useLekhana();

  return (
    <Modal title="Open document" onClose={closeDialog} size="lg">
      <button
        className="lk-list-item w-full text-left"
        onClick={() => { createDoc(); closeDialog(); }}
      >
        <span className="w-9 h-9 rounded-lg bg-blue-50 grid place-items-center text-blue-600">
          <Plus size={18} />
        </span>
        <span>
          <div className="font-medium text-gray-800 text-[14px]">Blank document</div>
          <div className="text-[12px] text-gray-500">Create a new empty document</div>
        </span>
      </button>

      {docs.length === 0 ? (
        <p className="text-gray-500 text-[13px] py-3 px-1">
          No saved documents yet. Your work is saved automatically to this browser.
        </p>
      ) : (
        <div className="mt-1">
          <div className="lk-label mb-1">Recent documents</div>
          {docs.map((d) => (
            <div
              key={d.id}
              className="lk-list-item group w-full text-left"
              onClick={() => { openDocById(d.id); closeDialog(); }}
            >
              <span className="w-9 h-9 rounded-lg bg-indigo-50 grid place-items-center text-indigo-600 shrink-0">
                <FileText size={18} />
              </span>
              <span className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-[14px] truncate">{d.name}</div>
                <div className="text-[12px] text-gray-500">
                  Edited {new Date(d.updatedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                </div>
              </span>
              <button
                className="lk-btn opacity-0 group-hover:opacity-100 text-red-500 shrink-0"
                onClick={(e) => { e.stopPropagation(); removeDoc(d.id); }}
                title="Delete document"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
