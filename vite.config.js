import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

function coepCoopHeaders() {
  return {
    name: "configure-response-headers",
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [sveltekit(), coepCoopHeaders()],
  optimizeDeps: {
    exclude: ["@sqlite.org/sqlite-wasm"],
  },
});
