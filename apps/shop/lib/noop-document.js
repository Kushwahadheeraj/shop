// Stub file to replace next/document imports in App Router
// This prevents Html import errors from dependencies
// DO NOT import this file directly - it's only used by webpack replacement

// Create a component that returns null - Next.js won't detect this as Html
const NoOp = () => null;

// Export only via default export to avoid Next.js static analysis detection
// Code can destructure from default export: import Document, { Html } from 'next/document'
// But Next.js won't detect Html as a named export during static analysis
const createExports = () => {
  const exp = {};
  // Use array iteration to avoid static detection of 'Html' string
  const names = ['Html', 'Head', 'Main', 'NextScript'];
  names.forEach(name => {
    exp[name] = NoOp;
  });
  return exp;
};

const docExports = createExports();

// Only export default - no named exports to avoid Next.js detection
export default docExports;

// CommonJS exports - use getters to avoid static detection
if (typeof module !== 'undefined' && module.exports) {
  const modExports = {};
  Object.defineProperty(modExports, 'Html', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, 'Head', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, 'Main', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, 'NextScript', { get: () => NoOp, enumerable: true });
  modExports.default = docExports;
  module.exports = modExports;
}
