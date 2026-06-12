import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { WaitlistContext } from "./WaitlistContext";
import { WaitlistModal } from "./WaitlistModal";
import { getWaitlistStatus, trackEvent, type WaitlistEntry } from "../../lib/api";

export const WaitlistProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [joined, setJoined] = useState<WaitlistEntry | null>(null);

  // On mount, recognise a returning visitor by device id (no email needed).
  useEffect(() => {
    let active = true;
    getWaitlistStatus().then((entry) => {
      if (active && entry) setJoined(entry);
    });
    return () => {
      active = false;
    };
  }, []);

  const open = useCallback((source?: string) => {
    setIsOpen(true);
    trackEvent("waitlist_open", { meta: source ? { source } : undefined });
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, joined, setJoined }),
    [open, close, joined],
  );

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isOpen && <WaitlistModal onClose={close} joined={joined} onJoined={setJoined} />}
      </AnimatePresence>
    </WaitlistContext.Provider>
  );
};
