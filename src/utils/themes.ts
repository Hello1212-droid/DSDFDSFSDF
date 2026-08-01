import { mix, shade, temperature } from "./color";

/** A fully-resolved theme (CSS variable values). */
export interface ThemeColors {
  id: string;
  name: string;
  isDark: boolean;
  appBg: string;
  surface: string;
  surface2: string;
  titlebar: string;
  border: string;
  borderSoft: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  hover: string;
  hoverStrong: string;
  pageBg: string;
  pageText: string;
  danger: string;
}

export type ThemeMode = "light" | "dark" | "system";

/* ------------------------------------------------------------------ */
/* OS-inspired base themes (light + dark palettes)                     */
/* ------------------------------------------------------------------ */

interface OSDef {
  name: string;
  accent: string;
  window: [string, string]; // [light, dark] page/surface bg
  chrome: [string, string]; // [light, dark] titlebar/toolbar bg
  border: [string, string];
  family: string;
}

export const OS_THEMES: OSDef[] = [
  // Windows family
  { name: "Windows 11", family: "Windows", accent: "#4cc2ff", window: ["#ffffff", "#202020"], chrome: ["#f3f3f3", "#2b2b2b"], border: ["#dcdcdc", "#3a3a3a"] },
  { name: "Windows 10", family: "Windows", accent: "#0078d4", window: ["#ffffff", "#1b1b1b"], chrome: ["#f3f3f3", "#262626"], border: ["#d5d5d5", "#383838"] },
  { name: "Windows 7", family: "Windows", accent: "#4fc3f7", window: ["#ffffff", "#1b1b1b"], chrome: ["#eef2f7", "#2a2a2a"], border: ["#d6dce3", "#393939"] },
  { name: "Windows Vista", family: "Windows", accent: "#92c041", window: ["#ffffff", "#1e1e1e"], chrome: ["#e6eef7", "#2d2d2d"], border: ["#cdd8e6", "#3a3a3a"] },
  { name: "Windows XP", family: "Windows", accent: "#75a7e0", window: ["#f3ead8", "#1e1e1e"], chrome: ["#2f5b9e", "#274a6b"], border: ["#b8c8dc", "#3a4d5c"] },
  { name: "Windows 2000", family: "Windows", accent: "#4a6c9a", window: ["#f5f5f5", "#1e1e1e"], chrome: ["#6b88b0", "#2b2b2b"], border: ["#c6d0dc", "#3a3a3a"] },
  { name: "Windows 98", family: "Windows", accent: "#008080", window: ["#d4d0c8", "#1e1e1e"], chrome: ["#d4d0c8", "#333333"], border: ["#808080", "#4a4a4a"] },
  { name: "Windows 95", family: "Windows", accent: "#008080", window: ["#c0c0c0", "#1e1e1e"], chrome: ["#c0c0c0", "#404040"], border: ["#808080", "#555555"] },
  { name: "MS-DOS", family: "Windows", accent: "#aaaaaa", window: ["#000000", "#000000"], chrome: ["#000000", "#000000"], border: ["#444444", "#444444"] },

  // macOS family
  { name: "macOS Sequoia", family: "macOS", accent: "#0a84ff", window: ["#f5f5f7", "#1e1e20"], chrome: ["#f5f5f7", "#2a2a2c"], border: ["#d6d6db", "#3a3a3d"] },
  { name: "macOS Big Sur", family: "macOS", accent: "#0a84ff", window: ["#f5f5f7", "#1e1e20"], chrome: ["#ececec", "#28282a"], border: ["#d6d6db", "#3a3a3d"] },
  { name: "macOS Mojave", family: "macOS", accent: "#007aff", window: ["#ececec", "#1e1e1e"], chrome: ["#e4e4e4", "#252525"], border: ["#cfcfcf", "#3a3a3a"] },
  { name: "macOS Yosemite", family: "macOS", accent: "#007aff", window: ["#f0f0f0", "#1e1e1e"], chrome: ["#e8e8e8", "#242424"], border: ["#d0d0d0", "#393939"] },
  { name: "macOS Classic", family: "macOS", accent: "#3388ff", window: ["#d6dde5", "#1e1e1e"], chrome: ["#c8d0da", "#2a2a2a"], border: ["#9aa7b4", "#3d3d3d"] },
  { name: "macOS Aqua", family: "macOS", accent: "#6cb4ee", window: ["#e8edf2", "#1e1e1e"], chrome: ["#dce1e6", "#262626"], border: ["#b9c2cc", "#3a3a3a"] },

  // Linux family
  { name: "Ubuntu", family: "Linux", accent: "#e95420", window: ["#ffffff", "#2c2c2c"], chrome: ["#f7f7f7", "#353535"], border: ["#dcdcdc", "#484848"] },
  { name: "Linux Mint", family: "Linux", accent: "#7fb512", window: ["#ffffff", "#2c2c2c"], chrome: ["#f0f0f0", "#353535"], border: ["#d9d9d9", "#484848"] },
  { name: "Fedora", family: "Linux", accent: "#3c6eb4", window: ["#ffffff", "#2a2a2a"], chrome: ["#eef2f6", "#353535"], border: ["#d6dde6", "#474747"] },
  { name: "openSUSE", family: "Linux", accent: "#73ba25", window: ["#ffffff", "#2c2c2c"], chrome: ["#f0f0f0", "#353535"], border: ["#dadada", "#484848"] },
  { name: "Arch Linux", family: "Linux", accent: "#1793d1", window: ["#ffffff", "#2c2c2c"], chrome: ["#eef1f4", "#353535"], border: ["#d5dade", "#484848"] },
  { name: "Debian", family: "Linux", accent: "#d70a53", window: ["#ffffff", "#2c2c2c"], chrome: ["#f0f0f0", "#353535"], border: ["#dcdcdc", "#484848"] },
  { name: "Kali Linux", family: "Linux", accent: "#557c93", window: ["#f2f2f2", "#262626"], chrome: ["#e8e8e8", "#303030"], border: ["#cfcfcf", "#424242"] },
  { name: "GNOME", family: "Linux", accent: "#3584e4", window: ["#f6f5f4", "#242424"], chrome: ["#f6f5f4", "#2e2e2e"], border: ["#d9d8d5", "#3f3f3f"] },
  { name: "KDE Plasma", family: "Linux", accent: "#3daee9", window: ["#eff0f1", "#1d2123"], chrome: ["#eff0f1", "#232627"], border: ["#d5d8da", "#3a3f42"] },
  { name: "Xfce", family: "Linux", accent: "#4a90d9", window: ["#f0f0f0", "#2c2c2c"], chrome: ["#e8e8e8", "#333333"], border: ["#cfcfcf", "#464646"] },
  { name: "LXDE", family: "Linux", accent: "#5899b5", window: ["#f2f2f2", "#2b2b2b"], chrome: ["#e8e8e8", "#323232"], border: ["#d0d0d0", "#464646"] },
  { name: "Elementary OS", family: "Linux", accent: "#a2b8c7", window: ["#ffffff", "#2c2c2c"], chrome: ["#e8edf0", "#343434"], border: ["#cfd8dd", "#494949"] },

  // Mobile / cloud
  { name: "ChromeOS", family: "Mobile", accent: "#1a73e8", window: ["#ffffff", "#202124"], chrome: ["#f1f3f4", "#2d2e30"], border: ["#dadce0", "#3c4043"] },
  { name: "Android Material", family: "Mobile", accent: "#6750a4", window: ["#f7f2fa", "#1f1b2e"], chrome: ["#ffffff", "#2d283e"], border: ["#d9d2e2", "#423c56"] },
  { name: "Android Holo", family: "Mobile", accent: "#33b5e5", window: ["#e8e8e8", "#16181c"], chrome: ["#14181c", "#14181c"], border: ["#9ea7ad", "#33383e"] },
  { name: "iOS", family: "Mobile", accent: "#0a84ff", window: ["#ffffff", "#000000"], chrome: ["#f2f2f7", "#1c1c1e"], border: ["#d1d1d6", "#3a3a3c"] },
  { name: "Tizen", family: "Mobile", accent: "#0a9edb", window: ["#f5f5f5", "#1c1c1c"], chrome: ["#eef4f8", "#262626"], border: ["#cfd8e0", "#3a3a3a"] },

  // Retro / developer
  { name: "Solaris", family: "Retro", accent: "#e6b800", window: ["#d6e6e6", "#1e1e1e"], chrome: ["#c0d0d0", "#262626"], border: ["#9fb2b2", "#3a3a3a"] },
  { name: "Solarized", family: "Developer", accent: "#268bd2", window: ["#fdf6e3", "#002b36"], chrome: ["#eee8d5", "#073642"], border: ["#ddd6c3", "#11424f"] },
  { name: "Dracula", family: "Developer", accent: "#bd93f9", window: ["#282a36", "#282a36"], chrome: ["#21222c", "#21222c"], border: ["#44475a", "#44475a"] },
  { name: "Nord", family: "Developer", accent: "#88c0d0", window: ["#eceff4", "#2e3440"], chrome: ["#e5e9f0", "#3b4252"], border: ["#d8dee9", "#434c5e"] },
  { name: "Gruvbox", family: "Developer", accent: "#fb4934", window: ["#fbf1c7", "#282828"], chrome: ["#ebdbb2", "#3c3836"], border: ["#d5c4a1", "#504945"] },
  { name: "One Dark", family: "Developer", accent: "#61afef", window: ["#282c34", "#282c34"], chrome: ["#21252b", "#21252b"], border: ["#3b4048", "#3b4048"] },
  { name: "Tokyo Night", family: "Developer", accent: "#7aa2f7", window: ["#1a1b26", "#1a1b26"], chrome: ["#16161e", "#16161e"], border: ["#2a2b3d", "#2a2b3d"] },
  { name: "Catppuccin", family: "Developer", accent: "#89b4fa", window: ["#1e1e2e", "#1e1e2e"], chrome: ["#181825", "#181825"], border: ["#313244", "#313244"] },
  { name: "Amber Terminal", family: "Retro", accent: "#ffb000", window: ["#1c1c1c", "#1c1c1c"], chrome: ["#0f0f0f", "#0f0f0f"], border: ["#333333", "#333333"] },
  { name: "Retro Terminal", family: "Retro", accent: "#33ff33", window: ["#001100", "#001100"], chrome: ["#000800", "#000800"], border: ["#1a3a1a", "#1a3a1a"] },
  { name: "IBM CGA", family: "Retro", accent: "#55ffff", window: ["#000000", "#000000"], chrome: ["#000000", "#000000"], border: ["#2a2a2a", "#2a2a2a"] },
];

