import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' supaya hasil build bisa jalan di GitHub Pages (subfolder repo)
export default defineConfig({ plugins: [react()], base: './' })
