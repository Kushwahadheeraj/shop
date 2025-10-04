import ProductList from './ProductList';


// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";

export default function SocketsetPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}