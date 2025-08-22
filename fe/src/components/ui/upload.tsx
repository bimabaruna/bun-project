import { useRef, useState } from "react";
import { uploadImage } from "@/lib/uploadImage";
import { X, Plus } from "lucide-react"; // Optional: use Lucide icon or replace with plain ✕ text

interface UploadImageInputProps {
  token: string;
  onUploadSuccess: (url: string, file: File | null) => void;
}

export function Upload({ token, onUploadSuccess }: UploadImageInputProps) {
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
    <div className="relative mt-4 mb-8 w-60 h-60">
      <label className=" text-gray-700">Product Image</label>
      {!previewUrl && (
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()} // 👈 manually trigger click
            className="flex items-center justify-center w-60 h-60 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 transition "
          >
            <Plus className="w-10 h-10 text-gray-400" />
          </button>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative mb-8 w-60 h-60">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-60 h-60 object-cover rounded-xl border border-gray-300 shadow-md transition duration-300"

          />
          <button
            onClick={handleCancelImage}
            className="absolute  top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            aria-label="Cancel image"
          >
            <X className="w-5 h-5 text-gray-500" />

          </button>
        </div>
      )}
    </div>
  );
}
