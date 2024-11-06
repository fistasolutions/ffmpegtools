'use client'
import React, { useState, useRef } from 'react';
import { Upload, Loader, Settings, AlertCircle, CheckCircle } from 'lucide-react';

interface ProcessedVideoResponse {
  success: boolean;
  video: {
    url: string;
    publicId: string;
    duration: number;
  };
}

interface BackgroundRemovalSettings {
  backgroundColor: string;
  sensitivity: string;
  blend: string;
}

const BackgroundRemover = () => {
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  
  // Advanced settings
  const [settings, setSettings] = useState<BackgroundRemovalSettings>({
    backgroundColor: '#00FF00',
    sensitivity: '0.3',
    blend: '0.1'
  });

  const handleSettingsChange = (key: keyof BackgroundRemovalSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleFileSelect = (file: File | null) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setError('Please select a video file');
      return;
    }
    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const processVideo = async () => {
    if (!selectedFile) {
      setError('Please select a video file first');
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('backgroundColor', settings.backgroundColor.replace('#', '0x'));
    formData.append('sensitivity', settings.sensitivity);
    formData.append('blend', settings.blend);

    try {
      const response = await fetch('http://localhost:5000/remove-background', {
        method: 'POST',
        body: formData,
    });
    
    const data: ProcessedVideoResponse = await response.json();
    console.log(data)

      if (data.success) {
        setProcessedVideo(data.video.url);
        showSuccessMessage();
      } else {
        throw new Error('Failed to process video');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process video');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = () => {
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
      successMessage.classList.remove('opacity-0');
      setTimeout(() => {
        successMessage.classList.add('opacity-0');
      }, 3000);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Video Background Remover
          </h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <Settings className="w-5 h-5" />
            <span>Advanced Settings</span>
          </button>
        </div>

        {/* Advanced Settings Panel */}
        {showSettings && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Processing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={settings.backgroundColor}
                  onChange={(e) => handleSettingsChange('backgroundColor', e.target.value)}
                  className="mt-1 w-full h-10 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sensitivity
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.sensitivity}
                  onChange={(e) => handleSettingsChange('sensitivity', e.target.value)}
                  className="mt-1 w-full"
                />
                <span className="text-sm text-gray-500">{settings.sensitivity}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Blend
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.blend}
                  onChange={(e) => handleSettingsChange('blend', e.target.value)}
                  className="mt-1 w-full"
                />
                <span className="text-sm text-gray-500">{settings.blend}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Drop Zone */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ease-in-out
            ${dragActive 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDragEnter={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);
            const files = e.dataTransfer.files;
            if (files?.[0]) handleFileSelect(files[0]);
          }}
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

        {/* Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Original Video */}
          {previewUrl && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Original Video:
              </h3>
              <video
                src={previewUrl}
                controls
                className="w-full rounded-lg bg-black"
              />
            </div>
          )}

          {/* Processed Video */}
          {processedVideo && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">
                Processed Video:
              </h3>
              <video
                src={processedVideo}
                controls
                className="w-full rounded-lg bg-black"
              />
            </div>
          )}
        </div>

        {/* Messages */}
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
          <p className="text-sm">Video processed successfully!</p>
        </div>

        {/* Process Button */}
        <button
          onClick={processVideo}
          disabled={!selectedFile || loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${!selectedFile || loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
            } transition-colors duration-200`}
        >
          <span className="flex items-center justify-center space-x-2">
            {loading && <Loader className="w-5 h-5 animate-spin" />}
            <span>{loading ? 'Processing...' : 'Remove Background'}</span>
          </span>
        </button>

        {/* Progress Bar */}
         
      </div>
    </div>
  );
};

export default BackgroundRemover;