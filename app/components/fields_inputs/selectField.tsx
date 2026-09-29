"use client";

import React from "react";

interface SelectFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

export default function SelectField({
  label,
  name,
  placeholder = "Selecione",
  value = "",
  onChange,
  options,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col space-y-1 w-full">
      <label htmlFor={name} className="text-gray-700 text-sm font-medium">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-[45px] rounded-sm px-3 outline-none text-gray-700 border border-gray-300 focus:ring-2 focus:ring-[#EFA23B] focus:border-transparent transition-all duration-200 bg-white"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
