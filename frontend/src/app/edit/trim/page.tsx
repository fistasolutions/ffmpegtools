'use client';  // Indicating this is a client component

import Wrapper from '@/src/components/ui/Wrapper';
import React, { useState } from 'react';

const VideoTrimmer: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [trimmedVideoUrl, setTrimmedVideoUrl] = useState<string>('');
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
        <Wrapper head='Trim Video' url={trimmedVideoUrl} message=''>
            <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mb-4 p-2 border border-gray-400 rounded bg-white"
            />
            <div className="flex space-x-4 mb-4 gap-2 items-center">
                <input
                    type="text"
                    placeholder="Start Time (in seconds)"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-2 border border-gray-400 rounded bg-white"
                />
                <input
                    type="text"
                    placeholder="End Time (in seconds)"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="p-2 border border-gray-400 rounded bg-white"
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

        </Wrapper>
    );
};

export default VideoTrimmer;
