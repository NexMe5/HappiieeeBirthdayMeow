import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // relative paths, so the built site works on Vercel, Netlify, GitHub Pages or any sub-folder
  base: "./",
  server: { host: true }, // lets you open the dev server on your phone over the same Wi-Fi
});
