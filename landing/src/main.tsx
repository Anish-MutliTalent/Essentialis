import './polyfills';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThirdwebProvider } from 'thirdweb/react';

// --- FORCE CLEANUP: Remove stale coi-serviceworker ---
// The coi-serviceworker (previously used for SharedArrayBuffer) intercepts ALL
// requests and injects COOP/COEP headers even on /login, blocking OAuth popups.
// Once registered, it persists until explicitly unregistered.
// If we find one on a non-viewer route, we unregister + reload BEFORE mounting React.
async function cleanupAndMount() {
  if ('serviceWorker' in navigator) {
    const isViewerRoute = window.location.pathname.includes('/my-docs');

    if (!isViewerRoute) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      if (registrations.length > 0) {
        console.warn(`🧹 Found ${registrations.length} stale service worker(s). Removing...`);
        await Promise.all(registrations.map(r => r.unregister()));
        console.warn('🧹 Service workers removed. Reloading for clean headers...');
        window.location.reload();
        return; // Don't mount React — page is about to reload
      }
    }
  }

  // Mount React only after confirming no interfering service workers
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThirdwebProvider>
        <App />
      </ThirdwebProvider>
    </StrictMode>
  );
}

cleanupAndMount();
