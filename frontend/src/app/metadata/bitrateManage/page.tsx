'use client'
// pages/uploadVideo.tsx
import React, { useState } from "react";
import axios from "axios";

const UploadVideo = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleBitrateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBitrate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!videoFile || !bitrate) {
      alert("Please select a video file and enter a bitrate.");
      return;
    }

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("bitrate", bitrate);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/adjust-bitrate",
        formData
      );

      // Save the Cloudinary URL from the response
      setVideoUrl(response.data.url);
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Upload Video and Adjust Bitrate</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Video File:</label>
          <input type="file" accept="video/*" onChange={handleFileChange} />
        </div>
        <div>
          <label>Bitrate (kbps):</label>
          <input
            type="number"
            value={bitrate}
            onChange={handleBitrateChange}
            placeholder="Enter bitrate in kbps"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload and Adjust Bitrate"}
        </button>
      </form>

      {videoUrl && (
        <div style={{ marginTop: "1rem" }}>
          <h2>Processed Video:</h2>
          <video controls src={videoUrl} style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
};

export default UploadVideo;
