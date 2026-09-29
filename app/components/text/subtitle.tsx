import React from "react";

interface SubtitleProps {
  firstLine: string;
  secondLine?: string;
  align?: "left" | "center" | "right";
  size?: number | string;
  lineHeight?: string;
  color?: string;
  font?: string;
}

export default function Subtitle({
  firstLine,
  secondLine,
  align = "center",
  size = "28px",
  lineHeight = "1.4",
  color = "FFFFFF",
}: SubtitleProps) {
  return (
    <p
      className={`font-roboto text-gray-200 font-light mt-6 text-${align}`}
      style={{
        fontSize: size,
        lineHeight: lineHeight,
        color,
      }}
    >
      {firstLine}
      {secondLine && (
        <>
          <br />
          <span>{secondLine}</span>
        </>
      )}
    </p>
  );
}
