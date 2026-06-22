import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import dotenv from "dotenv";

dotenv.config();
export default defineConfig({
  plugins: [react()],

  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    setupFiles: ["./src/test/setup.ts"],

    server: {
      deps: {
        inline: ["next-auth", "next"],
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      "next/server": path.resolve(
        __dirname,
        "./node_modules/next/dist/server/web/globals.js"
      ),
    },
  },
});