'use client';
import axios from 'axios';
import React, { useState, useEffect } from 'react';

const TextOverlay: React.FC = () => {
    const [text, setText] = useState('Your text will appear here');
    const [font, setFont] = useState('Arial');
    const [color, setColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(20);
    const [animation, setAnimation] = useState('none');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoURL, setVideoURL] = useState<string | null>(null);
    const [convertedVideoUrl, setConvertedVideoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false); // Loading state

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = event.target.files[0];
            setVideoFile(file);
            setVideoURL(URL.createObjectURL(file)); // Create a URL for the video preview
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent default form submission
        console.log("Button clicked.");
        if (!videoFile) return;

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('text', text);
        formData.append('font', font);
        formData.append('color', color);
        formData.append('fontSize', fontSize.toString());
        formData.append('animation', animation);

        // Call the API to process the video
        setLoading(true); // Set loading to true when starting the upload
        try {
            const response = await axios.post('http://localhost:5000/convert/edit/textoverlay', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("Response:", response.data);
            setConvertedVideoUrl(response.data.url); // Set the converted video URL from the response
        } catch (error) {
            console.error('Error uploading video:', error);
        } finally {
            setLoading(false); // Reset loading state when done
        }
    };

    // Clean up URL object when the component unmounts
    useEffect(() => {
        return () => {
            if (videoURL) {
                URL.revokeObjectURL(videoURL);
            }
        };
    }, [videoURL]);

    return (
        <div className="flex flex-col items-center rounded-lg shadow-lg p-6 bg-white">
            <h2 className="text-2xl font-bold mb-4">Text Overlay Customization</h2>

            <form onSubmit={handleSubmit} className="w-full">
                {/* Input field for custom text */}
                <div className="mb-4">
                    <label className="block text-gray-700">Custom Text:</label>
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                        placeholder="Enter your text"
                    />
                </div>

                {/* Font selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">Font:</label>
                    <select
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="Arial">Arial</option>
                        <option value="Courier New">Courier New</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                    </select>
                </div>

                {/* Text color selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">Text Color:</label>
                    <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="mt-1"
                    />
                </div>

                {/* Font size selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">Font Size:</label>
                    <input
                        type="range"
                        min="10"
                        max="100"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="mt-1 w-full"
                    />
                    <span>{fontSize}px</span>
                </div>

                {/* Animation selection */}
                <div className="mb-4">
                    <label className="block text-gray-700">Animation:</label>
                    <select
                        value={animation}
                        onChange={(e) => setAnimation(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    >
                        <option value="none">None</option>
                        <option value="fade">Fade</option>
                        <option value="slide">Slide</option>
                        <option value="bounce">Bounce</option>
                    </select>
                </div>

                {/* Video upload field */}
                <div className="mb-4">
                    <label className="block text-gray-700">Upload Video:</label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="mt-1"
                    />
                </div>
                <button
                    type="submit"
                    className={`bg-blue-500 text-white p-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading} // Disable the button while loading
                >
                    {loading ? (
                        <span className="loader"></span> // You can use your own loading spinner or just text
                    ) : (
                        'Upload Video with Overlay'
                    )}
                </button>
            </form>

            {/* Video preview section */}
            {videoURL && (
                <div className="relative mt-6 w-full">
                    <video controls className="w-full h-80 rounded-lg shadow-md">
                        <source src={videoURL} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                            color: color,
                            fontFamily: font,
                            fontSize: `${fontSize}px`,
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)',
                            transition: 'all 0.3s ease',
                            animation: animation === 'none' ? 'none' : `${animation} 1s`,
                        }}
                    >
                        {text}
                    </div>
                </div>
            )}
            {convertedVideoUrl && (
                <a href={convertedVideoUrl} target='_blank' rel="noopener noreferrer" className='text-red-600'>Download Video</a>
            )}
        </div>
    );
};

export default TextOverlay;
