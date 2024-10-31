'use client'
import React, { useRef, useState } from 'react';

const ScreenRecorder: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);
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
            console.log("Recording started");
        } catch (error) {
            console.error('Error starting screen recording:', error);
        }
    };


    // Stop recording
    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            console.log("Recording stopped");
        } else {
            console.log("No recording in progress");
        }
    };


    // Send recorded video to server
    const uploadRecording = async (blob: Blob) => {
        const formData = new FormData();
        formData.append('video', blob, 'recording.webm');

        try {
            setLoading(true); // Set loading to true before upload
            console.log("Preparing to upload video...");

            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/screenrecording`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Video uploaded successfully:', data.url);
                setData(data.url);
            } else {
                console.error('Upload failed:', data.error);
            }
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setLoading(false); // Set loading to false after upload
        }
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Screen Recording</h2>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                style={{
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    backgroundColor: isRecording ? '#e63946' : '#1d3557',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    marginTop: '20px'
                }}
            >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>

            {loading ? (
                <p className="mt-4 text-lg text-blue-500">Uploading, please wait...</p>
            ) : (
                data && (
                    <div className="mt-4 text-center">
                        <h3 className="text-lg text-green-500 mb-2">Split Videos:</h3>
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

export default ScreenRecorder;
