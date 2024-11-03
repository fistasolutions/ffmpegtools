'use client';
import Button from "@/src/components/ui/button";
import FileInput from "@/src/components/ui/FileInput";
import { usePostHandler } from "@/src/components/ui/postEndpoint";
import Wrapper from "@/src/components/ui/Wrapper";
import React, { useState } from "react";

const AudioUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState("mp3");
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<FormData | null>(null);
  const { data, error, isLoading } = usePostHandler("convert/audio", formData);

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile);
    setMessage(""); // Clear previous messages
  };

  const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOutputFormat(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return; // Exit if no file is selected

    const newFormData = new FormData();
    newFormData.append("audio", file);
    newFormData.append("format", outputFormat);
    setFormData(newFormData); // Update formData state
  };

  // Update message based on response
  React.useEffect(() => {
    if (data) {
      setMessage("Conversion successful!");
    }
    if (error) {
      setMessage(error);
    }
  }, [data, error]);

  return (
    <Wrapper head="Audio Conversion - Muzammil" message={message} url={data?.url}>
      <form onSubmit={handleSubmit}>
        <FileInput onFileChange={handleFileChange} accept="audio/*" required />
        <select
          value={outputFormat}
          onChange={handleFormatChange}
          className="mb-4 p-2 border rounded w-full text-gray-800"
        >
          <option value="mp3">MP3</option>
          <option value="wav">WAV</option>
        </select>

        <Button type="submit" isLoading={isLoading}>
          {isLoading ? "Converting..." : "Convert"}
        </Button>
      </form>
    </Wrapper>
  );
};

export default AudioUpload;
