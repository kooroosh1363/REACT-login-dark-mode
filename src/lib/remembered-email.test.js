import { describe, expect, it } from "vitest";
import { readRememberedEmail, storeRememberedEmail } from "./remembered-email";

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => map.set(key, value),
    removeItem: (key) => map.delete(key)
  };
}

describe("remember-email policy", () => {
  it("stores normalized email only when enabled", () => {
    const storage = memoryStorage();

    expect(storeRememberedEmail(" Person@Example.com ", true, storage)).toBe(true);
    expect(readRememberedEmail(storage)).toBe("person@example.com");

    storeRememberedEmail("ignored@example.com", false, storage);
    expect(readRememberedEmail(storage)).toBe("");
  });
});
