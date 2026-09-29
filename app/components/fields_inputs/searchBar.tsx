"use client";

import React, { useState } from "react";

interface SearchBarProps {
  placeholder?: string;
  buttonLabel?: string;
  onSearch?: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "DIGITE SUA CIDADE...",
  buttonLabel = "BUSCAR",
  onSearch,
  className = "",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center justify-between overflow-hidden ${className}`}
      style={{
        width: "100%",
        height: "107px",
      }}
    >
      {/* Campo de texto */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="bg-[#585858] uppercase text-gray-300 opacity-50 font-extrabold font-bebas tracking-wide text-[28px] px-10 focus:outline-none w-full placeholder-gray-300"
        style={{
          height: "97px",
          borderTopLeftRadius: "50px",
          borderBottomLeftRadius: "50px",
          borderTopRightRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      />

      {/* Botão */}
      <button
        type="submit"
        className="bg-[#EFA23B] text-[#2B2B2B] font-extrabold font-bebas text-[24px] uppercase tracking-wide hover:bg-[#d38e2e] transition-all duration-300"
        style={{
          width: "267.52px",
          height: "97px",
          borderTopRightRadius: "50px",
          borderBottomRightRadius: "50px",
          borderTopLeftRadius: "0px",
          borderBottomLeftRadius: "0px",
        }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}
