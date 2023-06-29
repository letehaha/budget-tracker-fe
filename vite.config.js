import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgLoader from 'vite-svg-loader';
import path from 'path';

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };

  return defineConfig({
    plugins: [
      react(),
      svgLoader(),
    ],
    server: {
      port: process.env.PORT,
      host: process.env.HOST,
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
        {
          find: 'shared-types',
          replacement: path.resolve(__dirname, 'shared-types'),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "./src/styles/resources/index.scss";',
        },
      },
    },
  });
};
