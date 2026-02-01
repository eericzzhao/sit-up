import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import manifest from "./manifest.json";
import { resolve } from "path";

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    rollupOptions: {
      // We must explicitly include the offscreen page here
      input: {
        offscreen: resolve(__dirname, "offscreen.html"),
      },
    },
  },
});
