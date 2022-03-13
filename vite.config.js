import { defineConfig } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

import autoprefixer from 'autoprefixer';

// import flattenTemplateStrings from './vite/plugin-flatten-template-strings';
import plainSvg from './vite/plugin-plain-svg';
import manifest from './src/pwa/manifest.json';

export default defineConfig({
  clearScreen: false,
  server: {
    port: 8080,
  },
  plugins: [
    createVuePlugin(),
    // flattenTemplateStrings(),
    plainSvg({
      optimize: true,
      svgoConfig: {
        plugins: [
          { removeTitle: true },
          { removeViewBox: false },
          { convertShapeToPath: true },
          { removeAttrs: { attrs: ['data-name'] } },
          { inlineStyles: { onlyMatchedOnce: false } },
        ],
      },
    }),
    VitePWA({ manifest }),
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
      vue: 'vue/dist/vue.js',
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
      plugins: [autoprefixer],
    },
  },
});