/** 50 accent colors → combined with 40 OS themes = 2000 unique themes. */
export const ACCENTS: Array<{ name: string; color: string }> = [
  { name: "Blue", color: "#2563eb" }, { name: "Royal", color: "#1e3a8a" }, { name: "Azure", color: "#0284c7" },
  { name: "Sky", color: "#0ea5e9" }, { name: "Cyan", color: "#06b6d4" }, { name: "Teal", color: "#0d9488" },
  { name: "Emerald", color: "#059669" }, { name: "Green", color: "#16a34a" }, { name: "Lime", color: "#65a30d" },
  { name: "Olive", color: "#6b8e23" }, { name: "Yellow", color: "#ca8a04" }, { name: "Gold", color: "#d4a017" },
  { name: "Amber", color: "#d97706" }, { name: "Orange", color: "#ea580c" }, { name: "Coral", color: "#ff6b57" },
  { name: "Salmon", color: "#fa8072" }, { name: "Red", color: "#dc2626" }, { name: "Crimson", color: "#b91c1c" },
  { name: "Rose", color: "#f43f5e" }, { name: "Pink", color: "#db2777" }, { name: "Magenta", color: "#c026d3" },
  { name: "Fuchsia", color: "#a21caf" }, { name: "Purple", color: "#7c3aed" }, { name: "Violet", color: "#8b5cf6" },
  { name: "Indigo", color: "#6366f1" }, { name: "Lavender", color: "#a78bfa" }, { name: "Plum", color: "#86198f" },
  { name: "Wine", color: "#7f1d1d" }, { name: "Burgundy", color: "#6b2d3d" }, { name: "Brown", color: "#92400e" },
  { name: "Coffee", color: "#6f4e37" }, { name: "Sand", color: "#c2a878" }, { name: "Peach", color: "#fda4af" },
  { name: "Apricot", color: "#f59e0b" }, { name: "Blush", color: "#f9a8d4" }, { name: "Cream", color: "#e7d8b5" },
  { name: "Slate", color: "#475569" }, { name: "Graphite", color: "#3f3f46" }, { name: "Charcoal", color: "#27272a" },
  { name: "Navy", color: "#1e293b" }, { name: "Midnight", color: "#111827" }, { name: "Silver", color: "#9ca3af" },
  { name: "Mint", color: "#6ee7b7" }, { name: "Seafoam", color: "#5eead4" }, { name: "Ocean", color: "#2563eb" },
  { name: "Caribbean", color: "#06b6d4" }, { name: "Cerulean", color: "#0ea5e9" }, { name: "Turquoise", color: "#14b8a6" },
  { name: "Ice", color: "#bae6fd" }, { name: "Sunset", color: "#fb923c" },
];

