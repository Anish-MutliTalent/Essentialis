// Homepage.tsx — Professional Bento Box Layout for Essentialis
import { memo, useState, useEffect, useRef } from 'react';
import {
  motion,
  useAnimation,
  useMotionValue,
  useSpring,
  useTransform,
  cubicBezier,
} from 'framer-motion';

import { MagneticButton } from "../components/Interactive"
import Footer from '../components/Footer';
import JazziconAvatar from '../components/UI/JazziconAvatas';
import IcoSphereGlobe from '../components/IcoSphereGlobe';
import CommunityStats from '../components/CommunityStats';
import Testimonials from '../components/Testimonials';
import VelocityText from '../components/VelocityText';


// ========== Utilities ==========
const ease = cubicBezier(0.16, 1, 0.3, 1);

const AnimatedText = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div key={String(children)} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={className}>
    {children}
  </motion.div>
);

// Interactive Encryption Demo Component
const InteractiveEncryptionDemo = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [encryptionStage, setEncryptionStage] = useState(0);
  const [fileProgress, setFileProgress] = useState(0);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setEncryptionStage(1);
    
    // Simulate encryption process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setFileProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setEncryptionStage(2);
        setTimeout(() => setEncryptionStage(3), 1000);
      }
    }, 200);
  };
  
  return (
    <LiquidGlassCard className="!p-0 overflow-hidden">
      <div 
        className="aspect-[16/9] relative bg-gradient-to-br from-slate-900 to-black"
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Stage 0: Drop Zone */}
        {encryptionStage === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <motion.div
              animate={{ 
                scale: isDragging ? 1.1 : 1,
                borderColor: isDragging ? 'rgba(251,191,36,0.8)' : 'rgba(251,191,36,0.3)'
              }}
              className={`w-32 h-32 rounded-2xl border-2 border-dashed flex items-center justify-center mb-6 ${
                isDragging ? 'bg-amber-500/10' : 'bg-transparent'
              }`}
            >
              <svg className="w-12 h-12 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </motion.div>
            <p className="text-xl font-medium text-white mb-2">Drop a file to encrypt</p>
            <p className="text-sm text-gray-500">See end-to-end encryption in action</p>
          </motion.div>
        )}
        
        {/* Stage 1: Encrypting */}
        {encryptionStage === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <div className="w-32 h-32 relative mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border-2 border-amber-500/30 rounded-full"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.15,
                    ease: "easeOut" 
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-amber-400">{fileProgress}%</span>
              </div>
            </div>
            <p className="text-xl font-medium text-white mb-2">Encrypting...</p>
            <p className="text-sm text-gray-500">Splitting into encrypted fragments</p>
          </motion.div>
        )}
        
        {/* Stage 2: Distributed */}
        {encryptionStage === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <div className="flex gap-4 mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.1, type: "spring" }}
                  className="w-12 h-12 bg-gradient-to-br from-amber-400/20 to-yellow-500/10 rounded-xl border border-amber-500/30 flex items-center justify-center"
                >
                  <div className="w-4 h-4 bg-amber-400 rounded-full" />
                </motion.div>
              ))}
            </div>
            <p className="text-xl font-medium text-white mb-2">Distributed across network</p>
            <p className="text-sm text-gray-500">5 encrypted fragments stored independently</p>
          </motion.div>
        )}
        
        {/* Stage 3: Complete */}
        {encryptionStage === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(74,222,128,0.4)]"
            >
              <svg className="w-12 h-12 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <p className="text-xl font-medium text-white mb-2">Encrypted & Owned</p>
            <p className="text-sm text-gray-500">Only you can access this file</p>
            <button
              onClick={() => { setEncryptionStage(0); setFileProgress(0); }}
              className="mt-6 px-6 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm text-amber-400 hover:bg-amber-500/30 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </LiquidGlassCard>
  );
};

const Reveal = ({ children, className = '', delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.9, ease, delay }}
    className={className}
  >
    {children}
  </motion.div>
);




// Cinematic Hero Animations


const CycleTypewriter = ({ words, className = "" }: { words: string[], className?: string }) => {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const currentWord = words[index];
    const typeSpeed = isDeleting ? 40 : 100;

    const timeout = setTimeout(() => {
      if (!isDeleting && text === currentWord) {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, 2000);
        return;
      }

      if (isDeleting && text === "") {
        setIsDeleting(false);
        setIndex((prev) => (prev + 1) % words.length);
        return;
      }

      setText(currentWord.substring(0, text.length + (isDeleting ? -1 : 1)));
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [text, isDeleting, isPaused, index, words]);

  return (
    <span className={`inline-block relative ${className}`}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[0.08em] h-[0.9em] bg-yellow-400 ml-1 align-baseline translate-y-[0.1em]"
      />
    </span>
  );
};


