/// <reference types="bun-types" />
import sharp from 'sharp';
import { join } from "path";
import { mkdir, readdir, stat } from "fs/promises";

const FULL_WIDTH = 1440;
const FULL_HEIGHT = 900;
const THUMBNAIL_WIDTH = 400;  // More appropriate size for grid display
const THUMBNAIL_HEIGHT = 250; // Maintaining the same aspect ratio

async function resizeImages() {
  const sourceDir = 'static/screenshots-original';
  const outputDir = 'static/screenshots';
  const thumbnailsDir = 'static/screenshots/thumbnails';

  try {
    // Create output directories
    await mkdir(outputDir, { recursive: true });
    await mkdir(thumbnailsDir, { recursive: true });
    
    const files = await readdir(sourceDir);
    const existingWebp = new Set((await readdir(outputDir)).filter(f => f.endsWith('.webp')));
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        // Keep the full domain name by removing only the extension
        const fullDomainName = file.replace(/\.(jpg|jpeg|png)$/i, '');
        const targetWebp = `${fullDomainName}.webp`;

        // Skip if WebP version already exists
        if (existingWebp.has(targetWebp)) {
          console.log(`Skipping ${file} (already processed)`);
          continue;
        }

        console.log(`Processing ${file}...`);
        
        // Create full-size version
        const sourceFile = await Bun.file(join(sourceDir, file)).arrayBuffer();
        
        // Create WebP versions
        await sharp(sourceFile)
          .resize(FULL_WIDTH, FULL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .webp({ 
            quality: 85,
            effort: 6  // Higher effort = better compression but slower
          })
          .toFile(join(outputDir, targetWebp));

        await sharp(sourceFile)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .webp({ 
            quality: 80,
            effort: 6
          })
          .toFile(join(thumbnailsDir, targetWebp));

        // Create JPEG fallback versions
        await sharp(sourceFile)
          .resize(FULL_WIDTH, FULL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 85,
            mozjpeg: true
          })
          .toFile(join(outputDir, `${fullDomainName}.jpeg`));

        await sharp(sourceFile)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 80,
            mozjpeg: true
          })
          .toFile(join(thumbnailsDir, `${fullDomainName}.jpeg`));

        // Get actual file sizes from the file system
        const webpStats = await stat(join(outputDir, targetWebp));
        const jpegStats = await stat(join(outputDir, `${fullDomainName}.jpeg`));
        const thumbWebpStats = await stat(join(thumbnailsDir, targetWebp));
        const thumbJpegStats = await stat(join(thumbnailsDir, `${fullDomainName}.jpeg`));
        
        console.log(`  Full WebP: ${(webpStats.size / 1024).toFixed(1)}KB`);
        console.log(`  Full JPEG: ${(jpegStats.size / 1024).toFixed(1)}KB`);
        console.log(`  Thumb WebP: ${(thumbWebpStats.size / 1024).toFixed(1)}KB`);
        console.log(`  Thumb JPEG: ${(thumbJpegStats.size / 1024).toFixed(1)}KB`);
      }
    }
    
    console.log('✨ All done! Only new images were processed.');
  } catch (err) {
    console.error('Error:', err);
  }
}

resizeImages();
