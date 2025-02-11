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
        const baseName = file.split('.')[0];
        console.log(`Processing ${file}...`);
        
        // Create full-size version
        const sourceFile = await Bun.file(join(sourceDir, file)).arrayBuffer();
        await sharp(sourceFile)
          .resize(FULL_WIDTH, FULL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 85,
            mozjpeg: true
          })
          .toFile(join(outputDir, `${baseName}.jpeg`));

        // Create thumbnail version
        await sharp(sourceFile)
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 80,  // Slightly more compressed for thumbnails
            mozjpeg: true
          })
          .toFile(join(thumbnailsDir, `${baseName}.jpeg`));

        const fullStats = await sharp(join(outputDir, `${baseName}.jpeg`)).metadata();
        const thumbStats = await sharp(join(thumbnailsDir, `${baseName}.jpeg`)).metadata();
        
        console.log(`  Full size: ${((fullStats.size || 0) / 1024).toFixed(1)}KB`);
        console.log(`  Thumbnail: ${((thumbStats.size || 0) / 1024).toFixed(1)}KB`);
      }
    }
    
    console.log('✨ All done! Screenshots and thumbnails created and optimized.');
  } catch (err) {
    console.error('Error:', err);
  }
}

resizeImages();
