'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Sidebar() {
    const pathname = usePathname();

    // Helper function to check if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="hidden sm:flex flex-col items-center gap-4 bg-gray-800 text-white w-96 min-h-full p-4">
            {/* Header */}
            <header className="text-2xl font-bold text-center mb-6">FFmpeg</header>
            {links.map((link: any) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className={`w-full rounded-lg text-center p-3 hover:bg-gray-700 transition ${isActive(link.href) ? "bg-gray-600" : ""
                        }`}
                >
                    {link.label}
                </Link>
            ))}
        </aside>
    );
}


const links = [
    { "href": "/image-processing", "label": "Image Processing" },
    { "href": "/audio-processing", "label": "Audio Processing" },
    { "href": "/merge-vedio", "label": "Merge Video" },
    { "href": "/screen-recording", "label": "Screen Recording" },
    { "href": "/streaming", "label": "Webcam Capture" },
    { "href": "/video-splitting", "label": "Vedio Trimmer" },
    { "href": "/video-trimmer", "label": "Vedio Splitting" },
    { "href": "/resize-image", "label": "Resize Image" },
]
