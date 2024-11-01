<<<<<<< HEAD
const express = require('express');
const cors = require('cors');
const path = require('path');

const image = require('./routes/image.route.js')
const audio = require('./routes/audio.route.js')

const { mergeVideos } = require('./controller/videoController');

const { ConvertRecording } = require('./controller/screenRecordingController');
const { convertTrimVedio } = require('./controller/trimVedioController');
const { convertSplitVedio } = require('./controller/splittingVedioController');
const { convertStream } = require('./controller/streamVedioController');
const { convertVideo } = require('./controller/encodingDecoding');
const { convertedVideo } = require('./controller/vp8vp9Conversion');
const multer = require('multer');
=======
const express = require("express");
const cors = require("cors");
const path = require("path");
>>>>>>> 8405abb72cc7823c47c3cc7e2c6bb805aba1c8cb

const { convertImage } = require("./controller/imageController");
const { convertAudio } = require("./controller/audioController");
const { mergeVideos } = require("./controller/videoController");
const { convertImageResize } = require("./controller/imageResizeController");
const { ConvertRecording } = require("./controller/screenRecordingController");
const { convertTrimVedio } = require("./controller/trimVedioController");
const { convertSplitVedio } = require("./controller/splittingVedioController");
const { convertStream } = require("./controller/streamVedioController");
const { convertVideo } = require("./controller/encodingDecoding");
const { convertedVideo } = require("./controller/vp8vp9Conversion");
const { speedController } = require("./controller/speedController");
const { rotateVideo } = require("./controller/rotateVedio");
const { addWatermark } = require("./controller/vedioWaterMark");
const { applyFilter } = require('./controller/filterOnVedio');
const multer = require("multer");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to handle CORS
app.use(
  cors({
    origin: [
      "https://converter-frontend-rosy.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

// Endpoints
<<<<<<< HEAD
app.use('/convert', image);
app.use('/convert', audio);
app.post('/convert/screenrecording', ConvertRecording);
app.post('/convert/trim', convertTrimVedio);
app.post('/convert/split', convertSplitVedio);
app.post('/convert/stream', convertStream);
app.post('/merge/videos', mergeVideos);
app.post('/convert', upload.single('file'), convertVideo);
app.post('/converted', upload.single('file'), convertedVideo);
app.use('/uploads/image', express.static(path.join(__dirname, 'uploads/image')));
app.use('/uploads/audio', express.static(path.join(__dirname, 'uploads/audio')));
app.use('/uploads/screenrecording', express.static(path.join(__dirname, 'uploads/screenrecording')));
app.use('/merged', express.static(path.join(__dirname, 'merged')));
=======
app.post("/convert/image", convertImage);
app.post("/convert/audio", convertAudio);
app.post("/convert/screenrecording", ConvertRecording);
app.post("/convert/resizeimage", convertImageResize);
app.post("/convert/trim", convertTrimVedio);
app.post("/convert/split", convertSplitVedio);
app.post("/convert/stream", convertStream);
app.post("/merge/videos", mergeVideos);
// app.post('/vedioController',vedioController );
app.post("/rotate", upload.single("video"), rotateVideo);
app.post("/convert", upload.single("file"), convertVideo);
app.post("/converted", upload.single("file"), convertedVideo);
app.post("/speedControllers", upload.single("vedio"), speedController);
app.post('/apply-filter', upload.single('video'), applyFilter);
>>>>>>> 8405abb72cc7823c47c3cc7e2c6bb805aba1c8cb

app.post(
  "/watermark",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "watermark", maxCount: 1 },
  ]),
  addWatermark
);
app.use(
  "/uploads/image",
  express.static(path.join(__dirname, "uploads/image"))
);
app.use(
  "/uploads/audio",
  express.static(path.join(__dirname, "uploads/audio"))
);

app.use(
  "/uploads/screenrecording",
  express.static(path.join(__dirname, "uploads/screenrecording"))
);
app.use("/merged", express.static(path.join(__dirname, "merged")));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});