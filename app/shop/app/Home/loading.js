import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-sky-100 p-2 space-y-4">
      {/* Slider Skeleton */}
      <Skeleton className="w-full h-48 md:h-[400px] rounded-none md:rounded-xl" />
      
      {/* Coupons/Card Slider Skeleton */}
      <div className="flex gap-4 overflow-hidden py-2">
          <Skeleton className="w-40 h-24 md:w-64 md:h-32 shrink-0 rounded-lg" />
          <Skeleton className="w-40 h-24 md:w-64 md:h-32 shrink-0 rounded-lg" />
          <Skeleton className="w-40 h-24 md:w-64 md:h-32 shrink-0 rounded-lg" />
      </div>

      {/* Grid Skeletons (Best Quality, Top Selection, etc) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-8xl mx-auto">
          <Skeleton className="h-64 w-full rounded-md bg-white" />
          <Skeleton className="h-64 w-full rounded-md bg-white" />
          <Skeleton className="h-64 w-full rounded-md bg-white" />
      </div>
      
      {/* Shop By Category Skeleton */}
      <div className="py-4">
         <Skeleton className="h-12 w-64 mx-auto mb-4" />
         <div className="flex flex-wrap justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="w-[45%] md:w-[15%] h-32 rounded-sm" />
            ))}
         </div>
      </div>
    </div>
  );
}
