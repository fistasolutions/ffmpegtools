'use client';
import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer: React.FC = () => {
    const [subtitles, setSubtitles] = useState<string | null>(null);

    const handleSubtitleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setSubtitles(url);
        }
    };

    return (
        <div className="flex flex-col items-center p-4">
            <ReactPlayer
                url="https://www.w3schools.com/html/mov_bbb.mp4" // Replace with your video URL
                controls
                width="100%"
                height="auto"
                config={{
                    file: {
                        tracks: subtitles
                            ? [
                                {
                                    kind: 'subtitles',
                                    src: subtitles,
                                    srcLang: 'en',
                                    label: 'English Subtitles', // Added label here
                                    default: true,
                                },
                            ]
                            : [],
                    },
                }}
            />
            <input
                type="file"
                accept=".vtt,.srt"
                onChange={handleSubtitleUpload}
                className="mt-4 border border-gray-300 rounded p-2"
            />
            <p className="mt-2 text-gray-600">Upload subtitles in .vtt or .srt format.</p>
        </div>
    );
};

export default VideoPlayer;
