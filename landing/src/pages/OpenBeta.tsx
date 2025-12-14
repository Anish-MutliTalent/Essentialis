import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MonitorSmartphone, Users, ArrowRight } from 'lucide-react';
import { BlurWords, GlassCard, MagneticButton } from '../components/Interactive';

type WaitlistEntry = {
  email: string;
  os: string;
  reason: string;
  referrer: string;
  joinedAt: string;
};

const STORAGE_KEY = 'essentialis-waitlist';
const DEMO_LINK = 'https://demo.essentialis.cloud';

const loadWaitlist = (): WaitlistEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveWaitlist = (entries: WaitlistEntry[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const OpenBeta = () => {
  const [email, setEmail] = useState('');
  const [os, setOs] = useState('Windows');
  const [reason, setReason] = useState('');
  const [referrer, setReferrer] = useState('');
  const [status, setStatus] = useState<{ type: 'idle' | 'error' | 'success'; message?: string }>({ type: 'idle' });

  const osOptions = useMemo(
    () => ['Windows', 'macOS', 'Linux', 'iOS', 'Android', 'Other'],
    []
  );

  const addToWaitlist = (entry: WaitlistEntry) => {
    const current = loadWaitlist();
    const filtered = current.filter((item) => item.email.toLowerCase() !== entry.email.toLowerCase());
    saveWaitlist([{ ...entry }, ...filtered]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'idle' });

    const emailValid = /\S+@\S+\.\S+/.test(email);
    if (!emailValid) {
      setStatus({ type: 'error', message: 'Please enter a valid email.' });
      return;
    }
    if (!reason.trim()) {
      setStatus({ type: 'error', message: 'Tell us why you chose Essentialis.' });
      return;
    }

    const entry: WaitlistEntry = {
      email: email.trim(),
      os,
      reason: reason.trim(),
      referrer: referrer.trim(),
      joinedAt: new Date().toISOString(),
    };

    addToWaitlist(entry);

    const mailto = `mailto:${encodeURIComponent(entry.email)}?subject=${encodeURIComponent(
      'Your Essentialis demo link'
    )}&body=${encodeURIComponent(
      `Hi there,\n\nThanks for joining the Essentialis open beta!\n\nHere is your demo link: ${DEMO_LINK}\n\nYou were added to the public waitlist so the team can keep you updated.\n\n- Essentialis Team`
    )}`;

    window.location.href = mailto;
    setStatus({ type: 'success', message: 'You are on the waitlist. We opened your email client with the demo link.' });
  };

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-6">
          <BlurWords text="Join the Essentialis Open Beta" className="text-4xl sm:text-5xl font-bold" />
          <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">
            Tell us a bit about you, and we will email you the demo link while adding you to the public waitlist.
          </p>
        </div>

        <GlassCard>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                <Mail className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Beta access</div>
                <div className="font-semibold text-white text-lg">We’ll send the demo link to your inbox</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <div className="text-sm text-gray-300">Work email</div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 px-4 py-3 text-white outline-none"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="space-y-2">
                <div className="text-sm text-gray-300 flex items-center gap-2">
                  <MonitorSmartphone className="w-4 h-4 text-yellow-300" />
                  Your primary OS
                </div>
                <div className="flex flex-wrap gap-2">
                  {osOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setOs(option)}
                      className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                        os === option
                          ? 'border-yellow-400/60 bg-yellow-400/10 text-yellow-200'
                          : 'border-white/10 bg-white/5 text-gray-300 hover:border-yellow-400/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <label className="space-y-2">
                <div className="text-sm text-gray-300">Why did you choose Essentialis?</div>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full min-h-[140px] rounded-xl bg-white/5 border border-white/10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 px-4 py-3 text-white outline-none resize-none"
                  placeholder="Zero-knowledge model, decentralized storage, control over sharing..."
                  required
                />
              </label>

              <label className="space-y-2">
                <div className="text-sm text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-yellow-300" />
                  Who referred you? (optional)
                </div>
                <input
                  type="text"
                  value={referrer}
                  onChange={(e) => setReferrer(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 px-4 py-3 text-white outline-none"
                  placeholder="Friend, community, event, etc."
                />
              </label>
            </div>

            {status.type === 'error' && (
              <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl">
                {status.message}
              </div>
            )}

            {status.type === 'success' && (
              <div className="text-sm text-green-300 bg-green-500/10 border border-green-500/30 px-4 py-3 rounded-xl">
                {status.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-yellow-400 text-black font-semibold flex items-center justify-center gap-2 hover:bg-yellow-300 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Open Beta
              </button>
              <MagneticButton href="/waitlist" ariaLabel="View public waitlist" className="sm:w-auto w-full">
                View public waitlist
              </MagneticButton>
            </div>

            <div className="text-xs text-gray-400">
              Submitting will: 1) add you to the public waitlist, and 2) open your email client with the demo link ready to send to you.
            </div>
          </motion.form>
        </GlassCard>
      </div>
    </div>
  );
};

export default OpenBeta;


