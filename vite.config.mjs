import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'
import eslintPlugin from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'
import dns from 'dns'
import * as path from 'path' // Você já tem 'path' importado, o que é ótimo!
import { fileURLToPath, URL } from 'node:url' // Importe URL e fileURLToPath para aliases com Vite

dns.setDefaultResultOrder('verbatim')

const pwaOptions = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.ico'],
  devOptions: {
    enabled: process.env.SW_DEV === 'false',
    /* when using generateSW the PWA plugin will switch to classic */
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
    // proxy: {
    //   '/development': {
    //     target: 'https://api.ncmhelper.com.br',
    //     changeOrigin: true,
    //     secure: false,
    //     rewrite: (path) => path.replace(/^\/development/, ''),
    //   },
    // },
  },
  preview: {
    port: 8080,
  },
  build: {
    sourcemap: process.env.SOURCE_MAP === 'true',
  },
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    quasar({
      sassVariables: path.resolve(
        __dirname,
        'src/styles/quasar-variables.scss'
      ),
    }),
    VitePWA(pwaOptions),
    replace(replaceOptions),
    eslintPlugin({
      exclude: [/virtual:/, /node_modules/],
    }),
    svgLoader({
      defaultImport: 'url', // or 'raw'
    }),
  ],
  // ADICIONE ESTA SEÇÃO para configurar o alias '@'
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
