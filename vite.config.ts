// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import federation from "@originjs/vite-plugin-federation";
// // import tailwindcss from "tailwindcss";
// // import autoprefixer from "autoprefixer";
// // import * as dotenv from "dotenv";

// // dotenv.config();

// // const BASE_URL = JSON.stringify(process.env.VITE_HOST)?.replace(/"/g, "");

// export default defineConfig({
//   plugins: [
//     react(),
//     federation({
//       name: "app",
//       filename: "remoteEntry.js", // Add this line
//       exposes: {
//      "./App": "./src/App",
//       },
//       remotes: {
//       remoteApp: "http://localhost:3001/assets/remoteEntry.js",
//       },
//       shared: ["react", "react-dom", "@reduxjs/toolkit", "react-redux"],
//     }),
//   ],
//   css: {
//     // postcss: {
//     //   plugins: [tailwindcss(), autoprefixer()],
//     // },
//   },
//   server: {
//     port: 4173, // Make sure this matches your remote URL
//     cors: {
//       origin: "*",
//     },
//   },
//   build: {
//     target: "es2022",
//   },
// });


import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "hostApp",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App",
      },
      remotes: {
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^19.2.0"
        } as any,
        "react-dom": {
          singleton: true,
          requiredVersion: "^19.2.0"
        } as any,
        "@reduxjs/toolkit": {
          singleton: true
        } as any,
        "react-redux": {
          singleton: true
        } as any
      }
    }),
  ],
  server: {
    port: 4173,
    cors: true
  },
  preview: {
    port: 4173,
    cors: true
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  }
});