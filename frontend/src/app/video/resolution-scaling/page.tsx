'use client'
import { useState } from "react";
import axios from "axios";

const VideoUploader = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [resolution, setResolution] = useState<string>("1080p");
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleResolutionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setResolution(event.target.value);
  };

  const handleUpload = async () => {
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("resolution", resolution);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/convert/vedio/resolutionscaling", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setDownloadUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="mb-4"
      />
      <select onChange={handleResolutionChange} className="mb-4">
        <option value="1080p">1080p</option>
        <option value="720p">720p</option>
        <option value="480p">480p</option>
      </select>
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {loading ? "Processing..." : "Upload Video"}
      </button>
      {downloadUrl && (
        <a href={downloadUrl} className="mt-4 text-blue-500 underline" download>
          Download Resized Video
        </a>
      )}
    </div>
  );
};

export default VideoUploader;
