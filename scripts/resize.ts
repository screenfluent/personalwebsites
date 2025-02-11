import sharp from 'sharp';

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
    await Bun.write(outputDir, '');  // Create directory if it doesn't exist
    await Bun.write(thumbnailsDir, '');  // Create directory if it doesn't exist
    
    const files = await Bun.file(sourceDir).list();
    
    for (const file of files) {
      if (file.match(/\.(jpg|jpeg|png)$/i)) {
        const baseName = file.split('.')[0];
        console.log(`Processing ${file}...`);
        
        // Create full-size version
        await sharp(Bun.file(Bun.join(sourceDir, file)))
          .resize(FULL_WIDTH, FULL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 85,
            mozjpeg: true
          })
          .toFile(Bun.join(outputDir, `${baseName}.jpeg`));

        // Create thumbnail version
        await sharp(Bun.file(Bun.join(sourceDir, file)))
          .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
            fit: 'cover',
            position: 'top'
          })
          .jpeg({ 
            quality: 80,  // Slightly more compressed for thumbnails
            mozjpeg: true
          })
          .toFile(Bun.join(thumbnailsDir, `${baseName}.jpeg`));

        const fullStats = await sharp(Bun.join(outputDir, `${baseName}.jpeg`)).metadata();
        const thumbStats = await sharp(Bun.join(thumbnailsDir, `${baseName}.jpeg`)).metadata();
        
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
