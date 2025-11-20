// Stub file to replace next/document imports in App Router
import React from 'react';

export function Html({ children, ...props }) {
  return <>{children}</>;
}

export function Head({ children, ...props }) {
  return <>{children}</>;
}

export function Main({ children, ...props }) {
  return <>{children}</>;
}

export function NextScript({ ...props }) {
  return null;
}

export default {
  Html,
  Head,
  Main,
  NextScript,
};