// ========== WIGGLE CARD — gentle Y sine oscillation via rAF ==========
const WiggleCard = ({ children, phase = 0, amplitude = 1, period = 40 }: {
  children: React.ReactNode;
  phase?: number;
  amplitude?: number;
  period?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let rafId: number;
    const angFreq = (2 * Math.PI) / period;
    const update = (t: number) => {
      if (ref.current) {
        const y = amplitude * Math.sin(t * 0.001 * angFreq + phase);
        ref.current.style.transform = `translateY(${y}px)`;
      }
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [amplitude, period, phase]);
  return <div ref={ref}>{children}</div>;
};


// ========== LIQUID GLASS CARD — PREMIUM GLASSMORPHISM ==========
const LiquidGlassCard = ({ children, className = "", rainbowIntensity = 0.07 }: { children: React.ReactNode; className?: string; rainbowIntensity?: number }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hue, setHue] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const tick = (t: number) => {
      if (!start) start = t;
      setHue(((t - start) * 0.025) % 360);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
      className={`relative rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden p-6 sm:p-10 group ${className}`}
      style={{ backgroundColor: "rgba(255,255,255,0.015)", backdropFilter: "blur(60px) saturate(200%)", WebkitBackdropFilter: "blur(60px) saturate(200%)" }}
    >
      {/* Rainbow border — rotates hue slowly, brightens on hover */}
      <div className="absolute inset-[-1px] rounded-[2.5rem] pointer-events-none z-[0]"
        style={{
          background: `conic-gradient(from ${hue}deg, #ff0080, #7928ca, #0070f3, #00dfd8, #fff500, #ff0080)`,
          opacity: isHovered ? 0.55 : rainbowIntensity,
          transition: 'opacity 0.4s ease',
          filter: 'blur(2px)',
        }}
      />
      {/* Dark glass interior over rainbow border */}
      <div className="absolute inset-[1px] rounded-[calc(2.5rem-1px)] z-[0]" style={{ background: 'rgba(4,4,10,0.93)' }} />

      {/* Cursor spotlight */}
      <motion.div
        className="absolute pointer-events-none rounded-[2.5rem] z-[1] mix-blend-screen"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ inset: 0, background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(120,80,255,0.14), rgba(0,200,255,0.08) 35%, transparent 60%)` }}
      />

      {/* Chromatic mask border on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-[2.5rem] z-[1]"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{
          border: "1px solid rgba(120,100,255,0.5)",
          maskImage: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 70%)`,
          WebkitMaskImage: `radial-gradient(280px circle at ${mousePosition.x}px ${mousePosition.y}px, black, transparent 70%)`,
        }}
      />

      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-purple-500/5 via-cyan-500/3 to-transparent blur-[100px] rounded-full pointer-events-none z-[1]" />
      <div className="absolute inset-0 rounded-[2.5rem] pointer-events-none bg-gradient-to-br from-white/[0.03] via-transparent to-white/[0.01] z-[1]" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};


// ========== HERO INTERACTIVE: VAULT ==========
const InteractiveVault = () => {
  const controls = useAnimation();
  const [locked, setLocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const runEncrypt = async () => {
    if (locked) return;
    setLocked(true); setProgress(0);
    await controls.start({ scale: 0.96, transition: { duration: 0.1 } });
    let p = 0;
    while (p < 100) {
      await new Promise((r) => setTimeout(r, 40));
      p += Math.min(100 - p, 7 + Math.random() * 6);
      setProgress(p);
    }
    await controls.start({ scale: 1, rotateY: 360, transition: { duration: 0.6, ease } });
  };

  const reset = () => { setLocked(false); setProgress(0); controls.set({ scale: 1, rotateY: 0 }); };

  return (
    <LiquidGlassCard className="!p-6 w-full h-full flex flex-col justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-6">

        {/* Status / Hash (Moved to LEFT) */}
        <div className="w-full sm:w-32 font-mono text-[10px] space-y-4">
          <div className="relative pl-3 border-l border-white/10">
            <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 bg-white/20 rounded-full" />
            <div className="text-gray-500 uppercase tracking-wider mb-1">Status</div>
            <AnimatedText className={locked ? "text-green-400 font-bold" : "text-yellow-500 font-bold"}>{locked ? "ENCRYPTED" : "UNPROTECTED"}</AnimatedText>
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
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative pl-3 border-l border-green-500/50">
              <div className="text-gray-500 uppercase tracking-wider mb-1">Hash</div>
              <div className="text-green-400/90 break-all leading-tight">0x7f...ac0</div>
            </motion.div>
          )}
        </div>

        {/* File & Controls (Moved to RIGHT) */}
        <div className="flex-1 flex items-start gap-4 justify-end w-full">
          <div className="flex-1 min-w-0 flex flex-col items-end text-right">
            <div className="flex items-center justify-end mb-1 gap-2">
              <div className="text-xs text-gray-400">Target File</div>
              <div className="text-[10px] text-gray-400 border border-white/20 px-1.5 py-0.5 rounded">PDF</div>
            </div>
            <div className="font-medium text-white text-sm truncate w-full text-right">passport_scan.pdf</div>
            <div className="mt-3 w-full">
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                {/* Progress bar fills from right to left intuitively matching layout */}
                <motion.div className="absolute right-0 top-0 h-full rounded-full bg-gradient-to-l from-yellow-400 to-yellow-500" style={{ width: `${progress}%` }} initial={{ width: "0%" }} animate={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={reset} className="px-4 py-1.5 text-xs text-gray-300 hover:text-white border border-white/10 rounded hover:bg-white/10 transition-colors">Reset</button>
                <button onClick={runEncrypt} disabled={locked} className={`max-w-[100px] w-full py-1.5 rounded text-xs font-medium text-center transition-all ${locked ? 'bg-green-500/20 text-green-400 cursor-default border border-green-500/30' : 'bg-yellow-400 text-black hover:bg-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.3)]'}`}>{locked ? 'Secured' : 'Encrypt'}</button>
              </div>
            </div>
          </div>
          <motion.div animate={controls} drag dragConstraints={{ left: -10, right: 10, top: -10, bottom: 10 }} whileDrag={{ scale: 1.05, rotate: 2 }} className="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing shrink-0">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-400"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
          </motion.div>
        </div>

      </div>
    </LiquidGlassCard>
  );
};



