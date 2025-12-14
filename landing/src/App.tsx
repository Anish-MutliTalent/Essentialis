import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import { useEffect, useRef } from 'react';
import { initSmoothScroll } from './lib/lenis';


// Lazy load components for better performance
const Homepage = lazy(() => import('./pages/Homepage'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const OpenBeta = lazy(() => import('./pages/OpenBeta'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const Contact = lazy(() => import('./pages/Contact'));

// Fast loading component
const FastLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.1s'}}></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
    </div>
  </div>
);

function App() {
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenisRef = useRef<any>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // Initialize smooth scroll
    const lenis = initSmoothScroll();
    lenisRef.current = lenis;

    // Function to show scrollbar
    const showScrollbar = () => {
      if (!isScrollingRef.current) {
        isScrollingRef.current = true;
        document.documentElement.classList.add('scrolling');
        document.body.classList.add('scrolling');
      }
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };

    // Function to hide scrollbar after scrolling stops
    const hideScrollbar = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        document.documentElement.classList.remove('scrolling');
        document.body.classList.remove('scrolling');
      }, 600); // Hide scrollbar 600ms after scrolling stops
    };

    // Listen to Lenis scroll events (primary method)
    const handleLenisScroll = () => {
      showScrollbar();
      hideScrollbar();
    };

    // Listen to wheel events to detect scroll intent
    const handleWheel = () => {
      showScrollbar();
      hideScrollbar();
    };

    // Listen to touch events for mobile
    const handleTouchStart = () => {
      showScrollbar();
    };

    const handleTouchEnd = () => {
      hideScrollbar();
    };

    // Listen to native scroll events as fallback
    const handleNativeScroll = () => {
      showScrollbar();
      hideScrollbar();
    };

    if (lenis) {
      lenis.on('scroll', handleLenisScroll);
    }

    // Add event listeners
    window.addEventListener('scroll', handleNativeScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      if (lenis) {
        lenis.off('scroll', handleLenisScroll);
      }
      window.removeEventListener('scroll', handleNativeScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-black text-white relative">
        {/* Premium blurred radial gradient background */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-40 -left-40 h-[60rem] w-[60rem] rounded-full blur-3xl opacity-20" style={{background: 'radial-gradient(closest-side, rgba(212,175,55,0.2), transparent)'}}></div>
          <div className="absolute top-1/3 -right-40 h-[40rem] w-[40rem] rounded-full blur-3xl opacity-15" style={{background: 'radial-gradient(closest-side, rgba(255,255,255,0.12), transparent)'}}></div>
        </div>

        {/* Animated subtle background grid */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none fixed inset-0 -z-10 bg-grid-pattern"
        />

        <Navigation />

        <Suspense fallback={<FastLoader />}>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/about" element={<About />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/open-beta" element={<OpenBeta />} />
            <Route path="/waitlist" element={<Waitlist />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;