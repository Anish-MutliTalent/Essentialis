import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
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
    }
  }
})
