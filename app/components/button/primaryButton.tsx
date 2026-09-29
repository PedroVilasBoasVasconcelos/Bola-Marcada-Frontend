"use client";

import React from "react";

interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  color?: string; // cor normal
  hoverColor?: string; // cor no hover
  textColor?: string; // cor do texto
}

export default function PrimaryButton({
  label,
  onClick,
  type = "button",
  className = "",
  color = "#EFA23B",
  hoverColor = "#d78c2f",
  textColor = "white",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`font-semibold py-2 px-6 rounded-sm transition-all duration-300 ${className}`}
      style={{
        backgroundColor: color,
        color: textColor,
      }}
      onMouseEnter={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = hoverColor;
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).style.backgroundColor = color;
      }}
    >
      {label}
    </button>
  );
}
