'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Wrapper from '@/src/components/ui/Wrapper';
import Button from '@/src/components/ui/button';

const Page: React.FC = () => {
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [status, setStatus] = useState<string>('');
    const [resultUrl, setResultUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // State for loading

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAudioFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!audioFile) return;

        setStatus('Processing...');
        setLoading(true); // Set loading to true when processing starts

        const formData = new FormData();
        formData.append('audio', audioFile);

        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio/slienceremover`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResultUrl(response.data.url);
            setStatus('Conversion successful!');
        } catch (error) {
            console.error('Error processing audio:', error);
            setStatus('Failed to process audio.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper head='Audio Silence Removal' url={resultUrl} message={status}>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    className="border p-2 w-full text-gray-700 mb-4"
                />
                <Button
                    type="submit"
                    isLoading={loading} // Pass loading state to the Button
                >
                    {loading ? 'Removing...' : 'Remove Silence'}
                </Button>
            </form>
        </Wrapper>
    );
};

export default Page;
