'use client'
import React, { useState } from 'react';

export default function VideoProcessingPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [bitrate, setBitrate] = useState(1000); // Default 1000 kbps
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileSelect = (event:any) => {
    const file = event.target.files[0];
    if (!file) return;
    setSelectedFile(file);
  };

  const handleProcessVideo = async () => {
    if (!selectedFile) return;

    setProcessing(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('bitrate', bitrate);

    try {
      const response = await fetch('http://localhost:5000/adjust-bitrate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setResult({
          videoUrl: `http://localhost:5000${data.videoUrl}`,
          stats: data.stats
        });
      } else {
        setError(data.error || 'Failed to process video');
      }
    } catch (err) {
      setError('Error processing video');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Video Bitrate Adjuster</h1>

      {/* File Upload */}
      <div className="mb-6">
        <label 
          htmlFor="video-upload" 
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose Video
        </label>
        <input
          id="video-upload"
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-blue-500 file:text-white 
                     hover:file:bg-blue-600 
                     cursor-pointer"
        />
      </div>

      {/* Bitrate Slider */}
      <div className="mb-6">
        <label 
          htmlFor="bitrate-slider"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Adjust Bitrate (kbps)
        </label>
        <input
          id="bitrate-slider"
          type="range"
          min="100"
          max="10000"
          value={bitrate}
          onChange={(e) => setBitrate(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="mt-2 text-sm text-white">
          Selected bitrate: {bitrate} kbps
        </div>
      </div>

      {/* Process Button */}
      <button
        onClick={handleProcessVideo}
        disabled={!selectedFile || processing}
        className={`w-full py-2 px-4 rounded-md text-white font-medium
                   ${!selectedFile || processing 
                     ? 'bg-red-400 cursor-not-allowed' 
                     : 'bg-blue-500 hover:bg-blue-600'
                   } transition-colors duration-200`}
      >
        {processing ? 'Processing...' : 'Process Video'}
      </button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Result Video */}
      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Processed Video</h2>
          <video
            controls
            className="w-full rounded-lg border border-gray-200"
            src={result.videoUrl}
          />
          {result.stats && (
            <div className="mt-4 p-4 bg-blue-300 rounded-lg space-y-2">
              <h3 className="font-medium">Processing Statistics:</h3>
              <p className=''>Original Size: {(result.stats.originalSize / (1024 * 1024)).toFixed(2)} MB</p>
              <p>Processed Size: {(result.stats.processedSize / (1024 * 1024)).toFixed(2)} MB</p>
              <p>Compression Ratio: {result.stats.compressionRatio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}