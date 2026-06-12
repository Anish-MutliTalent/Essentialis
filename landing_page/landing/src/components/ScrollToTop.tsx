import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackEvent } from "../lib/api";

export const ScrollToTop = (): null => {
  const { pathname, hash } = useLocation();

  // Funnel: log every page view (carries device id + referral code internally).
  useEffect(() => {
    trackEvent("visit", { path: pathname });
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      // Wait one frame so the target route has rendered.
      requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "auto", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "auto" });
        }
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};
