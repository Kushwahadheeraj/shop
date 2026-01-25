"use client";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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
    return form.name && file;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setPhotoError("Please upload at least 1 photo.");
      return;
    }
    setPhotoError("");
    if (!isFormValid()) {
      setPhotoError("Please fill all required fields and upload an image");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("subtitle", form.subtitle);
    data.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/home/shopbycategory/create`, {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Category item created successfully!");
        setForm({ name: "", subtitle: "" });
        setFile(null);
        setPreview(null);
      } else {
        alert("Error creating item");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Add Shop By Category Item</h1>
        </div>
        <p className="text-xs sm:text-sm text-emerald-50">Fill in the category details below</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter category name (e.g. Ethnic Wear)"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <Input
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            placeholder="Enter subtitle (e.g. 50-80% OFF)"
          />
        </div>



        <div>
          <label className="block text-sm font-medium mb-2">Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
            {!preview ? (
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 text-gray-400">
                  <Sparkles className="w-full h-full" />
                </div>
                <div className="text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFile}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-48 rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-lg"
                >
                  <span className="sr-only">Remove</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {photoError && <p className="text-red-500 text-sm mt-1">{photoError}</p>}
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-200"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Category Item"}
        </Button>
      </form>
    </div>
  );
}
