import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThirdwebProvider, useActiveAccount, AutoConnect } from 'thirdweb/react';
import { createWallet, inAppWallet } from 'thirdweb/wallets';
import { client } from './lib/thirdweb';
import { DocsProvider } from "./components/contexts/DocsContext";

// Static Imports for Instant Load
import LoginPage from './components/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DashboardHome from './components/UI/dashboard/content/DashboardHome';

// Keep heavy sub-pages lazy
const MyDocs = lazy(() => import('./components/UI/dashboard/content/MyDocs'));
// const Settings = lazy(() => import('./components/UI/dashboard/content/Settings'));
import Settings from './components/UI/dashboard/content/Settings'; // Make Settings eager too for smoothness
const CompleteProfileForm = lazy(() => import('./components/UI/dashboard/content/CompleteProfileForm'));
const MintDocPage = lazy(() => import('./components/UI/dashboard/content/MintDocPage'));
const DocView = lazy(() => import('./components/UI/dashboard/content/DocView'));
const EditDocPage = lazy(() => import('./components/UI/dashboard/content/EditDocPage'));
const DocHistory = lazy(() => import('./components/UI/dashboard/content/DocHistory'));
const AdminPanelPage = lazy(() => import('./pages/AdminPanelPage'));
const AccessGuard = lazy(() => import('./components/AccessGuard'));

// Wallets
const wallets = [
    inAppWallet({
        auth: { options: ['email', 'google'] },
    }),
    createWallet('io.metamask'),
];

// Protected Route Inner
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const account = useActiveAccount();
    const location = useLocation();
    if (!account) {
        const next = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?next=${next}`} replace />;
    }
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

const DashboardApp = () => {
    return (
        <ThirdwebProvider>
            <DocsProvider>
                <AutoConnect client={client} wallets={wallets} />
                <DashboardLayout>
                    <Routes>
                        <Route
                            path="/login"
                            element={
                                <Suspense fallback={null}>
                                    <AccessGuard><LoginPage /></AccessGuard>
                                </Suspense>
                            }
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Suspense fallback={null}>
                                        <DashboardPage />
                                    </Suspense>
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
                        {/* If we land here but path is /something-else, redirect to dashboard or login */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </DashboardLayout>
            </DocsProvider>
        </ThirdwebProvider>
    );
};

export default DashboardApp;
