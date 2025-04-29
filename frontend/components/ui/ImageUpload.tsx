import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageUpload = ({
  onImageUpload,
  imageUrl,
}: {
  onImageUpload: (url: string) => void;
  imageUrl: string | null;
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const url = URL.createObjectURL(file);
    onImageUpload(url);
  }, [onImageUpload]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });


  return (
    <div
      {...getRootProps()}
      // bg-gray-200 p-2 rounded-md shadow-md mb-10 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:right-auto
      className="w-full max-w-sm border-4 border-dashed border-gray-300 p-1 text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <button className="w-full text-sm text-gray-500 px-2 truncate cursor-pointer"
      title='Arrastra o selecciona una imagen para subir'>
        Arrastra o selecciona una imagen para subir
      </button>


    </div>
  );
};

export default ImageUpload;
