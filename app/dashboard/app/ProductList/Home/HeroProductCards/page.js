import ProductList from "./ProductList.jsx";

export default function HeroProductCardsListPage() {
  return (
    <div className="space-y-6">
      <ProductList />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
