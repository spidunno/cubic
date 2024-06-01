import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	optimizeDeps: {
		exclude: ["/root/programming/cubic/node_modules/.vite/deps/search-worker-entry.js"]
	},
  plugins: [react()],
})
