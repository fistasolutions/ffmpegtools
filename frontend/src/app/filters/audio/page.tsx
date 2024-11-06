'use client';
import { useState, FormEvent, ChangeEvent,useRef } from "react";
import {  Upload } from "lucide-react";

const EqualizerPage = () => {
  const [bass, setBass] = useState(5);
  const [treble, setTreble] = useState(5);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
    }
  };

  const handleApplyEqualizer = async (event: FormEvent) => {
    event.preventDefault();
    if (!videoFile) {
      alert("Please select a video file.");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("bass", bass.toString());
    formData.append("treble", treble.toString());

    try {
      const response = await fetch("http://localhost:5000/equalizer", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error("Error applying equalizer:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full ">
      <form onSubmit={handleApplyEqualizer}>
        <div>
          <label htmlFor="video">Select Video:</label>
          <div className="w-full mb-6">
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">Manage Audio </p>
                  </div>
                  <input
                    ref={videoRef}
                    type="file"
                    className="hidden"
                    accept="video/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </div>
        </div>

        <div>
          <label>Bass:</label>
          <input
            type="range"
            min="0"
            max="20"  
            value={bass}
            onChange={(e) => setBass(parseInt(e.target.value))}
          />
          <span>{bass}</span>
        </div>

        <div>
          <label>Treble:</label>
          <input
            type="range"
            min="0"
            max="20"  
            value={treble}
            onChange={(e) => setTreble(parseInt(e.target.value))}
          />
          <span>{treble}</span>
        </div>

        {loading ? "Loading..." : <button className="py-2 px-3 bg-red-600 text-white rounded mt-20" type="submit">Process Video</button>}
      </form>

      {videoUrl && (
        <div>
          <h3>Processed Video:</h3>
          <video src={videoUrl} controls style={{ width: "100%", maxHeight: "400px" }} />
          <a href={videoUrl} download="processed_video.mp4">
            Download Processed Video
          </a>
        </div>
      )}
    </div>
  );
};

export default EqualizerPage;
