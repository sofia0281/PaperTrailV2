"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  imageUrl: string | null;
  bookId: string;
}

const ImageUpload = ({ onImageUpload, imageUrl, bookId }: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const verifyImageUpload = async (bookId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/books/${bookId}?populate=cover`
      );
      const data = await response.json();
      if (data.data?.attributes?.cover?.data?.attributes?.url) {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.data.attributes.cover.data.attributes.url}`;
      }
      return null;
    } catch (error) {
      console.error("Error verifying image:", error);
      return null;
    }
  };
  
  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("ref", "api::book.book");
    formData.append("refId", bookId);
    formData.append("field", "cover");

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Primero intentamos obtener la imagen aunque haya error
      const result = await response.json().catch(() => null);
      
      if (result?.[0]?.url) {
        return `${process.env.NEXT_PUBLIC_BACKEND_URL}${result[0].url}`;
      }

      // Si no hay URL, verificamos manualmente
      const verifiedUrl = await verifyImageUpload(bookId);
      if (verifiedUrl) return verifiedUrl;

      throw new Error(response.statusText || "Error desconocido");
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    
    try {
      const imageUrl = await handleUpload(file);
      onImageUpload(imageUrl);
    } catch (error) {
      setUploadError("La imagen se subió pero hubo un problema al procesarla");
      console.error("Error en subida:", error);
      
      // Verificación final como último recurso
      setTimeout(async () => {
        const verifiedUrl = await verifyImageUpload(bookId);
        if (verifiedUrl) {
          onImageUpload(verifiedUrl);
        }
      }, 2000);
    } finally {
      setIsUploading(false);
    }
  }, [bookId, onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  return (
    <div className="mt-2">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <button
          type="button"
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isUploading}
        >
          {isUploading ? "Subiendo..." : imageUrl ? "Cambiar imagen" : "Subir imagen"}
        </button>
      </div>
      {uploadError && (
        <p className="text-red-500 text-xs mt-1">{uploadError}</p>
      )}
    </div>
  );
};

export default ImageUpload;