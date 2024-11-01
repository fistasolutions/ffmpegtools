'use client'
import Button from '@/src/components/ui/button';
import Wrapper from '@/src/components/ui/Wrapper';
import { useState } from 'react';

const Page: React.FC = () => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setIsLoading(true);

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/audio/extractor`, {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            setAudioUrl(data.url); // Assuming your backend returns a URL in the response
        } else {
            alert('Error extracting audio. Please try again.');
        }

        setIsLoading(false);
    };

    return (
        <Wrapper url={audioUrl ? audioUrl : undefined} head='Extract Audio from Video'>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <input
                        type="file"
                        id="video-file"
                        name="video"
                        accept="video/*"
                        className="border border-gray-300 rounded-md p-2 w-full text-gray-700"
                        required
                    />
                </div>
                <Button
                    type="submit"
                    isLoading={isLoading}
                >
                    {isLoading ? 'Extracting...' : 'Extract Audio'}
                </Button>
            </form>
        </Wrapper>
    );
};

export default Page;