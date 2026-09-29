"use client";

import React, { useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

interface ImageUploadProps {
  label?: string;
  onImagesChange?: (files: File[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({
  label = "Imagens",
  onImagesChange,
  maxFiles = 10,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Você pode adicionar no máximo ${maxFiles} imagens`);
      return;
    }

    const newFiles = [...files, ...selectedFiles];
    setFiles(newFiles);

    // Criar previews
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);

    // Notificar componente pai
    if (onImagesChange) {
      onImagesChange(newFiles);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Liberar memória do preview
    URL.revokeObjectURL(previews[index]);
    
    setFiles(newFiles);
    setPreviews(newPreviews);

    if (onImagesChange) {
      onImagesChange(newFiles);
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <label className="text-gray-700 text-sm font-medium">{label}</label>
      
      {/* Área de upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center hover:border-[#EFA23B] transition-colors duration-200">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center space-y-2"
        >
          <FiUpload className="text-4xl text-gray-400" />
          <p className="text-gray-600 font-medium">
            Arraste e solte fotos aqui ou clique para selecionar
          </p>
          <p className="text-gray-400 text-sm">
            Adicione fotos do seu espaço para atrair mais clientes.
          </p>
        </label>
      </div>

      {/* Preview das imagens */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-sm"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length > 0 && (
        <p className="text-sm text-gray-500">
          {previews.length} de {maxFiles} imagens adicionadas
        </p>
      )}
    </div>
  );
}
