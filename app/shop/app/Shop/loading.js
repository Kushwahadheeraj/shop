import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
      {/* Sidebar Skeleton */}
      <div className="hidden md:block w-64 shrink-0">
         <div className="space-y-4">
             <Skeleton className="h-12 w-full" />
             <Skeleton className="h-[600px] w-full" />
         </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="w-full md:flex-1 lg:mt-36 mt-16">
        {/* Breadcrumb Skeleton */}
        <div className="mb-4 bg-white p-3 border-b border-gray-200">
             <Skeleton className="h-6 w-48" />
        </div>
        
        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white p-2 rounded-lg shadow-sm space-y-3">
                    <Skeleton className="h-40 w-full rounded-md" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
            ))}
        </div>
      </main>
    </div>
  );
}
