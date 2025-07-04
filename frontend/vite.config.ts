import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      "/api": {
        target: 'https://bun-project.fly.dev',
        changeOrigin: true
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dir, "./src"),
    },
  },
})
