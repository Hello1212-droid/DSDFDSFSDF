import { useMemo, useState } from "react";
import { useLekhana } from "../../editor/context";
import { useTheme } from "../ThemeProvider";
import { Modal } from "../ui";
import {
  buildTheme,
  generateGallery,
  OS_THEMES,
  ACCENTS,
  toTheme,
  type GalleryTheme,
} from "../../utils/themes";
import { cn } from "../../utils/cn";
import { Monitor, Sun, Moon, Palette, Sparkles, Save, Trash2, Search, X } from "lucide-react";

type Tab = "appearance" | "gallery" | "generator";

/* ------------------------- Tab header ------------------------- */
function TabButton({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-colors",
        active ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
      )}
      style={active ? { background: "var(--lk-primary-soft)", color: "var(--lk-primary)" } : undefined}
      onClick={onClick}
    >
      {icon} {label}
    </button>
  );
}

/* ------------------------- Mini app preview ------------------------- */
function ThemePreview({ colors, dark }: { colors: any; dark?: boolean }) {
  const c = colors;
  const pageBg = c.pageBg ?? "#ffffff";
  const pageText = c.pageText ?? "#000000";
  void dark;
  return (
    <div
      className="rounded-xl overflow-hidden border shadow-sm w-full max-w-[300px]"
      style={{ background: c.appBg, borderColor: c.border }}
    >
      <div className="h-6 flex items-center gap-1 px-2" style={{ background: c.titlebar, borderBottom: `1px solid ${c.border}` }}>
        <span className="w-2 h-2 rounded-full" style={{ background: c.danger }} />
        <span className="w-2 h-2 rounded-full" style={{ background: c.primary }} />
        <span className="w-2 h-2 rounded-full" style={{ background: c.primarySoft }} />
        <span className="ml-2 text-[9px] font-semibold" style={{ color: c.text }}>Lekhana</span>
      </div>
      <div className="h-6 flex items-center gap-1 px-2" style={{ background: c.surface2, borderBottom: `1px solid ${c.border}` }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-3 rounded-sm" style={{ width: 28, background: i === 1 ? c.primarySoft : c.hover }} />
        ))}
      </div>
      <div className="px-3 py-3 flex flex-col gap-1.5 items-center">
        <div className="w-full rounded border p-2 flex flex-col gap-1.5" style={{ background: pageBg, borderColor: c.border, minHeight: 70 }}>
          <span className="h-2.5 w-3/4 rounded" style={{ background: pageText }} />
          <span className="h-2.5 w-1/2 rounded" style={{ background: pageText, opacity: 0.7 }} />
          <span className="h-2.5 w-2/3 rounded" style={{ background: pageText, opacity: 0.5 }} />
        </div>
        <div className="flex gap-1.5 w-full">
          <span className="h-5 flex-1 rounded-md" style={{ background: c.primary }} />
          <span className="h-5 flex-1 rounded-md" style={{ background: c.hoverStrong }} />
          <span className="h-5 flex-1 rounded-md" style={{ background: c.hover }} />
        </div>
      </div>
    </div>
  );
}

