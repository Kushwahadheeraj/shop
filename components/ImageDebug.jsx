"use client";
import React from 'react';

export default function ImageDebug({ src, alt, className, onError, ...props }) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleError = (e) => {
    console.log('Image failed to load:', src);
    setImageError(true);
    if (onError) onError(e);
  };

  const handleLoad = () => {
    console.log('Image loaded successfully:', src);
    setImageLoaded(true);
  };

  return (
    <div className="relative">
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      {imageError && (
        <div className="absolute inset-0 bg-gray-200 rounded-full flex items-center justify-center text-xs text-gray-500">
          Failed to load
        </div>
      )}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-1">
          Debug: {imageLoaded ? 'Loaded' : imageError ? 'Error' : 'Loading'} - {src}
        </div>
      )}
    </div>
  );
} 