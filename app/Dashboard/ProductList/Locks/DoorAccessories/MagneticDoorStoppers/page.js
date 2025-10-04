import ProductList from './ProductList';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function MagneticDoorStoppersPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}