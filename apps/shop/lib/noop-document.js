// Stub file to replace next/document imports in App Router
// This file prevents Html import errors during build

// Use both CommonJS and ESM exports for compatibility
function Html() {
  return null;
}

function Head() {
  return null;
}

function Main() {
  return null;
}

function NextScript() {
  return null;
}

// ESM exports
export { Html, Head, Main, NextScript };
export default { Html, Head, Main, NextScript };

// CommonJS exports (for compatibility)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Html, Head, Main, NextScript };
  module.exports.default = { Html, Head, Main, NextScript };
}

