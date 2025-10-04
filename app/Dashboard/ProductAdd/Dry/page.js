import ProductForm from './ProductForm';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function DryWallGypsumScrewsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dry Wall Gypsum Screws Product</h1>
      <ProductForm />
      {/* List products here */}
    </div>
  );
} 
