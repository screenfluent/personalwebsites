/// <reference types="bun-types" />
import sharp from 'sharp';
import { join } from "path";
import { mkdir, readdir } from "fs/promises";

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
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        // Keep the full domain name by removing only the extension
        const fullDomainName = file.replace(/\.(jpg|jpeg|png)$/i, '');
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
          .toFile(join(outputDir, `${fullDomainName}.webp`));

        await sharp(sourceFile)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .webp({ 
            quality: 80,
            effort: 6
          })
          .toFile(join(thumbnailsDir, `${fullDomainName}.webp`));

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

        const webpStats = await sharp(join(outputDir, `${fullDomainName}.webp`)).metadata();
        const jpegStats = await sharp(join(outputDir, `${fullDomainName}.jpeg`)).metadata();
        
        console.log(`  WebP size: ${((webpStats.size || 0) / 1024).toFixed(1)}KB`);
        console.log(`  JPEG size: ${((jpegStats.size || 0) / 1024).toFixed(1)}KB`);
      }
    }
    
    console.log('✨ All done! Screenshots and thumbnails created in both WebP and JPEG formats.');
  } catch (err) {
    console.error('Error:', err);
  }
}

resizeImages();
