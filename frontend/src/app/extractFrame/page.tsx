"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";

interface Frame {
  url: string;
}

const FrameExtractor = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [frames, setFrames] = useState<Frame[]>([]);
  const [loading, setLoading] = useState(false);
  const [numberOfFrames, setNumberOfFrames] = useState(10);
  const videoRef = useRef(null);

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      setFrames([]); // Clear previous frames
    }
  };

  const extractFrames = async () => {
    if (!selectedVideo) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("video", selectedVideo);
    formData.append("frameRate", numberOfFrames.toString());

    try {
      const response = await axios.post(
        "http://localhost:5000/extract-frames",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setFrames(response.data.frames.map((url: string) => ({ url })));
      }
    } catch (error) {
      console.error("Error extracting frames:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="block text-lg text-white font-medium">
              Select Video
            </label>
            <div className="mb-6">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Extract Frames </p>
                  </div>
                  <input
                    ref={videoRef}
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoSelect}
                  />
                </label>
              </div>
            </div>
          </div>

          {videoPreview && (
            <div className="mt-4 flex justify-center items-center">
              <video
                ref={videoRef}
                src={videoPreview}
                controls
                className="w-60 rounded-lg"
              />
            </div>
          )}

          <div className="flex gap-4 justify-center items-center">
            <div className="space-y-1">
              <label className="block text-sm text-white font-medium">
                Number of Frames to Extract
              </label>
              <input
                type="number"
                value={numberOfFrames}
                onChange={(e) => setNumberOfFrames(Number(e.target.value))}
                min="1"
                max="100"
                className="w-32 p-2 border rounded"
                placeholder="Number of frames"
              />
            </div>
            <button
              onClick={extractFrames}
              disabled={!selectedVideo || loading}
              className="px-4 mt-10 py-2 bg-red-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Processing
                </>
              ) : (
                "Extract Frames"
              )}
            </button>
          </div>
        </div>
      </div>

      {frames.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {frames.map((frame, index) => (
            <div key={index} className="relative aspect-video">
              <Image
                fill
                src={`http://localhost:5000${frame.url}`}
                alt={`Frame ${index + 1}`}
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                priority={index < 4}
                onError={(e) => {
                  console.error(`Error loading image: ${frame.url}`);
                }}
              />
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-sm">
                Frame {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrameExtractor;
