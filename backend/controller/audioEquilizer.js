const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { v2: cloudinary } = require("cloudinary");

exports.applyEqualizer = (req, res) => {
  const { bass, treble } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No video file provided" });
  }

  const inputFilePath = `./uploads/temp_${file.originalname}`;
  const outputFilePath = `./uploads/processed_${file.originalname}`;

  fs.writeFileSync(inputFilePath, file.buffer);

  const cleanupFiles = () => {
    setTimeout(() => {
      try {
        fs.unlinkSync(inputFilePath);
        fs.unlinkSync(outputFilePath);
      } catch (err) {
        console.error("Error deleting temp files:", err);
      }
    }, 500);
  };

  ffmpeg(inputFilePath)
    .audioFilters([
      `bass=g=${Math.min(bass, 20)}`,  
      `treble=g=${Math.min(treble, 20)}`,  
      `volume=0.9`,  
    ])
    .on("end", async () => {
      try {
        const result = await cloudinary.uploader.upload(outputFilePath, {
          resource_type: "video",
        });

        res.json({ videoUrl: result.secure_url });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        res.status(500).json({ error: "Error uploading video to Cloudinary" });
      } finally {
        cleanupFiles();
      }
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err);
      res.status(500).json({ error: "Error processing video" });
      cleanupFiles();
    })
    .save(outputFilePath);
};
