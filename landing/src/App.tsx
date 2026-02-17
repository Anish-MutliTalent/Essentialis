import { Suspense, lazy, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import PortalScreen from './components/PortalScreen';
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

// Separate Lazies
const LandingApp = lazy(() => import('./LandingApp'));
const DashboardApp = lazy(() => import('./DashboardApp'));

// Inner Component to use useLocation
function AppContent() {
  const location = useLocation();
  const [hasEntered, setHasEntered] = useState(false);
  const [appReady, setAppReady] = useState(false);

  // Determines which app *should* be active based on URL
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/login');
  const targetBundle = isDashboard ? 'dashboard' : 'landing';

  useEffect(() => {
    // Preload based on current requirement
    let preloadPromise;
    if (targetBundle === 'landing') {
      preloadPromise = import('./LandingApp');
    } else {
      preloadPromise = import('./DashboardApp');
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

      {hasEntered && (
        <Suspense fallback={<FastLoader />}>
          <Routes>
            {/* Define explicit routes for Dashboard App */}
            <Route path="/login" element={<DashboardApp />} />
            <Route path="/dashboard/*" element={<DashboardApp />} />

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
    <Router future={{ v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
}

export default App;