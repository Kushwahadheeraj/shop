"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";
import { Button } from "@/components/ui/button";

export default function CategorySelect() {
  const router = useRouter();
  const STORAGE_KEY = "homePaintsSelectedCategories";
  const [sourceCategories, setSourceCategories] = useState([]);
  const [alreadySelected, setAlreadySelected] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [srcRes, pickedRes] = await Promise.all([
          fetch(`${API_BASE_URL}/home/paints/source-categories`),
          fetch(`${API_BASE_URL}/home/paints/selected-categories`),
        ]);
        const srcJson = await srcRes.json();
        const pickedJson = await pickedRes.json();
        const src = Array.isArray(srcJson?.data) ? srcJson.data : [];
        const picked = Array.isArray(pickedJson?.data) ? pickedJson.data : [];
        setSourceCategories(src);
        setAlreadySelected(picked);
        const avail = src.filter((c) => !picked.includes(c));
        setAvailable(avail);
        try {
          const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
          if (Array.isArray(saved) && saved.length > 0) {
            setSelected(saved.filter((c) => avail.includes(c)));
          }
        } catch {}
      } catch (e) {
        setError("Failed to load categories");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggle = (cat) => {
    setSelected((prev) => {
      const next = prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filtered = useMemo(() => {
    const t = filterText.trim().toLowerCase();
    if (!t) return available;
    return available.filter((c) => c.toLowerCase().includes(t));
  }, [available, filterText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {}
    try {
      await fetch(`${API_BASE_URL}/home/paints/select-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categories: selected }),
      });
    } catch {}
    const qs = `categories=${encodeURIComponent(JSON.stringify(selected))}`;
    router.push(`/ProductList/Home/Paints?${qs}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 text-center">Home Paints - Select Categories</h2>
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
          {filtered.map((cat) => (
            <label key={cat} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={selected.includes(cat)} onChange={() => toggle(cat)} disabled={loading} />
              <span>{cat}</span>
            </label>
          ))}
          {filtered.length === 0 && <div className="text-xs text-gray-500">No categories found.</div>}
        </div>
        {error && <div className="text-red-600 text-xs mt-2">{error}</div>}
        <div className="flex gap-2 mt-3">
          <Button type="button" variant="outline" onClick={() => setSelected(available)} disabled={loading || available.length === 0}>Select All</Button>
          <Button type="button" variant="outline" onClick={() => setSelected([])} disabled={loading}>Clear</Button>
        </div>
        {alreadySelected.length > 0 && (
          <div className="text-xs text-gray-500 mt-2">Already added: {alreadySelected.join(", ")}</div>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={loading || selected.length === 0}>Show Products</Button>
    </form>
  );
}


