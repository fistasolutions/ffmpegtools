"use client";
import React, { useState } from "react";
import axios from "axios";

const FormatCompatibility: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("mp4");
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFormat(event.target.value);
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("format", format);

    setUploading(true);
    setError(null);
    setUploadUrl(null);

    try {
      
      const response = await axios.post("http://localhost:5000/convert/vedio/formatcompatibility", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setUploadUrl(response.data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Error uploading video. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Video Format Compatibility</h1>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <select
        value={format}
        onChange={handleFormatChange}
        className="mb-4 border rounded p-2 w-full"
      >
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
        <option value="avi">AVI</option>
        <option value="mkv">MKV</option>
      </select>
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white rounded p-2"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>
      {uploadUrl && (
        <div className="mt-4">
          <a
            href={uploadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Download Converted Video
          </a>
        </div>
      )}
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};

export default FormatCompatibility;