/* ------------------------------------------------------------------ */
/* Theme construction                                                  */
/* ------------------------------------------------------------------ */

export interface ThemeGenParams {
  osName?: string; // base OS style
  accent?: string; // accent hex
  isDark: boolean;
  warmth: number; // -1..1
  pageBg?: string;
  pageText?: string;
}

export function buildTheme(params: ThemeGenParams): Omit<ThemeColors, "id" | "name"> {
  const def = OS_THEMES.find((o) => o.name === params.osName) || OS_THEMES[0];
  const accent = params.accent || def.accent;
  const idx = params.isDark ? 1 : 0;
  const warm = params.warmth || 0;

  const surface = params.isDark ? mix(def.window[1], accent, 0.04) : temperature(def.window[0], warm);
  const chrome = params.isDark ? mix(def.chrome[1], accent, 0.05) : temperature(def.chrome[0], warm);
  const titlebar = params.isDark ? mix(chrome, "#000000", 0.15) : chrome;
  const border = def.border[idx];
  const appBg = params.isDark ? mix(def.window[1], "#000000", 0.4) : shade(def.window[0], -0.12);

  const text = params.isDark ? "#e6e6e6" : "#1f2328";
  const textMuted = params.isDark ? "#a3a8b0" : "#5c6670";
  const textFaint = params.isDark ? "#6b7280" : "#9aa1a8";

  const primary = accent;
  const primaryHover = params.isDark ? shade(accent, 0.12) : shade(accent, -0.12);
  const primarySoft = params.isDark ? mix(accent, "#000000", 0.72) : mix(accent, "#ffffff", 0.85);
  const hover = params.isDark ? mix(chrome, "#ffffff", 0.06) : mix(chrome, "#000000", 0.035);
  const hoverStrong = params.isDark ? mix(chrome, accent, 0.25) : mix(primarySoft, "#ffffff", 0.2);

  return {
    isDark: params.isDark,
    appBg, surface, surface2: chrome, titlebar, border, borderSoft: mix(border, surface, 0.55),
    text, textMuted, textFaint,
    primary, primaryHover, primarySoft, hover, hoverStrong,
    pageBg: params.pageBg || "#ffffff",
    pageText: params.pageText || "#000000",
    danger: params.isDark ? "#f87171" : "#dc2626",
  };
}

