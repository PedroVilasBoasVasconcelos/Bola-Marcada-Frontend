"use client";

import React from "react";

interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder = "",
  value = "",
  onChange,
}: InputFieldProps) {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label htmlFor={name} className="text-white text-lg font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-[45px] rounded-sm p-2 outline-none text-black focus:ring-2 focus:ring-[#EFA23B] transition-all duration-200"
      />
    </div>
  );
}
