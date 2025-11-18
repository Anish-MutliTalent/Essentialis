import  { useState, useEffect } from 'react';
import { Menu, X, User, FileText, DollarSign, BookOpen, Home } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);

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

  // Background remains conditional based on scrollPos for visual clarity
  const bgClass =
    scrollPos > 20 ? 'bg-black/90 backdrop-blur-professional' : 'bg-transparent';

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: User },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
    { name: 'Documentation', href: '/docs', icon: FileText },
    { name: 'Blog', href: '/blog', icon: BookOpen },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-in-out ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: `${containerPaddingTop}rem` }}>
        <div className="flex justify-between items-center transition-all duration-1000 ease-in-out" style={{ height: `${navHeight}rem` }}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-3 group">
              <span className="text-2xl font-bold gradient-gold-text">
                <img 
                  src="./essentialis.svg" 
                  alt="Logo" 
                  style={{ height: `${imageSize}rem`, width: `${imageSize}rem`, transition: 'all 1s ease-in-out' }}
                  className="rounded-full group-hover:scale-105"
                />
              </span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-yellow-400 px-4 py-2 text-sm font-medium transition-colors duration-1000 ease-in-out rounded-lg hover:bg-yellow-400/5"
                >
                  {item.name}
                </a>
              ))}
              <a
                  href="https://demo.essentialis.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-yellow-400 text-yellow-400 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300 shadow-yellow-400/30 shadow-lg inline-flex items-center gap-2 hover:scale-105"
                  style={{fontSize: '1rem'}}
                >
                  🎉 Experience Demo
                </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-yellow-400 p-2 rounded-lg hover:bg-yellow-400/5 transition-all duration-1000 ease-in-out"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-professional border-b border-gray-800/50 animate-fadeIn">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-yellow-400 block px-4 py-3 text-base font-medium transition-colors duration-1000 ease-in-out rounded-lg hover:bg-yellow-400/5"
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
              className="border border-yellow-400 text-yellow-400 px-5 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-all duration-300 shadow-yellow-400/30 shadow-lg inline-flex items-center gap-2 w-full justify-center mt-2"
              style={{fontSize: '1rem'}}
              onClick={() => setIsMenuOpen(false)}
            >
              🎉 Experience Demo
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;