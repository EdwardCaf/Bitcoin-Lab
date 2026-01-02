import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Enable minification
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // Core React libraries - rarely change
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Animation library - separate chunk
          'framer': ['framer-motion'],
          // Icons - separate chunk (large library)
          'icons': ['lucide-react'],
          // Drag and drop - only needed for specific lessons
          'dnd': ['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities'],
        },
      },
    },
    // Increase warning threshold since we have lazy loading
    chunkSizeWarningLimit: 600,
  },
})
