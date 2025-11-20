// Stub file to replace next/document imports in App Router
'use client';

// Export empty objects to prevent Html import errors
export const Html = function Html() { return null; };
export const Head = function Head() { return null; };
export const Main = function Main() { return null; };
export const NextScript = function NextScript() { return null; };

// Default export for compatibility
export default {
  Html,
  Head,
  Main,
  NextScript,
};

