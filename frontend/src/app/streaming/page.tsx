'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import React, { useRef, useState } from 'react';

const Page: React.FC = () => {
    const [isStreaming, setIsStreaming] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, { mimeType: 'video/webm; codecs=vp8' });
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
            setLoading(true);
            const formData = new FormData();
            formData.append('video', event.data, 'chunk.webm');

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/stream`, {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Video uploaded successfully:', data.url);
                    setData(data.url);
                    setMessage("Upload Successfully");
                } else {
                    console.error('Upload failed:', data.error);
                    setMessage("Upload Failed");
                }
            } catch (uploadError) {
                console.error('Error during video upload:', uploadError);
                setMessage("Upload Error");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Wrapper head='Live Video Stream' url={data} message={message}>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6"></h2>

            <video autoPlay className='mb-4' style={{ width: '100%', maxWidth: '600px', borderRadius: '8px' }}></video>

            <Button
                type="submit"
                isLoading={loading}
                onClick={isStreaming ? stopStreaming : startStreaming}
            >
                {isStreaming ? 'Stop Recording' : 'Start Recording'}
            </Button>
        </Wrapper>
    );
};

export default Page;
