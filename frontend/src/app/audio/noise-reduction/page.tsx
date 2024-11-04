'use client'
import { useState } from 'react';
import axios from 'axios';

const NoiseReduction = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [processing, setProcessing] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setAudioFile(file);
        setDownloadUrl(null); // Reset download URL when a new file is uploaded
    };

    const handleSubmit = async () => {
        if (!audioFile) {
            alert('Please upload an audio file');
            return;
        }

        setProcessing(true);

        const formData = new FormData();
        formData.append('audioFile', audioFile);

        try {
            const response = await axios.post('http://localhost:5000/convert/audio/noise-reduction', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response data:', response.data); // Log the entire response
            setDownloadUrl(response.data.url);
        } catch (error) {
            console.error('Error processing audio:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-4">Noise Reduction</h1>
            <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="mb-4 border p-2 rounded"
            />
            <button
                onClick={handleSubmit}
                disabled={processing}
                className={`px-4 py-2 bg-blue-500 text-white rounded ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                    }`}
            >
                {processing ? 'Processing...' : 'Apply Noise Reduction'}
            </button>

            {downloadUrl && (
                <a
                    href={downloadUrl}
                    download
                    className="mt-4 text-green-600 underline"
                >
                    Download Processed Audio
                </a>
            )}
        </div>
    );
};

export default NoiseReduction;
