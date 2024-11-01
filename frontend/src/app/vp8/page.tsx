'use client'

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [codec, setCodec] = useState('vp8');  
  const [message, setMessage] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Format Converter (VP8 & VP9)</h1>
      <p className='text-red-600 mt-10'>Support only .webm player not mpp4</p>
      <p className='text-gray-400 mt-10'>VP8 = 720p</p>
      <p className='text-gray-400 mb-20'>VP9 = 1080p</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="mb-2"
          />
        </div>
        <div>
          <label htmlFor="codec" className="block mb-2">Select Conversion Format:</label>
          <select
            id="codec"
            value={codec}
            onChange={(e) => setCodec(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="vp8">VP8 (1280x720)</option>
            <option value="vp9">VP9 (1920x1080)</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </form>
      
      {message && (
        <p className="mt-4 text-center">
          {message}
        </p>
      )}
      
      {outputUrl && (
        <div className="mt-4">
          <p>Download your converted video:</p>
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
            className="mt-4 max-w-full"
            src={outputUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
