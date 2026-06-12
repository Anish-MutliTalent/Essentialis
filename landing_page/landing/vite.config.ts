import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Flask backend that serves the public/access routes. Overridable via
  // VITE_API_PROXY for non-local backends.
  const apiTarget = env.VITE_API_PROXY || "http://127.0.0.1:5000";

  return {
    plugins: [react()],
    publicDir: "./public",
    base: "./",
    css: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    server: {
      proxy: {
        // Match the old app's setup: forward /api/* to the backend and strip
        // the /api prefix, since Flask serves the routes without it
        // (e.g. frontend /api/public/stats -> backend /public/stats).
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
          secure: false,
        },
      },
    },
  };
});