/* =============================================================== */
/* APPEARANCE TAB                                                   */
/* =============================================================== */
function AppearanceTab() {
  const { mode, setMode, active } = useTheme();
  const opts: Array<{ id: typeof mode; label: string; icon: React.ReactNode }> = [
    { id: "light", label: "Light", icon: <Sun size={15} /> },
    { id: "dark", label: "Dark", icon: <Moon size={15} /> },
    { id: "system", label: "System", icon: <Monitor size={15} /> },
  ];
  return (
    <div className="space-y-6">
      <div>
        <div className="lk-label">Theme mode</div>
        <div className="grid grid-cols-3 gap-2">
          {opts.map((o) => (
            <button
              key={o.id}
              onClick={() => setMode(o.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 py-4 rounded-xl border transition-all",
                mode === o.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300",
              )}
              style={mode === o.id ? { borderColor: "var(--lk-primary)", background: "var(--lk-primary-soft)" } : undefined}
            >
              {o.icon}
              <span className="text-[13px] font-medium" style={{ color: mode === o.id ? "var(--lk-primary)" : undefined }}>
                {o.label}
              </span>
            </button>
          ))}
        </div>
        <p className="text-[12px] text-gray-500 mt-2">
          {mode === "system" ? "Follows your device's light/dark setting automatically." : `App uses ${mode} theme.`}
        </p>
      </div>

      <div>
        <div className="lk-label mb-2">Current theme</div>
        <div className="flex items-center gap-3">
          <ThemePreview colors={active} dark={active.isDark} />
          <div className="text-[13px] text-gray-700 font-medium">{active.name}</div>
        </div>
      </div>
    </div>
  );
}

/* =============================================================== */
/* GALLERY TAB                                                      */
/* =============================================================== */
const PAGE_SIZE = 96;

