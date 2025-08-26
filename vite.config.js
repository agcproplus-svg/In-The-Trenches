import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Update base path for GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/in-the-trenches/'
})
