import { cp, copyFile, readdir } from 'node:fs/promises';

await cp('image', 'dist/image', { recursive: true });
await copyFile('CNAME', 'dist/CNAME');
for (const file of await readdir('.')) {
  if (file.startsWith('CV - ') && file.endsWith('.pdf')) await copyFile(file, `dist/${file}`);
}
