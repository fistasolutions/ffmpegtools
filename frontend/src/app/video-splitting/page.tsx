'use client';
import React, { useState } from 'react';

const Page: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [splitTime, setSplitTime] = useState<string>(''); // MM:SS format
    const [loading, setLoading] = useState<boolean>(false);
    const [splitVideoUrls, setSplitVideoUrls] = useState<string[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const convertTimeToSeconds = (time: string): number => {
        const parts = time.split(':');
        let seconds = 0;
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10) || 0;
            const secs = parseInt(parts[1], 10) || 0;
            seconds = minutes * 60 + secs;
        } else {
            throw new Error('Invalid time format. Please use MM:SS.');
        }
        return seconds;
    };

    const handleSplit = async () => {
        if (!videoFile || !splitTime) {
            setErrorMessage('Please provide a video file and split time.');
            return;
        }

        try {
            const splitSeconds = convertTimeToSeconds(splitTime);

            setLoading(true);
            setErrorMessage(null);
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('splitTime', splitSeconds.toString());

            const response = await fetch('http://localhost:5000/convert/split', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to split video');
            }

            const data = await response.json();
            setSplitVideoUrls(data.urls); // Expecting an array of URLs
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error splitting video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Video Splitter</h1>
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-400 rounded bg-white"
            />
            <div className="flex flex-col mb-4 w-full">
                <label htmlFor="split-time" className="text-gray-700 mb-2">Split Time (MM:SS)</label>
                <div className="flex space-x-2">
                    <input
                        type="text"
                        id="split-time"
                        placeholder="MM"
                        value={splitTime.split(':')[0] || ''}
                        onChange={(e) => setSplitTime(`${e.target.value}:${splitTime.split(':')[1] || ''}`)}
                        className="flex-1 p-2 border border-gray-400 rounded-l bg-white"
                    />
                    <span className="self-center text-gray-700">:</span>
                    <input
                        type="text"
                        placeholder="SS"
                        value={splitTime.split(':')[1] || ''}
                        onChange={(e) => setSplitTime(`${splitTime.split(':')[0] || ''}:${e.target.value}`)}
                        className="flex-1 p-2 border border-gray-400 rounded-r bg-white"
                    />
                </div>
            </div>
            <button
                onClick={handleSplit}
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200 
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Splitting...' : 'Split Video'}
            </button>
            {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
            {splitVideoUrls.length > 0 && (
                <div className="mt-4 text-center">
                    <h3 className="text-lg text-green-500 mb-2">Split Videos:</h3>
                    {splitVideoUrls.map((url, index) => (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline mb-2 block"
                        >
                            {url}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Page;
