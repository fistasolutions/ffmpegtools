const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const extractFrames = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No video file provided' });
        }

        const videoBuffer = req.file.buffer;
        const frameRate = req.body.frameRate || 1;
        const outputDir = path.join(__dirname, '../uploads/frames');
        const tempVideoPath = path.join(__dirname, `../uploads/temp-${uuidv4()}.mp4`);
        
        // Ensure directories exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write buffer to temporary file
        fs.writeFileSync(tempVideoPath, videoBuffer);

        // Generate unique identifier for this batch of frames
        const batchId = uuidv4();
        const framesPath = path.join(outputDir, batchId);
        fs.mkdirSync(framesPath);

        // Get video duration first
        const getDuration = () => {
            return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(tempVideoPath, (err, metadata) => {
                    if (err) reject(err);
                    resolve(metadata.format.duration);
                });
            });
        };

        const duration = await getDuration();
        // Calculate maximum frames based on duration and frame rate
        const maxFrames = Math.ceil(duration * frameRate);
        
        await new Promise((resolve, reject) => {
            ffmpeg(tempVideoPath)
                .fps(frameRate)
                .on('end', () => {
                    fs.unlinkSync(tempVideoPath);
                    resolve();
                })
                .on('error', (err) => {
                    fs.unlinkSync(tempVideoPath);
                    reject(err);
                })
                .screenshots({
                    count: Math.min(maxFrames, 300), // Limit maximum frames to 300
                    folder: framesPath,
                    filename: 'frame-%d.jpg',
                    size: '480x?', // Reduce output size
                });
        });

        const frames = fs.readdirSync(framesPath)
            .filter(file => file.endsWith('.jpg'))
            .map(file => `/uploads/frames/${batchId}/${file}`);

        res.json({
            success: true,
            frames,
            batchId
        });

    } catch (error) {
        console.error('Error extracting frames:', error);
        res.status(500).json({ error: 'Failed to extract frames' });
    }
};

module.exports = {
    extractFrames
};