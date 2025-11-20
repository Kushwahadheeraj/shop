// Stub file to replace next/document imports in App Router
// This file prevents Html import errors during build

// Export functions that match next/document API
export function Html(props) {
  if (typeof window === 'undefined') {
    // Server-side: return null to prevent errors
    return null;
  }
  return null;
}

export function Head(props) {
  return null;
}

export function Main(props) {
  return null;
}

export function NextScript(props) {
  return null;
}

// Default export for compatibility
export default {
  Html,
  Head,
  Main,
  NextScript,
};