export function toTheme(id: string, name: string, p: Omit<ThemeColors, "id" | "name">): ThemeColors {
  return { id, name, ...p };
}

export function applyThemeVars(t: ThemeColors) {
  const r = document.documentElement.style;
  const set = (k: string, v: string) => r.setProperty(k, v);
  set("--lk-app-bg", t.appBg);
  set("--lk-surface", t.surface);
  set("--lk-surface-2", t.surface2);
  set("--lk-titlebar", t.titlebar);
  set("--lk-border", t.border);
  set("--lk-border-soft", t.borderSoft);
  set("--lk-text", t.text);
  set("--lk-text-muted", t.textMuted);
  set("--lk-text-faint", t.textFaint);
  set("--lk-primary", t.primary);
  set("--lk-primary-hover", t.primaryHover);
  set("--lk-primary-soft", t.primarySoft);
  set("--lk-hover", t.hover);
  set("--lk-hover-strong", t.hoverStrong);
  set("--lk-page-bg", t.pageBg);
  set("--lk-page-text", t.pageText);
  set("--lk-danger", t.danger);
}

export function applyDarkFlag(isDark: boolean) {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
}

/* ------------------------------------------------------------------ */
/* Generate the 2000-theme gallery (deterministic)                     */
/* ------------------------------------------------------------------ */

export interface GalleryTheme {
  id: string;
  name: string;
  family: string;
  isDark: boolean;
  colors: Omit<ThemeColors, "id" | "name">;
}

export function generateGallery(count = 2000): GalleryTheme[] {
  const out: GalleryTheme[] = [];
  let i = 0;
  outer: for (const os of OS_THEMES) {
    for (const acc of ACCENTS) {
      const isDark = (i % 3) === 0 || os.family === "Developer" || os.family === "Retro" && i % 2 === 0;
      const c = buildTheme({ osName: os.name, accent: acc.color, isDark, warmth: (i % 5) / 4 - 0.5 });
      out.push({ id: `g${i}`, name: `${os.name} · ${acc.name}`, family: os.family, isDark, colors: c });
      i++;
      if (i >= count) break outer;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Saved presets (localStorage)                                        */
/* ------------------------------------------------------------------ */

const PRESETS_KEY = "lekhana.themePresets";

export interface SavedPreset {
  id: string;
  name: string;
  isDark: boolean;
  colors: Omit<ThemeColors, "id" | "name">;
}

export function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(PRESETS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function savePreset(p: SavedPreset) {
  const all = loadPresets();
  all.unshift(p);
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(all.slice(0, 40)));
  } catch {
    /* ignore */
  }
}

export function deletePreset(id: string) {
  try {
    localStorage.setItem(PRESETS_KEY, JSON.stringify(loadPresets().filter((p) => p.id !== id)));
  } catch {
    /* ignore */
  }
}
