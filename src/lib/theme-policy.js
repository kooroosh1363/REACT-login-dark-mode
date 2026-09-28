export const THEMES = Object.freeze(["system", "light", "dark"]);
const KEY = "authsurface:theme";

export function normalizeTheme(value) {
  return THEMES.includes(value) ? value : "system";
}

export function resolveTheme(preference, prefersDark = false) {
  const normalized = normalizeTheme(preference);
  if (normalized === "system") return prefersDark ? "dark" : "light";
  return normalized;
}

export function readTheme(storage = globalThis.localStorage) {
  try {
    return normalizeTheme(storage?.getItem(KEY));
  } catch {
    return "system";
  }
}

export function writeTheme(theme, storage = globalThis.localStorage) {
  const normalized = normalizeTheme(theme);
  try {
    storage?.setItem(KEY, normalized);
    return true;
  } catch {
    return false;
  }
}
