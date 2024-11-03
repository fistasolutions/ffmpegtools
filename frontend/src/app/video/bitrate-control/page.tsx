"use client";
import axios from "axios";
import React, { useState } from "react";

const BitrateControl: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [bitrateType, setBitrateType] = useState<"constant" | "variable">("constant");
  const [bitrate, setBitrate] = useState<number>(1000); // Default bitrate in kbps
  const [uploadUrl, setUploadUrl] = useState<string | null>(null); // State to store the uploaded video URL
  const [loading, setLoading] = useState<boolean>(false); // State to track loading status

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("bitrateType", bitrateType);
    formData.append("bitrate", bitrate.toString());

    setLoading(true); // Set loading to true when processing starts

    try {
      const response = await axios.post(
        "http://localhost:5000/convert/vedio/bitratecontrol",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Set the uploaded video URL from response
      setUploadUrl(response.data.url);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false when processing is done
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Video Bitrate Control</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Bitrate Type:</label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="constant"
                checked={bitrateType === "constant"}
                onChange={() => setBitrateType("constant")}
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Constant</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="variable"
                checked={bitrateType === "variable"}
                onChange={() => setBitrateType("variable")}
                className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">Variable</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Bitrate (kbps):</label>
          <input
            type="number"
            value={bitrate}
            onChange={(e) => setBitrate(Number(e.target.value))}
            min="100"
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          disabled={loading} // Disable the button while loading
        >
          {loading ? "Processing..." : "Process Video"}
        </button>
      </form>
      {loading && (
        <div className="mt-4 text-center">
          <p>Loading...</p> {/* Replace with a spinner if desired */}
        </div>
      )}
      {uploadUrl && (
        <div className="mt-4">
          <h2 className="text-md font-semibold">Uploaded Video URL:</h2>
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {uploadUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default BitrateControl;
