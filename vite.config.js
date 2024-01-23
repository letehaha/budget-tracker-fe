import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";

import tailwind from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    plugins: [vue(), svgLoader()],
    server: {
      port: process.env.PORT,
      host: process.env.HOST,
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
        {
          find: "shared-types",
          replacement: path.resolve(__dirname, "backend/shared-types"),
        },
        {
          find: "@tests",
          replacement: path.resolve(__dirname, "tests"),
        },
      ],
    },
    test: {
      globals: true,
      include: ["src/**/?(*.)+(spec|test).[jt]s?(x)"],
      environment: "jsdom",
      watch: false,
    },
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/resources/index.scss";',
        },
      },
    },
  });
};
