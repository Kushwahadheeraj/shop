import ProductList from './ProductList';


export default function PillarFaucetPage() {
  return (
    <div>
      <ProductList />
    </div>
  );
}
export const runtime = "nodejs";
export const revalidate = 0;

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const revalidate = 0;
