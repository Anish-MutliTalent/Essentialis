// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useActiveAccount } from 'thirdweb/react';
import { DocsProvider } from "./components/contexts/DocsContext";
import { useEffect } from 'react';

// Dashboard content components
import DashboardHome from './components/UI/dashboard/content/DashboardHome';
import MyDocs from './components/UI/dashboard/content/MyDocs';
import Settings from './components/UI/dashboard/content/Settings';
import CompleteProfileForm from './components/UI/dashboard/content/CompleteProfileForm';
import MintDocPage from './components/UI/dashboard/content/MintDocPage';
import DocView from './components/UI/dashboard/content/DocView';
import EditDocPage from './components/UI/dashboard/content/EditDocPage';
import DocHistory from './components/UI/dashboard/content/DocHistory';

// ProtectedRoute component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const account = useActiveAccount();
  const location = useLocation();
  if (!account) {
    // Preserve where the user tried to go via `next` query param
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <>{children}</>;
};

// No localStorage usage for lastPath per new flow; redirects use `next` query param.

function AppContent() {
  useNavigate();
  return (
    <div className="min-h-screen bg-black">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          >
            {/* Nested Routes - these will render inside DashboardPage's <Outlet /> */}
            <Route index element={<DashboardHome />} />
            <Route path="my-docs" element={<MyDocs />} />
            <Route path="mint-doc" element={<MintDocPage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="complete-profile" element={<CompleteProfileForm />} />
            <Route path="my-docs/:tokenId/view" element={<DocView />} />
            <Route path="my-docs/:tokenId/edit" element={<EditDocPage />} />
            <Route path="my-docs/:tokenId/history" element={<DocHistory />} />
          </Route>
          {/* Redirect root to login if no lastPath */}
          <Route path="/" element={<RootRedirect />} />
        </Routes>
    </div>
  );
}

// RootRedirect component: decides where to send users when they hit '/'
function RootRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
  let mounted = true;
  console.debug('RootRedirect mounted');
  (async () => {
      try {
        const res = await fetch('/api/auth/status', { method: 'GET', credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.logged_in) {
            const lastPath = localStorage.getItem('lastPath');
      console.debug('RootRedirect auth status: logged_in=true, lastPath=', lastPath);
            if (lastPath && lastPath !== '/' && lastPath !== '/login') {
              navigate(lastPath, { replace: true });
              return;
            }
            navigate('/dashboard', { replace: true });
            return;
          }
        }
      } catch (e) {
        console.warn('RootRedirect auth check failed', e);
      }
      if (mounted) navigate('/login', { replace: true });
    })();
    return () => { mounted = false; };
  }, [navigate]);

  return null;
}

function App() {
  return (
    <DocsProvider>
      <Router>
        <AppContent />
      </Router>
    </DocsProvider>
  );
}

export default App;