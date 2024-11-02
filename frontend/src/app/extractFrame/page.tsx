'use client'
import React, { useState, useRef } from 'react';
import axios from 'axios';
 
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Frame {
    url: string;
}

const FrameExtractor = () => {
    const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');
    const [frames, setFrames] = useState<Frame[]>([]);
    const [loading, setLoading] = useState(false);
    const [frameRate, setFrameRate] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedVideo(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
            setFrames([]); // Clear previous frames
        }
    };

    const extractFrames = async () => {
        if (!selectedVideo) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('video', selectedVideo);
        formData.append('frameRate', frameRate.toString());

        try {
            const response = await axios.post('http://localhost:5000/extract-frames', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFrames(response.data.frames.map((url: string) => ({ url })));
        } catch (error) {
            console.error('Error extracting frames:', error);
        } finally {
            setLoading(false);
        }
    };
    console.log(frames.map(frame => `http://localhost:5000${frame.url}`));

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium">Select Video</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoSelect}
                            className="w-full"
                        />
                    </div>

                    {videoPreview && (
                        <div className="mt-4">
                            <video
                                ref={videoRef}
                                src={videoPreview}
                                controls
                                className="w-80  rounded-lg"
                            />
                        </div>
                    )}

                    <div className="flex gap-4 items-center">
                        <input
                            type="number"
                            value={frameRate}
                            onChange={(e) => setFrameRate(Number(e.target.value))}
                            min="0.1"
                            max="30"
                            step="0.1"
                            className="w-32"
                            placeholder="Frame Rate"
                        />
                        <button
                            onClick={extractFrames}
                            disabled={!selectedVideo || loading}
                            className="min-w-[120px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing
                                </>
                            ) : (
                                'Extract Frames'
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {frames.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                    {frames.map((frame, index) => {
                        return (
                            <div key={index}>
                                <div className="p-2">
                                    <Image
                                        width={300}
                                        height={300}
                                        src={`http://localhost:5000${frame.url}`}
                                        alt={`Frame ${index + 1}`}
                                        className="w-full h-auto rounded-lg"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default FrameExtractor;