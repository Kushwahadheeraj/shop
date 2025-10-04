'use client';
import React from 'react';
import ProductListingPage from '@/components/ProductListingPage';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function CategoryPage() {
  return <ProductListingPage />;
}
