// Homepage.tsx — World Class Redesign
import { memo, useState, useEffect } from 'react';
import {
  motion,
  useAnimation,
  cubicBezier,
} from 'framer-motion';
import {
  ArrowRight,
  FileText,
  Key,
  LinkIcon,
  Copy,
  CheckCircle,
  User,
  UserCheck,
  UserX,
  HardDrive,
  Globe2,
  EyeOff,
  Shield,
  Clock, // Kept for stats
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { BlurWords, Counter, MagneticButton, GlassCard } from "../components/Interactive"
import Footer from '../components/Footer';
import BentoGrid from '../components/BentoGrid';
import CinemaVideo from '../components/CinemaVideo';
import StickyFeatures from '../components/StickyFeatures';
import VelocityText from '../components/VelocityText';
import CursorSpotlight from '../components/CursorSpotlight';
import CommunityStats from '../components/CommunityStats';
import Testimonials from '../components/Testimonials';
import JazziconAvatar from '../components/UI/JazziconAvatas';


// ========== Utilities ==========
const ease = cubicBezier(0.16, 1, 0.3, 1);

const AnimatedText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    key={String(children)}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    className={className}
  >
    {children}
  </motion.div>
);


// ========== INTERACTIVE 1: ENHANCED VAULT ==========
const InteractiveVault = () => {
  const controls = useAnimation();
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const runEncrypt = async () => {
    if (locked) return;
    setLocked(true);
    setProgress(0);
    await controls.start({ scale: 0.96, transition: { duration: 0.1 } });
    let p = 0;
    while (p < 100) {
      await new Promise((r) => setTimeout(r, 40));
      p += Math.min(100 - p, 7 + Math.random() * 6);
      setProgress(p);
    }
    await controls.start({ scale: 1, rotateY: 360, transition: { duration: 0.6, ease } });
  };

  const reset = () => {
    setLocked(false);
    setProgress(0);
    controls.set({ scale: 1, rotateY: 0 });
  };

  return (
    <div className="flex items-center gap-6">
      <GlassCard className="relative z-10 w-[440px]">
        <div className="flex items-start gap-4">
          <motion.div
            animate={controls}
            drag
            dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
            whileDrag={{ scale: 1.05, rotate: 2 }}
            className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-lg"
          >
            <FileText className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-400">Target File</div>
              <div className="text-[10px] text-gray-500 border border-white/10 px-1 rounded">PDF</div>
            </div>
            <div className="font-semibold text-white text-sm truncate">passport_scan.pdf</div>

            <div className="mt-3">
              <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                  style={{ width: `${progress}%` }}
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={runEncrypt}
                  disabled={locked}
                  className={`flex-1 py-1.5 rounded textxs font-medium text-center transition-all ${locked
                    ? 'bg-green-500/20 text-green-400 cursor-default'
                    : 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-lg shadow-yellow-400/20'
                    }`}
                >
                  {locked ? 'Secured' : 'Encrypt'}
                </button>
                <button
                  onClick={reset}
                  className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded hover:bg-white/5 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Dynamic Side HUD */}
      <div className="hidden sm:block w-32 font-mono text-[10px] space-y-4">
        <div className="relative pl-3 border-l border-white/10">
          <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-white/20 rounded-full" />
          <div className="text-gray-500 uppercase tracking-wider mb-1">Status</div>
          <AnimatedText className={locked ? "text-green-400 font-bold" : "text-yellow-500 font-bold"}>
            {locked ? "ENCRYPTED" : "UNPROTECTED"}
          </AnimatedText>
        </div>

        <div className="relative pl-3 border-l border-white/10">
          <div className={`absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full transition-colors ${progress > 0 && progress < 100 ? "bg-yellow-400 animate-pulse" : "bg-white/20"}`} />
          <div className="text-gray-500 uppercase tracking-wider mb-1">Process</div>
          <div className="text-white">
            {progress === 0 && "IDLE"}
            {progress > 0 && progress < 100 && `PROCESSING ${Math.round(progress)}%`}
            {progress === 100 && "COMPLETE"}
          </div>
        </div>

        {locked && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative pl-3 border-l border-green-500/50"
          >
            <div className="text-gray-500 uppercase tracking-wider mb-1">Hash</div>
            <div className="text-green-400/80 break-all leading-tight">0x7f...3a2</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};


// ========== INTERACTIVE 2: KEY GENERATION ==========
const KeyVisualizer = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <GlassCard>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <Key className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Zero-Knowledge Keys</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your encryption keys never leave your device.
        </p>
        <div className="space-y-3">
          <div className="text-left">
            <div className="text-xs text-gray-400 mb-1">Public Key (shared)</div>
            <div className="text-xs font-mono bg-gray-900/30 p-2 rounded truncate">
              pk_8f3a...b29c
            </div>
          </div>
          <div className="text-left">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400 mb-1">Private Key (yours only)</div>
              <button
                onClick={() => setRevealed(!revealed)}
                className="text-xs text-yellow-400 hover:underline"
              >
                {revealed ? 'Hide' : 'Reveal'}
              </button>
            </div>
            <div className="text-xs font-mono bg-gray-900/30 p-2 rounded truncate">
              {revealed ? 'sk_9e7d...c41f (never leaves your device)' : '••••••••••••••••'}
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <EyeOff className="w-3.5 h-3.5" />
          We never see your private key.
        </div>
      </div>
    </GlassCard>
  );
};

