'use client';
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

export default function Home() {
    const router = useRouter();
    const [data, setData] = useState<{ url?: string } | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [downloadUrl, setDownloadUrl] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Loading state

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            setFile(selectedFile);
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
            console.log("response:", response)
            const data = response.data;
            console.log("data:", data);

            if (response.status === 200) {
                setData(data)
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
        <Wrapper message={message} url={data?.url} head='JPG to WebP Converter'>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept=".jpg, .jpeg"
                    onChange={handleFileChange}
                    required
                    className="mb-4 w-full border border-gray-300 rounded-lg p-2 text-gray-700"
                />
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
