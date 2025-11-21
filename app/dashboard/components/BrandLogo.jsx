"use client";

import React from "react";

const hammerPath =
  "M85.4 21.3c-2.5.2-5 1.1-6.9 2.9l-6.5 6.2c-1.8-1-3.9-.8-5.4.6l-4.5 4.3 2.3 2.4-37.9 37.9c-2.5 2.5-2.5 6.5 0 9l1.9 1.9c2.5 2.5 6.5 2.5 9 0l38-37.9 2.3 2.3 4.5-4.3c1.4-1.4 1.6-3.6.6-5.4l6.2-6.5c3.7-3.9 3.6-10.1-.3-13.9l-2.4-2.4c-1.2-1.3-3-1.9-4.9-1.7z";
const wrenchPath =
  "M46.2 34.2c-2.1 0-4.2.8-5.9 2.4l-9.1 8.5c-3.3 3.2-6.7 6.2-8.5 8-3.1 3.1-3.1 8 0 11l12.2 12.2c3.1 3.1 8 3.1 11 0 1.7-1.7 4.6-5.2 7.8-8.5l8.5-9.1c3.3-3.5 3.3-9.1 0-12.5l-8.3-8.3c-1.7-1.7-3.8-2.7-6-2.7zm20.1 29.2-6.9 7.4 12.1 12.2 6.9-7.4-12.1-12.2z";

export default function BrandLogo({ className = "", size = 48, showText = true }) {
  return (
    <div className={`flex items-center gap-2 text-gray-900 ${className}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <rect
            x="20"
            y="20"
            width="80"
            height="80"
            rx="12"
            transform="rotate(45 60 60)"
            fill="#FDD210"
            stroke="#E6B800"
            strokeWidth="5"
          />
          <g transform="translate(15 15) scale(0.75)">
            <path d={hammerPath} fill="#0A0A0A" />
            <path d={wrenchPath} fill="#0A0A0A" />
          </g>
        </svg>
      </div>
      {showText && (
        <div className="leading-tight uppercase font-black tracking-wide text-gray-900">
          <p className="text-sm sm:text-base">Kushwaha</p>
          <p className="text-[10px] sm:text-xs tracking-[0.35em] text-gray-700">Hardware</p>
        </div>
      )}
    </div>
  );
}

