import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassContainer } from "../GlassContainer";
import {
  joinWaitlist,
  getWaitlistStatus,
  referralLink,
  trackEvent,
  type ContactPlatform,
  type WaitlistEntry,
} from "../../lib/api";
import { useStats } from "../../hooks/useStats";

type Step = 0 | 1 | 2;
type Status = "idle" | "submitting" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const platforms: {
  id: ContactPlatform;
  label: string;
  accent: string;
  icon: JSX.Element;
}[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    accent: "#0a66c2",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    accent: "#25d366",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.47 14.38c-.3-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.66-1.6-.9-2.18-.24-.57-.48-.5-.66-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.57-.35zM12.02 2C6.58 2 2.16 6.42 2.16 11.86c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.86 9.86 0 0 0 4.68 1.19h.01c5.44 0 9.86-4.42 9.86-9.86 0-2.64-1.03-5.12-2.9-6.99A9.8 9.8 0 0 0 12.02 2z" />
      </svg>
    ),
  },
  {
    id: "telegram",
    label: "Telegram",
    accent: "#29a9eb",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.94 4.3 18.9 19.1c-.23 1.01-.83 1.26-1.68.79l-4.65-3.43-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.74L18.5 5.9c.37-.33-.08-.51-.58-.18L6.96 12.9 2.3 11.44c-1.01-.32-1.03-1.01.21-1.5l18.2-7.02c.84-.31 1.58.2 1.23 1.38z" />
      </svg>
    ),
  },
];

const referrerChips = ["Twitter / X", "LinkedIn", "A friend", "Search", "An event", "Reddit"];

interface WaitlistModalProps {
  onClose: () => void;
  joined: WaitlistEntry | null;
  onJoined: (entry: WaitlistEntry) => void;
}

