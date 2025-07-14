"use client";
export default function ProductForm() {
  return (<h2 className="text-xl font-bold mb-2">Add CoralBathFixtures Product</h2>)
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const resource = pathParts[pathParts.length - 1];
  return <div>Product Form</div>;
}

