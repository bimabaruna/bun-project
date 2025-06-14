import { useRef, useState } from "react";
import { uploadImage } from "../lib/uploadImage";
import { X } from "lucide-react"; // Optional: use Lucide icon or replace with plain ✕ text

interface UploadImageInputProps {
  token: string;
  onUploadSuccess: (url: string, file: File | null) => void;
}

export function UploadImageInput({ token, onUploadSuccess }: UploadImageInputProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file, token);
      setPreviewUrl(uploadedUrl);
      onUploadSuccess(uploadedUrl, file);
    } catch (error) {
      alert("Image upload failed");
      console.error(error);
    }
  };

  const handleCancelImage = () => {
    setPreviewUrl(null);
    onUploadSuccess("", null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      <label className="mt-4 text-gray-700">Product Image</label>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700
          file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 mt-2"
      />

      {previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-60 h-60 object-cover rounded-xl border border-gray-300 shadow-md transition duration-300"

          />
          <button
            onClick={handleCancelImage}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            aria-label="Cancel image"
          >
            <X className="w-5 h-5 text-gray-500" />

          </button>
        </div>
      )}
    </div>
  );
}
