import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import { initSmoothScroll } from './lib/lenis';
import { ThirdwebProvider, useActiveAccount, AutoConnect } from 'thirdweb/react';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { client } from './lib/thirdweb';
import { DocsProvider } from "./components/contexts/DocsContext";

// Frontend Components
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
// Dashboard content components
import DashboardHome from './components/UI/dashboard/content/DashboardHome';
import MyDocs from './components/UI/dashboard/content/MyDocs';
import Settings from './components/UI/dashboard/content/Settings';
import CompleteProfileForm from './components/UI/dashboard/content/CompleteProfileForm';
import MintDocPage from './components/UI/dashboard/content/MintDocPage';
import DocView from './components/UI/dashboard/content/DocView';
import EditDocPage from './components/UI/dashboard/content/EditDocPage';
import DocHistory from './components/UI/dashboard/content/DocHistory';
import AdminPanelPage from './pages/AdminPanelPage';
import AccessGatePage from './pages/AccessGatePage';
import WaitlistPage from './pages/WaitlistPage';
import ReferralHandler from './pages/ReferralHandler';
import AccessGuard from './components/AccessGuard';

import LivingBlueprint from './components/LivingBlueprint';
import PortalScreen from './components/PortalScreen';
import AudioPlayer from './components/AudioPlayer';
import BackToTop from './components/BackToTop';
import { AnimatePresence } from 'framer-motion';
// Landing Components (Lazy)
const Homepage = lazy(() => import('./pages/Homepage'));
const About = lazy(() => import('./pages/About'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Documentation = lazy(() => import('./pages/Documentation'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
// const OpenBeta was removed
// const Waitlist was removed
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));

// Fast loading component
const FastLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount();
  const location = useLocation();
  if (!account) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <>{children}</>;
};

// Root Redirect/Landing Switcher
function RootRedirectOrLanding() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Use a lightweight check or just rely on thirdweb hook if initialized?
        // But thirdweb hook might be slow to populate 'account'.
        // We'll check the auth API as per original frontend
        const res = await fetch('/api/auth/status', { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.logged_in && mounted) {
            // If logged in, redirect to dashboard immediately
            navigate('/dashboard', { replace: true });
            return;
          }
        }
      } catch (e) {
        // failed to check, assume guest
      } finally {
        if (mounted) setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  if (checking) return null; // or <FastLoader />
  return <Homepage />;
}

// Wallets configuration
const wallets = [
  inAppWallet({
    auth: { options: ['email', 'google'] },
  }),
  createWallet('io.metamask'),
];

function AppContent() {
  const location = useLocation();
  const lenisRef = useRef<any>(null);
  const [hasEntered, setHasEntered] = useState(false);

  /* 
     Determining when to enable Lenis:
     - Must have entered the portal (hasEntered).
     - Must NOT be in dashboard or login (isDashboard).
  */
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login');
  const shouldEnableLenis = hasEntered && !isDashboard;

  // Manage Lenis instance lifecycle
  useEffect(() => {
    if (!shouldEnableLenis) {
      // Ensure clean state if we switch to dashboard or haven't entered
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      document.documentElement.classList.remove('scrolling');
      document.body.classList.remove('scrolling');
      return;
    }

    const lenis = initSmoothScroll();
    lenisRef.current = lenis;

    // content-visibility optimization if needed, or browser scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    return () => {
      if (lenis) {
        lenis.destroy();
      }
      lenisRef.current = null;
    };
  }, [shouldEnableLenis]);

  // Scroll to top on route change
  // Scroll to anchor or top on route change
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.slice(1);

      const scrollToElement = () => {
        const element = document.getElementById(targetId);
        if (element) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(element, { offset: -120 });
          } else {
            // Fallback if Lenis isn't ready or active
            const y = element.getBoundingClientRect().top + window.scrollY - 120;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
          return true;
        }
        return false;
      };

      // Attempt scroll immediately and retry for dynamic content/lazy loading
      // Extended retries to handle potentially slow loading About page components
      if (!scrollToElement()) {
        const retries = [100, 300, 500, 1000, 2000, 3000];
        retries.forEach(delay => setTimeout(scrollToElement, delay));
      }
    } else {
      // Handle Scroll to Top
      const scrollToTop = () => {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo(0, 0);
        }
      };

      requestAnimationFrame(() => {
        scrollToTop();
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <div className="min-h-screen text-white relative">
      <AnimatePresence mode="wait">
        {!hasEntered && !isDashboard && (
          <PortalScreen key="portal" onEnter={() => setHasEntered(true)} />
        )}
      </AnimatePresence>

      {(hasEntered || isDashboard) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          {!isDashboard && (
            <>
              {/* Premium blurred radial gradient background for Landing */}
              <LivingBlueprint />
              <Navigation />
              <AudioPlayer />
              <BackToTop />
            </>
          )}

          <Suspense fallback={<FastLoader />}>
            <Routes>
              {/* Landing Pages */}
              <Route path="/" element={<RootRedirectOrLanding />} />
              <Route path="/home" element={<Homepage />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              {/* Redirect open-beta to join-waitlist or use WaitlistPage directly */}
              <Route path="/open-beta" element={<Navigate to="/join-waitlist" replace />} />
              <Route path="/waitlist" element={<Navigate to="/join-waitlist" replace />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />

              {/* Access & Referral Routes */}
              <Route path="/access" element={<AccessGatePage />} />
              <Route path="/join-waitlist" element={<WaitlistPage />} />
              <Route path="/ref/:code" element={<ReferralHandler />} />

              {/* App Pages */}
              <Route
                path="/login"
                element={
                  <AccessGuard>
                    <LoginPage />
                  </AccessGuard>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="my-docs" element={<MyDocs />} />
                <Route path="mint-doc" element={<MintDocPage />} />
                <Route path="settings" element={<Settings />} />
                <Route path="complete-profile" element={<CompleteProfileForm />} />
                <Route path="my-docs/:tokenId/view" element={<DocView />} />
                <Route path="my-docs/:tokenId/edit" element={<EditDocPage />} />
                <Route path="my-docs/:tokenId/history" element={<DocHistory />} />
                <Route path="admin" element={<AdminPanelPage />} />
              </Route>
            </Routes>
          </Suspense>
        </motion.div>
      )}
    </div>
  );
}

function App() {
  return (
    <ThirdwebProvider>
      <DocsProvider>
        <AutoConnect client={client} wallets={wallets} />
        <Router future={{ v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </DocsProvider>
    </ThirdwebProvider>
  );
}

export default App;