import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills({
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      protocolImports: true,
    }),
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
    commonjsOptions: {
      transformMixedEsModules: true,
    },
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
    include: ['tweetnacl', 'tweetnacl-util'],
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
