import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      allow: [
        // Allow serving files from the project root and node_modules
        path.resolve(__dirname),
        path.resolve(__dirname, '../node_modules/@fontsource/roboto/files')
      ]
    }
  }
})