'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import { useState, ChangeEvent, FormEvent } from 'react';


export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [outputFormat, setOutputFormat] = useState<string>('mp3');

    const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setOutputFormat(event.target.value);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
            setMessage(''); // Reset message on file change
            setDownloadUrl(''); // Reset download URL on file change
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!file) return;

        const formData = new FormData();
        formData.append('audio', file);
        formData.append('format', outputFormat);
        setIsLoading(true); // Set loading to true

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio`, {
                method: 'POST',
                body: formData,
            });
            console.log("response:", response)
            const data = await response.json();
            console.log("data:", data)
            if (response.ok) {
                setMessage('Conversion successful!');
                setDownloadUrl(data.url); // Assuming the output contains the filename
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
        <Wrapper head='MP3 to WAV Converter' url={downloadUrl} message={message}>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Upload Audio File:</label>
                    <input
                        type="file"
                        accept=".mp3"
                        onChange={handleFileChange}
                        required
                        className="mb-4 w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Select Output Format:</label>
                    <select
                        value={outputFormat}
                        onChange={handleFormatChange}
                        className="mt-2 block w-full border border-gray-300 text-gray-800 rounded-md p-2"
                    >
                        <option value="mp3">MP3</option>
                        <option value="wav">WAV</option>
                    </select>
                </div>
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    {isLoading ? 'Converting...' : 'Convert'}
                </Button>
            </form>
        </Wrapper >
    );
}
