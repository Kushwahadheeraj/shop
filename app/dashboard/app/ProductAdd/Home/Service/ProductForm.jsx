"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    icon: 'ShieldCheck',
    title: '',
    description: '',
  });
  const [error, setError] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value) => {
    setForm(prev => ({ ...prev, icon: value }));
  };

  const isFormValid = () => {
    return form.title && form.description;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!isFormValid()) {
      setError("Please fill all required fields");
      return;
    }

    // Send as JSON instead of FormData since services don't have file uploads
    const serviceData = {
      icon: form.icon,
      title: form.title,
      description: form.description
    };

    try {
      const res = await fetch(`${API_BASE_URL}/home/service/create`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(serviceData)
      });
      
      if (res.ok) {
        alert('Service created successfully!');
        setForm({
          icon: 'ShieldCheck',
          title: '',
          description: '',
        });
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.message || 'Error creating service');
      }
    } catch (error) {
            setError('Error creating service');
    }
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Service</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {/* Icon Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Icon *</label>
          <Select value={form.icon} onChange={(e) => handleSelectChange(e.target.value)}>
            <option value="" disabled>Select an icon</option>
            <option value="ShieldCheck">Shield Check (Secure Payment)</option>
            <option value="Headphones">Headphones (Customer Support)</option>
            <option value="Truck">Truck (Fast Delivery)</option>
            <option value="CreditCard">Credit Card</option>
            <option value="Phone">Phone</option>
            <option value="Mail">Mail</option>
            <option value="Clock">Clock</option>
            <option value="Star">Star</option>
            <option value="Heart">Heart</option>
            <option value="CheckCircle">Check Circle</option>
          </Select>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <Input 
            name="title" 
            value={form.title} 
            onChange={handleChange} 
            placeholder="e.g., SECURE PAYMENT" 
            required 
            className="w-full focus:ring-amber-300 focus:border-amber-500 text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <Textarea 
          name="description" 
          value={form.description} 
          onChange={handleChange} 
          placeholder="Enter service description..." 
          required 
          className="w-full text-sm sm:text-base focus:ring-amber-300 focus:border-amber-500"
          rows={4}
        />
      </div>

      {/* Preview Section */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-3">Preview</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <div className="mb-2">
              {/* Icon preview */}
              <div className="w-10 h-10 mx-auto mb-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {form.icon ? form.icon.charAt(0) : 'S'}
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
    </form>
    </div>
  );
}
