import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

function compressDirectory(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      compressDirectory(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      const targetCompressExts = ['.html', '.css', '.js', '.json', '.svg', '.txt', '.xml', '.jpeg', '.jpg', '.png'];

      if (targetCompressExts.includes(ext) && !file.endsWith('.gz')) {
        const fileBuffer = fs.readFileSync(fullPath);
        const gzippedBuffer = zlib.gzipSync(fileBuffer, { level: 9 });
        const gzPath = `${fullPath}.gz`;
        fs.writeFileSync(gzPath, gzippedBuffer);
      }
    }
  }
}

console.log('📦 Generating Gzip pre-compressed (.gz) static assets for dist...');
compressDirectory(distDir);
console.log('✅ Gzip pre-compression completed.');
