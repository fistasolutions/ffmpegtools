const cloudinary = require('cloudinary').v2;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const tempDir = path.join(__dirname, '../temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const generateAnimatedThumbnail = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const tempVideoPath = path.join(tempDir, `${Date.now()}_input${path.extname(req.file.originalname)}`);
    const outputGifPath = path.join(tempDir, `${Date.now()}_thumbnail.gif`);

    fs.writeFileSync(tempVideoPath, req.file.buffer);

    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .setStartTime(0)
        .duration(3)  
        .size('320x240')  
        .fps(10) 
        .outputOption('-filter:v', 'scale=320:-1:flags=lanczos')
        .toFormat('gif')
        .on('end', () => {
          console.log('GIF generation finished');
          resolve();
        })
        .on('error', (err) => {
          console.error('Error:', err);
          reject(err);
        })
        .save(outputGifPath);
    });

    const cloudinaryResult = await cloudinary.uploader.upload(outputGifPath, {
      resource_type: 'image',
      folder: 'video-thumbnails'
    });

    try {
      fs.unlinkSync(tempVideoPath);
      fs.unlinkSync(outputGifPath);
    } catch (err) {
      console.error('Error cleaning up temp files:', err);
    }

    res.json({
      success: true,
      thumbnail: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id
      }
    });

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    res.status(500).json({ error: 'Failed to generate thumbnail' });
  }
};

module.exports = {
  generateAnimatedThumbnail
};