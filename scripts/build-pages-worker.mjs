import { build } from 'esbuild';

await build({
  entryPoints: ['public/_worker.js'],
  outfile: 'out/_worker.js',
  bundle: true,
  format: 'esm',
  platform: 'browser',
  external: ['node:buffer'],
  target: 'es2022',
});
