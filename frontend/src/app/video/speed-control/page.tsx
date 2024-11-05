'use client'
import { useState } from 'react';
import axios from 'axios';
import Wrapper from '@/src/components/ui/Wrapper';
import Button from '@/src/components/ui/button';

const RecordVideoPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [speed, setSpeed] = useState<number>(1);
  const [processedVideoUrl, setProcessedVideoUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleFileChange = (e: any) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setStatusMessage('Please select a video file.');
      return;
    }

    const formData = new FormData();
    formData.append('vedio', videoFile);
    formData.append('speed', speed.toString());

    try {
      setStatusMessage('Processing video...');
      const response = await axios.post('http://localhost:5000/speedControllers', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProcessedVideoUrl(response.data.videoUrl);
      setStatusMessage('Video processed successfully!');
    } catch (error) {
      setStatusMessage('Error processing video.');
      console.error(error);
    }
  };

  return (
    <Wrapper head='Upload and Adjust Video Speed' url=''>
      <input className='mb-4 w-full border border-gray-300 rounded-lg p-2' type="file" accept="video/*" onChange={handleFileChange} />

      <label className='text-gray-800 my-10'>
        Select Speed:
        <select className='border border-1 w-full my-2 h-12 px-4 rounded' value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
        >
          <option value="0.5">0.5x</option>
          <option value="1">1x (Normal)</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </label>
      <Button
        type="submit"
        onClick={handleUpload}
        isLoading={false}
      >
        upload and process vedio
      </Button>
      <p className='text-gray-500'>{statusMessage}</p>

      {processedVideoUrl && (
        <div>
          <h2>Processed Video</h2>
          <video src={processedVideoUrl} controls style={{ width: '100%', maxHeight: '400px', border: '1px solid black' }} />
        </div>
      )}
    </Wrapper>
  );
};

export default RecordVideoPage;
