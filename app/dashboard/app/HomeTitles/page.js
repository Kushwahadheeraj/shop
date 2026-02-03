"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import API_BASE_URL from "@/lib/apiConfig";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SECTIONS = [
  { id: 'shop-by-category', label: 'Shop By Category', default: 'SHOP BY CATEGORY' },
  { id: 'brands', label: 'Brands', default: 'Shop the brands' },
  { id: 'popular-products', label: 'Popular Products', default: 'Popular Products' },
  { id: 'card-slider', label: 'Card Slider / Top Deals', default: 'Top Deals' },
  { id: 'deals-discount', label: 'Deals - Discount Column', default: 'Discounts for you' },
  { id: 'deals-top-rated', label: 'Deals - Top Rated Column', default: 'Top rated' },
  { id: 'deals-furniture', label: 'Deals - Furniture Column', default: 'Furniture deals' },
  { id: 'best-quality', label: 'Best Quality', default: 'Best Quality' },
  { id: 'top-selection', label: 'Top Selection', default: 'Top Selection' },
  { id: 'paints', label: 'Paints', default: 'Paints' },
  { id: 'electrical', label: 'Electrical', default: 'Electrical' },
  { id: 'popular-tools', label: 'Popular Tools', default: 'Popular Tools' },
  { id: 'categories', label: 'Categories', default: 'Categories' },
  { id: 'items', label: 'Items / Featured', default: 'Featured Items' },
  { id: 'fashion-banner', label: 'Fashion Banner', default: 'Fashion Banner' },
  { id: 'promo-banner', label: 'Promo Banner', default: 'Promo Banner' },
];

function TitleEditor({ section, initialTitle, token }) {
  const [value, setValue] = useState(initialTitle || section.default);
  const [saving, setSaving] = useState(false);
  
  // If we fetched a title that is different from current state (and not just default), update it.
  // But strictly, we only want to update if we just loaded data. 
  // For simplicity, we'll let the parent pass the fetched title.
  // We use a key in parent to force re-mount or useEffect here.
  useEffect(() => {
    if (initialTitle) setValue(initialTitle);
  }, [initialTitle]);

  const handleSave = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/home/section-titles/${section.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: value })
      });
      const data = await res.json();
      if (data.success) {
        // Success feedback
      } else {
        alert("Failed to save");
      }
    } catch (error) {
      console.error("Error saving title", error);
      alert("Error saving title");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{section.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button onClick={handleSave} disabled={saving} size="icon">
            {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function HomeTitlesPage() {
  const { token } = useAuth();
  const [titles, setTitles] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/section-titles`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const map = {};
          data.data.forEach(t => {
            map[t.sectionId] = t.title;
          });
          setTitles(map);
        }
      } catch (error) {
        console.error("Failed to fetch titles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Home Page Section Titles</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <TitleEditor 
            key={section.id} 
            section={section} 
            initialTitle={titles[section.id]} 
            token={token}
          />
        ))}
      </div>
    </div>
  );
}
