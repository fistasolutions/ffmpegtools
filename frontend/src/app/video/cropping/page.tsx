'use client'

import { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';

export default function VideoEditor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedUrl, setProcessedUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  const [cropSettings, setCropSettings] = useState({
    cropX: 0,
    cropY: 0,
    cropWidth: 0,
    cropHeight: 0,
  });

  const [padSettings, setPadSettings] = useState({
    padTop: 0,
    padRight: 0,
    padBottom: 0,
    padLeft: 0,
    padColor: 'black',
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProcessedUrl('');
      setError('');
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Reset settings when new file is selected
      if (videoRef.current) {
        videoRef.current.onloadedmetadata = () => {
          const width = videoRef.current?.videoWidth || 0;
          const height = videoRef.current?.videoHeight || 0;
          setCropSettings({
            cropX: 0,
            cropY: 0,
            cropWidth: width,
            cropHeight: height,
          });
        };
      }
    }
  };

  const handleCropChange = (field: string, value: number) => {
    setCropSettings(prev => ({
      ...prev,
      [field]: Math.max(0, value) 
    }));
  };

  const handlePadChange = (field: string, value: number | string) => {
    setPadSettings(prev => ({
      ...prev,
      [field]: typeof value === 'number' ? Math.max(0, value) : value
    }));
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError('');
    setProcessedUrl('');

    const formData = new FormData();
    formData.append('video', selectedFile);
    
    Object.entries(cropSettings).forEach(([key, value]) => {
      formData.append(key, Math.floor(value).toString());
    });

    Object.entries(padSettings).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    try {
      const response = await axios.post('http://localhost:5000/process-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000,  
        responseType: 'json'
      });

      if (response.data.videoUrl) {
        // Add timestamp to prevent browser caching
        const timestamp = Date.now();
        setProcessedUrl(`http://localhost:5000${response.data.videoUrl}?t=${timestamp}`);
      } else {
        setError('No video URL in response');
      }
    } catch (error: any) {
      console.error('Error processing video:', error);
      setError(
        error.response?.data?.details || 
        error.response?.data?.error || 
        'Error processing video. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Video Editor</h1>
        
        <div className="mb-8">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="mb-4"
          />
        </div>

        {previewUrl && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <video
              ref={videoRef}
              src={previewUrl}
              controls
              className="w-full max-h-[400px] bg-black"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Crop Settings</h3>
            {Object.entries(cropSettings).map(([field, value]) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 capitalize">
                  {field.replace('crop', '')}
                </label>
                <input
                  type="number"
                  min="0"
                  value={value}
                  onChange={(e) => handleCropChange(field, parseInt(e.target.value) || 0)}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Padding Settings</h3>
            {Object.entries(padSettings).map(([field, value]) => (
              <div key={field} className="mb-4">
                <label className="block mb-2 capitalize">
                  {field.replace('pad', '')}
                </label>
                <input
                  type={field === 'padColor' ? 'text' : 'number'}
                  min={field === 'padColor' ? undefined : "0"}
                  value={value}
                  onChange={(e) => handlePadChange(
                    field, 
                    field === 'padColor' ? e.target.value : parseInt(e.target.value) || 0
                  )}
                  className="w-full p-2 border rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Process Video'}
        </button>

        {processedUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Processed Video</h2>
            <video
              src={processedUrl}
              controls
              className="w-full max-h-[400px] bg-black"
            />
            <a 
              href={processedUrl}
              download
              className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Download Processed Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}