import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/usuarios': {
          target: env.VITE_BACKEND_USUARIOS_URL || 'http://localhost:8081',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api\/usuarios/, '/api/v1'),
        },
        '/api/productos': {
          target: env.VITE_BACKEND_PRODUCTOS_URL || 'http://localhost:8082',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api\/productos/, '/api/v1'),
        },
        '/images/productos': {
          target: env.VITE_BACKEND_PRODUCTOS_URL || 'http://localhost:8082',
          changeOrigin: true,
        },
        '/api/ventas': {
          target: env.VITE_BACKEND_VENTAS_URL || 'http://localhost:8083',
          changeOrigin: true,
          rewrite: (url) => url.replace(/^\/api\/ventas/, '/api/v1'),
        },
      },
    },
  };
});
