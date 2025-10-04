"use client";


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

import ProductList from "./product-list.jsx";

export default function Page() {
  return <ProductList />;
}