// ========== INTERACTIVE 3: SECURE SHARE FLOW ==========
const SecureShareDemo = () => {
  const [copied, setCopied] = useState(false);
  const [expires, setExpires] = useState('24h');
  const [password, setPassword] = useState(false);

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Private Sharing</h3>
        <p className="text-gray-400 text-sm mb-4">Share with control, not risk.</p>

        <div className="bg-gray-900/40 rounded-lg p-3 mb-4 text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-300">essentials://share/passport.pdf</span>
          </div>
          <div className="text-xs text-gray-500">Expires: {expires} • {password ? 'Password protected' : 'No password'}</div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {['1h', '24h', '7d', 'Never'].map((opt) => (
            <button
              key={opt}
              onClick={() => setExpires(opt)}
              className={`px-2.5 py-1 text-xs rounded-full ${expires === opt
                ? 'bg-yellow-400/20 text-yellow-400'
                : 'bg-white/5 text-gray-400'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-300">Password protect</span>
          <button
            onClick={() => setPassword(!password)}
            className={`relative w-10 h-5 rounded-full transition-colors ${password ? 'bg-yellow-400' : 'bg-gray-700'
              }`}
          >
            <motion.div
              initial={false}
              animate={{ x: password ? 20 : 0 }}
              className="absolute top-0.5 left-0.5 w-4 h-4 bg-black rounded-full"
            />
          </button>
        </div>

        <button
          onClick={copyLink}
          className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Secure Link
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
};

// ========== INTERACTIVE 4: PERMISSIONS TOGGLE ==========
const PermissionsDemo = () => {
  const [access, setAccess] = useState<'view' | 'edit' | 'none'>('view');

  return (
    <GlassCard>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">Granular Permissions</h3>
        <p className="text-gray-400 text-sm mb-5">Control exactly what others can do.</p>

        <div className="space-y-3">
          {[
            { id: 'view', label: 'Can View', icon: User, desc: 'Read-only access' },
            { id: 'edit', label: 'Can Edit', icon: UserCheck, desc: 'Full access' },
            { id: 'none', label: 'No Access', icon: UserX, desc: 'Revoked' },
          ].map((perm) => (
            <button
              key={perm.id}
              onClick={() => setAccess(perm.id as any)}
              className={`w-full text-left p-3 rounded-xl transition-colors ${access === perm.id
                ? 'bg-yellow-400/10 border border-yellow-400/30'
                : 'bg-white/5 hover:bg-white/10'
                }`}
            >
              <div className="flex items-center gap-3">
                <perm.icon
                  className={`w-5 h-5 ${access === perm.id ? 'text-yellow-400' : 'text-gray-400'
                    }`}
                />
                <div>
                  <div className="font-medium text-white">{perm.label}</div>
                  <div className="text-xs text-gray-400">{perm.desc}</div>
                </div>
                {access === perm.id && <CheckCircle className="w-4 h-4 text-yellow-400 ml-auto" />}
              </div>
            </button>
          ))}
        </div>
      </div>
    </GlassCard>
  );
};

// ========== INTERACTIVE 5: TERMINAL DEMO ==========
const TerminalDemo = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const runDemo = async () => {
    if (running) return;
    setRunning(true);
    setCommands([]);
    await new Promise((r) => setTimeout(r, 300));
    setCommands((c) => [...c, '> essentials upload passport.pdf']);
    await new Promise((r) => setTimeout(r, 600));
    setCommands((c) => [...c, '✓ Generating keys...']);
    await new Promise((r) => setTimeout(r, 500));
    setCommands((c) => [...c, '✓ Encrypting file (AES-256)...']);
    await new Promise((r) => setTimeout(r, 1000));
    setCommands((c) => [...c, '✓ Storing on decentralized networkc (IPFS)...']);
    await new Promise((r) => setTimeout(r, 500));
    setCommands((c) => [...c, '✓ Signing transaction...']);
    await new Promise((r) => setTimeout(r, 1000));
    setCommands((c) => [...c, '✓ Sending transaction to blockchain network...']);
    await new Promise((r) => setTimeout(r, 500));
    setCommands((c) => [...c, '✓ Upload Complete!']);
    setRunning(false);
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>
      <div className="font-mono text-sm bg-gray-900/40 p-4 rounded-lg mb-3 h-54 overflow-y-auto">
        {commands.map((cmd, i) => (
          <div key={i} className="text-green-400 mb-1">
            {cmd}
          </div>
        ))}
        {!commands.length && (
          <div className="text-gray-500 italic">Run encryption demo...</div>
        )}
      </div>
      <button
        onClick={runDemo}
        disabled={running}
        className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium text-white disabled:opacity-50"
      >
        {running ? 'Encrypting...' : 'Run Encryption Demo'}
      </button>
    </GlassCard>
  );
};

// ========== INTERACTIVE 6: NODE NETWORK ==========
const NodeNetwork = () => {
  const nodes = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: i * 0.1,
    x: Math.cos((i / 12) * Math.PI * 2) * 120,
    y: Math.sin((i / 12) * Math.PI * 2) * 80,
  }));

  return (
    <GlassCard>
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-3">
          <Globe2 className="w-8 h-8 text-yellow-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">Decentralized Storage</h3>
        <p className="text-gray-400 text-sm mt-1">
          Your files are split, encrypted, and stored across global nodes.
        </p>
      </div>
      <div className="relative h-48 flex items-center justify-center">
        {/* Center file */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center"
        >
          <FileText className="w-6 h-6 text-black" />
        </motion.div>
        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: node.delay, duration: 0.5 }}
            style={{ x: node.x, y: node.y }}
            className="absolute w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
          >
            <HardDrive className="w-3 h-3 text-gray-400" />
          </motion.div>
        ))}
        {/* Connecting lines (simplified) */}
        <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
          {nodes.map((node, i) => (
            <motion.line
              key={i}
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.05, duration: 0.8 }}
              x1="50%"
              y1="50%"
              x2={`${50 + (node.x / 240) * 100}%`}
              y2={`${50 + (node.y / 160) * 100}%`}
              stroke="rgba(212, 175, 55, 0.2)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
    </GlassCard>
  );
};

// ========== Main Homepage ==========
const Homepage = memo(() => {
  const [latestMembers, setLatestMembers] = useState<string[]>([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/public/stats')
      .then(res => res.json())
      .then(data => {
        if (data.latest_members) {
          setLatestMembers(data.latest_members.map((m: any) => m.wallet));
        }
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <div className="relative z-[1] font-sans text-white min-h-screen">
      <CursorSpotlight />

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-48 lg:pt-32 relative overflow-hidden">
        {/* Local blueprint removed in favor of global LivingBlueprint */}

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="text-center lg:text-left mt-10 lg:mt-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="flex flex-col sm:flex-row items-center gap-4 mb-6 mx-auto lg:mx-0 justify-center lg:justify-start"
            >
              <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_10px_#facc15]" />
                <span className="text-sm font-medium text-gray-300 tracking-wide uppercase">Private by Design</span>
              </div>

              {/* Rating & Avatars */}
              <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
                <div className="flex -space-x-2">
                  {latestMembers.length > 0 ? latestMembers.slice(0, 3).map((wallet, i) => (
                    <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-800 overflow-hidden relative z-0">
                      <JazziconAvatar wallet={wallet} size={24} />
                    </div>
                  )) : (
                    [1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border border-black" />)
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">4.9/5 Rating</span>
                </div>
              </div>
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl md:text-7l xl:text-7xl font-bold mb-6 leading-tight">
              <BlurWords text="Your Documents, Your Control" className="block text-white font-light mb-2 tracking-tight" /><br></br>
              <motion.span
                className="block bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 bg-clip-text text-transparent font-black cursor-default transition-all duration-500 hover:drop-shadow-[0_0_25px_rgba(234,179,8,0.6)]"
                whileHover={{ scale: 1.02 }}
              >
                Safe Forever.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.4 }}
              className="text-lg text-gray-300 mb-10 px-4 lg:px-0 leading-relaxed font-light"
            >
              Store your most important documents with bank-level security. No big-tech, no tracking — just pure privacy.
            </motion.p>

            {/* Buttons removed as requested */}
          </div>

          <div className="flex flex-col items-center justify-center relative w-full">

            <div className="w-full flex justify-center z-20 mb-8 mt-4">
              <CommunityStats />
            </div>

            <div className="relative z-10 w-full flex justify-center">
              {/* Reduced scale slightly to match widths better and removed negative margin top that caused overlap */}
              <div className="origin-top">
                <InteractiveVault />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Section: Cinema Video */}
      <section className="relative">
        <CinemaVideo />
      </section>

      {/* Testimonials */}
      <Testimonials />

      <VelocityText />

      <StickyFeatures />

      {/* Section: Zero Knowledge */}
      <section id="security" className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords
              text="Zero-Knowledge Architecture"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              We designed a system where even we can’t access your data.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <KeyVisualizer />
          </div>
        </div>
      </section>

      <section className="py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need,{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Nothing You Don't.
              </span>
            </h2>
          </motion.div>

          {/* Bento Grid */}
          <BentoGrid />
        </div>
      </section>

      {/* Section: Secure Sharing */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords
              text="Share Without Sacrificing Security"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Granular controls, expiring links, and password protection — all in one flow.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <SecureShareDemo />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 aspect-video relative group"
            >
              <video
                className="w-full h-full object-cover"
                src="/demovideo/EditAndViewHistory.mp4"
                playsInline
                loop
                muted
                autoPlay
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-yellow-400 font-mono tracking-widest uppercase">Live Demo: Management & Sharing</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16 text-center">
            {[
              { number: 500, suffix: '+', label: 'Early Connections', icon: FileText },
              { number: 99.9, suffix: '%', label: 'Uptime', icon: Shield },
              { number: 24, suffix: '/7', label: 'Always Available', icon: Clock },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, ease }}
                className="space-y-4"
              >
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(212,175,55,0.12)]">
                  {/* use Counter for integers and handle a decimal for 99.9 */}
                  {stat.number === 99.9 ? (
                    <span>
                      <Counter from={0} to={99} duration={1.2} className="inline-block" />
                      .9<span className="align-top">%</span>
                    </span>
                  ) : (
                    <span>
                      <Counter from={0} to={stat.number} duration={1.4} className="inline-block" />
                      {stat.suffix}
                    </span>
                  )}
                </div>
                <div className="text-gray-300 font-medium text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Permissions */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords
              text="Fine-Grained Permissions"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Decide exactly what others can do with your files.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <PermissionsDemo />
          </div>
        </div>
      </section>

      {/* Section: Terminal */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords
              text="See It In Action"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Your file gets encrypted and stored in real time.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <TerminalDemo />
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 aspect-video relative group"
            >
              <video
                className="w-full h-full object-cover"
                src="/demovideo/Upload.mp4"
                playsInline
                loop
                muted
                autoPlay
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-xs text-yellow-400 font-mono tracking-widest uppercase">Live Demo: Terminal Node Upload</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section: Decentralized Network */}
      <section className="py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <BlurWords
              text="No Single Point of Failure"
              className="text-3xl md:text-4xl font-bold mb-4"
            />
            <p className="text-gray-300 max-w-2xl mx-auto font-light">
              Your data is stored across a global network of secure nodes.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <NodeNetwork />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-48 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <GlassCard>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease }}
              className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12"
            >

              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to protect your{' '}
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  confidential documents?
                </span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust Essentialis with their most critical data.
              </p>
              <MagneticButton
                href="/join-waitlist"
                className="shadow-2xl inline-flex"
                icon={<ArrowRight className="w-4 h-4 ml-2" />}
              >
                Join the Waitlist
              </MagneticButton>
            </motion.div>
          </GlassCard>
        </div>
      </section>

      <Footer />
    </div>
  );
});

export default Homepage;
