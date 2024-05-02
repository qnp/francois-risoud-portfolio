import path from 'path';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import AutoImport from 'unplugin-auto-import/vite';
import svgLoader from 'vite-svg-loader';

import autoprefixer from 'autoprefixer';

import manifest from './vite/pwa/manifest';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 8080,
  },
  plugins: [
    vue(),
    VitePWA({ manifest }),
    visualizer({
      filename: path.resolve(__dirname, '.report/treemap.html'),
      title: 'Bundle Visualizer – Treemap',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),
    AutoImport({
      dts: path.join(__dirname, 'auto-imports.d.ts'),
      imports: ['vue', 'vue-router', '@vueuse/core'],
    }),
    svgLoader({
      defaultImport: 'raw',
      svgoConfig: {
        plugins: [
          { name: 'removeTitle' },
          { name: 'removeViewBox' },
          { name: 'convertShapeToPath' },
          { name: 'removeAttrs', params: { attrs: ['data-name'] } },
          { name: 'inlineStyles', params: { onlyMatchedOnce: false } },
        ],
      },
    }),
  ],
  root: 'src',
  publicDir: path.resolve(__dirname, 'public'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    chunkSizeWarningLimit: 750,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      stylus: {
        // import these files so that they are available everywhere
        imports: [path.resolve(__dirname, 'src/styles/variables.styl')],
      },
    },
    postcss: {
      plugins: [autoprefixer()],
    },
  },
});
