import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],

      include: ['src/components/**', 'src/hooks/**', 'src/lib/**'],

      exclude: [
        '**/*.d.ts',
        'src/types/**',
        'src/app/**/layout.tsx',
        'src/app/**/page.tsx',
        'src/app/api/**',
        'src/lib/fonts.ts',
        'src/lib/metadata.ts',
        'src/lib/firebase/**',
        'src/context/**',
        'src/components/providers/**',
        'src/hooks/useAuth.ts',
        'src/components/mainLayout/**',
      ],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
