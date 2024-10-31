'use client';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function Home() {
    const [data, setData] = useState<{ url?: string } | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [message, setMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            setFiles(selectedFiles);
            setMessage('');
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach(file => formData.append('video', file)); // Append each video file

        setIsLoading(true); // Set loading to true

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}merge/videos`, {
                method: 'POST',
                body: formData,
            });
            const responseData = await response.json(); // Renamed variable to avoid confusion

            if (response.ok) {
                setData({ url: responseData.url }); // Set data with the URL
                setMessage('Merging successful!');
            } else {
                setMessage(`Error: ${responseData.error}`);
            }
        } catch (error) {
            setMessage('Error: Failed to submit the form');
        } finally {
            setIsLoading(false); // Set loading to false after the request
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Video Merger</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        multiple
                        required
                        className="mb-4 w-full border border-gray-300 rounded-lg p-2 text-gray-800"
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Merging...' : 'Merge Videos'}
                    </button>
                </form>
                {isLoading && (
                    <div className="mt-4 text-center">
                        <svg
                            className="animate-spin h-5 w-5 text-blue-600 mx-auto"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 0116 0A8 8 0 014 12z"
                            />
                        </svg>
                        <p className="text-gray-800">Please wait...</p>
                    </div>
                )}
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
                {data?.url && (
                    <a
                        href={data.url}
                        target="_blank"
                        className="mt-4 inline-block text-center text-blue-600 underline"
                    >
                        Download Merged Video
                    </a>
                )}
            </div>
        </div>
    );
}
