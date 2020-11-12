import { promises as fs } from 'fs';
import sharp from 'sharp';

const inputFolder = './input';
const outputFolder = './output';
const cropSize = 1000;
const frameSize = 1200;
const white: sharp.RGBA = { r: 255, g: 255, b: 255 };
const extendSize = (frameSize - cropSize) / 2;

(async () => {
  try {
    const files = await fs.readdir(inputFolder);

    for (const file of files) {
      const imageBuffer = await fs.readFile(`${inputFolder}/${file}`);
      const image = sharp(imageBuffer);
      const metadata = await (image.metadata());

      console.log(`Filename: ${file} - ${metadata.width} x ${metadata.height}`);

      await image.resize(cropSize, cropSize, { fit: 'inside', background: white })
        .extend({
          top: extendSize,
          bottom: extendSize,
          left: extendSize,
          right: extendSize,
          background: white
        })
        .withMetadata().toFile(`${outputFolder}/${file}`);
    }
  }
  catch (e) {
    console.log('Oops:', e);
  }
})();
