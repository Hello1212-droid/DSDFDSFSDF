import { useLekhana } from "../../editor/context";
import { Modal } from "../ui";
import { Feather, Sparkles, Globe2, Download, Printer, ShieldCheck, Keyboard } from "lucide-react";

const SHORTCUTS: Array<[string, string]> = [
  ["Ctrl+B / Ctrl+I / Ctrl+U", "Bold / Italic / Underline"],
  ["Ctrl+Z / Ctrl+Y", "Undo / Redo"],
  ["Ctrl+F / Ctrl+H", "Find / Replace"],
  ["Ctrl+K", "Insert link"],
  ["Ctrl+S / Ctrl+Shift+S", "Save / Export .docx"],
  ["Ctrl+Enter", "Insert page break"],
  ["Ctrl+P", "Print / Save as PDF"],
  ["Ctrl+,", "Open settings"],
  ["Space / Enter (Hindi on)", "Hinglish → Indian script"],
];

const FEATURES = [
  { icon: <Feather size={15} />, text: "Full rich-text editing" },
  { icon: <Globe2 size={15} />, text: "9 Indian scripts + Hinglish input" },
  { icon: <Sparkles size={15} />, text: "2,000 OS-inspired themes" },
  { icon: <Download size={15} />, text: "Export to Word, PDF, HTML & more" },
  { icon: <Printer size={15} />, text: "Multi-page print layout" },
  { icon: <ShieldCheck size={15} />, text: "Private — nothing leaves your browser" },
];

export function AboutDialog() {
  const { closeDialog, openDialog } = useLekhana();
  return (
    <Modal title="" onClose={closeDialog} size="lg">
      {/* Hero header */}
      <div
        className="rounded-xl overflow-hidden mb-4 relative"
        style={{ background: "linear-gradient(135deg, var(--lk-primary), #7c3aed)", padding: "22px 20px", color: "#fff" }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center text-[30px] font-bold shrink-0 backdrop-blur">ले</div>
          <div>
            <div className="text-[20px] font-bold leading-tight">Lekhana</div>
            <div className="text-[12px] opacity-90">Indian Word Processor · Version 1.1.0</div>
          </div>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed opacity-95 max-w-[520px]">
          A production-ready word processor built for India. Write in English, Hindi and every major
          Indian language, style documents like Microsoft Word, and export to Word, PDF or print —
          all privately in your browser.
        </p>
        <div className="absolute -right-6 -bottom-6 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute right-10 top-0 w-24 h-24 rounded-full bg-white/10" />
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[12px]"
            style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)", color: "var(--lk-text)" }}
          >
            <span style={{ color: "var(--lk-primary)" }}>{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>

      {/* Keyboard shortcuts */}
      <div className="flex items-center gap-2 mb-2">
        <Keyboard size={15} style={{ color: "var(--lk-primary)" }} />
        <span className="lk-label !mb-0 !text-[13px]" style={{ color: "var(--lk-text)" }}>Keyboard shortcuts</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        {SHORTCUTS.map(([k, d]) => (
          <div key={k} className="flex items-center justify-between py-1 border-b text-[12px]" style={{ borderColor: "var(--lk-border-soft)" }}>
            <span style={{ color: "var(--lk-text-muted)" }}>{d}</span>
            <span className="kbd" style={{ fontFamily: "ui-monospace, monospace", color: "var(--lk-primary)", background: "var(--lk-primary-soft)", borderRadius: 5, padding: "1px 6px" }}>
              {k}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        <button className="lk-btn-primary !py-2 flex items-center gap-1.5" onClick={() => openDialog("settings")}>
          <Sparkles size={14} /> Open settings &amp; themes
        </button>
        <button className="lk-btn-ghost !py-2" onClick={closeDialog}>Close</button>
      </div>

      <p className="text-[11px] mt-4" style={{ color: "var(--lk-text-faint)" }}>
        Made for India · Your documents are stored locally and are never uploaded to any server.
      </p>
    </Modal>
  );
}
