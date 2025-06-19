import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
import { VitePWA } from 'vite-plugin-pwa'
import replace from '@rollup/plugin-replace'
import eslintPlugin from 'vite-plugin-eslint'
import svgLoader from 'vite-svg-loader'
import dns from 'dns'
import * as path from 'path'
import { fileURLToPath, URL } from 'node:url'

dns.setDefaultResultOrder('verbatim')

const pwaOptions = {
  mode: 'development',
  base: '/',
  includeAssets: ['favicon.ico'],
  devOptions: {
    enabled: process.env.SW_DEV === 'false',
    type: 'module',
    navigateFallback: 'index.html',
  },
}

const replaceOptions = {
  __DATE__: new Date().toISOString(),
  preventAssignment: true,
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    watch: {
      usePolling: true,
    },
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
      defaultImport: 'url',
    }),
  ],
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "${path.resolve(__dirname, 'node_modules/quasar/src/css/variables.sass')}";`,
  //       // additionalData: `@import "${path.resolve(__dirname, 'src/styles/quasar-variables.scss')}"`,
  //     },
  //   }
  // },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
