"use client";
import { useState } from "react";

export default function ResellerProgramPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    message: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your interest in our Reseller Program! We will contact you soon.");
    setFormData({ name: "", email: "", phone: "", businessName: "", businessType: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Reseller Program</h1>
        
        <div className="space-y-8">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Join Our Reseller Program</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Become a part of our growing network of resellers and enjoy exclusive benefits, 
              competitive pricing, and dedicated support. Our reseller program is designed to 
              help your business grow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Competitive Pricing</h3>
                <p className="text-sm text-gray-700">Get access to wholesale prices and special discounts</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Marketing Support</h3>
                <p className="text-sm text-gray-700">Receive marketing materials and promotional support</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Dedicated Account Manager</h3>
                <p className="text-sm text-gray-700">Personal support from our team</p>
              </div>
              <div className="bg-blue-50 p-4 rounded">
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-700">Priority processing and faster shipping</p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Apply Now</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Business Type *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    required
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="retail">Retail Store</option>
                    <option value="wholesale">Wholesale</option>
                    <option value="online">Online Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Business Name *</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border rounded px-3 py-2"
                  placeholder="Tell us about your business and requirements..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
