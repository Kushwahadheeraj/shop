/**
 * jscodeshift codemod: Add API_BASE_URL import if missing and used
 */
module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Check if API_BASE_URL is used
  const usesApiBaseUrl = root.find(j.Identifier, { name: 'API_BASE_URL' }).size() > 0;
  if (!usesApiBaseUrl) return null;

  // Check if import already exists
  const hasImport = root.find(j.ImportDeclaration, {
    source: { value: '@/lib/apiConfig' }
  }).size() > 0;
  if (hasImport) return null;

  // Add the import at the top (after any 'use client' or 'use strict')
  const importDecl = j.importDeclaration(
    [j.importDefaultSpecifier(j.identifier('API_BASE_URL'))],
    j.literal('@/lib/apiConfig')
  );

  const body = root.get().value.program.body;
  let insertIdx = 0;
  while (
    insertIdx < body.length &&
    body[insertIdx].type === 'ExpressionStatement' &&
    (body[insertIdx].expression.value === 'use client' || body[insertIdx].expression.value === 'use strict')
  ) {
    insertIdx++;
  }
  body.splice(insertIdx, 0, importDecl);

  return root.toSource({ quote: 'double' });
}; 