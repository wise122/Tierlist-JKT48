import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 48, 128];
const svgPath = join(__dirname, '../public/extension/icon.svg');
const svgBuffer = readFileSync(svgPath);

async function generateIcons() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(__dirname, `../public/extension/icon${size}.png`));
  }
}

generateIcons().catch(console.error); 