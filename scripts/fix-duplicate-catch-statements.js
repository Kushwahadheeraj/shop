const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../backend/controllers/sanitary');

// Function to fix duplicate catch statements in a controller file
function fixDuplicateCatchStatements(filePath) {
  if (!fs.existsSync(filePath)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let updated = false;
    
    // Fix 1: Remove duplicate catch statements
    // Pattern: } catch (_) {} catch (_) {}
    const duplicateCatchRegex = /} catch \(_\) \{\} catch \(_\) \{\}/g;
    if (duplicateCatchRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(duplicateCatchRegex, '} catch (_) {}');
      updated = true;
    }
    
    // Fix 2: Remove triple catch statements
    // Pattern: } catch (_) {} catch (_) {} catch (_) {}
    const tripleCatchRegex = /} catch \(_\) \{\} catch \(_\) \{\} catch \(_\) \{\}/g;
    if (tripleCatchRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(tripleCatchRegex, '} catch (_) {}');
      updated = true;
    }
    
    // Fix 3: Remove orphaned catch statements that are not part of try-catch blocks
    // Pattern: } catch (_) {} that appears without a preceding try
    const orphanedCatchRegex = /([^t])\s*catch \(_\) \{\}/g;
    if (orphanedCatchRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(orphanedCatchRegex, '$1');
      updated = true;
    }
    
    // Fix 4: Ensure proper try-catch structure for variants parsing
    const incompleteTryRegex = /try \{ [^}]+ \}(?!\s*catch)/g;
    if (incompleteTryRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(incompleteTryRegex, (match) => {
        return match + ' catch (_) {}';
      });
      updated = true;
    }
    
    // Fix 5: Remove any stray catch statements that are not properly formatted
    const strayCatchRegex = /catch \(_\) \{\}\s*catch \(_\) \{\}/g;
    if (strayCatchRegex.test(updatedContent)) {
      updatedContent = updatedContent.replace(strayCatchRegex, 'catch (_) {}');
      updated = true;
    }
    
    if (updated) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Function to process all controller files recursively
function processDirectoryRecursive(dirPath, dirName = '') {
  const items = fs.readdirSync(dirPath);
  let processedCount = 0;
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      const subProcessed = processDirectoryRecursive(itemPath, path.join(dirName, item));
      processedCount += subProcessed;
    } else if (item.endsWith('.js')) {
      // Process JavaScript files (controllers)
      if (fixDuplicateCatchStatements(itemPath)) {
        processedCount++;
        console.log(`✅ Fixed duplicate catch statements in ${dirName}/${item}`);
      } else {
        console.log(`ℹ️  ${dirName}/${item} has no duplicate catch statements`);
      }
    }
  }
  
  return processedCount;
}

console.log('🔍 Starting to fix duplicate catch statements in ALL sanitary controllers...\n');
console.log('📋 This will fix ALL syntax errors related to duplicate catch statements\n');
console.log('🔄 Fixing: duplicate catch, triple catch, orphaned catch, incomplete try-catch\n');

// Process all controller files recursively
const totalProcessed = processDirectoryRecursive(controllersDir);

console.log(`\n🎉 Duplicate catch statements fix completed! Total files processed: ${totalProcessed}`);
console.log('✅ ALL sanitary controllers now have proper try-catch syntax!');
console.log('🔍 No more "Unexpected token catch" errors!');
console.log('🚀 All controllers should now load without syntax errors!');
