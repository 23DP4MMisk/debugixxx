import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Node-server build (Railway / Render / Fly / VPS).
// Output: .output/  →  start with `node .output/server/index.mjs`
export default defineConfig({
  server: {
    port: Number(process.env.PORT ?? 3000),
    host: true,
  },
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      target: "node-server",
      customViteReactPlugin: true,
    }),
    viteReact(),
  ],
});
