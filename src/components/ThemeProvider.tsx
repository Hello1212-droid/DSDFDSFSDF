import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyDarkFlag,
  applyThemeVars,
  buildTheme,
  loadPresets,
  deletePreset as deletePresetDb,
  savePreset as savePresetDb,
  toTheme,
  type GalleryTheme,
  type SavedPreset,
  type ThemeColors,
  type ThemeMode,
} from "../utils/themes";
import { uid } from "../utils/storage";

interface ThemeCtxValue {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  /** Currently applied theme. */
  active: ThemeColors;
  /** Apply a preset/gallery theme. */
  apply: (t: ThemeColors) => void;
  /** Build + apply a custom theme live (from the generator). */
  applyCustom: (params: {
    osName: string; accent: string; isDark: boolean; warmth: number; pageBg?: string; pageText?: string;
  }) => void;
  presets: SavedPreset[];
  addPreset: (name: string, colors: Omit<ThemeColors, "id" | "name">, isDark: boolean) => void;
  removePreset: (id: string) => void;
  systemDark: boolean;
}

const ThemeCtx = createContext<ThemeCtxValue | null>(null);

export function useTheme(): ThemeCtxValue {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme must be used within ThemeProvider");
  return v;
}

const MODE_KEY = "lekhana.themeMode";
const THEME_KEY = "lekhana.activeTheme";

function storedMode(): ThemeMode {
  try {
    const m = localStorage.getItem(MODE_KEY);
    if (m === "light" || m === "dark" || m === "system") return m;
  } catch { /* ignore */ }
  return "system";
}

function storedTheme(): ThemeColors | null {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(storedMode);
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false,
  );
  const [presets, setPresets] = useState<SavedPreset[]>(() => loadPresets());

  // Default theme (Word-like light) if none stored.
  const [active, setActive] = useState<ThemeColors>(() => {
    const stored = storedTheme();
    if (stored) return stored;
    const light = buildTheme({ osName: "Windows 11", accent: "#2563eb", isDark: false, warmth: 0 });
    return toTheme("default", "Word Light", light);
  });

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  // Apply theme whenever active or mode changes.
  useEffect(() => {
    // For light/dark/system we trust the active theme's palette; for system mode
    // we ensure data-theme follows the OS preference.
    const useActiveDark = active.isDark;
    applyDarkFlag(mode === "system" ? systemDark : useActiveDark);
    applyThemeVars(active);
  }, [active, mode, systemDark]);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
    try { localStorage.setItem(MODE_KEY, m); } catch { /* ignore */ }
  }, []);

  const apply = useCallback((t: ThemeColors) => {
    setActive(t);
    try { localStorage.setItem(THEME_KEY, JSON.stringify(t)); } catch { /* ignore */ }
  }, []);

  const applyCustom = useCallback((p: {
    osName: string; accent: string; isDark: boolean; warmth: number; pageBg?: string; pageText?: string;
  }) => {
    const built = buildTheme(p);
    const t = toTheme("custom", "Custom theme", built);
    setActive(t);
    try { localStorage.setItem(THEME_KEY, JSON.stringify(t)); } catch { /* ignore */ }
  }, []);

  const addPreset = useCallback((name: string, colors: Omit<ThemeColors, "id" | "name">, isDark: boolean) => {
    const p: SavedPreset = { id: uid(), name, isDark, colors };
    savePresetDb(p);
    setPresets(loadPresets());
  }, []);

  const removePreset = useCallback((id: string) => {
    deletePresetDb(id);
    setPresets(loadPresets());
  }, []);

  const value = useMemo<ThemeCtxValue>(
    () => ({ mode, setMode, active, apply, applyCustom, presets, addPreset, removePreset, systemDark }),
    [mode, setMode, active, apply, applyCustom, presets, addPreset, removePreset, systemDark],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export type { GalleryTheme };
