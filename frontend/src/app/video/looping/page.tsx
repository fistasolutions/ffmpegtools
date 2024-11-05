'use client'
import React, { useState } from 'react';
import { Upload, Video, AlertCircle } from 'lucide-react';

const VideoLooper = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loopCount, setLoopCount] = useState(3);
  const [resultUrl, setResultUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('video/')) {
        // Check file size (limit to 100MB)
        if (file.size > 100 * 1024 * 1024) {
          setError('File size too large. Please select a video under 100MB.');
          return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setError('');
      } else {
        setError('Please select a valid video file');
      }
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a video first');
      return;
    }

    setLoading(true);
    setError('');
    setProgress(0);

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('loopCount', loopCount.toString());

    try {
      const response = await fetch('http://localhost:5000/looping', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setResultUrl(data.url);
        setError('');
      } else {
        setError(data.message || 'Error processing video');
      }
    } catch (err) {
      setError(`Error uploading video:`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto p-6">
      <div className="space-y-6">
        <div className="border-2 border-dashed bg-white border-gray-300 rounded-lg p-10 text-center">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
            id="video-upload"
          />
          <label
            htmlFor="video-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            <Upload className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-600">
              Click to upload or drag and drop a video (max 100MB)
            </span>
          </label>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="flex justify-around">
          <div>
            {previewUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Preview</h3>
                <video
                  src={previewUrl}
                  controls
                  className="w-60 rounded-lg"
                  onError={() => setError('Error loading video preview')}
                />
              </div>
            )}
          </div>
          <div>
            {resultUrl && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Result</h3>
                <video
                  src={resultUrl}
                  controls
                  loop
                  className="w-60 rounded-lg"
                  onError={() => setError('Error loading processed video')}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <label className="font-medium">Loop Count:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={loopCount}
            onChange={(e) => setLoopCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
            className="border rounded px-2 py-1 w-20"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !selectedFile}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              Processing...
            </span>
          ) : (
            'Create Loop'
          )}
        </button>


      </div>
    </div>
  );
};

export default VideoLooper;