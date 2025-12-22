import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
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
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp"
      }
    }
})
