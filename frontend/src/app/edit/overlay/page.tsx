'use client'
import React, { useState } from 'react';
import { Upload, Camera } from 'lucide-react';

const VideoWatermark = () => {
  const [video, setVideo] = useState(null);
  const [watermark, setWatermark] = useState(null);
  const [videoPreview, setVideoPreview] = useState('');
  const [watermarkPreview, setWatermarkPreview] = useState('');
  const [position, setPosition] = useState('bottomright');
  const [scale, setScale] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleVideoChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleWatermarkChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setWatermark(file);
      setWatermarkPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!video || !watermark) {
      alert('Please select both video and watermark files');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('video', video);
    formData.append('watermark', watermark);
    formData.append('position', position);
    formData.append('scale', scale.toString());

    try {
      const response = await fetch('http://localhost:5000/watermark', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.url);
      } else {
        throw new Error(data.error || 'Error processing video');
      }
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w- mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Add Watermark to Video</h2>

        <form onSubmit={handleSubmit} className=" space-y-6">
          {/* Video Upload */}
          <div className='flex justify-evenly space-x-52 flex-row'>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Video
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Camera className="w-12 h-12 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload video</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoChange}
                  />
                </label>
              </div>
              {videoPreview && (
                <video
                  className="mt-4 w-full max-h-64 object-contain"
                  src={videoPreview}
                  controls
                />
              )}
            </div>

            {/* Watermark Upload */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload Watermark Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload watermark</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleWatermarkChange}
                  />
                </label>
              </div>
              {watermarkPreview && (
                <img
                  src={watermarkPreview}
                  alt="Watermark preview"
                  className="mt-4 max-h-32 object-contain"
                />
              )}
            </div>
          </div>

          {/* Position Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Watermark Position
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-1 border border-1 my-2 h-12 px-4 rounded block w-full border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="topleft">Top Left</option>
              <option value="topright">Top Right</option>
              <option value="bottomleft">Bottom Left</option>
              <option value="bottomright">Bottom Right</option>
              <option value="center">Center</option>
            </select>
          </div>

          {/* Scale Slider */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Watermark Size ({Math.round(scale * 100)}% of video size)
            </label>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
          </div> */}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !video || !watermark}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Add Watermark'}
          </button>
        </form>

        {/* Result */}
        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Result</h3>
            <a
              href={result}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-indigo-600 hover:text-indigo-500"
            >
              Download Processed Video
            </a>
            <video
              src={result}
              controls
              className="w-96 rounded-lg"
            />

          </div>
        )}
      </div>
    </div>
  );
};

export default VideoWatermark;