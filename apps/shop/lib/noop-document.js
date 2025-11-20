// Stub file to replace next/document imports in App Router
// This file prevents Html import errors during build
// DO NOT import this file directly - it's only used by webpack replacement

// Import React for proper component rendering
import React from 'react';

// Use both CommonJS and ESM exports for compatibility
// Return React fragments instead of null to avoid Next.js processing errors
function Html({ children, ...props }) {
  return React.createElement(React.Fragment, null, children);
}

function Head({ children, ...props }) {
  return React.createElement(React.Fragment, null, children);
}

function Main({ children, ...props }) {
  return React.createElement(React.Fragment, null, children);
}

function NextScript({ ...props }) {
  return null;
}

// ESM exports (default export first for better compatibility)
export default { Html, Head, Main, NextScript };
export { Html, Head, Main, NextScript };

// CommonJS exports (for compatibility with node_modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Html, Head, Main, NextScript };
  module.exports.default = { Html, Head, Main, NextScript };
  module.exports.Html = Html;
  module.exports.Head = Head;
  module.exports.Main = Main;
  module.exports.NextScript = NextScript;
}

