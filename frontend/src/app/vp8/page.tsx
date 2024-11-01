'use client'

import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [codec, setCodec] = useState('vp8');  
  const [message, setMessage] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setMessage('');
    setOutputUrl('');
    setLoading(true);

    try {
      if (!file) {
        setMessage('Please select a file to convert.');
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('codec', codec); 
      const res = await fetch('http://localhost:5000/converted', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Conversion successful!');
        setOutputUrl(data.url);
      } else {
        setMessage(data.error || 'An error occurred during conversion');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Video Format Converter (VP8 & VP9)</h1>
      <p className='text-red-600 mt-10'>Support only .webm player not mpp4</p>
      <p className='text-white mt-10'>VP8 = 720p</p>
      <p className='text-white mb-20'>VP9 = 1080p</p>
      <form onSubmit={handleSubmit} className="space-y-4">
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
                  <p className="text-xs text-gray-500">Conver into VP8 and VP9</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        <div>
          <label htmlFor="codec" className="block mb-2">Select Conversion Format:</label>
          <select
            id="codec"
            value={codec}
            onChange={(e) => setCodec(e.target.value)}
            className=" border-1 w-full my-2 h-12 px-4 rounded border-gray-300  py-1"
          >
            <option value="vp8">VP8 (1280x720)</option>
            <option value="vp9">VP9 (1920x1080)</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-red-700 text-white px-4 py-2 rounded"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </form>
      
      {message && (
        <p className="mt-4 text-white text-center">
          {message}
        </p>
      )}
      
      {outputUrl && (
        <div className="mt-4">
          <p className='text-white'>Download your converted video:</p>
          <a 
            href={outputUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Download
          </a>
          <video 
            controls 
            className="mt-4 w-80 max-w-full"
            src={outputUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
