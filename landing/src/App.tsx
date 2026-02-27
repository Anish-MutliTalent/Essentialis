import { Suspense, lazy, useEffect, useState } from 'react';
import { AutoConnect } from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { client } from './lib/thirdweb';
import { AnimatePresence } from 'framer-motion';
import PortalScreen from './components/PortalScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Fast loading component for the transition
const FastLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
    </div>
  </div>
);

// We need manual types for the dynamic imports to work cleanly with variables, 
// but since we are just doing import(), it returns a Promise.

// Static Imports
import DashboardApp from './DashboardApp';

// Separate Lazies
const LandingApp = lazy(() => import('./LandingApp'));
const DevApp = lazy(() => import('./DevApp'));
// const DashboardApp = lazy(() => import('./DashboardApp')); // User requested eager load

// Inner Component to use useLocation
function AppContent() {
  const location = useLocation();

  // Determines which app *should* be active based on URL
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login');
  const isDev = location.pathname.startsWith('/dev');

  // Skip Portal if we are already in the Dashboard/Login flow
  const [hasEntered, setHasEntered] = useState(isDashboard || isDev);
  const [appReady, setAppReady] = useState(false);

  // Preload logic (mostly for LandingApp now since Dashboard is static)
  const targetBundle = isDashboard ? 'dashboard' : 'landing';

  useEffect(() => {
    // Preload based on current requirement
    let preloadPromise;
    if (targetBundle === 'landing') {
      preloadPromise = import('./LandingApp');
    } else {
      // Dashboard is already loaded statically, but we can simulate readiness
      preloadPromise = Promise.resolve();
    }

    preloadPromise
      .then(() => {
        console.log(`[App] ${targetBundle} bundle loaded.`);
        setAppReady(true);
      })
      .catch(err => {
        console.error("Failed to preload app:", err);
        setAppReady(true);
      });
  }, [targetBundle]);

  const handleEnter = () => {
    setHasEntered(true);
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {!hasEntered && (
          <PortalScreen key="portal" onEnter={handleEnter} onAppReady={appReady} />
        )}
      </AnimatePresence>

      {/* AutoConnect handles restoring inAppWallet sessions after hard reloads (like when navigating to MyDocs) */}
      <AutoConnect
        client={client}
        wallets={[
          inAppWallet({
            executionMode: {
              mode: 'EIP7702',
              sponsorGas: true,
            },
            auth: { options: ['email', 'google'] },
          }),
          createWallet('io.metamask'),
        ]}
      />

      {hasEntered && (
        <Suspense fallback={<FastLoader />}>
          <Routes>
            {/* Define explicit routes for Dashboard App */}
            <Route path="/login/*" element={<ErrorBoundary name="DashboardApp-Login"><DashboardApp /></ErrorBoundary>} />
            <Route path="/dashboard/*" element={<ErrorBoundary name="DashboardApp-Dashboard"><DashboardApp /></ErrorBoundary>} />
            <Route path="/dev/*" element={<ErrorBoundary name="DevApp"><DevApp /></ErrorBoundary>} />


            {/* Catch-all for Landing App */}
            <Route path="*" element={<LandingApp />} />
          </Routes>
        </Suspense>
      )}
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <AppContent />
    </Router>
  );
}

export default App;