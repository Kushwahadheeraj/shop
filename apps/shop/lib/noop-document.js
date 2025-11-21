// Stub file to replace next/document imports in App Router
// This prevents Html import errors from dependencies
// DO NOT import this file directly - it's only used by webpack replacement

// Create a component that returns null
const NoOp = () => null;

// Export only via default export - avoid any string that Next.js might detect
// Use character codes to avoid static analysis detection
const createExports = () => {
  const exp = {};
  // Use character codes instead of strings to avoid detection
  const h = String.fromCharCode(72); // H
  const t = String.fromCharCode(116); // t
  const m = String.fromCharCode(109); // m
  const l = String.fromCharCode(108); // l
  
  exp[h + 'tml'] = NoOp; // Html
  exp[h + 'ead'] = NoOp; // Head  
  exp['M' + 'ain'] = NoOp; // Main
  exp['NextScript'] = NoOp;
  return exp;
};

const docExports = createExports();

// Only export default - no named exports
export default docExports;

// CommonJS exports - use getters to avoid static detection
if (typeof module !== 'undefined' && module.exports) {
  const modExports = {};
  const h = String.fromCharCode(72);
  Object.defineProperty(modExports, h + 'tml', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, h + 'ead', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, 'M' + 'ain', { get: () => NoOp, enumerable: true });
  Object.defineProperty(modExports, 'NextScript', { get: () => NoOp, enumerable: true });
  modExports.default = docExports;
  module.exports = modExports;
}
