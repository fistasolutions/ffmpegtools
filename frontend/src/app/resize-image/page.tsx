'use client';
import Link from 'next/link';
import React, { useState } from 'react';

const Page: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [height, setHeight] = useState<number>();
    const [width, setWidth] = useState<number>();
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successUrl, setSuccessUrl] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
            setErrorMessage(null); // Clear any previous errors
            setSuccessUrl(null); // Clear any previous success messages
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!image || height == null || width == null) return;

        setLoading(true); // Set loading to true
        setErrorMessage(null); // Clear any previous errors
        setSuccessUrl(null); // Clear any previous success messages

        const formData = new FormData();
        formData.append('image', image);
        formData.append('height', height.toString());
        formData.append('width', width.toString());

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/resizeimage`, {
                method: 'POST',
                body: formData,
            });

            setLoading(false); // Reset loading state

            if (response.ok) {
                const result = await response.json();
                console.log('Cropped image URL:', result.url);
                setSuccessUrl(result.url); // Set the success URL
                setHeight(0)
                setImage(null)
                setWidth(0)
            } else {
                const errorText = await response.text();
                console.error('Error uploading image:', errorText);
                setErrorMessage('Error uploading image. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            setLoading(false); // Reset loading state
            setErrorMessage('An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Resize Image</h2>
                {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
                {successUrl && (
                    <div className="mb-4 text-green-500">
                        <Link href={successUrl} target="_blank">
                            Resize image URL
                        </Link>
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="width" className="block text-sm font-medium text-gray-700">Width (px)</label>
                        <input
                            type="number"
                            id="width"
                            value={width}
                            onChange={(e) => setWidth(Number(e.target.value))}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (px)</label>
                        <input
                            type="number"
                            id="height"
                            value={height}
                            onChange={(e) => setHeight(Number(e.target.value))}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? 'Processing...' : 'Crop Image'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Page


// 'use client';
// import React, { useState } from 'react';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import Link from 'next/link';
// import 'react-tabs/style/react-tabs.css';

// const Page: React.FC = () => {
//     const [image, setImage] = useState<File | null>(null);
//     const [height, setHeight] = useState<number>(0);
//     const [width, setWidth] = useState<number>(0);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);
//     const [successUrl, setSuccessUrl] = useState<string | null>(null);
//     const [aspectRatioLocked, setAspectRatioLocked] = useState<boolean>(true);
//     const [percentage, setPercentage] = useState<number>(100);
//     const [unit, setUnit] = useState<string>('px');
//     const [imageFormat, setImageFormat] = useState<string>('png');

//     const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//         if (event.target.files && event.target.files[0]) {
//             setImage(event.target.files[0]);
//             setErrorMessage(null);
//             setSuccessUrl(null);
//         }
//     };

//     const handleUnitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setUnit(event.target.value);
//     };

//     const handleSubmit = async (event: React.FormEvent) => {
//         event.preventDefault();
//         if (!image || height <= 0 || width <= 0) return;

//         setLoading(true);
//         setErrorMessage(null);
//         setSuccessUrl(null);

//         const formData = new FormData();
//         formData.append('image', image);
//         formData.append('height', height.toString());
//         formData.append('width', width.toString());
//         formData.append('unit', unit);
//         formData.append('format', imageFormat);

//         try {
//             const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}convert/resizeimage`, {
//                 method: 'POST',
//                 body: formData,
//             });

//             setLoading(false);

//             if (response.ok) {
//                 const result = await response.json();
//                 setSuccessUrl(result.url);
//                 setHeight(0);
//                 setImage(null);
//                 setWidth(0);
//             } else {
//                 const errorText = await response.text();
//                 setErrorMessage('Error uploading image. Please try again.');
//             }
//         } catch (error) {
//             setLoading(false);
//             setErrorMessage('An unexpected error occurred. Please try again.');
//         }
//     };

//     return (
//         <div className="flex h-screen bg-gray-100">
//             <div className="bg-white p-8 w-1/3 shadow-lg rounded-lg">
//                 <h2 className="text-3xl font-semibold mb-4 text-center text-blue-600">Resize Image</h2>
//                 {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
//                 {successUrl && (
//                     <div className="mb-4 text-green-500">
//                         <Link href={successUrl} target="_blank" className="underline">
//                             Resized image URL
//                         </Link>
//                     </div>
//                 )}
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-6">
//                         <label htmlFor="image" className="block text-sm font-medium text-gray-700">Upload Image</label>
//                         <input
//                             type="file"
//                             id="image"
//                             accept="image/*"
//                             onChange={handleImageChange}
//                             required
//                             className="mt-1 block w-full text-sm text-gray-500
//                     file:mr-4 file:py-2 file:px-4
//                     file:rounded-md file:border-0
//                     file:text-sm file:font-semibold
//                     file:bg-blue-500 file:text-white
//                     hover:file:bg-blue-600
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
//                         />
//                     </div>
//                     <Tabs>
//                         <TabList className="flex space-x-2 mb-4">
//                             <Tab className="tab">Dimension</Tab>
//                             <Tab className="tab">Percentage</Tab>
//                         </TabList>

//                         <TabPanel>
//                             <div className="mb-4 flex items-center gap-3">
//                                 <input
//                                     type="number"
//                                     id="width"
//                                     value={width}
//                                     placeholder='Width'
//                                     onChange={(e) => setWidth(Number(e.target.value))}
//                                     required
//                                     className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
//                                 />
//                                 <input
//                                     type="number"
//                                     id="height"
//                                     value={height}
//                                     placeholder='Height'
//                                     onChange={(e) => setHeight(Number(e.target.value))}
//                                     required
//                                     className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <select value={unit} onChange={handleUnitChange} className="mt-2 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150">
//                                     <option value="px">px</option>
//                                     <option value="cm">cm</option>
//                                     <option value="mm">mm</option>
//                                 </select>
//                             </div>

//                             <div className="mb-4 flex items-center">
//                                 <input
//                                     type="checkbox"
//                                     id="lockAspect"
//                                     checked={aspectRatioLocked}
//                                     onChange={() => setAspectRatioLocked(!aspectRatioLocked)}
//                                     className="mr-2"
//                                 />
//                                 <label htmlFor="lockAspect" className="text-sm font-medium text-gray-700">Lock Aspect Ratio</label>
//                             </div>
//                             <div className="mb-4">
//                                 <label htmlFor="format" className="block text-sm font-medium text-gray-700">Download Format</label>
//                                 <select value={imageFormat} onChange={(e) => setImageFormat(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150">
//                                     <option value="png">PNG</option>
//                                     <option value="jpeg">JPEG</option>
//                                     <option value="gif">GIF</option>
//                                 </select>
//                             </div>
//                         </TabPanel>

//                         <TabPanel>
//                             <div className="mb-4">
//                                 <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">Resize Percentage</label>
//                                 <input
//                                     type="range"
//                                     id="percentage"
//                                     min="1"
//                                     max="100"
//                                     value={percentage}
//                                     onChange={(e) => setPercentage(Number(e.target.value))}
//                                     className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2
//                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 <div className="flex justify-between text-sm">
//                                     <span>1%</span>
//                                     <span>100%</span>
//                                 </div>
//                             </div>
//                         </TabPanel>
//                     </Tabs>
//                     <button
//                         type="submit"
//                         className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//                         disabled={loading}
//                     >
//                         {loading ? <div
//                             className={`border-t-transparent border-solid rounded-full animate-spin border-4`}
//                             style={{
//                                 width: `4rem`, // Using rem for responsive sizing
//                                 height: `4rem`,
//                                 borderColor: 'rgba(0, 0, 0, 0.1)', // Light gray border
//                                 borderTopColor: '#3498db', // Blue top border
//                             }}
//                         /> : 'Resize Image'}
//                     </button>
//                 </form>
//             </div>
//             <div className="bg-gray-200 w-2/3 flex items-center justify-center p-10">
//                 {image && (
//                     <img
//                         src={URL.createObjectURL(image)}
//                         alt="Preview"
//                         className="max-w-full max-h-full object-contain border border-gray-300 rounded-lg shadow-lg"
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Page;
