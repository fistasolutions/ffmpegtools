"use client";
import Button from "@/src/components/ui/button";
import Wrapper from "@/src/components/ui/Wrapper";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("mp4");
  const [message, setMessage] = useState<string>("");
  const [outputUrl, setOutputUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setOutputUrl("");
    setLoading(true);

    try {
      if (!file) {
        setMessage("Please select a file to convert.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("format", format);

      const res = await fetch("http://localhost:5000/convert", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Response Data:", data);

      if (res.ok) {
        setMessage("Conversion successful!");
        setOutputUrl(data.url);
      } else {
        setMessage(data.error || "An error occurred during conversion");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  return (
    <Wrapper head="Video Format Converter" url={outputUrl} message={message}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
            className="mb-2 text-gray-800"
          />
        </div>
        <div>
          <select
            onChange={(e) => setFormat(e.target.value)}
            value={format}
            className="p-2 border rounded text-gray-800 w-full"
          >
            <option value="mp4">MP4</option>
            <option value="avi">AVI</option>
            <option value="mkv">MKV</option>
            <option value="webm">WEBM</option>
          </select>
        </div>
        <Button type="submit" isLoading={loading}>
          {loading ? "Converting..." : "Convert"}
        </Button>
      </form>
    </Wrapper>
  );
}
