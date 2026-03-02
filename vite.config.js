

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "hostApp",
      filename: "remoteEntry.js",
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.0.0",
        },
        "@reduxjs/toolkit": {
          singleton: true,
        },
        "react-redux": {
          singleton: true,
        },
      },
    }),
  ],
  define: {
    global: 'globalThis',
  },
  server: {
    port: 5173,
    cors: true,
  },
  preview: {
    port: 4173,
    cors: true,
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});