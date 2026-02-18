import { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// Static imports for things we WANT ready immediately upon "Enter"
import Navigation from './components/Navigation';
import LivingBlueprint from './components/LivingBlueprint';
import AudioPlayer from './components/AudioPlayer';
import BackToTop from './components/BackToTop';

// Static Pages for instant render
import Homepage from './pages/Homepage';
import About from './pages/About';
import Pricing from './pages/Pricing';
import Documentation from './pages/Documentation';
import Contact from './pages/Contact';

// Keep less visited pages lazy if desired, or make them all static since this bundle is background loaded
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const AccessGatePage = lazy(() => import('./pages/AccessGatePage'));
const WaitlistPage = lazy(() => import('./pages/WaitlistPage'));
const ReferralHandler = lazy(() => import('./pages/ReferralHandler'));

// Re-implement the root redirector without Thirdweb calls
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initSmoothScroll } from './lib/lenis';

function RootRedirectOrLanding() {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                // Simple fetch check, no heavy SDK
                const res = await fetch('/api/auth/status', { method: 'GET', credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.logged_in && mounted) {
                        // Redirect to dashboard -> Triggers App.tsx to switch to DashboardApp
                        navigate('/dashboard', { replace: true });
                        return;
                    }
                }
            } catch (e) {
                // If 401 or network error, just ignore - user is guest
            } finally {
                if (mounted) setChecking(false);
            }
        })();
        return () => { mounted = false; };
    }, [navigate]);

    if (checking) return null;
    return <Homepage />;
}

const LandingApp = () => {
    // Initialize Smooth Scroll
    useEffect(() => {
        const lenis = initSmoothScroll();
        return () => {
            lenis.destroy();
        };
    }, []);

    return (
        <>
            <LivingBlueprint />
            <Navigation />
            <AudioPlayer />
            <BackToTop />

            <Routes>
                <Route path="/" element={<RootRedirectOrLanding />} />
                <Route path="/home" element={<Homepage />} />
                <Route path="/about" element={<About />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/open-beta" element={<Navigate to="/join-waitlist" replace />} />
                <Route path="/waitlist" element={<Navigate to="/join-waitlist" replace />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/access" element={<AccessGatePage />} />
                <Route path="/join-waitlist" element={<WaitlistPage />} />
                <Route path="/ref/:code" element={<ReferralHandler />} />

                {/* Fallback for anything else not caught */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default LandingApp;
