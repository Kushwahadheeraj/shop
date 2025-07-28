const fs = require('fs');
const path = require('path');

const LOCKS_PATH = path.join(__dirname, 'app', 'Dashboard', 'ProductAdd', 'Locks');

// API endpoint mappings for Locks folder
const LOCKS_API_MAPPINGS = {
  // Main folders
  'PatchFittings': 'patch-fittings',
  'MortiseLockBody': 'mortise-lock-body', 
  'MorticeLocks': 'mortice-locks',
  'DoorControls': 'door-controls',
  'RimLocks': 'rim-locks',
  'PremiumMortiseSeries': 'premium-mortise-series',
  'PopularMortiseSeries': 'popular-mortise-series',
  'Padlocks': 'padlocks',
  'LeverMortiseLocks': 'lever-mortise-locks',
  'GlassHardware': 'glass-hardware',
  'FurnitureFittings': 'furniture-fittings',
  'FoldingBrackets': 'folding-brackets',
  'DoorLocks': 'door-locks',
  'DoorHandles': 'door-handles',
  'DoorAccessories': 'door-accessories',
  
  // Subfolders
  'ConcealedHinges': 'concealed-hinges',
  'DoorEye': 'door-eye',
  'DoorStopper': 'door-stopper',
  'Hinges': 'hinges',
  'MagneticDoorStoppers': 'magnetic-door-stoppers',
  'WoodenSlidingDoorFittings': 'wooden-sliding-door-fittings',
  'BallBearingDoorHinges': 'ball-bearing-door-hinges',
  'DoorCloser': 'door-closer',
  'HydraulicDoorClosers': 'hydraulic-door-closers',
  'DoorKings': 'door-kings',
  'DoorPulls': 'door-pulls',
  'DimpleKey': 'dimple-key',
  'DiamantPadlocks': 'diamant-padlocks',
  'DeadLocks': 'dead-locks',
  'CylindricalLocks': 'cylindrical-locks',
  'CupboardLocks': 'cupboard-locks',
  'CentreShutterLocks': 'centre-shutter-locks',
  'TriBoltLocks': 'tri-bolt-locks',
  'SmartKey': 'smart-key',
  'SideLock': 'side-lock',
  'RimDeadLock': 'rim-dead-lock',
  'PullHandlesForMainDoors': 'pull-handles-for-main-doors',
  'NightLatch': 'night-latch',
  'MainDoorLock': 'main-door-lock',
  'KnobLocks': 'knob-locks',
  'JemmyProofDoorLock': 'jemmy-proof-door-lock',
  'DrawerLock': 'drawer-lock',
  'DiscPadLocks': 'disc-pad-locks',
  'ThickDoorHinge': 'thick-door-hinge',
  'SoftCloseDrawerChannel': 'soft-close-drawer-channel',
  'SlipOnHinge': 'slip-on-hinge',
  'HeavyDutyDrawerSlides': 'heavy-duty-drawer-slides',
  'FoldingBrackets': 'folding-brackets',
  'DrawerChannels': 'drawer-channels',
  'ClipOnSoftHinge': 'clip-on-soft-hinge',
  'ClipOnSoftHinge4Hole': 'clip-on-soft-hinge-4-hole',
  'CabinetHinge': 'cabinet-hinge',
  'BlindCornerHinge': 'blind-corner-hinge',
  'Nuvo': 'nuvo',
  'MultiPurposeLock': 'multi-purpose-lock',
  'FurnitureFittings': 'furniture-fittings',
  'DrawerLocks': 'drawer-locks',
  'DrawerCupboardLock': 'drawer-cupboard-lock',
  'Curvo': 'curvo',
  'Supernova': 'supernova',
  'TableLock': 'table-lock',
  'SlidingSystem': 'sliding-system',
  'ShowerCubicleHinge': 'shower-cubicle-hinge',
  'GlassHardware': 'glass-hardware',
  'GlassDoorPullHandle': 'glass-door-pull-handle',
  'GlassDoorLock': 'glass-door-lock',
  'GlassDoorFitting': 'glass-door-fitting',
  'FloorSpring': 'floor-spring',
  'FloorSpringComboSet': 'floor-spring-combo-set',
  'LeverMortiseLocks': 'lever-mortise-locks',
  'ExshiSecurityCylinders': 'exshi-security-cylinders',
  'EuroprofileMortisePinCylinderWithMasterKey': 'europrofile-mortise-pin-cylinder-with-master-key',
  'EuroprofileMortisePinCylinder': 'europrofile-mortise-pin-cylinder',
  'EuroprofileMortiseLockBodies': 'europrofile-mortise-lock-bodies',
  'CombipackWith6LeverMortiseLock': 'combipack-with-6-lever-mortise-lock',
  'UltraShutterLocks': 'ultra-shutter-locks',
  'SquareTypePadlock': 'square-type-padlock',
  'RoundTypePadlock': 'round-type-padlock',
  'PremiumPadlocks': 'premium-padlocks',
  'Padlocks': 'padlocks',
  'DiscPadlocks': 'disc-padlocks',
  'Victoria': 'victoria',
  'TowyLowHeightDesign': 'towy-low-height-design',
  'SsdTypeTubeLever': 'ssd-type-tube-lever',
  'PullHandles': 'pull-handles',
  'PopularMortiseSeries': 'popular-mortise-series',
  'Oliver': 'oliver',
  'Neh16': 'neh16',
  'Neh15LowHeightDesign': 'neh15-low-height-design',
  'Neh14': 'neh14',
  'Neh13': 'neh13',
  'Neh12': 'neh12',
  'Neh06': 'neh06',
  'Neh11': 'neh11',
  'Neh10': 'neh10',
  'Neh09': 'neh09',
  'Neh08': 'neh08',
  'Neh07': 'neh07',
  'Neh05': 'neh05',
  'Neh04': 'neh04',
  'Matiz': 'matiz',
  'MainDoorSet': 'main-door-set',
  'Gloria': 'gloria',
  'CylindricalLocks': 'cylindrical-locks',
  'CornerFetchSeries': 'corner-fetch-series',
  'CombiSet': 'combi-set',
  'ClassicLock': 'classic-lock',
  'Bm06': 'bm06',
  'Bm04': 'bm04',
  'Bm02': 'bm02',
  'Bm01': 'bm01',
  'SehSeries': 'seh-series',
  'PremiumMortiseSeries': 'premium-mortise-series',
  'Phoenix': 'phoenix',
  'Orbit': 'orbit',
  'Mercury': 'mercury',
  'Evva3ksRegalisMortise': 'evva3ks-regalis-mortise',
  'EuroprofileBrassHandleSet240mm': 'europrofile-brass-handle-set-240mm',
  'CombipackWith240mmEuroMortiseLock': 'combipack-with-240mm-euro-mortise-lock',
  'AllureRossetteSeries': 'allure-rossette-series',
  'UltraXlVertibolt': 'ultra-xl-vertibolt',
  'UltraXlTwinbolt': 'ultra-xl-twinbolt',
  'UltraXlTribolt': 'ultra-xl-tribolt',
  'UltraXlRimDeadbolt': 'ultra-xl-rim-deadbolt',
  'UltraVertibolt': 'ultra-vertibolt',
  'UltraTribolt': 'ultra-tribolt',
  'UltraRetrofitAdaptor': 'ultra-retrofit-adaptor',
  'UltraLatchboltCarton': 'ultra-latchbolt-carton',
  'RimLocks': 'rim-locks',
  'PinCylinderRimLocks': 'pin-cylinder-rim-locks',
  'PentaboltAries': 'pentabolt-aries',
  'NightLatch7Lever': 'night-latch-7-lever',
  'ExsAstro': 'exs-astro',
  'ExsAltrix': 'exs-altrix'
};

function getAllLocksProductFormFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of list) {
    if (file.isDirectory()) {
      results = results.concat(getAllLocksProductFormFiles(path.join(dir, file.name)));
    } else if (file.name === 'ProductForm.jsx') {
      results.push(path.join(dir, file.name));
    }
  }
  return results;
}

function getCategoryFromPath(filePath) {
  const parts = filePath.split(path.sep);
  const idx = parts.lastIndexOf('ProductAdd');
  if (idx !== -1 && parts.length > idx + 2) {
    return parts[parts.length - 2];
  }
  return '';
}

function getApiEndpointForLocks(filePath) {
  const parts = filePath.split(path.sep);
  const idx = parts.lastIndexOf('ProductAdd');
  if (idx !== -1 && parts.length > idx + 2) {
    const folderName = parts[parts.length - 2];
    return LOCKS_API_MAPPINGS[folderName] || folderName.toLowerCase();
  }
  return 'unknown';
}

const template = (category, apiEndpoint) => `"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  // 3 custom fields, each with a name and multiple values
  const [customFields, setCustomFields] = useState([
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
    { fieldName: '', fieldValues: [''] },
  ]);
  const [form, setForm] = useState({
    name: '',
    sku: 'N/A',
    price: '',
    discount: '',
    discountPrice: '',
    totalProduct: '',
    category: '${category}',
    description: '',
    tags: [],
    variants: [], // { variantName: '', price: '', discountPrice: '' }
  });
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);
  const [photoError, setPhotoError] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Discount price auto-calc
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => {
      let updated = { ...prev, [name]: value };
      if (name === 'price' || name === 'discount') {
        const price = parseFloat(name === 'price' ? value : prev.price);
        const discount = parseFloat(name === 'discount' ? value : prev.discount);
        updated.discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return updated;
    });
  };

  // Custom Fields logic
  const handleCustomFieldNameChange = (idx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[idx].fieldName = value;
      return updated;
    });
  };
  const handleCustomFieldValueChange = (fieldIdx, valueIdx, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues[valueIdx] = value;
      return updated;
    });
  };
  const handleAddCustomFieldValue = (fieldIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues.push('');
      return updated;
    });
  };
  const handleRemoveCustomFieldValue = (fieldIdx, valueIdx) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIdx].fieldValues = updated[fieldIdx].fieldValues.filter((_, i) => i !== valueIdx);
      if (updated[fieldIdx].fieldValues.length === 0) updated[fieldIdx].fieldValues = [''];
      return updated;
    });
  };

  // Variants logic
  const handleAddVariant = () => {
    setForm(prev => ({ ...prev, variants: [...prev.variants, { variantName: '', price: '', discountPrice: '' }] }));
  };
  const handleVariantChange = (idx, field, value) => {
    setForm(prev => {
      const updated = [...prev.variants];
      updated[idx][field] = value;
      // auto discountPrice
      if (field === 'price' || field === 'discount') {
        const price = parseFloat(field === 'price' ? value : updated[idx].price);
        const discount = parseFloat(form.discount);
        updated[idx].discountPrice = (!isNaN(price) && !isNaN(discount)) ? (price - (price * discount / 100)).toFixed(2) : '';
      }
      return { ...prev, variants: updated };
    });
  };
  const handleRemoveVariant = idx => {
    setForm(prev => {
      const updated = prev.variants.filter((_, i) => i !== idx);
      return { ...prev, variants: updated };
    });
  };

  // Tags logic
  const handleAddTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput("");
    }
  };
  const handleRemoveTag = (idx) => {
    setForm(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== idx) }));
  };

  // Image handling
  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 5) {
      setPhotoError("Maximum 5 photos allowed");
      return;
    }
    if (selectedFiles.length < 1) {
      setPhotoError("Minimum 1 photo required");
      return;
    }
    setPhotoError("");
    setFiles(selectedFiles);
    const urls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreview(urls);
  };
  const handleRemovePhoto = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
    setPreview(prev => prev.filter((_, i) => i !== idx));
  };

  const isFormValid = () => {
    return form.name && form.price && form.description && form.totalProduct && files.length >= 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'tags') {
        data.append(k, JSON.stringify(v));
      } else if (k === 'variants') {
        data.append(k, JSON.stringify(v));
      } else {
        data.append(k, v);
      }
    });
    // Add custom fields
    customFields.forEach((f, idx) => {
      data.append('customFieldName' + (idx+1), f.fieldName);
      f.fieldValues.forEach(val => data.append('customFieldValue' + (idx+1), val));
    });
    files.forEach(f => data.append('photos', f));
    const res = await fetch(\`\${API_BASE_URL}/locks/${apiEndpoint}/create\`, { method: 'POST', body: data });
    if (res.ok) onSave && onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Add ${category} Product</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <Input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <Input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discount (%)</label>
          <Input name="discount" type="number" value={form.discount} onChange={handleChange} placeholder="Discount (%)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Discounted Price (auto)</label>
          <Input name="discountPrice" type="number" value={form.discountPrice} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Total Product</label>
          <Input name="totalProduct" type="number" value={form.totalProduct} onChange={handleChange} placeholder="Total Product" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Input name="category" value={form.category} readOnly />
        </div>
      </div>
      {/* Custom Fields */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Custom Fields</label>
        {customFields.map((f, idx) => (
          <div key={idx} className="mb-2 border p-2 rounded">
            <div className="flex gap-2 items-center mb-1">
              <Input className="w-1/3" placeholder="Field Name" value={f.fieldName} onChange={e => handleCustomFieldNameChange(idx, e.target.value)} />
            </div>
            {f.fieldValues.map((val, vIdx) => (
              <div key={vIdx} className="flex gap-2 items-center mb-1">
                <Input className="w-1/2" placeholder="Field Value" value={val} onChange={e => handleCustomFieldValueChange(idx, vIdx, e.target.value)} />
                <Button type="button" onClick={() => handleRemoveCustomFieldValue(idx, vIdx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
              </div>
            ))}
            <Button type="button" onClick={() => handleAddCustomFieldValue(idx)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Value</Button>
          </div>
        ))}
      </div>
      {/* Variants Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Variants</label>
          <Button type="button" onClick={handleAddVariant} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1">Add Variant</Button>
        </div>
        {form.variants.map((v, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <Input className="w-1/3" placeholder="Variant Name" value={v.variantName} onChange={e => handleVariantChange(idx, 'variantName', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Price" value={v.price} onChange={e => handleVariantChange(idx, 'price', e.target.value)} />
            <Input className="w-1/3" type="number" placeholder="Discounted Price (auto)" value={v.discountPrice} readOnly />
            <Button type="button" onClick={() => handleRemoveVariant(idx)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1">Remove</Button>
          </div>
        ))}
      </div>
      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" />
      </div>
      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-1">Photos <span className="text-xs text-gray-400">(1-5 allowed)</span></label>
        <Input name="photos" type="file" multiple onChange={handleFiles} accept="image/*" />
        {photoError && <div className="text-red-500 text-xs mt-1">{photoError}</div>}
        {preview.length > 0 && (
          <div className="flex flex-row gap-3 mt-2 flex-wrap">
            {preview.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={'Preview ' + (idx + 1)} className="w-24 h-24 object-cover rounded border" />
                <button type="button" onClick={() => handleRemovePhoto(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">×</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex gap-2 mb-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}} placeholder="Type tag and press Enter or Add" />
          <Button type="button" onClick={handleAddTag} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag, idx) => (
            <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(idx)} className="ml-2 text-red-500">×</button>
            </span>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full mt-4">Create Product</Button>
    </form>
  );
}
`;

