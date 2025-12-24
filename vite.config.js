import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

// Only enable PWA in production builds, and make it optional
const plugins = [react()]

// Conditionally add PWA plugin (can be disabled if causing issues)
if (process.env.ENABLE_PWA !== 'false') {
  plugins.push(
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png'],
      manifest: {
        name: 'WEsolucions',
        short_name: 'WEsolucions',
        description: 'Dropshipping Management Platform',
        theme_color: '#0071ce',
        icons: [
          {
            src: 'favicon.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: []
      },
      devOptions: {
        enabled: false
      }
    })
  )
}

export default defineConfig({
  plugins,
  base: '/',   // Use root path for Vercel deployment
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
