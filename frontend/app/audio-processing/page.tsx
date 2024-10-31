'use client';
import { useState, ChangeEvent, FormEvent } from 'react';


export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setFileName(selectedFile.name); // Update the file name state
            setMessage(''); // Reset message on file change
            setDownloadUrl(''); // Reset download URL on file change
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('audio', file); // Ensure 'audio' matches the backend input name

        setIsLoading(true); // Set loading to true

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setMessage('Conversion successful!');
                setDownloadUrl(data.output); // Assuming the output contains the filename
            } else {
                setMessage(`Error: ${data.error}`);
                setDownloadUrl(''); // Reset download URL on error
            }
        } catch (error) {
            setMessage('Error: Failed to submit the form');
            setDownloadUrl(''); // Reset download URL on error
        } finally {
            setIsLoading(false); // Set loading to false regardless of success or error
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">MP3 to WAV Converter</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".mp3"
                        onChange={handleFileChange}
                        required
                        className="mb-4 w-full border border-gray-300 rounded-lg p-2"
                    />
                    {fileName && ( // Conditionally render the file name if it exists
                        <p className="text-gray-700 mb-2">Selected file: <strong>{fileName}</strong></p>
                    )}
                    <button
                        type="submit"
                        className={`w-full px-4 py-2 rounded-lg transition duration-300 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                        disabled={isLoading} // Disable button while loading
                    >
                        {isLoading ? 'Converting...' : 'Convert'}
                    </button>
                </form>
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
                {downloadUrl && ( // Conditionally render download link if available
                    <a
                        href={`http://localhost:5000/uploads/audio/${downloadUrl}`}
                        download
                        className="mt-4 inline-block text-center text-blue-600 underline"
                    >
                        Download your converted audio
                    </a>
                )}
            </div>
        </div>
    );
}
