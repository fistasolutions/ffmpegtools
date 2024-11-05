const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const cloudinary = require('../lib/cloudinaryConfig')

const BitrateController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const { bitrate } = req.body;

    if (!bitrate || isNaN(bitrate)) {
      return res.status(400).json({ error: 'Invalid bitrate value' });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const inputPath = path.join(uploadsDir, `input_${timestamp}.mp4`);
    const outputPath = path.join(uploadsDir, `output_${timestamp}.mp4`);

    // Save uploaded file
    fs.writeFileSync(inputPath, req.file.buffer);

    // Process video with new bitrate
    
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec('libx264')
        .videoBitrate(bitrate)
        .audioCodec('aac')
        .audioBitrate('128k')
        .format('mp4')
        .on('progress', (progress) => {
          console.log('Processing: ' + progress.percent + '% done');
        })
        .on('end', () => {
          console.log('Video processing completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error:', err);
          reject(err);
        })
        .save(outputPath);
    });

    // Get file stats
    const stats = {
      originalSize: req.file.size,
      processedSize: fs.statSync(outputPath).size,
      compressionRatio: Math.round((fs.statSync(outputPath).size / req.file.size) * 100) + '%'
    };

    // Return processed video path
    const videoUrl = `/uploads/${path.basename(outputPath)}`;
    
    // Clean up input file
    fs.unlinkSync(inputPath);

    // Send response
    return res.json({
      success: true,
      videoUrl,
      stats
    });

  } catch (error) {
    console.error('Error in video processing:', error);
    return res.status(500).json({ 
      error: 'Video processing failed', 
      details: error.message 
    });
  }
};

module.exports = { BitrateController };