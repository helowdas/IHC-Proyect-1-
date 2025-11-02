import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Config de build para generar un bundle IIFE del visor (export-viewer)
// Salida en public/ para poder servirlo y empaquetarlo fácilmente
export default defineConfig({
  plugins: [
    react(),
    // Procesa @import 'tailwindcss' y @theme en src/index.css para el viewer
    tailwindcss(),
  ],
  // Asegura DCE (dead code elimination) de React reemplazando process.env.NODE_ENV en build time
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env': '{}',
    global: 'window',
  },
  build: {
    lib: {
      entry: 'src/export-viewer.jsx',
      name: 'CraftRenderer',
      formats: ['iife'],
      fileName: () => 'craft-renderer-bundle.js',
    },
    outDir: 'public',
    emptyOutDir: false, // no borrar otros archivos del directorio public
    rollupOptions: {
      treeshake: true,
      external: [], // incluir dependencias dentro del bundle
      output: {
        inlineDynamicImports: true,
        // Asegura un nombre predecible para el CSS y nombres con hash para assets
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || '';
          const ext = name.split('.').pop();
          if (ext === 'css') return 'craft-renderer-bundle.css';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
  },
});
