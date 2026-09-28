import { describe, expect, it } from "vitest";
import { normalizeTheme, readTheme, resolveTheme, writeTheme } from "./theme-policy";

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value)
  };
}

describe("theme policy", () => {
  it("resolves system preference to the actual color mode", () => {
    expect(resolveTheme("system", false)).toBe("light");
    expect(resolveTheme("system", true)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });

  it("normalizes unknown preferences to system", () => {
    expect(normalizeTheme("sepia")).toBe("system");
  });

  it("persists supported preferences", () => {
    const storage = memoryStorage();
    expect(writeTheme("dark", storage)).toBe(true);
    expect(readTheme(storage)).toBe("dark");
  });
});
