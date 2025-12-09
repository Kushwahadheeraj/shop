"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

export default function ProductForm() {
  const router = useRouter();
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const STORAGE_KEY = 'electricalHomeSelectedCategories';
  const [alreadySelected, setAlreadySelected] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setError("");
      try {
        // Use home endpoint so BE logic is centralized under home controller
        const res = await fetch(`${API_BASE_URL}/home/electrical/get?firstPerCategory=true`);
        const json = await res.json();
        const rows = Array.isArray(json?.data) ? json.data : [];
        const cats = rows.map((r) => r.category).filter(Boolean).sort((a, b) => a.localeCompare(b));
        // fetch categories already selected into HomeElectricalModel
        try {
          const r2 = await fetch(`${API_BASE_URL}/home/electrical/selected-categories`);
          const j2 = await r2.json();
          const picked = Array.isArray(j2?.data) ? j2.data : [];
          setAlreadySelected(picked);
          setAvailableCategories(cats.filter((c) => !picked.includes(c)));
        } catch {
          setAvailableCategories(cats);
        }
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          if (Array.isArray(saved) && saved.length > 0) {
            setSelectedCategories(saved.filter((c) => cats.includes(c)));
          }
        } catch {}
      } catch (e) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const [filterText, setFilterText] = useState("");

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) => {
      const next = prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const filteredCategories = useMemo(() => {
    const t = filterText.trim().toLowerCase();
    if (!t) return availableCategories;
    return availableCategories.filter((c) => c.toLowerCase().includes(t));
  }, [availableCategories, filterText]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCategories)); } catch {}
    // Persist the selection into HomeElectricalModel
    fetch(`${API_BASE_URL}/home/electrical/select-categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categories: selectedCategories })
    }).then(() => {
      const qs = `categories=${encodeURIComponent(JSON.stringify(selectedCategories))}`;
      router.push(`/ProductList/Home/ElectricalHome?${qs}`);
    }).catch(() => {
      const qs = `categories=${encodeURIComponent(JSON.stringify(selectedCategories))}`;
      router.push(`/ProductList/Home/ElectricalHome?${qs}`);
    });
  };

  return (
    
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Hero Header */}
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-lg p-4 sm:p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 mb-2">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">ElectricalHome - Select Categories</h1>
        </div>
        <p className="text-xs sm:text-sm text-amber-50">Fill in the product details below</p>
      </div>

    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 sm:space-y-6 p-4 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <div>
        <label className="block text-sm font-medium mb-2">Categories</label>
        <input
          type="text"
          placeholder="Search category"
          className="w-full border rounded px-2 py-1 mb-2"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          disabled={loading}
        />
        <div className="w-full border rounded p-2 h-56 overflow-auto space-y-1">
          {filteredCategories.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                disabled={loading}
              />
              <span>{cat}</span>
            </label>
          ))}
          {filteredCategories.length === 0 && (
            <div className="text-xs text-gray-500">No categories found.</div>
          )}
        </div>
        {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
        <div className="flex gap-2 mt-3">
          <button type="button" className="px-3 py-1 border rounded" onClick={() => setSelectedCategories(availableCategories)} disabled={loading || availableCategories.length === 0}>
            Select All
          </button>
          <button type="button" className="px-3 py-1 border rounded" onClick={() => setSelectedCategories([])} disabled={loading}>
            Clear
          </button>
          {alreadySelected.length > 0 && (
            <div className="text-xs text-gray-500">Already added: {alreadySelected.join(', ')}</div>
          )}
        </div>
      </div>

      <button type="submit" className="w-full bg-black text-white rounded py-2 disabled:opacity-50" disabled={loading || selectedCategories.length === 0}>
        Show Products
      </button>
    </form>
    </div>
  );
}


