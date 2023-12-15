import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig(() => {
  return {
    base: 'datart',
    server: {
      port: 3000,
      open: true,
      https: true,
    },
    build: {
      outDir: 'build',
      assetsInclude: ['**/*.woff2'],
    },
    plugins: [
      react(),
      basicSsl(),
    ],
  };
});
