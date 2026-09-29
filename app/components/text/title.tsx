import React from "react";

interface TitleProps {
  firstLine: string;
  secondLine?: string;
  align?: "left" | "center" | "right";
  size?: number | string;
  lineHeight?: string;
  color?: string;
  font?: string;
}

export default function Title({
  firstLine,
  secondLine,
  align = "right",
  size = "120px",
  lineHeight = "100px",
  color = "FFFFFF",
}: TitleProps) {
  return (
    <h1
      className={`font-bebas text-white text-${align} tracking-[2px]`}
      style={{
        fontSize: size,
        lineHeight: lineHeight,
        letterSpacing: "0.05em",
        color,
      }}
    >
      {firstLine}
      {secondLine && (
        <>
          <br />
          <span className="block">{secondLine}</span>
        </>
      )}
    </h1>
  );
}
