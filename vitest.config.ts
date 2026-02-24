import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{js,ts,jsx,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      reporter: ["text", "html"],
      exclude: ["node_modules/", "src/**/*.d.ts"],
    },
  },
  resolve: {
    alias: [
      {
        find: "@/lib/auth",
        replacement: path.resolve(__dirname, "./src/test/mocks/auth.ts"),
      },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});
