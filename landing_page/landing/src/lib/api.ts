/**
 * Thin client for the Essentialis public backend.
 *
 * In production the landing is served behind the same reverse proxy as the
 * API, so relative `/api/*` paths resolve same-origin. For local dev, vite's
 * server proxy (see vite.config.ts) forwards `/api` to the real backend and
 * strips the `/api` prefix. `VITE_API_BASE_URL` can override the base for
 * split-origin deployments.
 */
import { getDeviceId } from "./device";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

const REF_KEY = "user_ref";

/** Persist a `?ref=` / `?r=` referral code so it can be attributed on submit. */
export function captureReferral(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref") || params.get("r");
    if (ref && ref.trim()) {
      sessionStorage.setItem(REF_KEY, ref.trim());
    }
  } catch {
    /* sessionStorage may be unavailable (private mode) — non-fatal */
  }
}

export function getReferral(): string | null {
  try {
    return sessionStorage.getItem(REF_KEY);
  } catch {
    return null;
  }
}

export interface PublicStats {
  total_community: number | null;
}

export async function getStats(signal?: AbortSignal): Promise<PublicStats> {
  const res = await fetch(`${API_BASE}/api/public/stats`, { signal });
  if (!res.ok) throw new Error("Failed to load stats");
  return res.json();
}

export type ContactPlatform = "linkedin" | "whatsapp" | "telegram";

/** A recognised waitlist member's standing. */
export interface WaitlistEntry {
  email: string | null;
  platform: string;
  referral_code: string | null;
  referral_count: number;
  status: string;
  position: number;
  total: number;
  joined_at: string | null;
}

export interface WaitlistJoinResult extends WaitlistEntry {
  message: string;
  already: boolean;
}

export interface WaitlistPayload {
  email: string;
  contactInfo: string;
  platform: ContactPlatform;
  /** Free-text "where did you hear about us" — optional. */
  referrer?: string;
}

export async function joinWaitlist(payload: WaitlistPayload): Promise<WaitlistJoinResult> {
  const res = await fetch(`${API_BASE}/api/access/join-waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: payload.email || undefined,
      contact_info: payload.contactInfo,
      platform: payload.platform,
      referrer: payload.referrer || undefined,
      user_ref: getReferral() || undefined,
      device_id: getDeviceId(),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data && data.error) || "Something went wrong. Please try again.");
  }
  return data as WaitlistJoinResult;
}

/**
 * Recognise a returning visitor. With no email it checks by device only; pass
 * an email to also link the current device to an existing entry (cross-device).
 * Returns null when there's no matching waitlist entry.
 */
export async function getWaitlistStatus(email?: string): Promise<WaitlistEntry | null> {
  try {
    const res = await fetch(`${API_BASE}/api/access/waitlist-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ device_id: getDeviceId(), email: email || undefined }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && data.found ? (data as WaitlistEntry) : null;
  } catch {
    return null;
  }
}

/** Fire-and-forget funnel/visit logging. Never throws. */
export function trackEvent(
  event: string,
  extra?: { path?: string; step?: number; meta?: Record<string, unknown> },
): void {
  try {
    const body = JSON.stringify({
      event,
      path: extra?.path ?? (typeof window !== "undefined" ? window.location.pathname : undefined),
      step: extra?.step,
      device_id: getDeviceId(),
      ref: getReferral() || undefined,
      meta: extra?.meta,
    });
    const url = `${API_BASE}/api/analytics/track`;
    // Prefer sendBeacon so events survive page unload (e.g. abandon on close).
    if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never let analytics break the app */
  }
}

/** Build a shareable referral link for a member's code. */
export function referralLink(code: string): string {
  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://essentialis.cloud";
  return `${origin}/?ref=${encodeURIComponent(code)}`;
}
