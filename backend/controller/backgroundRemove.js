const cloudinary = require('cloudinary').v2;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Ensure temp directory exists
const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const removeBackground = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { backgroundColor = '0x00FF00', sensitivity = '0.3', blend = '0.1' } = req.body;

    // Create temporary file paths
    const tempVideoPath = path.join(tempDir, `${Date.now()}_input${path.extname(req.file.originalname)}`);
    const outputVideoPath = path.join(tempDir, `${Date.now()}_output.mp4`);

    // Write the buffer to temporary file
    fs.writeFileSync(tempVideoPath, req.file.buffer);

    // Process video using FFmpeg with multiple filters
    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .videoFilters([
          // Detect edges
          {
            filter: 'edgedetect',
            options: { low: 0.1, high: 0.4 }
          },
          // Remove noise
          {
            filter: 'hqdn3d',
            options: '1.5:1.5:6:6'
          },
          // Enhance contrast
          {
            filter: 'eq',
            options: { contrast: 1.2 }
          },
          // Color-based segmentation (multiple color ranges)
          {
            filter: 'colorkey',
            options: {
              color: backgroundColor,
              similarity: sensitivity,
              blend: blend
            }
          },
          // Additional color ranges
          {
            filter: 'colorkey',
            options: {
              color: '0x87CEEB', // Sky blue
              similarity: '0.3',
              blend: '0.1'
            }
          },
          // Masking and refinement
          {
            filter: 'unsharp',
            options: '5:5:1:5:5:0'
          }
        ])
        .outputOptions([
          '-c:v libx264',        // Use H.264 codec
          '-preset medium',      // Balance between speed and quality
          '-crf 23',            // Quality setting
          '-c:a aac',           // Audio codec
          '-movflags +faststart', // Enable fast start for web playback
          '-pix_fmt yuv420p'    // Ensure compatibility
        ])
        .toFormat('mp4')
        .on('start', () => {
          console.log('Started processing video');
        })
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Video processing finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error:', err);
          reject(err);
        })
        .save(outputVideoPath);
    });

    // Upload to Cloudinary
    const cloudinaryResult = await cloudinary.uploader.upload(outputVideoPath, {
      resource_type: 'video',
      folder: 'background-removed-videos',
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Clean up temporary files
    try {
      fs.unlinkSync(tempVideoPath);
      fs.unlinkSync(outputVideoPath);
    } catch (err) {
      console.error('Error cleaning up temp files:', err);
    }

    res.json({
      success: true,
      video: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        duration: cloudinaryResult.duration
      }
    });

  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
};

module.exports = {
  removeBackground
};