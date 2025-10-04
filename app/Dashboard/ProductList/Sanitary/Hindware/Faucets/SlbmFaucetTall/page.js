import ProductList from './ProductList';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function SlbmFaucetTallPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}