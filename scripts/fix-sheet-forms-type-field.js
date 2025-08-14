const fs = require('fs');
const path = require('path');

const sheetTypes = [
  'CementsSheet',
  'FiberSheet', 
  'AluminiumSheet',
  'TeenSheet'
];

const formsDir = path.join(__dirname, '../app/Dashboard/ProductAdd/Roofer');

const typeFieldCode = `
    // Convert custom fields to type format for backend
    const typeData = [];
    customFields.forEach((f, idx) => {
      if (f.fieldName && f.fieldName.trim()) {
        f.fieldValues.forEach(val => {
          if (val && val.trim()) {
            typeData.push({ fit: f.fieldName.trim(), rate: parseFloat(form.fixPrice) || 0 });
          }
        });
      }
    });
    
    // Always send type field (required by schema)
    if (typeData.length > 0) {
      data.append('type', JSON.stringify(typeData));
    } else {
      data.append('type', JSON.stringify([{ fit: 'Default', rate: parseFloat(form.fixPrice) || 0 }]));
    }
    
    `;

sheetTypes.forEach(sheetType => {
  const formPath = path.join(formsDir, sheetType, 'ProductForm.jsx');
  
  if (fs.existsSync(formPath)) {
    let content = fs.readFileSync(formPath, 'utf8');
    
    // Add type field handling if not already present
    if (!content.includes('Convert custom fields to type format for backend')) {
      const insertPoint = content.indexOf('    if (form.variants.length > 0) data.append(\'variants\', JSON.stringify(form.variants));');
      if (insertPoint !== -1) {
        const endPoint = content.indexOf('    // Add custom fields', insertPoint);
        if (endPoint !== -1) {
          const beforeInsert = content.substring(0, endPoint);
          const afterInsert = content.substring(endPoint);
          content = beforeInsert + typeFieldCode + afterInsert;
          console.log(`✅ Added type field handling to ${sheetType}/ProductForm.jsx`);
          
          // Write the updated content back
          fs.writeFileSync(formPath, content, 'utf8');
        } else {
          console.log(`⚠️  Could not find custom fields section in ${sheetType}/ProductForm.jsx`);
        }
      } else {
        console.log(`⚠️  Could not find variants section in ${sheetType}/ProductForm.jsx`);
      }
    } else {
      console.log(`⚠️  ${sheetType}/ProductForm.jsx already has type field handling`);
    }
  } else {
    console.log(`❌ Form not found: ${sheetType}/ProductForm.jsx`);
  }
});

console.log('\n🎉 Type field handling added to all sheet product forms!');
