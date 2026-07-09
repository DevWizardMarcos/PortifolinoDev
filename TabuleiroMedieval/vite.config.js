import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'three-addons',
              test: /node_modules[\\/]three[\\/]examples[\\/]jsm/,
              priority: 3,
            },
            {
              name: 'three-core',
              test: /node_modules[\\/]three/,
              priority: 2,
              maxSize: 450 * 1024,
            },
            {
              name: 'animation-vendor',
              test: /node_modules[\\/]gsap/,
              priority: 2,
            },
          ],
        },
      },
    },
  },
})
