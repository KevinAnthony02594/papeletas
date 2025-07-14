// vite.config.js (DESPUÉS)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // La sección css y plugins se mantienen igual

  plugins: [react()],
})