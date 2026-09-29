"use client";

import React from "react";

interface TextAreaFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export default function TextAreaField({
  label,
  name,
  placeholder = "",
  value = "",
  onChange,
  rows = 5,
}: TextAreaFieldProps) {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full rounded-sm p-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200 resize-none"
      />
    </div>
  );
}