function GalleryTab() {
  const { active, apply, presets, removePreset, addPreset } = useTheme();
  const all = useMemo(() => generateGallery(2000), []);
  const [family, setFamily] = useState<string>("All");
  const [onlyDark, setOnlyDark] = useState(false);
  const [onlyLight, setOnlyLight] = useState(false);
  const [count, setCount] = useState(PAGE_SIZE);
  const [search, setSearch] = useState("");

  const families = ["All", ...Array.from(new Set(all.map((t) => t.family)))];

  const filtered = all.filter((t) => {
    if (family !== "All" && t.family !== family) return false;
    if (onlyDark && !t.isDark) return false;
    if (onlyLight && t.isDark) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const shown = filtered.slice(0, count);

  const applyTheme = (t: GalleryTheme) => {
    apply(toTheme(t.id, t.name, t.colors));
  };

  const saveAsPreset = (t: GalleryTheme) => {
    addPreset(t.name, t.colors, t.isDark);
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[150px]">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="lk-input !pl-8 !py-1.5 text-[13px]"
            placeholder="Search 2,000 themes…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCount(PAGE_SIZE); }}
          />
        </div>
        <select
          className="lk-input !w-auto !py-1.5 text-[13px]"
          value={family}
          onChange={(e) => { setFamily(e.target.value); setCount(PAGE_SIZE); }}
        >
          {families.map((f) => <option key={f}>{f}</option>)}
        </select>
        <button
          className={cn("px-2.5 py-1.5 rounded-md text-[12px] font-medium border", onlyDark ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-500")}
          style={onlyDark ? { borderColor: "var(--lk-primary)", color: "var(--lk-primary)", background: "var(--lk-primary-soft)" } : undefined}
          onClick={() => { setOnlyDark(!onlyDark); setOnlyLight(false); setCount(PAGE_SIZE); }}
        >
          Dark
        </button>
        <button
          className={cn("px-2.5 py-1.5 rounded-md text-[12px] font-medium border", onlyLight ? "border-blue-500 text-blue-600" : "border-gray-200 text-gray-500")}
          style={onlyLight ? { borderColor: "var(--lk-primary)", color: "var(--lk-primary)", background: "var(--lk-primary-soft)" } : undefined}
          onClick={() => { setOnlyLight(!onlyLight); setOnlyDark(false); setCount(PAGE_SIZE); }}
        >
          Light
        </button>
      </div>

      <div className="text-[12px] text-gray-500">
        {filtered.length.toLocaleString("en-IN")} themes · showing {shown.length}
      </div>

      {/* Theme grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[52vh] pr-1">
        {shown.map((t) => {
          const isActive = active.id === t.id;
          return (
            <div
              key={t.id}
              onClick={() => applyTheme(t)}
              className={cn(
                "rounded-xl border p-2 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md",
                isActive ? "ring-2 ring-blue-500" : "border-gray-200",
              )}
              style={isActive ? { borderColor: "var(--lk-primary)" } : undefined}
              title={t.name}
            >
              <div className="rounded-lg overflow-hidden mb-1.5 pointer-events-none">
                <ThemePreview colors={t.colors} dark={t.isDark} />
              </div>
              <div className="flex items-center justify-between gap-1">
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-gray-800 truncate">{t.name}</div>
                  <div className="text-[10px] text-gray-400">{t.family} · {t.isDark ? "Dark" : "Light"}</div>
                </div>
                <button
                  className="text-gray-400 hover:text-blue-600 p-1 shrink-0"
                  title="Save as preset"
                  onClick={(e) => { e.stopPropagation(); saveAsPreset(t); }}
                >
                  <Save size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {count < filtered.length && (
        <button
          className="mx-auto lk-btn-ghost !px-6 text-[13px]"
          onClick={() => setCount((c) => c + PAGE_SIZE)}
        >
          Load more themes ({filtered.length - count} left)
        </button>
      )}

      {/* Presets */}
      {presets.length > 0 && (
        <div className="border-t pt-3">
          <div className="lk-label mb-2 flex items-center gap-1.5"><Sparkles size={13} /> My saved presets</div>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 cursor-pointer text-[12px]"
                style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)", color: "var(--lk-text)" }}
                onClick={() => apply(toTheme(p.id, p.name, p.colors))}
              >
                <span className="w-3 h-3 rounded-full inline-block" style={{ background: p.colors.primary }} />
                {p.name}
                <button className="text-gray-400 hover:text-red-500" onClick={(e) => { e.stopPropagation(); removePreset(p.id); }}>
                  <Trash2 size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================================================== */
/* GENERATOR TAB                                                    */
/* =============================================================== */
function GeneratorTab() {
  const { active, applyCustom, addPreset, presets, removePreset } = useTheme();
  const [isDark, setIsDark] = useState(active.isDark);
  const [osName, setOsName] = useState(active.name.startsWith("Windows") ? "Windows 11" : OS_THEMES[0].name);
  const [accent, setAccent] = useState(active.primary);
  const [warmth, setWarmth] = useState(0);
  const [pageBg, setPageBg] = useState(active.pageBg);
  const [pageText, setPageText] = useState(active.pageText);
  const [presetName, setPresetName] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  const preview = useMemo(() => {
    const built = buildTheme({ osName, accent, isDark, warmth, pageBg, pageText });
    return toTheme("preview", "Preview", built);
  }, [osName, accent, isDark, warmth, pageBg, pageText]);

  const applyIt = () => {
    applyCustom({ osName, accent, isDark, warmth, pageBg, pageText });
  };

  const saveIt = () => {
    const name = presetName.trim() || "My theme";
    const built = buildTheme({ osName, accent, isDark, warmth, pageBg, pageText });
    addPreset(name, built, isDark);
    setPresetName("");
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      {/* Preview */}
      <div className="flex flex-col items-center gap-3">
        <div className="lk-label">Live preview</div>
        <ThemePreview colors={preview} dark={isDark} />
        <button className="lk-btn-primary w-full max-w-[300px] !py-2.5 flex items-center justify-center gap-2" onClick={applyIt}>
          <Palette size={15} /> Apply this theme
        </button>
      </div>

      {/* Controls */}
      <div className="space-y-4 overflow-y-auto max-h-[58vh] pr-1">
        <div>
          <div className="lk-label">Light / Dark</div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                className={cn("flex-1 py-1.5 text-[13px] font-medium rounded-md", isDark === (m === "dark") ? "bg-white shadow" : "")}
                onClick={() => setIsDark(m === "dark")}
              >
                {m === "light" ? "Light" : "Dark"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="lk-label">Base OS style</div>
          <select className="lk-input" value={osName} onChange={(e) => setOsName(e.target.value)}>
            {OS_THEMES.map((o) => <option key={o.name} value={o.name}>{o.family} · {o.name}</option>)}
          </select>
        </div>

        <div>
          <div className="lk-label">Accent color</div>
          <div className="flex items-center gap-2 mb-2">
            <input type="color" className="w-9 h-9 border rounded cursor-pointer" value={accent} onChange={(e) => setAccent(e.target.value)} />
            <input className="lk-input !w-28 text-[13px]" value={accent} onChange={(e) => /^#[0-9a-fA-F]{6}$/.test(e.target.value) && setAccent(e.target.value)} />
          </div>
          <div className="grid grid-cols-10 gap-1.5">
            {ACCENTS.map((a) => (
              <button
                key={a.name}
                title={a.name}
                onClick={() => setAccent(a.color)}
                className="w-6 h-6 rounded-md border border-black/10 hover:scale-110 transition-transform"
                style={{ background: a.color }}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="lk-label flex justify-between"><span>Neutral warmth</span><span className="text-gray-400 text-[11px]">{warmth > 0 ? "Warm" : warmth < 0 ? "Cool" : "Neutral"}</span></div>
          <input type="range" min={-1} max={1} step={0.05} value={warmth} onChange={(e) => setWarmth(parseFloat(e.target.value))} className="w-full accent-blue-600" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="lk-label">Page background</div>
            <div className="flex items-center gap-2">
              <input type="color" className="w-9 h-9 border rounded cursor-pointer" value={pageBg} onChange={(e) => setPageBg(e.target.value)} />
              <span className="text-[12px] text-gray-500 tabular">{pageBg}</span>
            </div>
          </div>
          <div>
            <div className="lk-label">Page text</div>
            <div className="flex items-center gap-2">
              <input type="color" className="w-9 h-9 border rounded cursor-pointer" value={pageText} onChange={(e) => setPageText(e.target.value)} />
              <span className="text-[12px] text-gray-500 tabular">{pageText}</span>
            </div>
          </div>
        </div>

        {/* Save preset */}
        <div className="border-t pt-3 space-y-2">
          <div className="lk-label">Save as preset</div>
          <div className="flex gap-2">
            <input
              className="lk-input !py-1.5 text-[13px]"
              placeholder="My custom theme"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <button className="lk-btn-primary shrink-0 !px-4 flex items-center gap-1.5" onClick={saveIt}>
              <Save size={14} /> Save
            </button>
          </div>
          {savedFlash && <p className="text-[12px] text-green-600 font-medium">✓ Saved to My presets</p>}

          {presets.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {presets.map((p) => (
                <span key={p.id} className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px]" style={{ borderColor: "var(--lk-border)", background: "var(--lk-surface-2)" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.colors.primary }} />
                  {p.name}
                  <button className="text-gray-400 hover:text-red-500" onClick={() => removePreset(p.id)}><X size={11} /></button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =============================================================== */
/* MAIN DIALOG                                                      */
/* =============================================================== */
export function SettingsDialog() {
  const { closeDialog } = useLekhana();
  const [tab, setTab] = useState<Tab>("appearance");

  return (
    <Modal title="Settings" onClose={closeDialog} size="lg">
      <div className="flex gap-1 mb-4 border-b pb-3">
        <TabButton icon={<Monitor size={15} />} label="Appearance" active={tab === "appearance"} onClick={() => setTab("appearance")} />
        <TabButton icon={<Palette size={15} />} label="Theme gallery (2,000)" active={tab === "gallery"} onClick={() => setTab("gallery")} />
        <TabButton icon={<Sparkles size={15} />} label="Theme generator" active={tab === "generator"} onClick={() => setTab("generator")} />
      </div>
      <div className="min-h-[320px]">
        {tab === "appearance" && <AppearanceTab />}
        {tab === "gallery" && <GalleryTab />}
        {tab === "generator" && <GeneratorTab />}
      </div>
    </Modal>
  );
}
