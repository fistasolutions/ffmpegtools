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
            "http://localhost:3001"
        ],
        credentials: true,
    })
);

// Endpoints
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


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
