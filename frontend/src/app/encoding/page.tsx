'use client'

import { Upload } from 'lucide-react';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [codec, setCodec] = useState('h264');
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

  const handleFileChange = (e:any) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };
  const handleCodecChange = (e:any) => {
    setCodec(e.target.value);  
  };

  return (
    <div className="container mx-auto p-4">
     <div className="flex justify-between" >
   <div>
   <h3 className="text-2xl font-bold mb-4">Video Format Converter (H.264)/(H.265)</h3>
   <p className='text-white mt-10'>H.264 = 720p</p>
   <p className='text-white mb-20'>H.265 = 1080p</p>
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
                  <p className="text-xs text-gray-500">MP4, WebM or OGG</p>
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
      <div className="">
      <div>
          <label htmlFor="codec" className="block mb-2">Select Format:</label>
          <select 
            id="codec" 
            value={codec} 
            onChange={handleCodecChange} 
            className="border border-1 w-full my-2 h-12 px-4 rounded py-1"
          >
            <option value="h264">H.264</option>
            <option value="h265">H.265</option>
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-red-500 text-white px-4 rounded mt-10 ms-5" style={{padding:'10px'}}
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
            className="mt-4  max-w-80"
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
