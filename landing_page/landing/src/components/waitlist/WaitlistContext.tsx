import { createContext, useContext } from "react";
import type { WaitlistEntry } from "../../lib/api";

export interface WaitlistContextValue {
  /** Open the waitlist modal. Optional `source` is for analytics. */
  open: (source?: string) => void;
  close: () => void;
  /** The returning member's standing, if recognised (by device or prior email). */
  joined: WaitlistEntry | null;
  /** Update the recognised standing (e.g. right after a successful join). */
  setJoined: (entry: WaitlistEntry | null) => void;
}

export const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used within <WaitlistProvider>");
  }
  return ctx;
}