// ========== STAR FIELD ==========
const STARS = Array.from({ length: 120 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  r: Math.random() * 1.4 + 0.3,
  opacity: Math.random() * 0.55 + 0.15,
  delay: Math.random() * 4,
}));

interface ShootingStar {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  trail: { x: number; y: number }[];
}

const StarField = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<ShootingStar[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawn = () => {
      const speed = 2.5 + Math.random() * 3.5;
      // Spawn from a random edge
      const edge = Math.floor(Math.random() * 4);
      let sx = 0, sy = 0;
      if (edge === 0) { sx = Math.random() * canvas.width; sy = 0; }
      else if (edge === 1) { sx = canvas.width; sy = Math.random() * canvas.height; }
      else if (edge === 2) { sx = Math.random() * canvas.width; sy = canvas.height; }
      else { sx = 0; sy = Math.random() * canvas.height; }

      // Bias direction toward center so they cross visible area
      const cx = canvas.width / 2, cy = canvas.height / 2;
      const toCenter = Math.atan2(cy - sy, cx - sx);
      const scatter = (Math.random() - 0.5) * Math.PI * 0.9;
      const finalAngle = toCenter + scatter;

      const maxLife = 80 + Math.random() * 60;
      starsRef.current.push({
        x: sx, y: sy,
        vx: Math.cos(finalAngle) * speed,
        vy: Math.sin(finalAngle) * speed,
        life: 0, maxLife,
        trail: [],
      });
    };

    let frameCount = 0;
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount++;
      // Spawn a new shooting star every ~120 frames (~2s at 60fps)
      if (frameCount % 120 === 0) spawn();

      starsRef.current = starsRef.current.filter(s => s.life < s.maxLife);

      for (const s of starsRef.current) {
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 28) s.trail.shift();

        s.x += s.vx;
        s.y += s.vy;
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.15
          ? progress / 0.15
          : progress > 0.75
            ? 1 - (progress - 0.75) / 0.25
            : 1;

        // Draw trail — gradient from head (bright) to tail (transparent)
        if (s.trail.length > 1) {
          for (let i = 1; i < s.trail.length; i++) {
            const t = i / s.trail.length;
            ctx.beginPath();
            ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
            ctx.lineTo(s.trail[i].x, s.trail[i].y);
            ctx.strokeStyle = `rgba(255,255,255,${t * 0.5 * alpha})`;
            ctx.lineWidth = t * 1.5;
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // Draw bright dot head
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 2.5);
        grd.addColorStop(0, `rgba(255,255,255,${alpha})`);
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }
    };

    // Stagger first spawns
    setTimeout(spawn, 500);
    setTimeout(spawn, 2000);
    setTimeout(spawn, 4000);
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {/* Static twinkling dots */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {STARS.map(s => (
          <motion.circle
            key={s.id}
            cx={`${s.x}%`} cy={`${s.y}%`} r={s.r}
            fill="white"
            initial={{ opacity: s.opacity * 0.4 }}
            animate={{ opacity: [s.opacity * 0.4, s.opacity, s.opacity * 0.5, s.opacity] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}
      </svg>
      {/* Canvas shooting stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};


// ========== Main Homepage ==========
const Homepage = memo(() => {
  const [latestMembers, setLatestMembers] = useState<string[]>([]);
  const [waitlistHref, setWaitlistHref] = useState('/join-waitlist');

  // Global cursor parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });
  const blobX1 = useTransform(springX, [-1, 1], [-25, 25]);
  const blobY1 = useTransform(springY, [-1, 1], [-18, 18]);
  const blobX2 = useTransform(springX, [-1, 1], [18, -18]);
  const blobY2 = useTransform(springY, [-1, 1], [12, -12]);
  const textShiftX = useTransform(springX, [-1, 1], [-5, 5]);
  const textShiftY = useTransform(springY, [-1, 1], [-3, 3]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseX.set((e.clientX - window.innerWidth / 2) / (window.innerWidth / 2));
    mouseY.set((e.clientY - window.innerHeight / 2) / (window.innerHeight / 2));
  };

  useEffect(() => {
    const ref = sessionStorage.getItem('user_ref');
    if (ref) setWaitlistHref(`/join-waitlist?ref=${encodeURIComponent(ref)}`);
  }, []);

  useEffect(() => {
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => { if (data.latest_members) setLatestMembers(data.latest_members.map((m: any) => m.wallet)); })
      .catch(e => console.error(e));
  }, []);

  return (
    <div onMouseMove={handleMouseMove} className="relative z-[1] font-sans text-white min-h-screen selection:bg-yellow-400 selection:text-black">
      {/* Full-page starfield */}
      <StarField />
      {/* Hero — no overflow-hidden so sphere bleeds into next section */}
      <section className="relative min-h-[100svh] flex flex-col items-center justify-start pt-28 sm:pt-36">

        {/* ── Centered top: badge + headline + CTA ── */}
        <motion.div
          style={{ x: textShiftX, y: textShiftY }}
          className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-4xl mx-auto"
        >

          {/* Badge row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10">
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse shadow-[0_0_8px_#facc15]" />
              <span className="text-xs font-semibold text-gray-200 tracking-widest uppercase">Web3. For Everyone.</span>
            </div>
            <div className="flex items-center gap-2.5 bg-white/[0.06] backdrop-blur-2xl px-4 py-2 rounded-full border border-white/10">
              <div className="flex -space-x-2">
                {latestMembers.length > 0 ? latestMembers.slice(0, 3).map((wallet, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-black bg-gray-800 overflow-hidden"><JazziconAvatar wallet={wallet} size={24} /></div>
                )) : [1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-700 border border-black" />)}
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#facc15"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>)}
              </div>
              <span className="text-[11px] text-gray-400">4.9/5</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-6xl md:text-7xl xl:text-[5.5rem] font-bold leading-[1.05] tracking-tight mb-6"
          >
            <span className="block text-white font-light mb-1">
              Your <CycleTypewriter words={["Money,", "Identity,", "Files,", "World,"]} />
            </span>
            <span className="block text-white font-light">Your Rules.</span>
            <motion.span
              initial={{ opacity: 0, filter: "blur(12px)", scale: 0.95 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent font-black"
            >
              Own Everything.
            </motion.span>
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mb-10"
          >
            Web3 has always promised privacy and true ownership. We're making that real — with apps that feel as simple as the ones you already love.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease }}
            className="flex flex-wrap justify-center gap-4"
          >
            <MagneticButton
              href={waitlistHref}
              className="shadow-[0_0_30px_rgba(250,204,21,0.25)] text-base px-10 py-4 rounded-full font-bold"
            >
              Get Early Access
            </MagneticButton>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-base font-medium text-gray-300 hover:text-white px-8 py-4 rounded-full border border-white/10 backdrop-blur-xl bg-white/[0.04] transition-all hover:border-white/20"
            >
              Learn more <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
            </a>
          </motion.div>
        </motion.div>

        {/* ── Icosphere + 3D bottom panels stage ── */}
        <div className="relative w-full flex-1 flex flex-col items-center" style={{ minHeight: '25vh' }}>

          {/* --- Right panel (Behind Globe - z-0) --- */}
          <div className="absolute bottom-40 sm:bottom-48 left-0 right-0 mx-auto w-full max-w-[80vw] px-4 sm:px-10 z-0 pointer-events-none flex justify-end pb-6 items-center sm:items-start tracking-tight">
            <div className="w-[360px] aspect-[4/3] scale-[0.9] sm:scale-[1.05] xl:scale-[1.15] origin-bottom-right pointer-events-none relative translate-x-4 sm:translate-x-12 -translate-y-6 sm:-translate-y-12">
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="w-full h-full pointer-events-auto rounded-[1.4rem]"
              >
                <InteractiveVault />
              </motion.div>
            </div>
          </div>

          {/* Icosphere globe — mid-scene */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -translate-y-[60px] -translate-x-1/2 z-10 pointer-events-none"
            style={{ width: '100vw', height: '100vw' }}
          >
            <IcoSphereGlobe className="w-full h-full" />
          </motion.div>

          {/* --- Left panel (In Front of Globe - z-20) --- */}
          <div className="absolute bottom-40 sm:bottom-48 left-0 right-0 mx-auto w-full max-w-[80vw] px-4 sm:px-10 z-20 pointer-events-none flex justify-start pb-6 items-center sm:items-start tracking-tight">
            <div className="w-[360px] aspect-[4/3] scale-[0.9] sm:scale-[1.05] xl:scale-[1.15] origin-bottom-left pointer-events-none relative -translate-x-4 sm:-translate-x-16 translate-y-6 sm:translate-y-16">
              <motion.div
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="w-full h-full pointer-events-auto rounded-[1.4rem] overflow-hidden shadow-[0_30px_60px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.07)]"
              >
                <div className="absolute" />
                <CommunityStats />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GRADIENT GLOW BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-blue-500/20 via-cyan-400/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-t from-amber-500/10 via-yellow-400/5 to-transparent rounded-full blur-[100px]" />
      </div>

      {/* ── TESTIMONIALS SECTION (Near Top) ── */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-4">Trusted by Early Adopters</p>
              <h2 className="text-3xl sm:text-4xl font-medium text-white">What people are saying</h2>
            </div>
          </Reveal>
          <Testimonials />
        </div>
      </section>

      {/* ── ESSENTIALIS SCROLLING MARQUEE ── */}
      <VelocityText />

      {/* ── THE PROBLEM ── */}
      <section className="relative z-[25] min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">The Foundation is Cracked</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1] tracking-tight mb-6">
                <span className="text-white">The Internet is </span>
                <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent">Broken.</span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Every file you upload, every photo you save, every document you store lives on someone else's server. They can delete it, sell it, or lock you out entirely. And you agreed to it in the fine print.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LiquidGlassCard className="!p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-500/20 to-transparent rounded-full blur-[40px]" />
                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500/20 to-red-600/5 border border-red-500/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-red-400">01</span>
                  </div>
                </div>
                <p className="text-2xl font-medium text-white mb-3">They Own It</p>
                <p className="text-gray-500 text-sm leading-relaxed">Cloud providers legally control your data through Terms of Service that you cannot negotiate. They can change the rules at any time, and there is nothing you can do about it. Your digital life exists at their mercy.</p>
              </LiquidGlassCard>
              
              <LiquidGlassCard className="!p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-[40px]" />
                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/5 border border-orange-500/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-orange-400">02</span>
                  </div>
                </div>
                <p className="text-2xl font-medium text-white mb-3">They Can Delete It</p>
                <p className="text-gray-500 text-sm leading-relaxed">Without warning or recourse. One policy change, one algorithmic mistake, one account suspension, and your entire digital life can vanish overnight. Years of memories, documents, work gone in an instant.</p>
              </LiquidGlassCard>
              
              <LiquidGlassCard className="!p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/20 to-transparent rounded-full blur-[40px]" />
                <div className="mb-6 relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/20 to-yellow-600/5 border border-yellow-500/20 flex items-center justify-center">
                    <span className="text-lg font-medium text-yellow-400">03</span>
                  </div>
                </div>
                <p className="text-2xl font-medium text-white mb-3">They Can Sell It</p>
                <p className="text-gray-500 text-sm leading-relaxed">Your data becomes their product. Packaged, profiled, and monetized without your meaningful consent. Your behavior, preferences, and private moments become inventory in an invisible marketplace.</p>
              </LiquidGlassCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── THE VISION ── */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">What The Internet Should Be</p>
              <h2 className="text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight">
                <span className="text-white">Full sovereignty. </span>
                <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">Complete privacy.</span>
              </h2>
            </div>
            
            {/* VIDEO SECTION - Web3 Vision */}
            <div className="mb-12">
              <LiquidGlassCard className="!p-0 overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  {/* PLACEHOLDER: Add video showing decentralized network visualization */}
                  <video 
                    className="w-full h-full object-cover opacity-80"
                    src="/videos/vision-network.mp4" 
                    playsInline 
                    loop 
                    muted 
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-sm text-gray-400 mb-2">Video: Decentralized Future</p>
                    <p className="text-xl text-white font-medium">A world where you own your digital life</p>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <LiquidGlassCard className="!p-10 min-h-[320px] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-[60px]" />
                <div className="relative">
                  <p className="text-3xl font-medium text-white mb-4 leading-relaxed">Imagine a world where no bank owns your money. No company owns your data. No government can freeze your account without recourse.</p>
                  <p className="text-gray-500 leading-relaxed">This is not a fantasy. This is what blockchain technology was built to create. Decentralized networks that put you in control of your own digital existence.</p>
                </div>
              </LiquidGlassCard>
              
              <div className="grid grid-cols-1 gap-4">
                <LiquidGlassCard className="!p-6 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-bl from-amber-500/30 to-transparent rounded-full blur-[30px]" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-600/5 border border-amber-500/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-amber-400">100%</span>
                  </div>
                  <div>
                    <p className="text-lg text-white">Complete transparency</p>
                    <p className="text-sm text-gray-500">Every transaction visible on the blockchain</p>
                  </div>
                </LiquidGlassCard>
                
                <LiquidGlassCard className="!p-6 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-bl from-yellow-500/30 to-transparent rounded-full blur-[30px]" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/5 border border-yellow-500/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-yellow-400">100%</span>
                  </div>
                  <div>
                    <p className="text-lg text-white">Absolute privacy</p>
                    <p className="text-sm text-gray-500">End-to-end encryption protects your data</p>
                  </div>
                </LiquidGlassCard>
                
                <LiquidGlassCard className="!p-6 flex items-center gap-4 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-bl from-orange-500/30 to-transparent rounded-full blur-[30px]" />
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-600/5 border border-orange-500/30 flex items-center justify-center">
                    <span className="text-sm font-medium text-orange-400">100%</span>
                  </div>
                  <div>
                    <p className="text-lg text-white">True ownership</p>
                    <p className="text-sm text-gray-500">Cryptographic keys guarantee your control</p>
                  </div>
                </LiquidGlassCard>
              </div>
            </div>
            
            <div className="mt-4">
              <LiquidGlassCard className="!p-8 relative overflow-hidden">
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-[60px]" />
                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <p className="text-2xl font-medium text-white mb-2">This is not fantasy.</p>
                    <p className="text-gray-500">This is what Web3 was built to make possible. The technology exists. It has existed for years. The only thing missing was someone willing to build it for everyone, not just developers.</p>
                  </div>
                  <div className="text-right md:text-right text-left">
                    <p className="text-gray-400">The problem:</p>
                    <p className="text-xl font-medium bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Never built for people.</p>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY WEB3 FAILED ── */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">Why Web3 Never Took Off</p>
              <h2 className="text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight text-white">
                Built by engineers, <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">for engineers.</span>
              </h2>
            </div>
            
            {/* VIDEO SECTION - Web3 Complexity */}
            <div className="mb-12">
              <LiquidGlassCard className="!p-0 overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  {/* PLACEHOLDER: Add video showing complex Web3 interfaces vs Essentialis simple UI */}
                  <video 
                    className="w-full h-full object-cover opacity-80"
                    src="/videos/web3-complexity.mp4" 
                    playsInline 
                    loop 
                    muted 
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Video: The Complexity Gap</p>
                      <p className="text-xl text-white font-medium">Why most people cannot use Web3 today</p>
                    </div>
                    <div className="px-4 py-2 bg-amber-500/20 border border-amber-500/30 rounded-full">
                      <span className="text-sm text-amber-400">4.2% adoption rate</span>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
            
            {/* UNIQUE VERTICAL SCROLL - The Three Problems */}
            <div className="relative">
              <div className="space-y-8">
                {/* Problem 1 - Glitch Effect */}
                <div className="relative group">
                  <LiquidGlassCard className="!p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <motion.div
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center"
                        >
                          <span className="text-2xl font-bold text-red-400">01</span>
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <p className="text-3xl font-medium text-white mb-4">Inaccessible</p>
                        <p className="text-gray-400 leading-relaxed">12-word seed phrases, gas fees, nonce errors. Complex interfaces that require technical knowledge just to perform basic operations. The barrier to entry is impossibly high.</p>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </div>

                {/* Problem 2 - Fade In/Out */}
                <div className="relative group">
                  <LiquidGlassCard className="!p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center"
                        >
                          <span className="text-2xl font-bold text-orange-400">02</span>
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <p className="text-3xl font-medium text-white mb-4">Invisible</p>
                        <p className="text-gray-400 leading-relaxed">Most people have never heard of Web3. Those who have often cannot access it in any meaningful way. Marketing speaks to developers, not users. The conversation happens in echo chambers.</p>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </div>

                {/* Problem 3 - Scale Pulse */}
                <div className="relative group">
                  <LiquidGlassCard className="!p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center"
                        >
                          <span className="text-2xl font-bold text-yellow-400">03</span>
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <p className="text-3xl font-medium text-white mb-4">The Gap</p>
                        <p className="text-gray-400 leading-relaxed">Technology exists, but accessibility does not. The infrastructure is solid, but the user experience is broken. That is the gap Essentialis fills. We bridge the impossible.</p>
                      </div>
                    </div>
                  </LiquidGlassCard>
                </div>
              </div>
            </div>
            
            {/* SOLUTION CARD */}
            <LiquidGlassCard className="!p-10 relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-bl from-amber-500/30 to-transparent rounded-full blur-[80px]" />
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl">
                  <p className="text-sm text-amber-400 mb-3 tracking-widest uppercase">The Solution</p>
                  <p className="text-3xl font-medium text-white mb-4">Essentialis</p>
                  <p className="text-gray-400 leading-relaxed">We are making Web3 actually usable. Simple interfaces that feel familiar. No seed phrases to memorize. No gas fees to calculate. Just apps that work like the ones you already know, but with true ownership built in.</p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <span className="text-4xl font-medium text-black">E</span>
                  </div>
                </div>
              </div>
            </LiquidGlassCard>
          </Reveal>
        </div>
      </section>

      {/* ── THE SOLUTION ── */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">The Solution</p>
              <h2 className="text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight mb-6">
                <span className="text-white">Essentialis </span>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">fills the gap.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                We build Web3 products that anyone can actually use. Simple, intuitive interfaces that feel familiar, without hiding what makes them powerful. No technical knowledge required. No compromises on ownership.
              </p>
            </div>
            
            {/* VIDEO SECTION - Essentialis Demo */}
            <div className="mb-12">
              <LiquidGlassCard className="!p-0 overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  {/* PLACEHOLDER: Add demo video showing Essentialis app interface */}
                  <video 
                    className="w-full h-full object-cover opacity-90"
                    src="/videos/essentialis-demo.mp4" 
                    playsInline 
                    loop 
                    muted 
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Video: Essentialis in Action</p>
                      <p className="text-xl text-white font-medium">Upload, share, and own your files</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-sm text-green-400">Encrypted</span>
                      <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-sm text-amber-400">Decentralized</span>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
            
            {/* FUTURISTC HORIZONTAL SCROLL FEATURES */}
            <div className="relative mb-12">
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                {/* Feature 1 - Animated Orbit */}
                <motion.div 
                  className="flex-shrink-0 w-[350px] snap-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LiquidGlassCard className="!p-8 h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div 
                        className="w-32 h-32 rounded-full border border-amber-500/30"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                      </motion.div>
                      <motion.div 
                        className="absolute w-20 h-20 rounded-full border border-yellow-500/20"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-yellow-400 rounded-full" />
                      </motion.div>
                      <div className="absolute w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-lg text-gray-500 mb-1">Starting with</p>
                      <p className="text-2xl font-medium text-white">Cloud Storage</p>
                    </div>
                  </LiquidGlassCard>
                </motion.div>

                {/* Feature 2 - Pulse Rings */}
                <motion.div 
                  className="flex-shrink-0 w-[350px] snap-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LiquidGlassCard className="!p-8 h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-24 h-24 rounded-full border border-yellow-500/20"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 2, opacity: 0 }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity, 
                            delay: i * 0.6,
                            ease: "easeOut" 
                          }}
                        />
                      ))}
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full flex items-center justify-center border border-yellow-400/30">
                        <svg className="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-lg text-gray-500 mb-1">Designed for</p>
                      <p className="text-2xl font-medium text-white">Everyone</p>
                    </div>
                  </LiquidGlassCard>
                </motion.div>

                {/* Feature 3 - Shield Lock */}
                <motion.div 
                  className="flex-shrink-0 w-[350px] snap-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <LiquidGlassCard className="!p-8 h-[300px] relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="relative"
                      >
                        <div className="w-20 h-24 bg-gradient-to-b from-orange-400/20 to-amber-500/10 rounded-t-3xl border border-orange-400/30 flex items-center justify-center">
                          <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-orange-400/20 blur-xl rounded-full" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-8 left-8 right-8">
                      <p className="text-lg text-gray-500 mb-1">Guarantee</p>
                      <p className="text-2xl font-medium text-white">True Ownership</p>
                    </div>
                  </LiquidGlassCard>
                </motion.div>
              </div>
            </div>

            {/* INTERACTIVE ENCRYPTION DEMO */}
            <InteractiveEncryptionDemo />
          </Reveal>
        </div>
      </section>

      {/* ── THE LARGER GOAL ── */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <p className="text-sm tracking-[0.2em] uppercase text-gray-500 mb-6">The Vision</p>
              <h2 className="text-4xl sm:text-5xl font-medium leading-[1.1] tracking-tight mb-6">
                <span className="text-white">Not just products. </span>
                <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">A movement.</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Essentialis is building a community around the radical idea that people deserve to own their digital lives. We are not just building apps. We are building a future where digital sovereignty is the default, not the exception.
              </p>
            </div>
            
            {/* VIDEO SECTION - Community & Ecosystem */}
            <div className="mb-12">
              <LiquidGlassCard className="!p-0 overflow-hidden">
                <div className="aspect-video relative bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  {/* PLACEHOLDER: Add video showing community, ecosystem roadmap, or team */}
                  <video 
                    className="w-full h-full object-cover opacity-80"
                    src="/videos/ecosystem-roadmap.mp4" 
                    playsInline 
                    loop 
                    muted 
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <p className="text-sm text-gray-400 mb-2">Video: The Essentialis Ecosystem</p>
                    <p className="text-xl text-white font-medium">Building a complete Web3 suite for everyone</p>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
            
            {/* UNIQUE 3D TIMELINE - Product Ecosystem */}
            <div className="relative py-12">
              {/* Central Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />
              
              <div className="space-y-24">
                {/* Timeline Item 1 - Cloud Storage */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-sm text-amber-400 mb-2 tracking-widest uppercase">Phase One</p>
                    <p className="text-3xl font-medium text-white mb-3">Cloud Storage</p>
                    <p className="text-gray-500 max-w-sm ml-auto">Where you own your files. Encrypted, distributed, and fully under your control.</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)]"
                    />
                  </div>
                  <div className="w-1/2 pl-12">
                    <div className="w-48 h-32 bg-gradient-to-br from-amber-900/20 to-slate-900 rounded-xl border border-amber-500/20 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 flex items-center justify-center opacity-20"
                      >
                        <div className="w-20 h-20 border border-amber-500 rounded-full" />
                      </motion.div>
                      <span className="text-amber-400 font-medium">Launching Soon</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 2 - Identity */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12">
                    <div className="w-48 h-32 bg-gradient-to-br from-yellow-900/20 to-slate-900 rounded-xl border border-yellow-500/20 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 bg-yellow-500/20 rounded-full" />
                      </motion.div>
                      <span className="text-yellow-400 font-medium">In Development</span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)]"
                    />
                  </div>
                  <div className="w-1/2 pl-12">
                    <p className="text-sm text-yellow-400 mb-2 tracking-widest uppercase">Phase Two</p>
                    <p className="text-3xl font-medium text-white mb-3">Identity</p>
                    <p className="text-gray-500 max-w-sm">Your digital identity, owned by you. No centralized authority can revoke it.</p>
                  </div>
                </div>

                {/* Timeline Item 3 - Finance */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12 text-right">
                    <p className="text-sm text-orange-400 mb-2 tracking-widest uppercase">Phase Three</p>
                    <p className="text-3xl font-medium text-white mb-3">Finance</p>
                    <p className="text-gray-500 max-w-sm ml-auto">DeFi made simple. Your assets, your control, no intermediaries needed.</p>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full shadow-[0_0_20px_rgba(251,146,60,0.6)]"
                    />
                  </div>
                  <div className="w-1/2 pl-12">
                    <div className="w-48 h-32 bg-gradient-to-br from-orange-900/20 to-slate-900 rounded-xl border border-orange-500/20 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 bg-orange-500/20 rounded-lg"
                      />
                      <span className="text-orange-400 font-medium">Coming Next</span>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 4 - Connect */}
                <div className="relative flex items-center">
                  <div className="w-1/2 pr-12">
                    <div className="w-48 h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-600/30 flex items-center justify-center relative overflow-hidden">
                      <motion.div
                        animate={{ rotate: 180 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="w-8 h-8 border-2 border-slate-500/30 rounded-full"
                      />
                      <span className="text-slate-400 font-medium">Planned</span>
                    </div>
                  </div>
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                      className="w-6 h-6 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full shadow-[0_0_20px_rgba(148,163,184,0.6)]"
                    />
                  </div>
                  <div className="w-1/2 pl-12">
                    <p className="text-sm text-slate-400 mb-2 tracking-widest uppercase">Phase Four</p>
                    <p className="text-3xl font-medium text-white mb-3">Connect</p>
                    <p className="text-gray-500 max-w-sm">Encrypted communication. Private, secure, and uncensorable messaging.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MISSION STATEMENT - Full Width */}
            <div className="mt-16">
              <LiquidGlassCard className="!p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-yellow-500/10" />
                <div className="relative text-center">
                  <p className="text-sm text-amber-400 mb-4 tracking-widest uppercase">The Mission</p>
                  <p className="text-4xl sm:text-5xl font-medium text-white mb-6 leading-tight">
                    Bring Web3 to everyone.<br />
                    <span className="text-gray-500">No compromises required.</span>
                  </p>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    We believe that digital ownership should not require a computer science degree. It should be as simple as downloading an app. The future is decentralized, and it should be accessible to all.
                  </p>
                </div>
              </LiquidGlassCard>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL STATEMENT - Cinematic Full Screen ── */}
      <section className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            {/* Cinematic Video Backdrop */}
            <div className="relative mb-12">
              <LiquidGlassCard className="!p-0 overflow-hidden">
                <div className="aspect-[21/9] relative bg-gradient-to-br from-slate-900 to-black flex items-center justify-center">
                  {/* PLACEHOLDER: Cinematic video showing ownership concept */}
                  <video 
                    className="w-full h-full object-cover opacity-50"
                    src="/videos/ownership-concept.mp4" 
                    playsInline 
                    loop 
                    muted 
                    autoPlay
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/70" />
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
                        initial={{ x: Math.random() * 100 + '%', y: '100%' }}
                        animate={{ y: '-10%', opacity: [0, 1, 0] }}
                        transition={{ 
                          duration: 8 + Math.random() * 4, 
                          repeat: Infinity, 
                          delay: i * 1.5,
                          ease: "linear" 
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <div className="text-center max-w-4xl">
                      <p className="text-sm tracking-[0.3em] uppercase text-gray-400 mb-8">The Promise</p>
                      <div className="space-y-4">
                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white">
                          The internet gave us <span className="text-gray-600">convenience.</span>
                        </p>
                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-white">
                          Essentialis gives it back to you,
                        </p>
                        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium">
                          <span className="bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">with ownership.</span>
                </p>
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
            
            {/* Value Props - Side by Side with Icons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <LiquidGlassCard className="!p-10 relative">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-white mb-3">No compromises</p>
                      <p className="text-gray-500 leading-relaxed">You should not have to choose between convenience and control. With Essentialis, you get both. The ease of use you expect from modern apps, combined with the ownership guarantees that only Web3 can provide.</p>
                    </div>
                  </div>
                </LiquidGlassCard>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <LiquidGlassCard className="!p-10 relative">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30 flex items-center justify-center"
                      >
                        <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </motion.div>
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-white mb-3">Built for everyone</p>
                      <p className="text-gray-500 leading-relaxed">Finally, Web3 that works like the apps you already love. No technical barriers. No intimidating interfaces. Just powerful technology made accessible for the first time.</p>
                    </div>
                  </div>
                </LiquidGlassCard>
              </div>
            </div>
            
            {/* CTA Section */}
            <div className="text-center">
              <MagneticButton
                href={waitlistHref}
                className="bg-gradient-to-r from-amber-400 to-yellow-400 text-black hover:from-amber-300 hover:to-yellow-300 text-lg px-16 py-5 rounded-full font-medium shadow-[0_0_50px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_rgba(251,191,36,0.5)] transition-all"
              >
                Join the waitlist
              </MagneticButton>
              <p className="text-sm text-gray-500 mt-6">Be among the first to reclaim your digital life.</p>
            </div>
          </Reveal>
        </div>
      </section>
                    
      <Footer />
    </div>
  );
});

export default Homepage;
