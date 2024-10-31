'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';

export default function Home() {
    const [data, setData] = useState<{ url?: string } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Handle file selection
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);
        }
    };

    // Handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (files.length === 0) {
            setMessage('Please select at least one video file.'); // Show message if no files are selected
            return;
        }

        const formData = new FormData();
        files.forEach(file => formData.append('video', file)); // Append each video file

        setIsLoading(true); // Set loading to true
        setMessage(''); // Clear previous messages

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}merge/videos`, {
                method: 'POST',
                body: formData,
            });
            const responseData = await response.json();

            if (response.ok) {
                setData({ url: responseData.url }); // Set data with the URL
                setMessage('Merging successful!'); // Success message
            } else {
                setMessage(`Error: ${responseData.error || 'Unknown error occurred.'}`); // Show error message
            }
        } catch (error) {
            setMessage('Error: Failed to submit the form. Please try again.'); // Catch error
        } finally {
            setIsLoading(false); // Set loading to false after the request
        }
    };

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <Wrapper head='Video Merger' url={data?.url} message={message}>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    multiple
                    required
                    className="mb-4 w-full border border-gray-300 rounded-lg p-2 text-gray-800"
                />
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    {isLoading ? 'Merging...' : 'Merge Videos'}
                </Button>
            </form>
        </Wrapper>
    );
}
