'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploaderProps {
  onUpload: (urls: string[]) => void;
  maxFiles?: number;
  existingImages?: string[];
}

export default function ImageUploader({ onUpload, maxFiles = 10, existingImages = [] }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(existingImages);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > maxFiles) {
      alert(`Максимум ${maxFiles} изображений`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    acceptedFiles.forEach(file => {
      formData.append('files', file);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/multiple`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки');
      }

      const data = await response.json();
      const newImages = [...images, ...data.urls];
      setImages(newImages);
      onUpload(newImages);
      setProgress(100);
    } catch (error) {
      alert('Ошибка загрузки изображений');
    } finally {
      setUploading(false);
    }
  }, [images, maxFiles, onUpload]);

  const removeImage = async (index: number) => {
    const url = images[index];
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads?url=${encodeURIComponent(url)}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Error deleting image:', error);
    }

    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUpload(newImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-[#3B82F6] bg-[#EFF6FF]' : 'border-[#E5E7EB] hover:border-[#3B82F6] hover:bg-[#F9FAFB]'
        }`}
      >
        <input {...getInputProps()} />
        <div className="text-4xl mb-2">📸</div>
        <p className="text-sm font-medium text-[#111827]">
          {isDragActive ? 'Отпустите файлы' : 'Перетащите изображения или нажмите для выбора'}
        </p>
        <p className="text-xs text-[#6B7280] mt-1">
          Максимум {maxFiles} файлов. До 10MB каждый. JPEG, PNG, GIF, WEBP, SVG
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-[#F3F4F6] rounded-full h-2">
              <div
                className="bg-[#3B82F6] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[#6B7280] mt-1">Загрузка... {progress}%</p>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Фото ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-[#E5E7EB]"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
