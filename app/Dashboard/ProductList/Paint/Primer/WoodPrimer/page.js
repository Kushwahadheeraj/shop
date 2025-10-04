import ProductList from './ProductList';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function WoodPrimerPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}