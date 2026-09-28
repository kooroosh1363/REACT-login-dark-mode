const KEY = "authsurface:remembered-email";

export function readRememberedEmail(storage = globalThis.localStorage) {
  try {
    return String(storage?.getItem(KEY) || "").trim();
  } catch {
    return "";
  }
}

export function storeRememberedEmail(email, enabled, storage = globalThis.localStorage) {
  try {
    if (enabled) storage?.setItem(KEY, String(email || "").trim().toLowerCase());
    else storage?.removeItem(KEY);
    return true;
  } catch {
    return false;
  }
}
