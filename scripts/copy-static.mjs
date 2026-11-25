import { cp, copyFile, readdir } from 'node:fs/promises';

await cp('image', 'dist/image', { recursive: true });
for (const file of await readdir('.')) {
  if (file.startsWith('CV - ') && file.endsWith('.pdf')) await copyFile(file, `dist/${file}`);
}
