import { useCallback, useEffect, useRef, useState } from "react";
import { useLekhana } from "../editor/context";
import { recognizeSymbol, buildEquation, type Stroke } from "../utils/handwrite";
import { SYMBOL_CATEGORIES } from "../utils/mathSymbols";
import { MathPreview } from "./MathPreview";
import { X, Eraser, Undo2, Trash2, Wand2, Plus, Type } from "lucide-react";
import { cn } from "../utils/cn";

interface Token { latex: string; label: string }

export function MathInputPanel() {
  const { editor, closeDialog } = useLekhana();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const currentStroke = useRef<Stroke>([]);
  const strokesRef = useRef<Stroke[]>([]);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [activeCat, setActiveCat] = useState(SYMBOL_CATEGORIES[0].id);
  const [manual, setManual] = useState("");
  const [recognized, setRecognized] = useState<{ label: string; confidence: number } | null>(null);

  const equation = buildEquation(tokens.map((t) => t.latex));

  const redraw = useCallback((s: Stroke[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#1f2937";
    for (const stroke of s) {
      if (stroke.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i].x, stroke[i].y);
      ctx.stroke();
    }
  }, []);

  useEffect(() => { redraw(strokes); }, [strokes, redraw]);

  const getPos = (e: React.PointerEvent): { x: number; y: number } => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onDown = (e: React.PointerEvent) => {
    e.preventDefault();
    canvasRef.current?.setPointerCapture(e.pointerId);
    drawing.current = true;
    currentStroke.current = [getPos(e)];
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    currentStroke.current.push(getPos(e));
    setStrokes([...strokesRef.current, [...currentStroke.current]]);
  };
  const onUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (currentStroke.current.length > 1) {
      strokesRef.current = [...strokesRef.current, [...currentStroke.current]];
      setStrokes(strokesRef.current);
    }
    currentStroke.current = [];
  };

  const clearCanvas = () => {
    strokesRef.current = [];
    currentStroke.current = [];
    setStrokes([]);
    setRecognized(null);
  };
  const undoStroke = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokes(strokesRef.current);
    setRecognized(null);
  };

  const recognize = () => {
    if (!strokes.length) return;
    const res = recognizeSymbol(strokes);
    if (res.label) {
      setTokens((t) => [...t, { latex: res.latex, label: res.label }]);
      setRecognized(res);
      clearCanvas();
    } else {
      setRecognized({ label: "?", confidence: 0 });
    }
  };

  const addSymbol = (latex: string, label: string) => {
    setTokens((t) => [...t, { latex, label }]);
  };

  const removeToken = (i: number) => setTokens((t) => t.filter((_, j) => j !== i));

  const insertEquation = () => {
    const latex = manual.trim() || equation;
    if (!latex) return;
    editor?.commands.insertBlockMath({ latex });
    closeDialog();
  };

  const cat = SYMBOL_CATEGORIES.find((c) => c.id === activeCat) || SYMBOL_CATEGORIES[0];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center lk-print-hide" style={{ background: "var(--lk-shadow)" }} onMouseDown={(e) => { if (e.target === e.currentTarget) closeDialog(); }}>
      <div className="lk-modal lg !max-h-[92vh]" style={{ background: "var(--lk-surface)" }}>
        <div className="lk-modal-header">
          <div>
            <div className="lk-modal-title">Math Input Panel (गणित)</div>
            <div className="text-[12px]" style={{ color: "var(--lk-text-muted)" }}>
              Handwrite an equation — it converts to a formula, just like MS Word
            </div>
          </div>
          <button className="lk-btn" onClick={closeDialog}><X size={18} /></button>
        </div>

        <div className="lk-modal-body space-y-4">
          {/* Live equation preview */}
          <div className="rounded-lg border p-3 flex items-center justify-center min-h-[64px]" style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)" }}>
            <MathPreview latex={manual || equation} fallback="Draw or type your equation…" />
          </div>

          {/* Drawing canvas */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="lk-label !mb-0">Write a symbol, then press Recognize (or Space)</span>
              <div className="flex gap-1">
                <button className="lk-btn" title="Undo stroke" onClick={undoStroke} disabled={!strokes.length}><Undo2 size={15} /></button>
                <button className="lk-btn" title="Clear canvas" onClick={clearCanvas}><Eraser size={15} /></button>
              </div>
            </div>
            <canvas
              ref={canvasRef}
              className="lk-math-canvas"
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerLeave={onUp}
            />
            <div className="flex items-center gap-2 mt-2">
              <button className="lk-btn-primary !py-1.5 flex items-center gap-1.5" onClick={recognize} disabled={!strokes.length}>
                <Wand2 size={14} /> Recognize
              </button>
              {recognized && (
                <span className="text-[12px]" style={{ color: "var(--lk-text-muted)" }}>
                  → {recognized.label} · {Math.round(recognized.confidence * 100)}%
                </span>
              )}
              <span className="text-[11px] ml-auto" style={{ color: "var(--lk-text-faint)" }}>
                Recognizes digits, + − = ÷ × ( ) x y π √ ∞ ∑ Δ θ α …
              </span>
            </div>
          </div>

          {/* Tokens */}
          {tokens.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px]" style={{ color: "var(--lk-text-muted)" }}>Equation:</span>
              {tokens.map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[13px]" style={{ borderColor: "var(--lk-primary)", background: "var(--lk-primary-soft)", color: "var(--lk-text)" }}>
                  {t.label}
                  <button className="text-red-500 hover:text-red-700" onClick={() => removeToken(i)}><X size={12} /></button>
                </span>
              ))}
              <button className="text-gray-400 hover:text-red-500 p-0.5" onClick={() => setTokens([])} title="Clear all"><Trash2 size={13} /></button>
            </div>
          )}

          {/* Symbol palette */}
          <div>
            <div className="flex flex-wrap gap-1 mb-1.5">
              {SYMBOL_CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={cn("px-2.5 py-1 rounded-md text-[12px] font-medium border", activeCat === c.id ? "text-blue-700" : "")}
                  style={activeCat === c.id ? { borderColor: "var(--lk-primary)", background: "var(--lk-primary-soft)", color: "var(--lk-primary)" } : { borderColor: "var(--lk-border)", color: "var(--lk-text-muted)" }}
                  onClick={() => setActiveCat(c.id)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-8 gap-1">
              {cat.symbols.map((s, i) => (
                <button
                  key={i}
                  title={s.latex}
                  onClick={() => addSymbol(s.latex, s.display)}
                  className="h-9 rounded-md border text-[15px] hover:scale-105 transition-transform"
                  style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)", color: "var(--lk-text)" }}
                >
                  {s.display}
                </button>
              ))}
            </div>
          </div>

          {/* Manual LaTeX */}
          <div>
            <div className="lk-label flex items-center gap-1"><Type size={13} /> Or type LaTeX</div>
            <div className="flex gap-2">
              <input
                className="lk-input"
                placeholder="e.g. x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}"
                value={manual}
                onChange={(e) => setManual(e.target.value)}
              />
              <button className="lk-btn-ghost shrink-0" onClick={() => setManual("")}>Clear</button>
            </div>
          </div>
        </div>

        <div className="lk-modal-footer">
          <button className="lk-btn-ghost" onClick={closeDialog}>Cancel</button>
          <button className="lk-btn-primary flex items-center gap-1.5" onClick={insertEquation} disabled={!(manual.trim() || equation)}>
            <Plus size={15} /> Insert equation
          </button>
        </div>
      </div>
    </div>
  );
}
