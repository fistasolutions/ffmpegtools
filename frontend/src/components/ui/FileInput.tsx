import React from 'react';

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange, ...props }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileChange(event.target.files ? event.target.files[0] : null);
  };

  return (
    <input
      type="file"
      onChange={handleChange}
      required
      className="text-gray-800 mb-4 p-2 border rounded w-full"
      {...props}
    />
  );
};

export default FileInput;
