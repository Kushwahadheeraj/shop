import CategorySelect from "./CategorySelect.jsx";
export default function HomeProductAddPage() {
  return <CategorySelect />;
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