export const WaitlistModal = ({ onClose, joined, onJoined }: WaitlistModalProps): JSX.Element => {
  const { total } = useStats();

  // If we already recognise this member, open straight to their standing.
  const [member, setMember] = useState<WaitlistEntry | null>(joined);
  const [celebrate, setCelebrate] = useState(false);

  const [step, setStep] = useState<Step>(0);
  const [maxStep, setMaxStep] = useState<Step>(0);
  const [direction, setDirection] = useState(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<ContactPlatform>("linkedin");
  const [contactInfo, setContactInfo] = useState("");
  const [referrer, setReferrer] = useState("");

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const submittedRef = useRef(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!member && status === "idle") firstFieldRef.current?.focus();
  }, [step, status, member]);

  // Log step progression.
  useEffect(() => {
    if (!member) trackEvent("waitlist_step", { step });
  }, [step, member]);

  const handleClose = () => {
    // Record where someone dropped off (only if they hadn't completed).
    if (!member && !submittedRef.current) {
      trackEvent("waitlist_abandon", { step: maxStep });
    }
    onClose();
  };

  const emailValid = EMAIL_RE.test(email.trim());
  const contactValid = contactInfo.trim().length > 1;

  const goTo = (next: Step) => {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    setMaxStep((m) => (next > m ? next : m));
  };

  // Step 0 → before moving on, see if this email is already on the list (covers
  // "same email, new device": we recognise them and link this device).
  const continueFromEmail = async () => {
    setStatus("submitting");
    const existing = await getWaitlistStatus(email.trim());
    setStatus("idle");
    if (existing) {
      setMember(existing);
      setCelebrate(false);
      onJoined(existing);
      return;
    }
    goTo(1);
  };

  const submit = async () => {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const result = await joinWaitlist({
        email: email.trim(),
        contactInfo: contactInfo.trim(),
        platform,
        referrer,
      });
      submittedRef.current = true;
      setMember(result);
      setCelebrate(!result.already);
      onJoined(result);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handlePrimary = () => {
    if (status === "submitting") return;
    if (step === 0 && emailValid) continueFromEmail();
    else if (step === 1 && contactValid) goTo(2);
    else if (step === 2) submit();
  };

  const onKeyDownField = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePrimary();
    }
  };

  const activePlatform = platforms.find((p) => p.id === platform)!;

  const stepVariants = {
    enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <button
        type="button"
        aria-label="Close waitlist"
        onClick={handleClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-title"
        initial={{ scale: 0.95, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: 12, opacity: 0 }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-[480px]"
      >
        <GlassContainer
          cornerRadius={28}
          baseStrength={16}
          softness={16}
          edgeContrast={2.3}
          shadowContrast={2.3}
          reflectionPresence={1}
          edgeBrightness={1.15}
          brightness={1.05}
          className="w-full"
        >
          <div
            className="relative w-full overflow-hidden rounded-[28px] bg-[#0b0b0d]/55 p-7 sm:p-9
            shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1),inset_1px_1px_0_0_rgba(255,255,255,0.25),inset_-1px_-1px_0_0_rgba(255,255,255,0.08)]"
          >
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-16 w-[280px] h-[280px] rounded-full blur-[90px] pointer-events-none"
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(232,151,0,0.22) 0%, transparent 100%)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-24 -left-16 w-[280px] h-[280px] rounded-full blur-[90px] pointer-events-none"
              style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(159,52,145,0.2) 0%, transparent 100%)" }}
            />

            <button
              type="button"
              onClick={handleClose}
              aria-label="Close"
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white/[0.06] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.12] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="relative z-[1]">
              {member ? (
                <StatusView member={member} celebrate={celebrate} onClose={handleClose} />
              ) : (
                <>
                  {/* Progress — pr-10 keeps the bar clear of the close button */}
                  <div className="flex items-center gap-1.5 mb-7 pr-10" aria-hidden="true">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#ffb01f] to-[#e89700]"
                          initial={false}
                          animate={{ width: step >= i ? "100%" : "0%" }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    ))}
                  </div>

                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {step === 0 && (
                        <div>
                          <h2
                            id="waitlist-title"
                            className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-[28px] sm:text-3xl tracking-[-0.01em] leading-tight"
                          >
                            Secure your spot in the{" "}
                            <span className="font-light italic bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                              private beta.
                            </span>
                          </h2>
                          <p className="mt-3 [font-family:'Inter',Helvetica] font-light text-neutral-400 text-sm sm:text-base leading-relaxed">
                            {total != null ? (
                              <>
                                Join{" "}
                                <span className="text-white font-medium">{total.toLocaleString()}</span>{" "}
                                people already securing private, self-owned storage.
                              </>
                            ) : (
                              "Access opens in small batches. Drop your email and we'll save your place."
                            )}
                          </p>

                          <label className="block mt-7 mb-2 [font-family:'Inter',Helvetica] text-xs tracking-[0.2em] uppercase text-neutral-500">
                            Email address
                          </label>
                          <input
                            ref={firstFieldRef}
                            type="email"
                            inputMode="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={onKeyDownField}
                            className="w-full h-[54px] px-5 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-base
                            [font-family:'Inter',Helvetica] placeholder:text-neutral-600 outline-none transition-colors
                            focus:border-white/30 focus:bg-white/[0.06]"
                          />
                        </div>
                      )}

                      {step === 1 && (
                        <div>
                          <h2 className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-[28px] sm:text-3xl tracking-[-0.01em] leading-tight">
                            How should we send{" "}
                            <span className="font-light italic bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                              your invite?
                            </span>
                          </h2>
                          <p className="mt-3 [font-family:'Inter',Helvetica] font-light text-neutral-400 text-sm sm:text-base leading-relaxed">
                            We onboard one-to-one so the first run is smooth. Pick what&#39;s easiest for you.
                          </p>

                          <div className="mt-6 flex gap-2">
                            {platforms.map((p) => {
                              const selected = platform === p.id;
                              return (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => {
                                    setPlatform(p.id);
                                    setContactInfo("");
                                  }}
                                  className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${
                                    selected
                                      ? "bg-white/[0.08] border-white/25"
                                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.05]"
                                  }`}
                                  style={selected ? { color: p.accent } : { color: "#a3a3a3" }}
                                >
                                  {p.icon}
                                  <span className="[font-family:'Inter',Helvetica] text-xs font-medium text-white">
                                    {p.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>

                          <label className="block mt-6 mb-2 [font-family:'Inter',Helvetica] text-xs tracking-[0.2em] uppercase text-neutral-500">
                            {activePlatform.label} {platform === "whatsapp" ? "number" : "handle"}
                          </label>
                          <div className="flex items-stretch rounded-2xl bg-white/[0.04] border border-white/10 overflow-hidden focus-within:border-white/30 transition-colors">
                            {platform === "linkedin" && (
                              <span className="flex items-center px-3 text-neutral-500 text-sm [font-family:'Roboto_Mono',monospace] border-r border-white/10 whitespace-nowrap">
                                in/
                              </span>
                            )}
                            {platform === "telegram" && (
                              <span className="flex items-center px-4 text-neutral-500 text-sm [font-family:'Roboto_Mono',monospace] border-r border-white/10">
                                @
                              </span>
                            )}
                            <input
                              ref={firstFieldRef}
                              type={platform === "whatsapp" ? "tel" : "text"}
                              inputMode={platform === "whatsapp" ? "tel" : "text"}
                              placeholder={
                                platform === "linkedin"
                                  ? "your-username"
                                  : platform === "whatsapp"
                                  ? "+1 555 000 0000"
                                  : "yourhandle"
                              }
                              value={contactInfo}
                              onChange={(e) => setContactInfo(e.target.value)}
                              onKeyDown={onKeyDownField}
                              className="flex-1 h-[52px] px-4 bg-transparent text-white text-base [font-family:'Inter',Helvetica] placeholder:text-neutral-600 outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {step === 2 && (
                        <div>
                          <h2 className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-[28px] sm:text-3xl tracking-[-0.01em] leading-tight">
                            One last thing —{" "}
                            <span className="font-light italic bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                              where&#39;d you hear about us?
                            </span>
                          </h2>
                          <p className="mt-3 [font-family:'Inter',Helvetica] font-light text-neutral-400 text-sm sm:text-base leading-relaxed">
                            Optional — it just helps us reach more of the right people.
                          </p>

                          <div className="mt-6 flex flex-wrap gap-2">
                            {referrerChips.map((chip) => {
                              const selected = referrer === chip;
                              return (
                                <button
                                  key={chip}
                                  type="button"
                                  onClick={() => setReferrer(selected ? "" : chip)}
                                  className={`px-4 py-2 rounded-full border [font-family:'Inter',Helvetica] text-sm transition-all ${
                                    selected
                                      ? "bg-white text-black border-white"
                                      : "bg-white/[0.03] text-neutral-300 border-white/10 hover:bg-white/[0.07]"
                                  }`}
                                >
                                  {chip}
                                </button>
                              );
                            })}
                          </div>

                          <input
                            ref={firstFieldRef}
                            type="text"
                            placeholder="Or type it here…"
                            value={referrerChips.includes(referrer) ? "" : referrer}
                            onChange={(e) => setReferrer(e.target.value)}
                            onKeyDown={onKeyDownField}
                            className="w-full mt-4 h-[48px] px-4 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm
                            [font-family:'Inter',Helvetica] placeholder:text-neutral-600 outline-none focus:border-white/30 transition-colors"
                          />

                          {status === "error" && (
                            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-sm text-center">
                              {errorMsg}
                            </div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Footer */}
                  <div className="mt-7 flex items-center gap-3">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={() => goTo((step - 1) as Step)}
                        disabled={status === "submitting"}
                        className="flex items-center justify-center w-[52px] h-[52px] rounded-2xl bg-white/[0.04] border border-white/10 text-neutral-400 hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-50"
                        aria-label="Back"
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                          <path d="M11 4l-5 5 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handlePrimary}
                      disabled={
                        status === "submitting" ||
                        (step === 0 && !emailValid) ||
                        (step === 1 && !contactValid)
                      }
                      className="relative flex-1 flex items-center justify-center h-[52px] rounded-2xl bg-white text-black
                      [font-family:'Inter',Helvetica] font-semibold text-base
                      shadow-[inset_0px_4px_23.8px_-6px_#ffc473,inset_-1px_1px_2px_#ffffff]
                      transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]
                      disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                      {status === "submitting" ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
                          {step === 2 ? "Joining…" : "Checking…"}
                        </span>
                      ) : step === 2 ? (
                        "Join the waitlist"
                      ) : (
                        "Continue"
                      )}
                    </button>

                    {step === 2 && status !== "submitting" && (
                      <button
                        type="button"
                        onClick={submit}
                        className="px-3 h-[52px] [font-family:'Inter',Helvetica] text-sm text-neutral-500 hover:text-white transition-colors whitespace-nowrap"
                      >
                        Skip
                      </button>
                    )}
                  </div>

                  <p className="mt-4 text-center [font-family:'Inter',Helvetica] text-xs text-neutral-600">
                    No spam. No tracking. We barely email.
                  </p>
                </>
              )}
            </div>
          </div>
        </GlassContainer>
      </motion.div>
    </motion.div>
  );
};

const StatusView = ({
  member,
  celebrate,
  onClose,
}: {
  member: WaitlistEntry;
  celebrate: boolean;
  onClose: () => void;
}): JSX.Element => {
  const [copied, setCopied] = useState(false);
  const link = member.referral_code ? referralLink(member.referral_code) : null;

  const copy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      trackEvent("referral_copy", { meta: { code: member.referral_code } });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const shareText = encodeURIComponent(
    "I just joined the Essentialis private beta — private, self-owned cloud storage without the crypto headache. Grab your spot:",
  );
  const shareUrl = encodeURIComponent(link ?? "https://essentialis.cloud");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center py-1"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto w-14 h-14 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center mb-5"
      >
        <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 14.5l4.5 4.5L21 9" stroke="#4ade80" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>

      <h2
        id="waitlist-title"
        className="m-0 [font-family:'Inter',Helvetica] font-normal text-white text-[26px] sm:text-3xl tracking-[-0.01em]"
      >
        {celebrate ? (
          <>
            You&#39;re{" "}
            <span className="font-light italic bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              on the list.
            </span>
          </>
        ) : (
          <>
            Welcome{" "}
            <span className="font-light italic bg-[linear-gradient(0deg,rgba(184,184,184,1)_0%,rgba(255,255,255,1)_100%)] bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
              back.
            </span>
          </>
        )}
      </h2>

      {/* Position */}
      <div className="mt-5 flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="[font-family:'Inter',Helvetica] font-bold text-white text-4xl tracking-[-0.01em]">
            #{member.position.toLocaleString()}
          </div>
          <div className="mt-1 [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase text-neutral-500">
            your spot
          </div>
        </div>
        <div className="w-px h-10 bg-white/10" aria-hidden="true" />
        <div className="text-center">
          <div className="[font-family:'Inter',Helvetica] font-bold text-white text-4xl tracking-[-0.01em]">
            {member.total.toLocaleString()}
          </div>
          <div className="mt-1 [font-family:'Roboto_Mono',monospace] text-[10px] tracking-[0.2em] uppercase text-neutral-500">
            in line
          </div>
        </div>
      </div>

      {/* Referral */}
      <div className="mt-7 rounded-2xl bg-white/[0.03] border border-white/10 p-4 text-left">
        <p className="[font-family:'Inter',Helvetica] text-sm text-white font-medium">
          Skip the line — invite friends.
        </p>
        <p className="mt-1 [font-family:'Inter',Helvetica] text-xs text-neutral-400 leading-relaxed">
          Every friend who joins with your link moves you up.{" "}
          {member.referral_count > 0 ? (
            <span className="text-[#ffb01f]">
              {member.referral_count} joined so far — keep going.
            </span>
          ) : (
            "You haven't referred anyone yet."
          )}
        </p>

        {link && (
          <div className="mt-3 flex items-stretch gap-2">
            <div className="flex-1 min-w-0 flex items-center px-3 rounded-xl bg-black/40 border border-white/10">
              <span className="truncate [font-family:'Roboto_Mono',monospace] text-xs text-neutral-300">
                {link.replace(/^https?:\/\//, "")}
              </span>
            </div>
            <button
              type="button"
              onClick={copy}
              className="shrink-0 px-4 h-[40px] rounded-xl bg-white text-black [font-family:'Inter',Helvetica] text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}

        <div className="mt-2.5 flex items-center gap-2">
          <a
            href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("referral_share", { meta: { via: "whatsapp" } })}
            className="flex-1 flex items-center justify-center gap-2 h-[40px] rounded-xl bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-white hover:bg-white/[0.1] transition-colors [font-family:'Inter',Helvetica] text-sm font-medium"
          >
            Share on WhatsApp
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("referral_share", { meta: { via: "linkedin" } })}
            className="flex items-center justify-center w-[44px] h-[40px] rounded-xl bg-white/[0.05] border border-white/10 text-neutral-300 hover:text-[#0a66c2] hover:bg-white/[0.1] transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
            </svg>
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-5 [font-family:'Inter',Helvetica] text-sm text-neutral-500 hover:text-white transition-colors"
      >
        Done
      </button>
    </motion.div>
  );
};
