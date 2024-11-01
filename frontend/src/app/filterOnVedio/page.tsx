'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Upload } from 'lucide-react';

interface ProcessedVideo {
  url: string;
  message: string;
}

export default function VideoFilter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<string>('blur'); 
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<ProcessedVideo | null>(null);
  const [error, setError] = useState<string>('');

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setProcessedVideo(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/*': ['.mp4', '.avi', '.mov', '.mkv'] },
    maxFiles: 1,
  });

  const handleApplyFilter = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('filter', selectedFilter);

    try {
      const response = await fetch('http://localhost:5000/apply-filter', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Response Data:", data);
      if (data.url) {
        setProcessedVideo({ url: data.url, message: data.message });
      } else {
        setError(data.error || 'Failed to process video');
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err instanceof Error ? err.message : 'Failed to apply filter');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="p-6">
        <h2 className="text-2xl text-white font-bold mb-6">Video Filter Application</h2>
        <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 bg-white ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}>
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-lg">Drop the video here...</p>
          ) : (
            <div>
              <p className="text-lg mb-2">Drag & drop your video here</p>
              <p className="text-sm text-gray-500">or click to select file</p>
            </div>
          )}
        </div>
 
        {previewUrl && (
          <div className="mt-6">
            <h3 className="text-lg text-white font-semibold mb-2">Original Video</h3>
            <video src={previewUrl} controls className="w-86 rounded-lg" style={{ maxHeight: '400px' }} />
          </div>
        )}
    
        <div className="mt-6">
          <h3 className="text-lg text-white font-semibold mb-2">Select Filter</h3>
          <select className='border border-1 w-full my-2 h-12 px-4 rounded' value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
            <option value="blur">Blur</option>
            <option value="sharpen">Sharpen</option>
          </select>
        </div>
   
        <button onClick={handleApplyFilter} disabled={!selectedFile || loading} className="w-full bg-red-600 rounded text-white py-3 mt-4">
          {loading ? (
            <div className='flex flex-row justify-center items-center'>
              Processing Video...
              <Loader2 className="mr-2  text-white font-semibold mb-4 h-4 w-4 animate-spin" />
            </div>
          ) : (
            'Apply Filter'
          )}
        </button>
    
      </div>
      {processedVideo && (
        <div className="p-6">
          <div className="text-lg  text-white font-semibold mb-4">Processed Video</div>
          <video src={processedVideo.url} controls className="w-80 rounded-lg" style={{ maxHeight: '400px' }} />
          <p className="text-white mt-2">{processedVideo.message}</p>
          <button onClick={() => window.open(processedVideo.url, '_blank')} className="w-full underline text-red-800 mt-4">Download Processed Video</button>
        </div>
      )}
    </div>
  );
}
