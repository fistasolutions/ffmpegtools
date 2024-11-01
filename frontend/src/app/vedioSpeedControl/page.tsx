'use client'
import { useState } from 'react';
import axios from 'axios';

const RecordVideoPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [speed, setSpeed] = useState(1); // Default speed
  const [processedVideoUrl, setProcessedVideoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile || !speed) {
      setStatusMessage('Please upload a video and set a speed.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('speed', speed);

    try {
      setStatusMessage('Processing video...');
      const response = await axios.post('http://localhost:5000/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setProcessedVideoUrl(response.data.videoUrl);
      setStatusMessage('Video processed successfully!');
    } catch (error) {
      setStatusMessage('Error processing video.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Upload and Adjust Video Speed</h1>
      <input type="file" accept="video/*" onChange={handleFileChange} />
      
      <label>
        Select Speed:
        <select value={speed} onChange={(e) => setSpeed(e.target.value)}>
          <option value="0.5">0.5x</option>
          <option value="1">1x (Normal)</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </label>

      <button onClick={handleUpload}>Upload and Process Video</button>
      <p>{statusMessage}</p>

      {processedVideoUrl && (
        <div>
          <h2>Processed Video</h2>
          <video src={processedVideoUrl} controls style={{ width: '100%', maxHeight: '400px', border: '1px solid black' }} />
        </div>
      )}
    </div>
  );
};

export default RecordVideoPage;
