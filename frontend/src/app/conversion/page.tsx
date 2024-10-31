'use client'
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('mp4');
  const [message, setMessage] = useState<string>('');
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setOutputUrl('');
    setLoading(true);

    try {
      if (!file) {
        setMessage('Please select a file to convert.');
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('format', format);

      const res = await fetch('http://localhost:5000/api/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      console.log('Response Data:', data);
      
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-row justify-between">
   <div>
   <h1 className="text-2xl font-bold mb-4">Video Format Converter</h1>
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
          <select 
            onChange={(e) => setFormat(e.target.value)} 
            value={format}
            className="p-2 border rounded"
          >
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
            <option value="mkv">MKV</option>
            <option value="webm">WEBM</option>
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
      <Link href={'/encoding'}>
     <button className="bg-blue-500 py-2 text-white px-4 rounded">Increase vedio quality </button>
     </Link>
      </div>
    </div>
  );
}