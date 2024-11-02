const ffmpeg = require('fluent-ffmpeg');
const cloudinary = require('../lib/cloudinaryConfig');
const fs = require('fs');
const path = require('path');

const cropVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No video file provided' });
    }

    const { type, x, y, width, height } = req.body;
    // Convert string values to numbers
    const numX = parseInt(x, 10);
    const numY = parseInt(y, 10);
    const numWidth = parseInt(width, 10);
    const numHeight = parseInt(height, 10);

    const inputPath = req.file.path;
    const outputFileName = `processed-${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '../uploads/processed', outputFileName);

    // Ensure directory exists
    if (!fs.existsSync(path.join(__dirname, '../uploads/processed'))) {
      fs.mkdirSync(path.join(__dirname, '../uploads/processed'), { recursive: true });
    }

    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath);

      if (type === 'crop') {
        command
          .videoFilters([
            {
              filter: 'crop',
              options: {
                w: numWidth,
                h: numHeight,
                x: numX,
                y: numY
              }
            }
          ]);
      } else if (type === 'padding') {
        command
          .videoFilters([
            {
              filter: 'pad',
              options: {
                w: numWidth,
                h: numHeight,
                x: numX,
                y: numY,
                color: 'black'
              }
            }
          ]);
      }

      command
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('end', async () => {
          try {
            const uploadResult = await cloudinary.uploader.upload(outputPath, {
              resource_type: 'video',
              folder: 'processed-videos'
            });

            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);

            res.json({
              success: true,
              message: 'Video processed successfully',
              videoUrl: uploadResult.secure_url
            });
          } catch (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          }
        })
        .on('error', (err, stdout, stderr) => {
          console.error('FFmpeg error:', err);
          console.error('FFmpeg stderr:', stderr);
          reject(err);
        })
        .run();
    });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing video',
      error: error.message
    });
  }
};

module.exports = {
  cropVideo
};