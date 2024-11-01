'use client'

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [codec, setCodec] = useState('h264');


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

      const res = await fetch('http://localhost:5000/convert', {
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
  const handleCodecChange = (e) => {
    setCodec(e.target.value);  
  };

  return (
    <div className="container mx-auto p-4">
     <div className="flex justify-between" >
   <div>
   <h3 className="text-2xl font-bold mb-4">Video Format Converter (H.264)/(H.265)</h3>
   <p className='text-gray-400 mt-10'>H.264 = 720p</p>
   <p className='text-gray-400 mb-20'>H.265 = 1080p</p>
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
      <div className="flex flex-row">
      <div>
          <label htmlFor="codec" className="block mb-2">Select Format:</label>
          <select 
            id="codec" 
            value={codec} 
            onChange={handleCodecChange} 
            className="border rounded px-2 py-1"
          >
            <option value="h264">H.264</option>
            <option value="h265">H.265</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-500 text-white px-4 rounded ms-10" style={{padding:'-30px'}}
        >
          {loading ? 'Converting...' : 'Convert'}
        </button>
      </div>
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
     <Link href={'/vp8'}>
     <button className='bg-blue-500 text-white py-2 px-4 rounded ms-10'>Increase vedio quality </button>
     </Link>
     </div>
    </div>
  );
}
