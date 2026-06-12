/**
 * Stable per-device identifier, persisted in localStorage. Lets a returning
 * visitor be recognised on the same device without re-entering their email.
 * It is a random opaque id — no fingerprinting, nothing personal.
 */
const DEVICE_KEY = "essentialis_device";

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    /* fall through */
  }
  return `d_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export function getDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = randomId();
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    // localStorage unavailable (private mode) — fall back to a per-session id.
    return randomId();
  }
}
