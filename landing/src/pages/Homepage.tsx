// Homepage.tsx — Fully interactive, cinematic, no placeholders
import { memo, useState, useEffect } from 'react';
import {
  motion,
  useAnimation,
  cubicBezier,
} from 'framer-motion';
import {
  ArrowRight,
  Lock,
  Shield,
  Smartphone,
  Zap,
  Globe,
  CheckCircle,
  FileText,
  Clock,
  Key,
  LinkIcon,
  Copy,
  User,
  UserCheck,
  UserX,
  HardDrive,
  Globe2,
  EyeOff,
} from 'lucide-react';
import {BlurWords, ParallaxGlow, Counter, MagneticButton, FeatureCard, GlassCard} from "../components/Interactive"

// ========== Utilities ==========
const ease = cubicBezier(0.16, 1, 0.3, 1);


// ========== INTERACTIVE 1: ENHANCED VAULT ==========
const InteractiveVault = () => {
  const controls = useAnimation();
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0);
  // const fileRef = useRef(null);

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
    <GlassCard>
      <div className="flex items-start gap-4">
        <motion.div
          animate={controls}
          drag
          dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
          whileDrag={{ scale: 1.05, rotate: 2 }}
          className="w-20 h-20 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-lg"
        >
          <FileText className="w-8 h-8 text-yellow-400" />
        </motion.div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Document</div>
              <div className="font-semibold text-white">passport.pdf</div>
            </div>
            <div className="text-xs text-gray-500">12 KB</div>
          </div>
          <div className="mt-4">
            <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-300">
                {locked ? <Lock className="w-3.5 h-3.5 text-green-400" /> : <Lock className="w-3.5 h-3.5 text-yellow-400" />}
                <span>{locked ? 'Encrypted' : 'Not encrypted'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={runEncrypt}
                  disabled={locked}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    locked
                      ? 'bg-green-400/20 text-green-400 cursor-default'
                      : 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/30'
                  }`}
                >
                  {locked ? 'Secured' : 'Encrypt'}
                </button>
                <button
                  onClick={reset}
                  className="px-2 py-1 text-xs text-gray-400 hover:text-white"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Drag the file and click <span className="text-yellow-400 font-medium">Encrypt</span> to see zero-knowledge encryption in action.
          </div>
        </div>
      </div>
    </GlassCard>
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
              className={`px-2.5 py-1 text-xs rounded-full ${
                expires === opt
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
            className={`relative w-10 h-5 rounded-full transition-colors ${
              password ? 'bg-yellow-400' : 'bg-gray-700'
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
              className={`w-full text-left p-3 rounded-xl transition-colors ${
                access === perm.id
                  ? 'bg-yellow-400/10 border border-yellow-400/30'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <perm.icon
                  className={`w-5 h-5 ${
                    access === perm.id ? 'text-yellow-400' : 'text-gray-400'
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
  // Fade sections on scroll
  useEffect(() => {
    const sections = document.querySelectorAll('.section');
 
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          } else {
            entry.target.classList.remove('section-visible');
          }
        });
     },
      { 
        threshold: window.innerWidth < 768 ? 0.1 : 0.4 
      }
    );
 
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-black text-white overflow-x-hidden relative font-sans">
      <ParallaxGlow />

      {/* Hero */}
      <section className="section min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-48 lg:pt-32">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease }}
              className="inline-block mb-6 mx-auto lg:mx-0"
            >
              <div className="inline-flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-gray-300">Now Available • Private by Design</span>
              </div>
            </motion.div>

            <h1
              className="text-4xl sm:text-5xl md:text-7l xl:text-7xl font-bold mb-6 leading-tight">
              <BlurWords text="Your Documents, Your Control" className="block text-white font-light mb-2" /><br></br>
              <BlurWords text="Safe Forever." className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text font-black" delay={0.5}/>
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <MagneticButton
                href="/open-beta"
                ariaLabel="Start storing safely"
                className="shadow-2xl flex items-center justify-center gap-2"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Start Storing Safely
              </MagneticButton>
              <a
                href="/docs"
                className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-colors"
              >
                See How It Works
              </a>
            </motion.div>
          </div>

          <div className="flex justify-center">
            <InteractiveVault />
          </div>
        </div>
      </section>

      {/* Section: Zero Knowledge */}
      <section className="section py-28 px-4 sm:px-6 lg:px-8">
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

      <section className="section py-28 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Made For{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Everyone
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto font-light">
              Essentials gives you a safe place for your documents—encrypted, decentralized, and always under your control.
            </p>
          </motion.div>

          {/* Feature Grid (interactive tilt cards) */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Zap,
                title: 'Immediate Access',
                description: 'You get to your files wherever you go. No one else (not even us) can look in.',
              },
              {
                icon: Shield,
                title: 'Strong Encryption',
                description: 'Everything is protected before it ever leaves your device. Only you have the key.',
              },
              {
                icon: Globe,
                title: 'Private Sharing',
                description: 'Share what you want, only with who you want. There’s no hidden data collection.',
              },
              {
                icon: Smartphone,
                title: 'Blockchain Security',
                description: 'Your files are stored on a secure network, not some corporate database. You hold the power.',
              },
            ].map((feature, index) => (
              <GlassCard>
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Secure Sharing */}
      <section className="section py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b">
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
          <div className="max-w-2xl mx-auto">
            <SecureShareDemo />
          </div>
        </div>
      </section>

      <section className="section py-24 px-4 sm:px-6 lg:px-8 bg-white/5 backdrop-blur-xl border-y border-white/10 relative">
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
      <section className="section py-28 px-4 sm:px-6 lg:px-8">
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
      <section className="section py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b">
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
          <div className="max-w-2xl mx-auto">
            <TerminalDemo />
          </div>
        </div>
      </section>

      {/* Section: Decentralized Network */}
      <section className="section py-28 px-4 sm:px-6 lg:px-8">
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
      <section className="section py-48 px-4 sm:px-6 lg:px-8">
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

            

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton href="/open-beta" ariaLabel="Start protecting now" className="shadow-xl" icon={<ArrowRight className="w-4 h-4" />}>
                Start Protecting Now
              </MagneticButton>

              <a
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-semibold hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
              >
                See How It Works
              </a>
            </div>
          </motion.div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
});

Homepage.displayName = 'Homepage';
export default Homepage;
