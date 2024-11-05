'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Page: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [subtitles, setSubtitles] = useState<string>('');
    const [subtitleFormat, setSubtitleFormat] = useState<'srt' | 'vtt'>('srt');
    const [convertedVideoUrl, setConvertedVideoUrl] = useState<string | null>(null);

    const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setVideoFile(file);
        }
    };

    const handleSubtitleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSubtitles(event.target.value);
    };

    const handleExport = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior

        if (videoFile) {
            const formData = new FormData();
            formData.append('video', videoFile);
            formData.append('subtitles', subtitles);
            formData.append('subtitleFormat', subtitleFormat);

            try {
                const response = await axios.post('http://localhost:5000/convert/edit/subtitles', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log("Response:", response.data);
                setConvertedVideoUrl(response.data.url);
            } catch (error) {
                console.error('An error occurred:', error);
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <h1 className="text-2xl font-bold">Video Upload and Subtitle Creator</h1>
            <form onSubmit={handleExport} className="flex flex-col items-start space-y-4">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="border p-2"
                    required // Make this field required
                />
                {videoFile && (
                    <div className="flex flex-col items-start space-y-2">
                        <video controls width="600" className="border">
                            <source src={URL.createObjectURL(videoFile)} type={videoFile.type} />
                            Your browser does not support the video tag.
                        </video>
                        <textarea
                            rows={5}
                            placeholder="Enter subtitles here..."
                            value={subtitles}
                            onChange={handleSubtitleChange}
                            className="border p-2 w-full"
                            required // Make this field required
                        />
                        <select
                            value={subtitleFormat}
                            onChange={(e) => setSubtitleFormat(e.target.value as 'srt' | 'vtt')}
                            className="border p-2"
                        >
                            <option value="srt">SRT</option>
                            <option value="vtt">WebVTT</option>
                        </select>
                        <button
                            type="submit" // Set button type to submit
                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Export Video with Subtitles
                        </button>
                    </div>
                )}
            </form>
            {convertedVideoUrl && (
                <a href={convertedVideoUrl} target='_blank' rel="noopener noreferrer" className='text-red-600'>
                    Download Converted Video
                </a>
            )}
        </div>
    );
};

export default Page;
