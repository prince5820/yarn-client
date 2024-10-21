import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const isProduction = command === 'build';
  return {
    plugins: [react(), svgr()],
    base: isProduction ? '/assets/' : '/'
  }
});