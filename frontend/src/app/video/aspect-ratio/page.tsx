'use client'
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
 
import { Loader2, Upload } from 'lucide-react';

interface ProcessedVideo {
  url: string;
  width: number;
  height: number;
  format: string;
}

const PRESET_RATIOS = [
  { label: 'Widescreen (16:9)', value: '16:9' },
  { label: 'Standard (4:3)', value: '4:3' },
  { label: 'Square (1:1)', value: '1:1' },
  { label: 'Portrait (9:16)', value: '9:16' },
  { label: 'Custom', value: 'custom' }
];

export default function AspectRatioAdjuster() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedRatio, setSelectedRatio] = useState<string>('16:9');
  const [customRatio, setCustomRatio] = useState({ width: '', height: '' });
  const [loading, setLoading] = useState(false);
  const [processedVideo, setProcessedVideo] = useState<ProcessedVideo | null>(null);
  const [error, setError] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedVideo(null);
      setError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv']
    },
    maxFiles: 1
  });

  const handleAdjustRatio = async () => {
    if (!selectedFile) {
      setError('Please select a video file');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', selectedFile);
    
    // Handle custom ratio
    const ratio = selectedRatio === 'custom' 
      ? `${customRatio.width}:${customRatio.height}`
      : selectedRatio;
    formData.append('ratio', ratio);

    try {
      const response = await fetch('http://localhost:5000/adjust-ratio', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to adjust aspect ratio');
      }

      const data = await response.json();
      if (data.success) {
        setProcessedVideo(data.video);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust aspect ratio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="p-6">
        <h2 className="text-2xl text-white font-bold mb-6">Video Aspect Ratio Adjustment</h2>

        <div
          {...getRootProps()}
          className={`
            border-2 bg-white border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors duration-200
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          `}
        >
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
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        <div className="mt-6 space-y-4">
          <h3 className="text-lg text-white font-semibold">Select Aspect Ratio</h3>
          <select
            value={selectedRatio}
            className=' border-1 w-full my-2 h-12 px-4 rounded border-gray-300  py-1'
            onChange={(e)=>setSelectedRatio(e.target.value)}
          >
            
              {PRESET_RATIOS.map(ratio => (
                <option key={ratio.value} value={ratio.value}>
                  {ratio.label}
                </option>
              ))}
          </select>

          {selectedRatio === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Width"
                  value={customRatio.width}
                  onChange={(e) => setCustomRatio(prev => ({ 
                    ...prev, 
                    width: e.target.value 
                  }))}
                  className="mt-2 rounded p-2"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Height"
                  value={customRatio.height}
                  onChange={(e) => setCustomRatio(prev => ({ 
                    ...prev, 
                    height: e.target.value 
                  }))}
                  className="mt-2 rounded p-2"
                />
              </div>
            </div>
          )}

          <button
            onClick={handleAdjustRatio}
            disabled={!selectedFile || loading}
            className="w-full text-white bg-red-700 px-2 py-3 rounded mt-4"
          >
            {loading ? (
              <div className='flex flex-row justify-center items-center'>
                Adjusting Ratio...
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              </div>
            ) : (
              'Adjust Ratio'
            )}
          </button>
        </div>

         
      </div>

      {processedVideo && (
        <div className="p-6">
          <h3 className="text-lg text-white font-semibold mb-4">Processed Video</h3>
          <video
            src={processedVideo.url}
            controls
            className="w-full rounded-lg"
            style={{ maxHeight: '400px' }}
          />
          <div className="mt-4 text-sm text-gray-600">
            <p className='text-white'>Resolution: {processedVideo.width} x {processedVideo.height}</p>
            <p className='text-white'>Format: {processedVideo.format}</p>
          </div>
          <button
            onClick={() => window.open(processedVideo.url, '_blank')}
            className="w-full text-red-700 underline mt-4"
          >
            Download Processed Video
          </button>
        </div>
      )}
    </div>
  );
}