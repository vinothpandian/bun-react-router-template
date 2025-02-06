import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const resolve =
  process.env.NODE_ENV === "development"
    ? undefined
    : {
        alias: {
          "react-dom/server": "react-dom/server.node",
        },
      };

export default defineConfig(({ isSsrBuild }) => ({
  build: {
    rollupOptions: isSsrBuild
      ? {
          input: "./server/app.ts",
        }
      : undefined,
  },
  plugins: [reactRouter(), tsconfigPaths()],
  resolve,
}));
