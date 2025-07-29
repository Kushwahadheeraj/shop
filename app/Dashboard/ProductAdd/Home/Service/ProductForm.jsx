"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    icon: 'ShieldCheck',
    title: '',
    description: '',
  });
  const [file, setFile] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setForm(prev => ({ ...prev, icon: value }));
  };

  

 

  const isFormValid = () => {
    return form.title && form.description && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    const data = new FormData();
    data.append('icon', form.icon);
    data.append('title', form.title);
    data.append('description', form.description);

    try {
      const res = await fetch(`${API_BASE_URL}/home/service/create`, { 
        method: 'POST', 
        body: data 
      });
      
      if (res.ok) {
        alert('Service created successfully!');
        setForm({
          icon: 'ShieldCheck',
          title: '',
          description: '',
        });
        setFile(null);
        setPreview(null);
      } else {
        alert('Error creating service');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating service');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Service Product</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Icon</label>
          <Select value={form.icon} onValueChange={handleSelectChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ShieldCheck">Shield Check (Secure Payment)</SelectItem>
              <SelectItem value="Headphones">Headphones (Customer Support)</SelectItem>
              <SelectItem value="Truck">Truck (Fast Delivery)</SelectItem>
              <SelectItem value="CreditCard">Credit Card</SelectItem>
              <SelectItem value="Phone">Phone</SelectItem>
              <SelectItem value="Mail">Mail</SelectItem>
              <SelectItem value="Clock">Clock</SelectItem>
              <SelectItem value="Star">Star</SelectItem>
              <SelectItem value="Heart">Heart</SelectItem>
              <SelectItem value="CheckCircle">Check Circle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title </label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="e.g., SECURE PAYMENT" 
            required 
            className="w-full"
          />
        </div>


      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description </label>
        <Textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Enter service description..." 
          required 
          className="w-full"
          rows={4}
        />
       
      </div>

      

      {/* Preview Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="mb-2">
              {/* Icon preview - you can add actual icon rendering here */}
              <div className="w-10 h-10 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                {form.icon.charAt(0)}
              </div>
            </div>
            <h3 className="text-xl font-extrabold mb-2">{form.title || 'Service Title'}</h3>
            <p className="text-gray-600 text-sm">{form.description || 'Service description will appear here...'}</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!isFormValid()}
      >
        Create Service
      </Button>
      </div>
    </form>
  );
}
