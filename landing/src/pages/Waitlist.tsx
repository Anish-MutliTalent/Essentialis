import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users } from 'lucide-react';
import { BlurWords, GlassCard, MagneticButton } from '../components/Interactive';

type WaitlistEntry = {
  email: string;
  os: string;
  reason: string;
  referrer: string;
  joinedAt: string;
};

const STORAGE_KEY = 'essentialis-waitlist';

const loadWaitlist = (): WaitlistEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Waitlist = () => {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);

  useEffect(() => {
    setEntries(loadWaitlist());
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-4">
          <BlurWords text="Essentialis Public Waitlist" className="text-4xl sm:text-5xl font-bold" />
          <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">
            Everyone who requests the demo is listed here. Join from the open beta page and get the demo link instantly.
          </p>
        </div>

        <div className="flex justify-center">
          <MagneticButton href="/open-beta" ariaLabel="Join the open beta">
            Join the open beta
          </MagneticButton>
        </div>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-sm text-gray-400">Live list</div>
              <div className="font-semibold text-white text-lg">{entries.length || 'No'} beta testers so far</div>
            </div>
          </div>

          {!entries.length && (
            <div className="text-center text-gray-400 py-8">
              No entries yet. Be the first to join the open beta.
            </div>
          )}

          <div className="space-y-4">
            {entries.map((entry, idx) => (
              <motion.div
                key={entry.email + entry.joinedAt}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="p-4 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="flex flex-wrap justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="font-semibold">{entry.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">OS</div>
                    <div className="text-yellow-200">{entry.os}</div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Clock className="w-4 h-4" />
                    {formatDate(entry.joinedAt)}
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-300">
                  <span className="text-gray-400">Why: </span>
                  {entry.reason}
                </div>
                {entry.referrer && (
                  <div className="mt-2 text-xs text-gray-400">
                    Referred by: {entry.referrer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Waitlist;


