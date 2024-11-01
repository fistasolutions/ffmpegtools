'use client'; // Indicates that this component is a client component in Next.js
import React, { useState } from 'react';
import axios from 'axios';
import Wrapper from '@/src/components/ui/Wrapper';
import Button from '@/src/components/ui/button';

function Page() {
    const [file, setFile] = useState<File | null>(null);
    const [channel, setChannel] = useState<'mono' | 'stereo'>('stereo'); // Default to stereo
    const [loading, setLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        } else {
            console.error('No file selected');
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!file) {
            console.error('No audio file to submit');
            return;
        }

        setLoading(true); // Set loading state to true
        const formData = new FormData();
        formData.append('audio', file); // Append the audio file
        formData.append('channel', channel); // Append the selected channel type

        try {
            // Make an API request to upload the audio and convert channels
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio/channelcontrol`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Response:", res);
            console.log("Response data:", res.data);
            setResponse(res.data.output); // Set the response URL
        } catch (error) {
            console.error('Error uploading the file:', error);
            setResponse('Error converting audio.'); // Handle any errors
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <Wrapper head='Audio Channel Conversion' url={response ? response : undefined} message=''>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2 text-gray-700">Upload Audio File:</label>
                    <input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="border p-2 w-full text-gray-700"
                    />
                </div>
                <div className="mb-4 text-gray-700">
                    <label className="block mb-2 text-gray-700">Select Channel:</label>
                    <select
                        value={channel}
                        onChange={(e) => setChannel(e.target.value as 'mono' | 'stereo')} // Type assertion to ensure correct value type
                        className="border p-2 w-full"
                    >
                        <option value="stereo">Stereo</option>
                        <option value="mono">Mono</option>
                    </select>
                </div>
                <Button
                    type="submit"
                    isLoading={loading}
                >
                    {loading ? 'Converting...' : 'Convert'}
                </Button>
            </form>
        </Wrapper>
    );
}

export default Page;
