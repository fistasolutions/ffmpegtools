"use client";
import React, { useRef, useState } from "react";
import {
  Upload,
  Settings,
  RefreshCcw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const VideoFrameRateAdjuster = () => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>("");
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string>("");
  const [fps, setFps] = useState<string>("30");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const commonFpsOptions = ["24", "30", "60"];

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
      setProcessedVideoUrl("");
      setError("");
      setSuccess(false);
    }
  };

  const processVideo = async () => {
    if (!selectedVideo) return;

    setIsProcessing(true);
    setProgress(0);
    setError("");
    setSuccess(false);

    const formData = new FormData();
    formData.append("video", selectedVideo);
    formData.append("targetFps", fps);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      const response = await fetch("http://localhost:5000/convert/frame-rate", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to process video");
      }

      setProcessedVideoUrl(data.videoUrl);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full mx-auto p-4 space-y-6">
      <div>
        <div>
          <p className="flex text-white items-center gap-2">
            <Settings className="w-6 h-6" />
            Frame Rate Adjustment
          </p>
        </div>
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="mb-6 mt-10 w-full">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Change Frame rate</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleVideoSelect}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-around">
            <div>
              {videoPreview && (
                <div className="space-y-4">
                  <p className="text-white">Original Video</p>
                  <video
                    src={videoPreview}
                    controls
                    className="w-80 rounded-lg border"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
            <div>
              {processedVideoUrl && (
                <div className="space-y-4 text-white">
                  <p>Processed Video ({fps} FPS)</p>
                  <video
                    src={processedVideoUrl}
                    controls
                    className=" w-80 rounded-lg border"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>

          {selectedVideo && (
            <div className="space-y-4">
              <p>Target Frame Rate (FPS)</p>
              <div className="flex gap-4">
                <select
                  className="border-1 w-60 my-2 h-8 px-4 rounded border-gray-300 "
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                >
                  {commonFpsOptions.map((option) => (
                    <option key={option} value={option}>
                      {option} FPS
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={fps}
                  onChange={(e) => setFps(e.target.value)}
                  min="1"
                  max="120"
                  className="w-24 rounded px-1"
                  placeholder="Custom"
                />
              </div>

              <button
                onClick={processVideo}
                disabled={isProcessing}
                className="w-full bg-red-700 text-white px-4 py-2 rounded"
              >
                {isProcessing ? (
                  <div className="flex py-2 justify-center items-center">
                    Processing...
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                  </div>
                ) : (
                  <div className="flex justify-center items-center py-2">
                    <Settings className="w-4 h-4 mr-2" />
                    Adjust Frame Rate
                  </div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoFrameRateAdjuster;
