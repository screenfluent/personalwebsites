import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import path from 'path';

const THUMBNAIL_WIDTH = 710;

async function resizeImages() {
  const sourceDir = 'screenshots-original';
  const outputDir = 'static/thumbnails';

  try {
    // Upewnij się że folder istnieje
    await mkdir(outputDir, { recursive: true });
    
    const files = await readdir(sourceDir);
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const baseName = path.parse(file).name;
        console.log(`Processing ${file}...`);
        
        const pipeline = sharp(path.join(sourceDir, file))
          .resize(THUMBNAIL_WIDTH, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          });

        // Zapisz jako WebP (najlepsza kompresja)
        await pipeline
          .webp({ 
            quality: 80,
            effort: 6  // lepszy effort = lepsza kompresja
          })
          .toFile(path.join(outputDir, `${baseName}.webp`));

        // Zapisz też jako JPG (fallback)
        await pipeline
          .jpeg({ 
            quality: 80,
            mozjpeg: true  // lepsza kompresja
          })
          .toFile(path.join(outputDir, `${baseName}.jpg`));

        // Pokaż rozmiary plików
        const stats = await Promise.all([
          sharp(path.join(outputDir, `${baseName}.webp`)).metadata(),
          sharp(path.join(outputDir, `${baseName}.jpg`)).metadata()
        ]);
        
        console.log(`  WebP: ${(stats[0].size || 0 / 1024).toFixed(1)}KB`);
        console.log(`  JPG: ${(stats[1].size || 0 / 1024).toFixed(1)}KB`);
      }
    }
    
    console.log('✨ All done! Images optimized and converted.');
  } catch (err) {
    console.error('Error:', err);
  }
}

resizeImages();
