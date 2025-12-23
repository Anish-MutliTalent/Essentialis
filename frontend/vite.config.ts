import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
        name: 'configure-specific-headers',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url?.includes('/dashboard/my-docs/')) {
              res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
              res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            }
            if (req.url?.includes('/zetajs/')) {
              res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
              res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
            }
            next();
          });
        },
      },
    ],
    optimizeDeps: {
      include: ['@metamask/jazzicon'],
      exclude: ['@pdftron/webviewer'],
    },
    ssr: {
    noExternal: ['@metamask/jazzicon', '@pdftron/webviewer'],
    },
    server: {
      port: 5173, // Your frontend port
      proxy: {
        // Proxy API requests to Flask backend
        '/api': { // Match requests starting with /api
          target: 'http://127.0.0.1:5000', // Your backend address
          changeOrigin: true, // Needed for virtual hosted sites
          rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix before sending to backend
          secure: false, // Allow proxying to HTTP backend
        }
      },
    }
})
