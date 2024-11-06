'use client'
import React, { useState, useRef } from 'react';
import { Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface ThumbnailResponse {
  success: boolean;
  thumbnail: {
    url: string;
    publicId: string;
  };
}

const AnimatedThumbnailGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }

    setLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/generate-thumbnail', {
        method: 'POST',
        body: formData,
      });

      const data: ThumbnailResponse = await response.json();

      if (data.success) {
        setThumbnail(data.thumbnail.url);
        const successMessage = document.getElementById('success-message');
        if (successMessage) {
          successMessage.classList.remove('opacity-0');
          setTimeout(() => {
            successMessage.classList.add('opacity-0');
          }, 3000);
        }
      } else {
        throw new Error('Failed to generate thumbnail');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to generate thumbnail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white    ">
          Animated Thumbnail Generator
        </h2>
        
        <div
          className={`relative bg-white cursor-pointer border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out
            ${dragActive 
              ? 'border-white bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="video/*"
            onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
          />
          
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload 
              className={`w-12 h-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}
            />
            <p className="text-sm text-gray-600">
              Click or drag video file to this area
            </p>
            {selectedFile && (
              <p className="text-sm text-gray-500">
                Selected: {selectedFile.name}
              </p>
            )}
          </div>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-red-500 bg-red-50 p-3 rounded-md">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div 
          id="success-message"
          className="opacity-0 transition-opacity duration-300 flex items-center space-x-2 text-green-500 bg-green-50 p-3 rounded-md"
        >
          <CheckCircle className="w-5 h-5" />
          <p className="text-sm">Thumbnail generated successfully!</p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedFile || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${!selectedFile || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            } transition-colors duration-200`}
        >
          <span className="flex items-center justify-center space-x-2">
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            <span>{loading ? 'Generating...' : 'Generate Thumbnail'}</span>
          </span>
        </button>

        {thumbnail && (
          <div className="mt-6 space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Generated Thumbnail:
            </h3>
            <div className="border rounded-lg overflow-hidden bg-gray-50">
              <img
                src={thumbnail}
                alt="Animated thumbnail"
                className="w-full h-96"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedThumbnailGenerator;