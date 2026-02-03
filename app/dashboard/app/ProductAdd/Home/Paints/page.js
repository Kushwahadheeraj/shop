import CategorySelect from "./CategorySelect.jsx";

export default function HomeProductAddPage() {
  return (
    <div className="space-y-6">
      <CategorySelect />
    </div>
  );
}

// Force dynamic rendering to prevent build timeouts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
