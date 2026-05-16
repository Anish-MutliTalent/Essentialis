import { useRef, useState, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  animate,
  cubicBezier,
  useInView
} from 'framer-motion';

const ease = cubicBezier(0.16, 1, 0.3, 1);

const BlurWords = ({ text, className = '', delay = 0 }: { text: any, className?: string, delay?: number }) => (
  <span>
    {text.split(' ').map((word: any, i: any) => (
      <motion.span
        key={i}
        initial={{ filter: 'blur(12px)', opacity: 0 }}
        whileInView={{ filter: 'blur(0px)', opacity: 1 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.7, ease, delay: delay + i * 0.07 }}
        className={`inline-block mr-2 last:mr-0 ${className} text-transparent bg-clip-text`}
      >
        {word}&nbsp;
      </motion.span>
    ))}
  </span>
);

// ========== Dynamic Background Lighting ==========
const ParallaxGlow = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1200], ['10%', '90%']);
  const y2 = useTransform(scrollY, [0, 1200], ['90%', '10%']);
  const x1 = useTransform(scrollY, [0, 1200], ['20%', '80%']);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1, x: x1 }}
        className="absolute w-[800px] h-[800px] rounded-full bg-yellow-400/10 blur-[160px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute w-[600px] h-[600px] rounded-full bg-white/5 blur-[120px] bottom-0 right-0"
      />
    </div>
  );
};

// ========== Reusable Glass Card — Premium Glassmorphism ==========
const GlassCard = ({ children, delay = 0, tilt = true, className = '', onClick }: { children: any, delay?: number, tilt?: boolean, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateY = useTransform(mouseX, [-100, 100], [-6, 6]);
  const rotateX = useTransform(mouseY, [-100, 100], [6, -6]);

  const handleMouseMove = (e: any) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - (rect.left + rect.width / 2));
    mouseY.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
      style={{ rotateX: tilt ? rotateX : 0, rotateY: tilt ? rotateY : 0 }}
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease, delay }}
      className={`backdrop-blur-[50px] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)] ${className}`}
      whileHover={{ boxShadow: '0 25px 60px -12px rgba(0,0,0,0.9), 0 0 0 1px rgba(120,80,255,0.12)' }}
    >
      {/* Prismatic inner refraction gradient */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] via-purple-500/[0.01] to-transparent pointer-events-none" />
      {/* Subtle glass surface highlight */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.025), transparent 40%)' }} />
      {children}
    </motion.div>
  );
};


/**
 * Feature Card with tilt on pointer move
 */
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useTransform(my, [-20, 20], [8, -8]);
  const rotateY = useTransform(mx, [-20, 20], [-8, 8]);
  // const shadowY = useTransform(my, [-20, 20], [12, -12]);
  function handleMove(e: any) {
    const rect = ref.current!.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width;
    const dy = (e.clientY - rect.top) / rect.height;
    mx.set((dx - 0.5) * 40);
    my.set((dy - 0.5) * 40);
  }
  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY }}
      className="group relative bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 cursor-pointer will-change-transform"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease }}
    >
      <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.03), transparent)' }} />
      <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mb-6 shadow">
        <Icon className="w-7 h-7 text-black" />
      </div>

      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{description}</p>
    </motion.div>
  );
};

import { Link } from 'react-router-dom';

// ========== Magnetic Button (Enhanced) ==========
const MagneticButton = ({ href, children, className = '', ariaLabel, icon }: { href: string, children: any, className?: string, ariaLabel?: string, icon?: any }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 15 });
  const springY = useSpring(y, { stiffness: 300, damping: 15 });
  const ref = useRef<any>(null);
  const [hue, setHue] = useState(0);
  const [hovered, setHovered] = useState(false);
  const animRef = useRef<number>(0);

  useEffect(() => {
    let start: number | null = null;
    const tick = (t: number) => {
      if (!start) start = t;
      setHue(((t - start) * 0.04) % 360);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const isExternal = href.startsWith('http') || href.startsWith('mailto:');

  const onMove = (e: any) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx / 6);
    y.set(dy / 6);
  };

  const content = (
    <>
      {/* Rainbow glow ring */}
      <span
        className="absolute inset-[-2px] rounded-xl pointer-events-none z-[-1]"
        style={{
          background: `conic-gradient(from ${hue}deg, #ff0080, #7928ca, #facc15, #0070f3, #00dfd8, #ff0080)`,
          opacity: hovered ? 0.9 : 0,
          transition: 'opacity 0.3s ease',
          filter: 'blur(4px)',
        }}
      />
      <motion.span
        style={{ x: springX, y: springY }}
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 transform-gpu"
      />
      <span className="relative z-10 px-6 py-3 font-semibold text-black whitespace-nowrap flex items-center gap-1">
        {children}
        {icon && <span className="inline-block">{icon}</span>}
      </span>
    </>
  );

  const commonProps = {
    'aria-label': ariaLabel,
    ref: ref,
    className: `relative inline-flex items-center gap-2 rounded-xl overflow-visible ${className}`,
    onMouseMove: onMove,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => { x.set(0); y.set(0); setHovered(false); }
  };

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...commonProps}>
        {content}
      </a>
    );
  }

  return (
    <Link to={href} {...commonProps}>
      {content}
    </Link>
  );
};

/**
 * Animated Counter — animates numeric value when in view
 * Uses framer-motion's top-level `animate` helper for compatibility.
 */
const Counter = ({ from = 0, to = 100, duration = 1.6, className = '' }) => {
  const [display, setDisplay] = useState(from);
  const ref = useRef(null);

  // triggers when element enters viewport
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" });

  useEffect(() => {
    if (!isInView) return;

    const ease = cubicBezier(0.16, 1, 0.3, 1);

    const controls = animate(from, to, {
      duration,
      ease,
      onUpdate(v) {
        setDisplay(Math.round(v));
      },
    });

    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return (
    <div ref={ref} className={className}>
      {display}
    </div>
  );
};

export { BlurWords, ParallaxGlow, Counter, MagneticButton, FeatureCard, GlassCard };