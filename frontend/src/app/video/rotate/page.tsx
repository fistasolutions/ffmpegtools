'use client'
import { useState, useRef } from 'react';

import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Upload,
  Loader2
} from 'lucide-react';

export default function VideoRotation() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url); setProcessedUrl(null);
      setError("null");
    }
  };

  const handleRotation = async (rotation: any) => {
    if (!selectedFile) {
      setError('Please select a video first');
      return;
    }

    setIsProcessing(true);
    setError("null");

    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      formData.append('rotation', rotation);

      const response = await fetch('http://localhost:5000/rotate', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process video');
      }

      const data = await response.json();
      setProcessedUrl(data.url);
    } catch (err: any) {
      setError('Error processing video: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div>
        <div>
          <div className='text-white text-4xl mb-2'>Video Rotation</div>
        </div>
        <div>
          <div className="mb-6">
            <div className="flex items-center justify-center w-full">
              <label
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">MP4, WebM or OGG</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => handleRotation('90')}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Rotate 90°
            </button>
            <button
              onClick={() => handleRotation('270')}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Rotate -90°
            </button>
            <button
              onClick={() => handleRotation('180')}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Rotate 180°
            </button>
            <button
              onClick={() => handleRotation('flipH')}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <FlipHorizontal className="w-4 h-4" />
              Flip Horizontal
            </button>
            <button
              onClick={() => handleRotation('flipV')}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <FlipVertical className="w-4 h-4" />
              Flip Vertical
            </button>
          </div>

          {isProcessing && (
            <div className="flex justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {previewUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Original</h3>
                <video
                  src={previewUrl}
                  controls
                  className="w-52 rounded-lg"
                />
              </div>
            )}

            {processedUrl && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Processed</h3>
                <video
                  src={processedUrl}
                  controls
                  className=" w-52 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}