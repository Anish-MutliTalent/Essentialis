import react from "@vitejs/plugin-react";
import tailwind from "tailwindcss";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  publicDir: "./public",
  base: "./",
  css: {
    postcss: {
      plugins: [tailwind()],
    },
  },
});