import { resolve } from 'path';

export default {
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        it: resolve(__dirname, 'it.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        privacyIt: resolve(__dirname, 'privacy-it.html'),
      },
    },
  },
};
