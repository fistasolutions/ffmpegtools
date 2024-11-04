'use client'
import React, { useState } from 'react';
import axios from 'axios';
import Wrapper from '@/src/components/ui/Wrapper';

const Page = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [convertedVideoUrl, setConvertedVideoUrl] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [filter, setFilter] = useState<string>('none'); // Default filter

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setVideoFile(file);
        setConvertedVideoUrl(null); // Reset video URL when a new file is uploaded
    };

    const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFilter(event.target.value); // Update selected filter
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior

        if (!videoFile) {
            alert('Please upload a video file');
            return;
        }

        setProcessing(true);

        const formData = new FormData();
        formData.append('videoFile', videoFile); // Append the video file
        formData.append('filter', filter); // Append the selected filter

        try {
            const response = await axios.post('http://localhost:5000/convert/edit/filtervedio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("response:", response.data);
            setConvertedVideoUrl(response.data.url); // Assume the response includes the URL of the converted image
        } catch (error) {
            console.error('Error converting video to image:', error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Wrapper head='Filter Video' url=''>
            <h1 className="text-2xl font-bold mb-4"></h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="mb-4 border p-2 rounded text-gray-800"
                />
                <select
                    value={filter}
                    onChange={handleFilterChange}
                    className="mb-4 border p-2 rounded text-gray-800"
                >
                    <option value="">Select Filter</option>
                    <option value="hue=s=0">Grayscale</option>
                    <option value="colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131">Sepia</option>
                    <option value="boxblur=10:1">Blur</option>
                    {/* Add more filters as needed */}
                </select>
                <button
                    type="submit"
                    disabled={processing}
                    className={`px-4 py-2 bg-blue-500 text-white rounded ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {processing ? 'Processing...' : 'Filter Vedio'}
                </button>
            </form>

            {convertedVideoUrl && (
                <a href={convertedVideoUrl} target='_blank' className='text-red-600'>Download Vedio</a>
            )}
        </Wrapper>
    );
};

export default Page;
