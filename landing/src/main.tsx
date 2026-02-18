import './polyfills';
import { StrictMode } from 'react';

// --- Conditional COOP/COEP Management ---
const path = window.location.pathname;
const isSecureRoute = path.startsWith('/dashboard');
const isPublicAuthRoute = path.startsWith('/login') || path.startsWith('/access') || path.startsWith('/ref') || path === '/';

if (isSecureRoute) {
  // We need SharedArrayBuffer for the Dashboard (Media Viewer, etc.)
  // Load coi-serviceworker to enforce COOP/COEP headers
  if (!window.sessionStorage.getItem('coi_loaded')) {
    const script = document.createElement('script');
    script.src = '/coi-serviceworker.min.js';
    script.async = true;
    document.head.appendChild(script);
    window.sessionStorage.setItem('coi_loaded', 'true');
    console.log("🔒 Securing Dashboard Context (COOP/COEP enabled)");
  }
} else if (isPublicAuthRoute) {
  // We need unrestricted access for OAuth Popups (Google Login)
  // Unregister any existing service worker that might be enforcing strict headers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      let detached = false;
      for (let registration of registrations) {
        // Only unregister if it's likely our COI worker (or blanket unregister to be safe for auth)
        // We log it to verify
        console.log('🔓 Unregistering Service Worker for Auth Flow:', registration);
        registration.unregister();
        detached = true;
      }
      if (detached) {
        window.sessionStorage.removeItem('coi_loaded');
        // Optional: Reload to ensure clean state if SW was just removed? 
        // Usually unregister takes effect on next page load, but for OAuth popup opening from this page, it should be fine instantly if the page isn't controlled.
        // Force reload might be jarring, lets try without first.
        console.log("Auth context cleaned.");
      }
    });
  }
}


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThirdwebProvider } from 'thirdweb/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThirdwebProvider>
      <App />
    </ThirdwebProvider>
  </StrictMode>
);
