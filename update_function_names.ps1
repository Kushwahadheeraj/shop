# PowerShell script to update function names in all lock controller files
$locksPath = "backend/controllers/locks"

# Get all .js files recursively
$files = Get-ChildItem -Path $locksPath -Recurse -Filter "*.js"

foreach ($file in $files) {
    $fileName = $file.BaseName
    $content = Get-Content $file.FullName -Raw
    
    # Extract the function name from filename (remove "Controller" suffix)
    $functionName = $fileName -replace "Controller$", ""
    
    # Update the folder name for cloudinary (camelCase)
    $folderName = $functionName -replace "([a-z])([A-Z])", '$1$2' -replace "([A-Z])([A-Z][a-z])", '$1$2'
    $folderName = $folderName.ToLower()
    
    # Update function names
    $content = $content -replace "exports\.create\w+", "exports.create$functionName"
    $content = $content -replace "exports\.getAll\w+", "exports.getAll$functionName"
    $content = $content -replace "exports\.get\w+ById", "exports.get$functionName`ById"
    $content = $content -replace "exports\.update\w+", "exports.update$functionName"
    $content = $content -replace "exports\.delete\w+", "exports.delete$functionName"
    
    # Update type field
    $content = $content -replace "type: '\w+'", "type: '$functionName'"
    
    # Update cloudinary folder
    $content = $content -replace "folder: '\w+'", "folder: '$folderName'"
    
    # Update model path if needed (for subdirectories)
    if ($file.DirectoryName -ne $locksPath) {
        $depth = ($file.DirectoryName -split "\\").Count - ($locksPath -split "\\").Count
        $modelPath = "../" * $depth + "models/locksModel"
        $cloudinaryPath = "../" * $depth + "config/cloudinary"
        $content = $content -replace "require\('\.\./\.\./models/locksModel'\)", "require('$modelPath')"
        $content = $content -replace "require\('\.\./\.\./config/cloudinary'\)", "require('$cloudinaryPath')"
    }
    
    # Write back to file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    
    Write-Host "Updated: $($file.FullName)"
} 