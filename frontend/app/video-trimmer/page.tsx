'use client';  // Indicating this is a client component

import React, { useState } from 'react';

const VideoTrimmer: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleTrim = async () => {
        if (!videoFile || !startTime || !endTime) {
            setErrorMessage('Please provide a video file and start/end times.');
            return;
        }

        setLoading(true);
        setErrorMessage(null);
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('start', startTime);
        formData.append('end', endTime);

        try {
            const response = await fetch('http://localhost:5000/convert/trim', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to trim video');
            }

            const data = await response.json();
            setTrimmedVideoUrl(data.url);
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Error trimming video. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200 p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Video Trimmer</h1>
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-400 rounded bg-white"
            />
            <div className="flex space-x-4 mb-4">
                <input
                    type="text"
                    placeholder="Start Time (in seconds)"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="flex-1 p-2 border border-gray-400 rounded bg-white"
                />
                <input
                    type="text"
                    placeholder="End Time (in seconds)"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="flex-1 p-2 border border-gray-400 rounded bg-white"
                />
            </div>
            <button
                onClick={handleTrim}
                disabled={loading}
                className={`w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition duration-200 
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {loading ? 'Trimming...' : 'Trim Video'}
            </button>
            {errorMessage && <div className="mt-4 text-red-500">{errorMessage}</div>}
            {trimmedVideoUrl && (
                <div className="mt-4 text-center">
                    <h3 className="text-lg text-green-500 mb-2">Trimmed Video:</h3>
                    <a
                        href={trimmedVideoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline mb-2 block"
                    >
                        {trimmedVideoUrl}
                    </a>
                </div>
            )}
        </div>
    );
};

export default VideoTrimmer;
