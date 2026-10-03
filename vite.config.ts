import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          const norm = id.replace(/\\/g, "/");
          if (/\/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|@remix-run\/router)\//.test(norm)) {
            return "react-vendor";
          }
          if (/\/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(norm)) {
            return "motion-vendor";
          }
          return "vendor";
        },
      },
    },
  },
}));
