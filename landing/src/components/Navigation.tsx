import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const navData = [
  {
    title: "PRODUCT",
    items: [
      {
        name: "Features",
        desc: "Vault, Fragmenting & Shielding",
        href: "/#features",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9.937 15.5.394 1.581a4.417 4.417 0 0 0 8.562 0L19.287 15.5a2 2 0 0 1 1.437-1.437l1.581-.394a4.417 4.417 0 0 0 0-8.562L20.724 4.713a2 2 0 0 1-1.437-1.437l-.394-1.581a4.417 4.417 0 0 0-8.562 0L9.937 2.089a2 2 0 0 1-1.437 1.437l-1.581.394a4.417 4.417 0 0 0 0 8.562l1.581.394a2 2 0 0 1 1.437 1.437Z"/><path d="m15 15-3-3"/></svg>
      },
      {
        name: "Pricing",
        desc: "Plans for individuals and teams",
        href: "/pricing",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
      }
    ]
  },
  {
    title: "COMPANY",
    items: [
      {
        name: "About Us",
        desc: "Our story and mission",
        href: "/about",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
      },
      {
        name: "Careers",
        desc: "Join our core team",
        href: "/about#careers",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
      }
    ]
  },
  {
    title: "RESOURCES",
    items: [
      {
        name: "Documentation",
        desc: "Quick start and API",
        href: "/docs",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>
      },
      {
        name: "Privacy Policy",
        desc: "How we protect your autonomy",
        href: "/privacy-policy",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      },
      {
        name: "Terms of Service",
        desc: "Usage guidelines",
        href: "/terms-of-service",
        icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>
      }
    ]
  }
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoLink, setDemoLink] = useState('/join-waitlist');
  const [hue, setHue] = useState(0);
  const animRef = useRef<number>(0);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 0], [0.3, 0.85]);

  // Slowly rotating rainbow hue for nav pill
  useEffect(() => {
    let start: number | null = null;
    const tick = (t: number) => {
      if (!start) start = t;
      setHue(((t - start) * 0.018) % 360);
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    const hasAccess = sessionStorage.getItem('access_granted') === 'true';
    setDemoLink(hasAccess ? '/login' : '/join-waitlist');

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-6 px-4">
        {/* Rainbow glow ring behind pill */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[620px] h-[72px] rounded-full pointer-events-none z-49"
          style={{
            backgroundImage: `conic-gradient(from ${hue}deg, #ff0080, #7928ca, #0070f3, #00dfd8, #fff500, #ff0080)`,
            filter: 'blur(8px)',
            opacity: 0.3,
          }}
        />
        {/* Shortened Frosted Pill - Perfectly Symmetrical */}
        <motion.div
           style={{
             backgroundColor: `rgba(3,3,8,${bgOpacity.get()})`,
             backdropFilter: 'blur(40px) saturate(200%)',
             WebkitBackdropFilter: 'blur(40px) saturate(200%)',
           }}
           className="relative flex items-center justify-between w-full max-w-[600px] rounded-full border border-white/[0.06] p-2 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.04)] z-50 transition-all duration-300"
        >
          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white z-10"
            aria-label="Toggle menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="5" y1="9" x2="19" y2="9" />
                  <line x1="5" y1="15" x2="19" y2="15" />
                </>
              )}
            </svg>
          </button>

          {/* Logo - Absolute Center */}
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="absolute left-1/2 -translate-x-1/2 flex items-center hover:opacity-80 transition-opacity z-10 pointer-events-auto">
            <img
              src="./essentialisbrand.png"
              alt="Essentialis Logo"
              className="h-5 sm:h-8 w-auto object-contain"
            />
          </Link>

          {/* CTA */}
          <Link
            to={demoLink}
            className="group flex items-center gap-1 sm:gap-2 text-[11px] sm:text-[13px] font-semibold text-black bg-white hover:bg-gray-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all z-10 shrink-0"
          >
            <span className="hidden sm:inline">Join Waitlist</span>
            <span className="sm:hidden">Access</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
          </Link>
        </motion.div>

        {/* Unique Floating Bento Grid Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 16, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(10px)" }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.7 }}
              className="absolute top-[80px] left-0 right-0 mx-auto w-full max-w-[1000px] z-40 px-2 sm:px-4"
            >
              <div className="p-2 sm:p-3 bg-white/[0.01] border border-white/[0.05] rounded-[2rem] sm:rounded-[2.5rem] backdrop-blur-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,1),0_0_0_1px_rgba(255,255,255,0.03)] overflow-hidden relative"
                   style={{ backdropFilter: 'blur(60px) saturate(200%)', WebkitBackdropFilter: 'blur(60px) saturate(200%)' }}>
                
                {/* Prismatic Rainbow Refraction */}
                <div className="absolute top-0 left-1/3 w-[400px] h-[250px] bg-gradient-to-r from-violet-500/10 via-cyan-500/8 to-transparent blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] bg-gradient-to-l from-fuchsia-500/8 to-transparent blur-[100px] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative z-10">
                  {navData.map((category) => (
                    <div key={category.title} className="p-6 pb-8 rounded-[2rem] bg-black/60 border border-white/5 hover:border-white/10 transition-colors group">
                      <h3 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] mb-6 flex items-center gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/30 group-hover:bg-yellow-400/80 group-hover:shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all" />
                         {category.title}
                      </h3>
                      <div className="space-y-1">
                        {category.items.map((item) => (
                          <Link 
                            key={item.name} 
                            to={item.href} 
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-white/5 transition-colors group/item"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover/item:text-yellow-400 group-hover/item:bg-yellow-400/10 group-hover/item:border-yellow-400/30 transition-all shrink-0">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-[14px] font-semibold text-gray-200 group-hover/item:text-white transition-colors">{item.name}</div>
                              <div className="text-[12px] text-gray-500 font-medium leading-relaxed mt-0.5">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom decorative bar inside grid */}
                <div className="mt-2 sm:mt-3 relative z-10 w-full rounded-[1.2rem] sm:rounded-[1.5rem] bg-gradient-to-r from-yellow-400/5 to-transparent border border-white/5 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 group/bottom">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shadow-[0_0_10px_#facc15] shrink-0" />
                    <span className="text-xs text-gray-300 font-medium tracking-wide">Ready to claim your sovereignty?</span>
                  </div>
                  <Link to="/join-waitlist" onClick={() => setIsMenuOpen(false)} className="mx-auto sm:mx-0 text-xs font-bold text-yellow-400 inline-flex items-center gap-1 group-hover/bottom:gap-2 transition-all">
                    Get Early Access <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Deep Screen Darkening Overlay outside nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 cursor-pointer"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;