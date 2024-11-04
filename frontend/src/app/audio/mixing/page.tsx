"use client";
import axios from "axios";
import React, { useState } from "react";

const AudioMixing: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<File[]>([]);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAudioFiles(filesArray);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (audioFiles.length === 0) return;

    const formData = new FormData();
    audioFiles.forEach((file) => {
      formData.append("audioFiles", file);
    });

    setLoading(true); // Set loading to true when processing starts

    try {
      const response = await axios.post(
        "http://localhost:5000/convert/audio/mixAudio", // Your backend endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadUrl(response.data.url); // URL of mixed audio
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false); // Set loading to false when processing is done
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-xl font-semibold mb-4">Audio Mixing</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-700">Upload Audio Files:</label>
          <input
            type="file"
            accept="audio/*"
            multiple
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
          disabled={loading} // Disable button while loading
        >
          {loading ? "Mixing..." : "Mix Audio"}
        </button>
      </form>
      {uploadUrl && (
        <div className="mt-4">
          <h2 className="text-md font-semibold">Mixed Audio URL:</h2>
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

export default AudioMixing;
