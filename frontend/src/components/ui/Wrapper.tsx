import React from 'react';

interface WrapperProps {
    children: React.ReactNode;
    message?: string;
    head: string;
    url: string | undefined;
}

export default function Wrapper({ children, message, url, head }: WrapperProps) {
    return (
        <div className="flex items-center justify-center min-h-screen text-white">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{head}</h1>
                {children}
                {message && <p className="mt-4 text-center text-gray-800">{message}</p>}
                {url && (
                    <a
                        href={url}
                        target="_blank"
                        className="mt-4 inline-block text-center text-blue-600 underline"
                    >
                        Download
                    </a>
                )}
            </div>
        </div>
    );
}
