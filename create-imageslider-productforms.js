const fs = require('fs');
const path = require('path');

const IMAGE_SLIDER_PATH = path.join(__dirname, 'app', 'Dashboard', 'ProductAdd', 'Home', 'ImageSlider', 'ImageFile');

// List of folders that need ProductForm.jsx files
const FOLDERS_TO_CREATE = [
  'FaucetImage',
  'ElectricImage', 
  'ToolsImage',
  'SanitaryImage',
  'PaintsImage'
];

const template = (category) => `"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    image: '',
    mainText: '',
    subtext: '',
    descrText: '',
    descText: '',
    offer: '',
    category: '${category}',
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Image handling - only 1 image
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPhotoError("");
    }
  };

  const handleRemovePhoto = () => {
    setFile(null);
    setPreview(null);
  };

  const isFormValid = () => {
    return form.mainText && form.subtext && form.descrText && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('image', form.image);
    data.append('mainText', form.mainText);
    data.append('subtext', form.subtext);
    data.append('descrText', form.descrText);
    data.append('descText', form.descText);
    data.append('offer', form.offer);
    data.append('category', form.category);
    data.append('uploadedImage', file);

    try {
      const res = await fetch(\`\${API_BASE_URL}/home/imageslider/${category.toLowerCase()}/create\`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Image Slider item created successfully!');
        setForm({
          image: '',
          mainText: '',
          subtext: '',
          descrText: '',
          descText: '',
          offer: '',
          category: '${category}',
        });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating image slider item');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating image slider item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add ${category} Image Slider</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Main Text *</label>
          <Input 
            name="mainText" 
            value={form.mainText} 
            onChange={handleChange} 
            placeholder="Enter main text" 
            required 
            className="w-full"
          />
        </div>

        {/* Sub Text */}
        <div>
          <label className="block text-sm font-medium mb-2">Sub Text *</label>
          <Input 
            name="subtext" 
            value={form.subtext} 
            onChange={handleChange} 
            placeholder="Enter sub text" 
            required 
            className="w-full"
          />
        </div>

        {/* Image Path */}
        <div>
          <label className="block text-sm font-medium mb-2">Image Path</label>
          <Input 
            name="image" 
            value={form.image} 
            onChange={handleChange} 
            placeholder="/images/slider1.jpg" 
            className="w-full"
          />
        </div>

        {/* Offer */}
        <div>
          <label className="block text-sm font-medium mb-2">Offer</label>
          <Input 
            name="offer" 
            value={form.offer} 
            onChange={handleChange} 
            placeholder="Enter offer details" 
            className="w-full"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <Input 
            name="category" 
            value={form.category} 
            readOnly 
            className="w-full bg-gray-50"
          />
        </div>
      </div>

      {/* Description Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Description Text *</label>
        <Textarea 
          name="descrText" 
          value={form.descrText} 
          onChange={handleChange} 
          placeholder="Enter description text" 
          required 
          className="w-full"
          rows={3}
        />
      </div>

      {/* Desc Text */}
      <div>
        <label className="block text-sm font-medium mb-2">Additional Description</label>
        <Textarea 
          name="descText" 
          value={form.descText} 
          onChange={handleChange} 
          placeholder="Enter additional description" 
          className="w-full"
          rows={3}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Upload Image *</label>
        <Input 
          name="uploadedImage" 
          type="file" 
          onChange={handleFile} 
          accept="image/*" 
          required 
          className="w-full"
        />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        
        {/* Image Preview */}
        {preview && (
          <div className="mt-4 relative">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-32 h-32 object-cover rounded border"
            />
            <button 
              type="button" 
              onClick={handleRemovePhoto} 
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            {preview && (
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-48 object-cover rounded mb-4"
              />
            )}
            <h3 className="text-xl font-bold mb-2">{form.mainText || 'Main Text'}</h3>
            <p className="text-lg mb-2">{form.subtext || 'Sub Text'}</p>
            <p className="text-sm text-gray-600 mb-2">{form.descrText || 'Description Text'}</p>
            {form.descText && <p className="text-xs text-gray-500">{form.descText}</p>}
            {form.offer && <p className="text-sm font-semibold text-red-600 mt-2">{form.offer}</p>}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid()}
      >
        Create Image Slider Item
      </Button>
    </form>
  );
}
`;

function main() {
  let created = 0;
  let skipped = [];
  
  console.log('Creating ProductForm.jsx files for ImageSlider subfolders...\n');
  
  for (const folder of FOLDERS_TO_CREATE) {
    const folderPath = path.join(IMAGE_SLIDER_PATH, folder);
    const productFormPath = path.join(folderPath, 'ProductForm.jsx');
    
    try {
      // Check if folder exists
      if (!fs.existsSync(folderPath)) {
        console.log(`Skipped: ${folder} (folder doesn't exist)`);
        skipped.push(folder);
        continue;
      }
      
      // Check if ProductForm.jsx already exists
      if (fs.existsSync(productFormPath)) {
        console.log(`Skipped: ${folder}/ProductForm.jsx (already exists)`);
        skipped.push(folder);
        continue;
      }
      
      // Create ProductForm.jsx
      fs.writeFileSync(productFormPath, template(folder), 'utf8');
      console.log(`Created: ${folder}/ProductForm.jsx`);
      created++;
      
    } catch (err) {
      console.error(`Error creating ${folder}/ProductForm.jsx:`, err.message);
      skipped.push(folder);
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total ProductForm.jsx files created: ${created}`);
  if (skipped.length > 0) {
    console.log('Skipped folders:');
    skipped.forEach(f => console.log(`- ${f}`));
  }
}

main(); 