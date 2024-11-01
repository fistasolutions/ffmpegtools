'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import React, { useState } from 'react';

const Page: React.FC = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [volume, setVolume] = useState<number>(1); // Default volume is 1 (100%)
    const [data, setData] = useState('')
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // Error message state
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message state

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setAudioFile(files[0]);
            setErrorMessage(null); // Clear previous error messages
            setSuccessMessage(null); // Clear previous success messages
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission
        if (!audioFile) {
            setErrorMessage('Please select an audio file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('audio', audioFile);
        formData.append('volume', volume.toString());

        setIsLoading(true); // Set loading state to true
        setErrorMessage(null); // Clear previous error messages
        setSuccessMessage(null); // Clear previous success messages
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio/voladjustment`, {
                method: 'POST',
                body: formData,
            });
            console.log("response:", response)
            if (!response.ok) {
                throw new Error('Failed to adjust volume. Please try again.');
            }

            const data = await response.json();
            setData(data?.url)
            console.log('Response from server:', data);
            setSuccessMessage('Volume adjusted successfully!'); // Success message
        } catch (error) {
            console.error('Error uploading audio:', error);
            setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    return (
        <Wrapper head='Volume Adjustment' url={data} message=''>
            <form onSubmit={handleUpload} className="space-y-4">
                {errorMessage && (
                    <div className="text-red-500">
                        {errorMessage}
                    </div>
                )}
                {successMessage && (
                    <div className="text-green-500">
                        {successMessage}
                    </div>
                )}
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="border rounded p-2 w-full text-gray-800"
                />
                <label className="block text-gray-800">
                    Volume: {Math.round(volume * 100)}%
                </label>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-full"
                />
                <Button type="submit" isLoading={isLoading}>
                    {isLoading ? 'Adjusting...' : 'Adjust Volume'}
                </Button>
            </form>
        </Wrapper>
    );
};

export default Page;
