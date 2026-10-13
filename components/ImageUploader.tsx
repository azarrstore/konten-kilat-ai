import React, { ChangeEvent, DragEvent, useState } from 'react';

interface ImageUploaderProps {
  imageSrc: string | null;
  onImageSelected: (file: File) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ imageSrc, onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelected(e.target.files[0]);
    }
    e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isLoading) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <label 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-56 sm:h-64 border-2 border-dashed rounded-xl cursor-pointer transition-colors duration-150 ${
          isDragging 
            ? 'border-sky-500 bg-sky-100/60' 
            : imageSrc 
            ? 'border-sky-300 bg-sky-50/50' 
            : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
        }`}
      >
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt="Preview Produk" 
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain rounded-xl p-2" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center pt-4 pb-5 px-4 text-center">
            <svg className={`w-8 h-8 sm:w-10 sm:h-10 mb-2.5 transition-colors ${isDragging ? 'text-sky-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="mb-1.5 text-xs sm:text-sm text-slate-600">
              <span className="font-semibold text-sky-600">{isDragging ? 'Lepaskan gambar di sini' : 'Klik untuk unggah'}</span>
              {!isDragging && ' atau seret foto'}
            </p>
            <p className="text-[11px] text-slate-400">PNG, JPG atau WEBP (Maks 8MB)</p>
          </div>
        )}
        
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};
