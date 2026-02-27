import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useActiveAccount, useIsAutoConnecting } from 'thirdweb/react';
import { DocsProvider } from "./components/contexts/DocsContext";

// Static Imports for Instant Load
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardHome from './components/UI/dashboard/content/DashboardHome';

// Keep heavy sub-pages lazy
const MyDocs = lazy(() => import('./components/UI/dashboard/content/MyDocs'));
import Settings from './components/UI/dashboard/content/Settings'; // Make Settings eager too for smoothness
const CompleteProfileForm = lazy(() => import('./components/UI/dashboard/content/CompleteProfileForm'));
const MintDocPage = lazy(() => import('./components/UI/dashboard/content/MintDocPage'));
const DocView = lazy(() => import('./components/UI/dashboard/content/DocView'));
const EditDocPage = lazy(() => import('./components/UI/dashboard/content/EditDocPage'));
const DocHistory = lazy(() => import('./components/UI/dashboard/content/DocHistory'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'));
const AccessGuard = lazy(() => import('./components/AccessGuard'));

// Protected Route Inner
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const account = useActiveAccount();
    const isAutoConnecting = useIsAutoConnecting();
    const location = useLocation();
    const [isInitializing, setIsInitializing] = useState(!account);

    // Give thirdweb auto-connect a moment to start on fresh page loads.
    // Without this, useIsAutoConnecting() returns false on the very first render
    // (before the auto-connect process even begins), causing an immediate
    // redirect to /login after any hard reload.
    useEffect(() => {
        if (account) {
            setIsInitializing(false);
            return;
        }
        const timer = setTimeout(() => setIsInitializing(false), 800);
        return () => clearTimeout(timer);
    }, [account]);

    // Wait for initialization + auto-connect to finish before making a decision
    if (!account && (isInitializing || isAutoConnecting)) {
        return <div className="flex items-center justify-center h-screen text-yellow-400">Connecting Wallet...</div>;
    }

    // Standard access guard logic
    if (!account) {
        console.log("[ProtectedRoute] No account & not auto-connecting, redirecting...");
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }
    console.log("[ProtectedRoute] Account present, rendering children");
    return <>{children}</>;
};

// Wrapper for Lenis in Dashboard (optional, but good for consistency)
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        // Ensure no leftover scroll classes if we switch between apps
        document.documentElement.classList.remove('scrolling');
        document.body.classList.remove('scrolling');
    }, []);
    return <>{children}</>;
}

// Fail-safe Catch-All that checks if we are actually at a valid route
// that the Router failed to match due to nesting/splat issues.
const RouteCatchAll = () => {
    const location = useLocation();
    useEffect(() => {
        console.log("[DashboardApp] CatchAll hit for path:", location.pathname);
    }, [location]);

    if (location.pathname === '/login') {
        return (
            <Suspense fallback={null}>
                <AccessGuard><LoginPage /></AccessGuard>
            </Suspense>
        );
    }

    // Prevent infinite redirect loop if we are already at dashboard root
    if (location.pathname === '/dashboard' || location.pathname === '/dashboard/') {
        return <div>404 - Dashboard Route Not Found (CatchAll)</div>;
    }

    return <Navigate to="/dashboard" replace />;
};

const DashboardApp = () => {
    const location = useLocation();
    const isLogin = location.pathname.startsWith('/login');

    return (
        <DocsProvider>
            <DashboardLayout>
                {isLogin ? (
                    <Routes>
                        <Route
                            index
                            element={
                                <Suspense fallback={<div className="flex items-center justify-center h-screen text-yellow-400">Loading Login...</div>}>
                                    <AccessGuard><LoginPage /></AccessGuard>
                                </Suspense>
                            }
                        />
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                ) : (
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <AccessGuard>
                                        <Suspense fallback={<div className="flex items-center justify-center h-screen text-yellow-400">Loading Dashboard...</div>}>
                                            <DashboardPage />
                                        </Suspense>
                                    </AccessGuard>
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
                        {/* Catch-all relative to /dashboard */}
                        <Route path="*" element={<RouteCatchAll />} />
                    </Routes>
                )}
            </DashboardLayout>
        </DocsProvider>
    );
};

export default DashboardApp;
