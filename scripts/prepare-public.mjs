import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const publicDir = resolve(root, 'public');

if (existsSync(publicDir)) {
  rmSync(publicDir, { recursive: true, force: true });
}

mkdirSync(publicDir, { recursive: true });

const pathsToCopy = [
  'index.html',
  'css',
  'js',
  'pages',
  'projects',
];

for (const path of pathsToCopy) {
  const source = resolve(root, path);
  if (!existsSync(source)) {
    continue;
  }

  const destination = resolve(publicDir, path);
  cpSync(source, destination, { recursive: true });
}

console.log('Prepared Vercel output in public/.');
