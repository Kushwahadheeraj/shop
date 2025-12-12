"use client";

import React from "react";
import Image from "next/image";

export default function BrandLogo({ className = "", size = 64, showText = true }) {
  const diamondSize = size;
  const bgSize = size * 0.9; // Yellow diamond background size
  
  return (
    <div className={`flex items-center gap-2 text-zinc-900 dark:text-white w-full ${className}`}>
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ width: diamondSize, height: diamondSize }}
      >
        {/* Amber/Yellow Diamond Background with gradient */}
        <div
          className="absolute rounded-lg"
          style={{
            background: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 50%, #fbbf24 100%)',
            transform: 'rotate(45deg)',
            borderRadius: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            width: bgSize,
            height: bgSize,
            left: '50%',
            top: '50%',
            marginLeft: `-${bgSize / 2}px`,
            marginTop: `-${bgSize / 2}px`
          }}
        />
        {/* Logo Image on top - centered inside diamond */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{ 
            width: size * 1.6, 
            height: size * 1.6
          }}
        >
          <Image
            src="/logo.png"
            alt="Kushwaha Hardware Logo"
            width={size * 1.6}
            height={size * 1.6}
            className="object-contain"
            priority
          />
        </div>
      </div>
      {showText && (
        <div className="text-left leading-tight flex-1 min-w-0">
          <p className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Kushwaha</p>
          <p className="text-lg font-semibold text-zinc-600 dark:text-zinc-200 tracking-wide">Hardware</p>
        </div>
      )}
    </div>
  );
}

