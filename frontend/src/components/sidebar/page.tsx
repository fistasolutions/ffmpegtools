'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    // Helper function to check if a link is active
    const isActive = (path: string) => pathname === path;

    return (
        <aside className="hidden sm:flex flex-col items-center gap-4 bg-gray-800 text-white w-96 p-4">
            {/* Header */}
            <header className="text-2xl font-bold text-center mb-6">FFmpeg</header>
            {allLinks.map((section, index) => (
                <div key={index} className="w-full">
                    {/* Heading */}
                    <h2 className="text-lg font-semibold mb-2 text-red-500">{section.heading}</h2>
                    {/* Links under each heading */}
                    {section.child.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`block w-full rounded-lg text-center p-3 hover:bg-gray-700 transition ${isActive(link.href) ? "bg-gray-600" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            ))}
        </aside>
    );
}

type LinkItem = {
    href: string;
    label: string;
};

type Section = {
    heading: string;
    child: LinkItem[];
};

const allLinks = [
    {
        heading: "Basic Format Conversion",
        child: [
            { href: "/format-conversion/video", label: "Video Format Conversion (MP4 to AVI)" },
            { href: "/format-conversion/audio", label: "Audio Format Conversion (WAV to MP3)" },
        ]
    },
    {
        heading: "Video Processing",
        child: [
            { href: "/video/encoding", label: "Encoding and Decoding (H.264, VP8)" },
            { href: "/video/resolution-scaling", label: "Resolution Scaling" },
            { href: "/video/frame-rate", label: "Frame Rate Adjustment" },
            { href: "/video/bitrate-control", label: "Bitrate Control" },
            { href: "/video/platform-compatibility", label: "Format Compatibility" },
            { href: "/video/speed-control", label: "Speed Control" },
            { href: "/video/rotate", label: "Transpose/Rotate" },
            { href: "/video/cropping", label: "Cropping and Padding" },
            { href: "/video/aspect-ratio", label: "Aspect Ratio Adjustments" },
            { href: "/video/looping", label: "Looping" },
            { href: "/video/split", label: "Splitting" }
        ]
    },
    {
        heading: "Audio Processing",
        child: [
            { href: "/audio/extraction", label: "Audio Extraction" },
            { href: "/audio/encoding", label: "Audio Encoding" },
            { href: "/audio/volume-adjustment", label: "Volume Adjustment" },
            { href: "/audio/channel-control", label: "Channel Control" },
            { href: "/audio/mixing", label: "Audio Mixing" },
            { href: "/audio/silence-removal", label: "Silence Removal" },
            { href: "/audio/noise-reduction", label: "Noise Reduction" }
        ]
    },
    {
        heading: "Editing and Trimming",
        child: [
            { href: "/edit/trim", label: "Cutting and Trimming" },
            { href: "/edit/concat", label: "Joining/Stitching (Concatenation)" },
            { href: "/edit/subtitles", label: "Subtitles and Closed Captions" },
            { href: "/edit/overlay", label: "Overlay Images/Watermarks" },
            { href: "/edit/filters", label: "Filter Chains" },
            { href: "/edit/text-overlay", label: "Text Overlay" }
        ]
    },
    {
        heading: "Filters and Effects",
        child: [
            { href: "/filters/video", label: "Video Filters" },
            { href: "/filters/audio", label: "Audio Filters" },
            { href: "/filters/color-grading", label: "Color Grading" },
            { href: "/filters/stabilization", label: "Motion Stabilization" },
            { href: "/filters/equalizer", label: "Equalizer" },
            { href: "/filters/dynamic-range", label: "Dynamic Range Compression" }
        ]
    },
    {
        heading: "Subtitles and Text Processing",
        child: [
            { href: "/subtitles/embedding", label: "Subtitle Embedding" },
            { href: "/subtitles/conversion", label: "Subtitle Conversion" },
            { href: "/subtitles/burn-in", label: "Burn-in Subtitles" },
            { href: "/subtitles/animations", label: "Text Animations" }
        ]
    },
    {
        heading: "Screenshots and Thumbnails",
        child: [
            { href: "/screenshots/extract", label: "Extract Frames" },
            { href: "/screenshots/thumbnails", label: "Create Thumbnails" },
            { href: "/screenshots/animated", label: "Animated Thumbnails" }
        ]
    },
    {
        heading: "Live Streaming and Recording",
        child: [
            { href: "/streaming/protocols", label: "Streaming Protocols" },
            { href: "/recording/screen", label: "Screen Recording" },
            { href: "/recording/webcam", label: "Webcam Capture" },
            { href: "/streaming/network", label: "Network Streaming" },
            { href: "/streaming/copy", label: "Stream Copying" }
        ]
    },
    {
        heading: "Metadata and Analysis",
        child: [
            { href: "/metadata/editing", label: "Metadata Editing" },
            { href: "/metadata/analysis", label: "Stream Analysis" },
            { href: "/metadata/bitrate-management", label: "Bitrate Management" },
            { href: "/metadata/detection", label: "Format Detection" },
            { href: "/metadata/preview-grids", label: "Thumbnail Preview Grids" }
        ]
    },
    {
        heading: "Advanced Video Techniques",
        child: [
            { href: "/advanced/chroma-keying", label: "Green Screen (Chroma Keying)" },
            { href: "/advanced/multi-angle", label: "Multi-Angle Video" },
            { href: "/advanced/abr", label: "Adaptive Bitrate Streaming (ABR)" },
            { href: "/advanced/audio-tracks", label: "Dynamic Audio Track Management" },
            { href: "/advanced/hdr-conversion", label: "HDR to SDR Conversion" }
        ]
    },
    {
        heading: "Specialized Applications",
        child: [
            { href: "/specialized/timelapse", label: "Timelapse Creation" },
            { href: "/specialized/hyperlapse", label: "Hyperlapse" },
            { href: "/specialized/gif", label: "GIF Creation" },
            { href: "/specialized/denoising", label: "Denoising" },
            { href: "/specialized/3d-conversion", label: "3D Video Conversion" }
        ]
    },
    {
        heading: "Custom Encoding Options",
        child: [
            { href: "/encoding/hardware", label: "Hardware Acceleration" },
            { href: "/encoding/multi-pass", label: "Multi-pass Encoding" },
            { href: "/encoding/profiles", label: "Encoding Profiles" }
        ]
    },
    {
        heading: "Error Resilience and Recovery",
        child: [
            { href: "/error/correction", label: "Error Correction" },
            { href: "/error/detection", label: "Error Detection" },
            { href: "/error/tolerance", label: "Fault Tolerance" }
        ]
    }
];
