import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Polyfill global for libraries like eventemitter3 used by some web3 libs
    global: 'window',
  },

  plugins: [
    react(),
    {
      name: 'configure-specific-headers',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.includes('/dashboard/my-docs/') || req.url?.includes('/zetajs') || req.url?.includes('/zetaoffice')) {
            res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
            res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          }
          next();
        });
      },
    },
    {
      name: 'html-ext-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // If the URL has no extension and isn't the root, append .html
          if (req.url?.includes('simple') && !req.url.includes('.')) {
            req.url += '.html'
          }
          next()
        })
      }
    },
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['react', 'react-dom', 'react-router-dom', '@metamask/jazzicon'],
  },
  ssr: {
    noExternal: ['@metamask/jazzicon'],
  },
  server: {
    port: 5173,
    hmr: {
      overlay: false,
    },
    proxy: {
      // Proxy API requests to Flask backend
      '/api': { // Match requests starting with /api
        target: 'http://127.0.0.1:5000', // Your backend address
        changeOrigin: true, // Needed for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before sending to backend
        secure: false, // Allow proxying to HTTP backend
      }
    },
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
    },
  },
});
