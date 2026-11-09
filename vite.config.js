import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// HEALTH_CHECK_BASE lets the same app build for two places:
//   npm run build       -> served at the root (Vercel)
//   npm run build:site  -> served at theprivacyblueprint.co.uk/health-check/ (inside netlify-site)
export default defineConfig({
  base: process.env.HEALTH_CHECK_BASE || '/',
  plugins: [react()],
})
