import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'es5',
  format: ['cjs'],
  // format: ['iife', 'cjs']
});
