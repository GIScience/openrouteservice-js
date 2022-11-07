import { fileURLToPath, URL } from 'node:url'

import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    istanbul({
      include: ['src/*', 'dev_app/*'],
      cypress: true,
      exclude: ['node_modules', '**/__test__/**'],
      extension: [ '.js', '.ts', '.vue' ],
      requireEnv: true
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  esbuild: {
    minify: true
  },
  server: {
    fs: {
      allow: [resolve(__dirname, ''), resolve(__dirname, 'src')]
    },
    hmr: false  // hot module reload pushes new content as new file with timestamp which makes breakpoints useless
  },
  build: {
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      }
    },
    lib: {
      formats: ['cjs', 'es', 'umd'],
      entry: resolve(__dirname, 'src/index.js'),
      name: 'OrsJsClient', // the proper extensions will be added
      fileName: 'ors-js-client'
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
