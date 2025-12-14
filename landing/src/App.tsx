import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import { useEffect } from 'react';
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
  useEffect(() => {
    initSmoothScroll();
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