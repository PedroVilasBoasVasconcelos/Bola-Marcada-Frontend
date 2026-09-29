"use client";

import { useRef } from "react";
import { FiCamera } from "react-icons/fi";

export default function Avatar({
  name,
  email,
  avatarUrl,
  onImageChange,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
  onImageChange: (file: File) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: any) => {
    const file = e.target.files[0];
    if (file) onImageChange(file);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* FOTO */}
      <div className="relative">
        <img
          src={avatarUrl || "/images/avatar.png"}
          className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
        />

        {/* BOTÃO DE CAMERA */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute bottom-1 right-1 bg-[#EFA23B] text-white p-2 rounded-full shadow hover:bg-[#d78c2f]"
        >
          <FiCamera size={18} />
        </button>
      </div>

      {/* INPUT OCULTO */}
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />

      {/* NOME E EMAIL */}
      <p className="mt-4 text-lg font-semibold text-[#1C1A0D]">{name}</p>
      <p className="text-sm text-gray-600">{email}</p>
    </div>
  );
}
