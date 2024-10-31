'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function Home() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setMessage('');
            setDownloadUrl('');
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setLoading(true); // Start loading
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const data = response.data;
            console.log("data:", data);

            if (response.status === 200) {
                setMessage('Conversion successful!');
                setDownloadUrl(data.output);
                router.refresh();
            } else {
                setMessage(`Error: ${data.error}`);
                setDownloadUrl('');
            }
        } catch (error) {
            console.error(error);
            setMessage('Error: Failed to submit the form');
            setDownloadUrl('');
        } finally {
            setLoading(false); // Stop loading after request completes
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">JPG to WebP Converter</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".jpg, .jpeg"
                        onChange={handleFileChange}
                        required
                        className="mb-4 w-full border border-gray-300 rounded-lg p-2"
                    />
                    {fileName && (
                        <p className="text-gray-700 mb-2">Selected file: <strong>{fileName}</strong></p>
                    )}
                    <button
                        type="submit"
                        disabled={loading} // Disable button during loading
                        className={`w-full px-4 py-2 rounded-lg transition duration-300 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? 'Converting...' : 'Convert'} {/* Show loading text */}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
                {downloadUrl && (
                    <a
                        href={`http://localhost:5000${downloadUrl}`}
                        download
                        className="mt-4 inline-block text-center text-blue-600 underline"
                    >
                        Download your converted image
                    </a>
                )}
            </div>
        </div>
    );
}
