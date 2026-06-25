import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Polling reliably catches file changes on macOS / editor saves where
    // native FS events are sometimes missed, which otherwise breaks HMR.
    watch: {
      usePolling: true,
      interval: 150,
    },
    // Prevent the browser from serving stale dev assets.
    headers: {
      'Cache-Control': 'no-store',
    },
  },
})
