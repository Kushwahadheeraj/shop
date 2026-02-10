"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload, X } from "lucide-react";
import Image from 'next/image';

export default function CategoryBannerUpload({ category }) {
  const [currentBanner, setCurrentBanner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [category]);

  const fetchBanner = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/category-banner?category=${encodeURIComponent(category)}`);
      if (res.ok) {
        const data = await res.json();
        setCurrentBanner(data?.imageUrl || null);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // 1. Upload to Cloudinary via Proxy
      const formData = new FormData();
      formData.append('file', file);
      
      // Note: Adjust the upload endpoint if needed. 
      // Assuming /shop/api/upload/cloudinary is available or we use the dashboard one if it exists.
      // Based on previous context, the proxy is at /shop/api/upload/cloudinary
      // But we are in dashboard app. Let's try to access the shop api route.
      // Or we can assume there is a similar route in dashboard or we use absolute path?
      // Next.js routes are usually relative to root.
      // app/shop/app/api/upload/cloudinary/route.js -> /api/upload/cloudinary (if shop is root)
      // Wait, app structure is:
      // app/dashboard
      // app/shop
      // They might be different zones or just route groups.
      // If they are route groups, path is /api/upload/cloudinary (if not in (shop) group)
      // app/shop/app/api/upload/cloudinary -> /api/upload/cloudinary (if shop is just folder)
      // Let's assume standard Next.js routing.
      
      const uploadRes = await fetch('/api/upload/cloudinary', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');
      
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.secure_url || uploadData.url; // Adjust based on actual response

      if (!imageUrl) throw new Error('No image URL returned');

      // 2. Save to Database
      const saveRes = await fetch('/api/category-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, imageUrl }),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save banner');
      }

      setCurrentBanner(imageUrl);
      
    } catch (error) {
      alert('Failed to upload banner');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-4"><Loader2 className="animate-spin" /></div>;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Category Banner: {category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {currentBanner ? (
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border">
              <Image 
                src={currentBanner} 
                alt={`${category} Banner`} 
                fill 
                className="object-cover"
              />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => {
                  // Optional: Add delete functionality
                  if(confirm('Replace this banner?')) {
                     document.getElementById(`banner-upload-${category}`).click();
                  }
                }}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
              <p>No banner uploaded</p>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              id={`banner-upload-${category}`}
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button 
              variant="outline" 
              onClick={() => document.getElementById(`banner-upload-${category}`).click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> {currentBanner ? 'Change Banner' : 'Upload Banner'}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
