'use client'
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    // Helper function to check if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="hidden sm:flex flex-col items-center gap-4 bg-gray-800 text-white w-96 min-h-full p-4 overflow-y-scroll">
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
    { "href": "/image/image-converter", "label": "Image Converter" },
    { "href": "/image/image-resize", "label": "Image Resize" },
    { "href": "/audio/audio-converter", "label": "Audio Converter" },
    { "href": "/audio/audio-extraction", "label": "Audio Extraction" },
    { "href": "/audio/volume-adjustment", "label": "Volume Adjustment" },
    { "href": "/audio/channel-control", "label": "Audio Channel" },
    { "href": "/audio/silence-remover", "label": "Slience Remover" },
    { "href": "/vedio/screen-recording", "label": "Screen Recording" },
    { "href": "/vedio/streaming-vedio", "label": "Webcam Capture" },
    { "href": "/vedio/merge-vedio", "label": "Video Merge" },
    { "href": "/vedio/trim-vedio", "label": "Vedio Trim" },
    { "href": "/vedio/split-vedio", "label": "Vedio Split" },
    { "href": "/vedioSpeedControl", "label": "Vedio Speed Control" },
    { "href": "/encoding", "label": "Vedio Enhance" },
    { "href": "/vp8", "label": "Vedio Enhance (VP8/VP9)" },
]
