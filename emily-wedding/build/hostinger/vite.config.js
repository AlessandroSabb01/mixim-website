import { defineConfig } from 'vite';

// Static site: images and videos live in public/ and are copied as they are.
export default defineConfig({
  base: './',
  build: { outDir: 'dist', assetsInlineLimit: 0 }
});
