import  { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X, User, FileText, DollarSign, BookOpen, Home, Mail } from 'lucide-react';
import { MagneticButton } from './Interactive';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const navRef = useRef<HTMLDivElement | null>(null);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 200], [0, 0.9]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Compute fraction from 0 to 1 based on max scroll threshold (200)
  const fraction = Math.min(scrollPos / 200, 1);
  // Compute dynamic values:
  // Navbar inner content: from 7rem (h-28) to 5rem (h-20)
  const navHeight = 7 - 2 * fraction;
  // Container top padding: from 2rem (p-8) to 0.25rem (pt-1); difference = 1.75
  const containerPaddingTop = 2 - 1.75 * fraction;
  // Logo image size: from 12rem (h-48/w-48) to 10rem (h-40/w-40)
  const imageSize = 12 - 2 * fraction;

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Documentation', href: '/docs', icon: FileText },
    { name: 'Blog', href: '/blog', icon: BookOpen },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 left-0 right-0 z-50 transition-all">
      {/* Background layer that fades with scroll, links stay always visible */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: 'rgba(0,0,0,1)',
          backdropFilter: 'saturate(180%) blur(16px)',
          WebkitBackdropFilter: 'saturate(180%) blur(16px)',
          opacity: bgOpacity
        }}
      >
        {/* Glow border */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 border-b border-white/10" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-20 w-[60%] bg-yellow-400/10 blur-2xl rounded-full" />
        </div>
      </motion.div>

      {/* Foreground content - always visible */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${containerPaddingTop}rem` }}>
        <div className="flex justify-between items-center transition-all" style={{ height: `${navHeight}rem` }}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3 group">
              <span className="text-2xl font-bold gradient-gold-text">
                <img 
                  src="./essentialis.svg" 
                  alt="Logo" 
                  style={{ height: `${imageSize}rem`, width: `${imageSize}rem`, transition: 'all 1s ease-in-out' }}
                  className="rounded-full group-hover:scale-105 will-change-transform"
                />
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-400 px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-yellow-400/5"
                >
                  {item.name}
                </a>
              ))}
              <MagneticButton
                href="https://demo.essentialis.cloud"
                ariaLabel="Experience Demo"
                className="shadow-2xl bg-transparent"
                icon=""
              >
                🎉 Experience Demo
              </MagneticButton>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-400/5 transition-colors"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:hidden bg-black/95 backdrop-blur-professional border-b border-gray-800/50"
        >
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-yellow-400 block px-4 py-3 text-base font-medium transition-colors rounded-lg hover:bg-yellow-400/5"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5 text-yellow-400" />
                  <span>{item.name}</span>
                </div>
              </a>
            ))}
            <a
              href="https://demo.essentialis.cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-yellow-400 text-yellow-400 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-colors shadow-yellow-400/30 shadow-lg inline-flex items-center gap-2 w-full justify-center mt-2"
              style={{fontSize: '1rem'}}
              onClick={() => setIsMenuOpen(false)}
            >
              🎉 Experience Demo
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navigation;