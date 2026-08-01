import { useState } from "react";
import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";
import { MathPreview } from "../MathPreview";
import { SYMBOL_CATEGORIES, FORMULA_TEMPLATES, insertLatex } from "../../utils/mathSymbols";
import { cn } from "../../utils/cn";
import { Plus } from "lucide-react";

export function EquationDialog() {
  const { closeDialog, editor } = useLekhana();
  const [latex, setLatex] = useState("");
  const [cursor, setCursor] = useState(0);
  const [catId, setCatId] = useState(SYMBOL_CATEGORIES[0].id);
  const [inline, setInline] = useState(false);

  const cat = SYMBOL_CATEGORIES.find((c) => c.id === catId) || SYMBOL_CATEGORIES[0];

  const addToken = (token: string) => {
    const res = insertLatex(latex, cursor, token);
    setLatex(res.latex);
    setCursor(res.cursor);
  };

  const useTemplate = (t: string) => {
    setLatex(t);
    setCursor(t.length);
  };

  const insert = () => {
    if (!latex.trim()) return;
    if (inline) editor?.commands.insertInlineMath({ latex });
    else editor?.commands.insertBlockMath({ latex });
    closeDialog();
  };

  return (
    <Modal
      title="Insert equation"
      onClose={closeDialog}
      size="lg"
      footer={
        <>
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
          <button className="lk-btn-primary flex items-center gap-1.5" onClick={insert} disabled={!latex.trim()}>
            <Plus size={15} /> Insert {inline ? "inline" : "equation"}
          </button>
        </>
      }
    >
      {/* Live preview */}
      <div className="rounded-lg border p-4 mb-4 flex items-center justify-center min-h-[72px]" style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)" }}>
        <MathPreview latex={latex} fallback="Your formula will appear here" />
      </div>

      {/* Templates */}
      <div className="mb-4">
        <div className="lk-label">Formula templates</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {FORMULA_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => useTemplate(t.latex)}
              title={t.latex}
              className="rounded-lg border px-2 py-1.5 text-[12px] text-left hover:border-blue-500"
              style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)", color: "var(--lk-text-muted)" }}
            >
              <div className="text-[11px] font-medium" style={{ color: "var(--lk-text)" }}>{t.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* LaTeX input */}
      <div className="mb-4">
        <div className="lk-label">LaTeX</div>
        <input
          className="lk-input"
          autoFocus
          placeholder="e.g. \frac{a}{b} + c^2 = \sqrt{d}"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          onSelect={(e) => setCursor(e.currentTarget.selectionStart ?? latex.length)}
        />
      </div>

      {/* Symbol palette */}
      <div className="mb-2">
        <div className="flex flex-wrap gap-1 mb-1.5">
          {SYMBOL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={cn("px-2.5 py-1 rounded-md text-[12px] font-medium border", catId === c.id ? "" : "")}
              style={catId === c.id ? { borderColor: "var(--lk-primary)", background: "var(--lk-primary-soft)", color: "var(--lk-primary)" } : { borderColor: "var(--lk-border)", color: "var(--lk-text-muted)" }}
              onClick={() => setCatId(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-10 gap-1">
          {cat.symbols.map((s, i) => (
            <button
              key={i}
              title={s.latex}
              onClick={() => addToken(s.latex)}
              className="h-8 rounded-md border text-[15px] hover:scale-105 transition-transform"
              style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)", color: "var(--lk-text)" }}
            >
              {s.display}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "var(--lk-text)" }}>
          <input type="checkbox" checked={inline} onChange={(e) => setInline(e.target.checked)} className="h-4 w-4 accent-blue-600" />
          Insert inline with text
        </label>
        <span className="text-[11px]" style={{ color: "var(--lk-text-faint)" }}>
          Click a symbol to add it at the cursor · templates insert ready-made formulas
        </span>
      </div>
    </Modal>
  );
}
