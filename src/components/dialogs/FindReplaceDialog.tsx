import { useEffect, useRef, useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal, Toggle } from "../ui";
import { searchPluginKey } from "../../editor/extensions";
import { ChevronDown, ChevronUp, Replace, ReplaceAll } from "lucide-react";

export function FindReplaceDialog() {
  const { closeDialog, editor } = useLekhana();
  const [term, setTerm] = useState("");
  const [replacement, setReplacement] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const [info, setInfo] = useState<{ matches: number; current: number }>({ matches: 0, current: 0 });
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync plugin state with the editor
  useEffect(() => {
    if (!editor) return;
    const update = () => {
      const s = searchPluginKey.getState(editor.state);
      setInfo({ matches: s?.matches?.length || 0, current: s?.current || 0 });
    };
    update();
    editor.on("transaction", update);
    return () => { editor.off("transaction", update); };
  }, [editor]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runFind = (termArg: string, cs: boolean, ww: boolean) => {
    if (!editor) return;
    editor.chain().focus().find(termArg, { caseSensitive: cs, wholeWord: ww }).run();
  };

  return (
    <Modal title="Find and replace" onClose={closeDialog} size="sm">
      <div className="space-y-3">
        <div>
          <div className="lk-label mb-1">Find</div>
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              className="lk-input lk-search-input"
              placeholder="Search in document"
              value={term}
              onChange={(e) => { setTerm(e.target.value); runFind(e.target.value, caseSensitive, wholeWord); }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); editor?.commands.nextMatch(); }
                if (e.key === "Escape") { editor?.commands.clearSearch(); closeDialog(); }
              }}
            />
            <button className="lk-btn" title="Previous" onClick={() => editor?.commands.prevMatch()}>
              <ChevronUp size={16} />
            </button>
            <button className="lk-btn" title="Next" onClick={() => editor?.commands.nextMatch()}>
              <ChevronDown size={16} />
            </button>
          </div>
          <div className="text-[11px] text-gray-400 mt-1 h-4">
            {info.matches > 0
              ? `${info.current + 1} of ${info.matches} matches`
              : term
                ? "No matches"
                : ""}
          </div>
        </div>

        <div className="flex gap-3">
          <Toggle label="Match case" checked={caseSensitive} onChange={(v) => { setCaseSensitive(v); runFind(term, v, wholeWord); }} />
          <Toggle label="Whole word" checked={wholeWord} onChange={(v) => { setWholeWord(v); runFind(term, caseSensitive, v); }} />
        </div>

        <div>
          <div className="lk-label mb-1">Replace with</div>
          <input
            className="lk-input"
            placeholder="Replacement text"
            value={replacement}
            onChange={(e) => setReplacement(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); editor?.commands.replaceCurrent(replacement); } }}
          />
        </div>

        <div className="flex gap-2">
          <button className="lk-btn-ghost flex-1 flex items-center justify-center gap-1.5" onClick={() => editor?.commands.replaceCurrent(replacement)} disabled={!info.matches}>
            <Replace size={15} /> Replace
          </button>
          <button className="lk-btn-primary flex-1 flex items-center justify-center gap-1.5" onClick={() => editor?.commands.replaceAll(replacement)} disabled={!info.matches}>
            <ReplaceAll size={15} /> All
          </button>
        </div>
      </div>
    </Modal>
  );
}
