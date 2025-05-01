"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Loader2, X } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, file: File | null) => void;
  imageUrl: string | null;
  disabled?: boolean;
}

const ImageUpload = ({ onImageUpload, imageUrl, disabled }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(imageUrl);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
  
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onImageUpload(previewUrl, file); // Envía tanto la URL como el archivo
    } catch (error) {
      setPreview(null);
      setUploadError("Error al subir la imagen. Intenta nuevamente.");
      console.error("Upload error:", error);
      onImageUpload("", null); // Limpia ambos valores en caso de error
    } finally {
      setIsUploading(false);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: disabled || isUploading,
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageUpload("", null); // Limpia ambos valores
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isUploading ? "border-blue-300 bg-blue-50" : "border-gray-300 hover:border-blue-400"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center overflow-hidden rounded-md bg-gray-100">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-contain"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <X size={11} />
            </button>
          )}
        </div>
        
        
        
        ) : (
          <div className="space-y-2">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center py-4">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-2" />
                <p className="text-sm text-gray-600">Subiendo imagen...</p>
              </div>
            ) : (
              <>
                
                <p className="text-xs text-gray-500">
                  Formatos: JPG, PNG, WEBP (max. 5MB)
                </p>
                <button
                  type="button"
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 text-sm"
                  disabled={disabled}
                >
                  Seleccionar imagen
                </button>
              </>
            )}
          </div>
        )}
      </div>
      
      {uploadError && (
        <p className="text-red-500 text-sm text-center">{uploadError}</p>
      )}
    </div>
  );
};

export default ImageUpload;