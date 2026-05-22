import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  server: {
    allowedHosts: ["host.docker.internal"],
  },
});
