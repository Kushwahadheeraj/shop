"use client";
export default function ProductForm() {
  return (<h2 className="text-xl font-bold mb-2">Add Primer Product</h2>)
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const resource = pathParts[pathParts.length - 1].toLowerCase();
  const apiUrl = ${API_BASE_URL}/paint//create;
  return <div>Product Form</div>;
}

