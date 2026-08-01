/** Color manipulation helpers used by the theme engine. */

export interface RGB { r: number; g: number; b: number }

export function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  if (Number.isNaN(n) || h.length !== 6) return { r: 37, g: 99, b: 235 };
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const to = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function mix(a: string, b: string, t: number): string {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return rgbToHex({
    r: ca.r + (cb.r - ca.r) * t,
    g: ca.g + (cb.g - ca.g) * t,
    b: ca.b + (cb.b - ca.b) * t,
  });
}

/** Tint toward white (lighten) or toward black (darken). */
export function shade(hex: string, amount: number): string {
  const c = hexToRgb(hex);
  const target = amount >= 0 ? 255 : 0;
  const t = Math.abs(amount);
  return rgbToHex({
    r: c.r + (target - c.r) * t,
    g: c.g + (target - c.g) * t,
    b: c.b + (target - c.b) * t,
  });
}

/** Convert hex to an rgba() string with the given alpha (0–1). */
export function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Shift neutral grays toward a warm (positive) or cool (negative) tint. */
export function temperature(hex: string, warm: number): string {
  const c = hexToRgb(hex);
  const lum = (c.r * 299 + c.g * 587 + c.b * 114) / 1000;
  const strength = (1 - lum / 255) * 0.5 + 0.25;
  const delta = warm * strength * 40;
  return rgbToHex({
    r: Math.max(0, c.r + delta * 0.9),
    g: Math.max(0, c.g),
    b: Math.max(0, c.b - delta * 1.1),
  });
}

/** Luminance (0–1) for choosing dark/light foreground text. */
export function luminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export function isLight(hex: string): boolean {
  return luminance(hex) > 0.6;
}
