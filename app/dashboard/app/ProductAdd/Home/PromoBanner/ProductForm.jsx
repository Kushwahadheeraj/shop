"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    highlightText: '',
    buttonText: '',
    buttonLink: '',
    cards: [
      { image: '', label: '', link: '' },
      { image: '', label: '', link: '' },
      { image: '', label: '', link: '' },
      { image: '', label: '', link: '' }
    ]
  });
  
  // Track new files separately
  const [files, setFiles] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState(['', '', '', '']);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/home/promobanner/get`);
      const data = await res.json();
      if (data) {
        setForm({
          title: data.title || '',
          subtitle: data.subtitle || '',
          highlightText: data.highlightText || '',
          buttonText: data.buttonText || '',
          buttonLink: data.buttonLink || '',
          cards: data.cards && data.cards.length === 4 ? data.cards : [
             { image: '', label: '', link: '' },
             { image: '', label: '', link: '' },
             { image: '', label: '', link: '' },
             { image: '', label: '', link: '' }
          ]
        });
        setPreviews(data.cards ? data.cards.map(c => c.image) : ['', '', '', '']);
      }
    } catch (error) {
          } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (index, field, value) => {
    const newCards = [...form.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setForm(prev => ({ ...prev, cards: newCards }));
  };

  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);

      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE_URL}/upload/cloudinary`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Upload failed');
      }
      return data.secure_url;
    } catch (error) {
            alert(`Failed to upload image: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedCards = [...form.cards];
      let uploadFailed = false;
      
      // Upload new files
      for (let i = 0; i < 4; i++) {
        if (files[i]) {
          const url = await uploadFile(files[i]);
          if (url) {
            updatedCards[i].image = url;
          } else {
            uploadFailed = true;
          }
        }
      }

      if (uploadFailed) {
        setLoading(false);
        return; // Stop if any upload failed
      }

      const payload = { ...form, cards: updatedCards };

      const res = await fetch(`${API_BASE_URL}/home/promobanner/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();

      if (res.ok) {
        alert("Banner updated successfully!");
        fetchBanner(); // Refresh
        setFiles([null, null, null, null]); // Reset files
      } else {
        alert(`Failed to update banner: ${data.message}`);
      }
    } catch (error) {
            alert(`Error updating banner: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Manage Promo Banner</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-semibold text-lg">Left Section (Text)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input name="title" value={form.title} onChange={handleChange} placeholder="Up to 35% OFF" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <Input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="on first order" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Highlight Text</label>
              <Input name="highlightText" value={form.highlightText} onChange={handleChange} placeholder="*Only on App" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              <Input name="buttonText" value={form.buttonText} onChange={handleChange} placeholder="Download Now" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Button Link</label>
              <Input name="buttonLink" value={form.buttonLink} onChange={handleChange} placeholder="/" />
            </div>
          </div>
        </div>

        <div className="space-y-4 border p-4 rounded-md">
          <h3 className="font-semibold text-lg">Right Section (4 Cards)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {form.cards.map((card, index) => (
              <div key={index} className="border p-3 rounded-md space-y-3 bg-gray-50">
                <h4 className="font-medium text-sm">Card {index + 1}</h4>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Label</label>
                  <Input 
                    value={card.label} 
                    onChange={(e) => handleCardChange(index, 'label', e.target.value)} 
                    placeholder="Trending Now" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium mb-1">Link</label>
                  <Input 
                    value={card.link} 
                    onChange={(e) => handleCardChange(index, 'link', e.target.value)} 
                    placeholder="/shop/category" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Image</label>
                  <div className="flex items-center gap-2">
                    {previews[index] && (
                      <img src={previews[index]} alt="Preview" className="w-10 h-10 object-cover rounded border" />
                    )}
                    <Input type="file" accept="image/*" onChange={(e) => handleFileChange(index, e)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