function isUpToDate(file, category, apiEndpoint) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    // Check for key template markers
    return (
      content.includes('import API_BASE_URL from "@/lib/apiConfig";') &&
      content.includes('locks/' + apiEndpoint + '/create') &&
      content.includes('const [customFields, setCustomFields] = useState([') &&
      content.includes('customFields.map((f, idx) => (') &&
      content.includes('<label className=\"block text-sm font-medium\">Custom Fields</label>') &&
      content.includes('const [form, setForm] = useState({') &&
      content.includes('variants: [],') &&
      content.includes('<label className=\"block text-sm font-medium\">Variants</label>') &&
      content.includes('Create Product</Button>')
    );
  } catch {
    return false;
  }
}

function main() {
  const files = getAllLocksProductFormFiles(LOCKS_PATH);
  
  let updated = 0;
  let skipped = [];
  let alreadyUpToDate = 0;
  
  console.log(`Found ${files.length} Locks ProductForm.jsx files`);
  
  for (const file of files) {
    const category = getCategoryFromPath(file);
    const apiEndpoint = getApiEndpointForLocks(file);
    
    console.log(`Processing: ${file} -> API: locks/${apiEndpoint}/create`);
    
    try {
      if (isUpToDate(file, category, apiEndpoint)) {
        alreadyUpToDate++;
        console.log(`Already up-to-date: ${file}`);
        continue;
      }
      fs.writeFileSync(file, template(category, apiEndpoint), 'utf8');
      console.log('Updated:', file);
      updated++;
    } catch (err) {
      console.error('Skipped (error):', file, '\nReason:', err.message);
      skipped.push(file);
    }
  }
  
  console.log(`\n=== SUMMARY ===`);
  console.log(`Total Locks ProductForm.jsx files updated: ${updated}`);
  console.log(`Total already up-to-date: ${alreadyUpToDate}`);
  if (skipped.length > 0) {
    console.log('Files skipped due to errors:');
    skipped.forEach(f => console.log(f));
  }
}

main(); 