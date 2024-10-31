'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import React, { useRef, useState } from 'react';

const ScreenRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    // Start screen recording
    const startRecording = async () => {
        try {
            console.log("Starting screen recording...");

            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: true
            });
            console.log("Stream obtained:", stream);

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });

            mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                    console.log("Data available:", event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                chunksRef.current = [];
                console.log("Recording stopped. Blob created:", blob);
                await uploadRecording(blob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setMessage('Recording...');
        } catch (error) {
            console.error('Error starting screen recording:', error);
            setMessage('Error starting recording.');
        }
    };

    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setMessage('Recording stopped...');
        } else {
            console.log("No recording in progress");
            setMessage('No recording in progress.');
        }
    };

    // Send recorded video to server
    const uploadRecording = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');

        try {
            setLoading(true); // Set loading to true before upload
            setMessage("Preparing to upload video...");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/screenrecording`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Video uploaded successfully:', data.url);
                setData(data.url);
                setMessage('Video uploaded successfully!');
                setIsRecording(false);
            } else {
                console.error('Upload failed:', data.error);
                setMessage(`Upload failed: ${data.error}`); // Show error message
            }
        } catch (error) {
            console.error('Error uploading video:', error);
            setMessage('Error uploading video.'); // Show error message
        } finally {
            setLoading(false); // Set loading to false after upload
            setIsRecording(false);
        }
    };

    return (
        <Wrapper head='Screen Recording' url={data} message={message}>
            <Button
                type="submit"
                isLoading={loading}
                onClick={isRecording ? stopRecording : startRecording}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
        </Wrapper>
    );
};

export default ScreenRecorder;
