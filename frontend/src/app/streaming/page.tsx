'use client'
import React, { useRef, useState } from 'react';

const Page: React.FC = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);

    const startStreaming = async () => {
        try {
            // Request access to the user's camera
            streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true });
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.srcObject = streamRef.current;
                videoElement.play();
            }

            // Set up MediaRecorder for real-time streaming
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType: 'video/webm' });
            mediaRecorderRef.current.ondataavailable = handleDataAvailable;
            mediaRecorderRef.current.start(1000); // Send data every second

            setIsStreaming(true);
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    const stopStreaming = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        setIsStreaming(false);
    };

    // Send each chunk to the backend
    const handleDataAvailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
            const formData = new FormData();
            formData.append('video', event.data, 'chunk.webm');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/stream`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                console.log('Video uploaded successfully:', data.url);
                setData(data.url);
                setIsStreaming(false)
            } else {
                console.error('Upload failed:', data.error);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Live Video Stream</h2>

            <video autoPlay style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}></video>

            <button
                onClick={isStreaming ? stopStreaming : startStreaming}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: isStreaming ? '#e63946' : '#1d3557',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '20px'
                }}
            >
                {isStreaming ? 'Stop Recording' : 'Start Recording'}
            </button>
            {loading ? (
                <p className="mt-4 text-lg text-blue-500">Uploading, please wait...</p>
            ) : (
                data && (
                    <div className="mt-4 text-center">
                        <h3 className="text-lg text-green-500 mb-2">Stream Videos:</h3>
                        <a
                            href={data}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline mb-2 block"
                        >
                            {data}
                        </a>
                    </div>
                )
            )}
        </div>
    );
};

export default Page;
