import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../utils/cn";

interface Swatch {
  label: string;
  value: string;
}

function ColorPopup({
  title,
  colors,
  onPick,
  onCustom,
  onClose,
}: {
  title: string;
  colors: Swatch[];
  onPick: (v: string) => void;
  onCustom: (v: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-3 w-[220px]" onMouseDown={(e) => e.stopPropagation()}>
      <div className="text-[11px] font-semibold text-gray-500 mb-2">{title}</div>
      <div className="grid grid-cols-6 gap-1.5">
        {colors.map((c) => (
          <button
            key={c.label}
            title={c.label}
            onClick={() => { onPick(c.value); onClose(); }}
            className="w-7 h-7 rounded-md border border-gray-200 hover:scale-110 transition-transform"
            style={{ background: c.value === "inherit" ? "linear-gradient(135deg,#fff 40%,#ccc 40%,#ccc 50%,#fff 50%)" : c.value }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <label className="flex items-center gap-2 text-[12px] text-gray-600 cursor-pointer">
          Custom
          <input
            type="color"
            className="w-7 h-7 border rounded"
            onChange={(e) => { onCustom(e.target.value); onClose(); }}
          />
        </label>
        <button className="ml-auto lk-btn-ghost !py-1 !px-2 text-[12px]" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}

export function ColorButton({
  active,
  activeColor,
  button,
  title,
  colors,
  onPick,
  onCustom,
  underline = false,
}: {
  active: boolean;
  activeColor?: string;
  button: ReactNode;
  title: string;
  colors: Swatch[];
  onPick: (v: string) => void;
  onCustom: (v: string) => void;
  underline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className={cn("lk-btn lk-swatch", active && "active")}
        title={title}
        onClick={() => setOpen((o) => !o)}
      >
        {button}
        {underline && (
          <span className="underline-bar" style={{ background: activeColor && activeColor !== "inherit" ? activeColor : "#2563eb" }} />
        )}
      </button>
      {open && (
        <ColorPopup title={title} colors={colors} onPick={onPick} onCustom={onCustom} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}
