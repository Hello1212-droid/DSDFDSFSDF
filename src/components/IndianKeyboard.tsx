import { useMemo, useState } from "react";
import { useLekhana } from "../editor/context";
import { SCRIPTS, VOWEL_KEYS, CONSONANT_KEYS, transliterateWord, type IndicScript } from "../utils/scripts";
import { setLangEnabled, setScriptId, isLangEnabled, getScriptId } from "../utils/langState";
import { X } from "lucide-react";
import { cn } from "../utils/cn";

type Mode = "osk" | "hinglish";

function Key({
  glyph,
  label,
  onClick,
  wide = false,
}: {
  glyph: string;
  label: string;
  onClick: () => void;
  wide?: boolean;
}) {
  return (
    <button
      className={cn(
        "h-9 rounded-md border border-gray-200 bg-white text-[16px] leading-none flex flex-col items-center justify-center",
        "hover:bg-blue-50 hover:border-blue-300 active:bg-blue-100 transition-colors",
        wide && "col-span-2",
      )}
      style={{ fontFamily: "inherit" }}
      onClick={onClick}
      title={`Insert ${label}`}
    >
      <span>{glyph}</span>
      <span className="text-[9px] text-gray-400 font-normal">{label}</span>
    </button>
  );
}

export function IndianKeyboardPanel() {
  const { editor, closeDialog } = useLekhana();
  const [scriptId, setLocalScript] = useState(getScriptId());
  const [mode, setMode] = useState<Mode>("osk");
  const [enabled, setEnabledState] = useState(isLangEnabled());

  const script: IndicScript = useMemo(() => SCRIPTS.find((s) => s.id === scriptId) || SCRIPTS[0], [scriptId]);

  const insert = (glyph: string) => {
    if (!glyph) return;
    editor?.chain().focus().insertContent(glyph).run();
  };

  const setScript = (id: string) => {
    setLocalScript(id);
    setScriptId(id);
  };

  const toggleEnabled = (v: boolean) => {
    setEnabledState(v);
    setLangEnabled(v);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-[360px] bg-white shadow-2xl z-[80] flex flex-col border-l border-gray-200 lk-print-hide">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <div className="font-semibold text-gray-900 text-[15px]">भारतीय कीबोर्ड</div>
          <div className="text-[12px] text-gray-500">Indian language keyboard</div>
        </div>
        <button className="lk-btn" onClick={closeDialog}><X size={18} /></button>
      </div>

      {/* Controls */}
      <div className="px-4 py-3 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] font-medium text-gray-700">Enable keyboard</span>
          <button
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors",
              enabled ? "bg-blue-600" : "bg-gray-300",
            )}
            onClick={() => toggleEnabled(!enabled)}
            aria-pressed={enabled}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow",
                enabled ? "left-[22px]" : "left-0.5",
              )}
            />
          </button>
        </div>

        <div>
          <label className="lk-label">Language / script</label>
          <select className="lk-input" value={scriptId} onChange={(e) => setScript(e.target.value)}>
            {SCRIPTS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.native}) — {s.languages.join(", ")}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(
            [
              { id: "osk", label: "On-screen keys" },
              { id: "hinglish", label: "Type in Hinglish" },
            ] as { id: Mode; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              className={cn(
                "flex-1 py-1.5 text-[12px] font-medium rounded-md transition-colors",
                mode === m.id ? "bg-white shadow text-gray-900" : "text-gray-500",
              )}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {mode === "hinglish" ? (
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-[12px] text-gray-700 leading-relaxed">
              <div className="font-semibold text-blue-800 mb-1">Type in Hinglish, get {script.native}</div>
              Type a word in English letters, then press <b>space</b> or <b>Enter</b> to convert it.
              <div className="mt-2 font-medium">Examples:</div>
              <div className="grid grid-cols-2 gap-1 mt-1">
                <span>namaste → <b>{trans("namaste", script)}</b></span>
                <span>dhanyavaad → <b>{trans("dhanyavaad", script)}</b></span>
                <span>pranaam → <b>{trans("pranaam", script)}</b></span>
                <span>shubh → <b>{trans("shubh", script)}</b></span>
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                <b>M</b> = {script.anusvara || "anusvara"} · <b>H</b> = {script.visarga || "visarga"} ·
                <b> x</b> = ksha · <b>gy</b> = {script.consonants[36]}
              </div>
            </div>
            <p className="text-[12px] text-gray-500">
              To insert symbols like the rupee, click the ₹ button in the toolbar.
            </p>
          </div>
        ) : (
          <>
            {/* Vowels */}
            <section>
              <div className="lk-label">Vowels (स्वर)</div>
              <div className="grid grid-cols-6 gap-1.5">
                {script.vowels.map((g, i) =>
                  g ? (
                    <Key key={i} glyph={g} label={VOWEL_KEYS[i] || ""} onClick={() => insert(g)} />
                  ) : null,
                )}
              </div>
            </section>

            {/* Consonants */}
            <section>
              <div className="lk-label">Consonants (व्यंजन)</div>
              <div className="grid grid-cols-6 gap-1.5">
                {script.consonants.map((g, i) =>
                  g ? (
                    <Key key={i} glyph={g} label={CONSONANT_KEYS[i] || ""} onClick={() => insert(g)} />
                  ) : null,
                )}
              </div>
            </section>

            {/* Matras */}
            <section>
              <div className="lk-label">Vowel signs (मात्रा) — shown with क</div>
              <div className="grid grid-cols-6 gap-1.5">
                {script.matras.map((m, i) =>
                  i !== 0 && m ? (
                    <Key key={i} glyph={"क" + m} label={VOWEL_KEYS[i] || ""} onClick={() => insert(m)} />
                  ) : null,
                )}
              </div>
            </section>

            {/* Signs */}
            <section>
              <div className="lk-label">Special signs</div>
              <div className="grid grid-cols-6 gap-1.5">
                <Key glyph={script.halant} label="halant" onClick={() => insert(script.halant)} />
                {script.anusvara && <Key glyph={script.anusvara} label="M" onClick={() => insert(script.anusvara)} />}
                {script.visarga && <Key glyph={script.visarga} label="H" onClick={() => insert(script.visarga)} />}
                {script.candrabindu && <Key glyph={script.candrabindu} label="~" onClick={() => insert(script.candrabindu)} />}
              </div>
            </section>

            {/* Numerals */}
            <section>
              <div className="lk-label">Numerals (१२३)</div>
              <div className="grid grid-cols-10 gap-1">
                {script.numerals.map((g, i) => (
                  <Key key={i} glyph={g} label={String(i)} onClick={() => insert(g)} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-gray-400">
        Documents are stored privately in your browser.
      </div>
    </div>
  );
}

function trans(w: string, s: IndicScript): string {
  return transliterateWord(w, s);
}
