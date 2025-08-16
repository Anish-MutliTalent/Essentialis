// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Your global styles

// The client is now typically passed directly to components like ConnectButton,
// or set globally if ThirdwebProvider still uses it like that in v5 for context.
// The documentation snippet shows ThirdwebProvider without client, but ConnectButton taking it.
// Let's assume ThirdwebProvider is mainly for context propagation of chain/wallet state.

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
import { ThirdwebProvider, AutoConnect } from 'thirdweb/react';
import { inAppWallet, createWallet } from 'thirdweb/wallets';
import { client } from "./lib/thirdweb";

const walletsToUse = [
  inAppWallet({
    auth: {
      options: ['email', 'google'], // Enable email & Google login
    },
  }),
  createWallet('io.metamask'),
];

const root = ReactDOM.createRoot(rootElement);

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.parentElement === document.body &&
        node !== document.getElementById("root")
      ) {
        document.body.removeChild(node);
      }
    });
  });
});

observer.observe(document.body, { childList: true });

root.render(
  <React.StrictMode>
    <ThirdwebProvider>
    <AutoConnect client={client} wallets={walletsToUse} />
      <App />
    </ThirdwebProvider>
  </React.StrictMode>
);