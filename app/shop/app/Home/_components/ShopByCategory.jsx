"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import API_BASE_URL from "@/lib/apiConfig";
import { allCategories } from "../../../lib/categoryData";
import { useSectionTitle } from "@/hooks/useSectionTitle";

export default function ShopByCategory() {
  const [items, setItems] = useState([]);
  const { title } = useSectionTitle('shop-by-category', 'SHOP BY CATEGORY');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // Fetch Items
        const res = await fetch(`${API_BASE_URL}/home/shopbycategory/get`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setItems(json.data);
          } else if (Array.isArray(json)) {
            setItems(json);
          }
        }
      } catch (error) {
        console.error("Error fetching shop by category data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading || items.length === 0) {
    return null;
  }

  return (
    <div className="bg-sky-100 py-4">
      <div className="max-w-8xl mx-auto px-2">
        {/* Header */}
        <div className="bg-yellow-100 text-center py-8 mb-4 relative overflow-hidden rounded-t-md border-b-4 border-orange-500">
           {/* Decorative corner images - placeholders if needed, or CSS styling */}
           <div className="flex items-center justify-center gap-2">
             <h2 className="text-2xl md:text-4xl font-black text-orange-600 uppercase tracking-wide" style={{ textShadow: '1px 1px 0 #fff' }}>
               {title}
             </h2>
           </div>
        </div>

        {/* Grid */}
        <div className="flex flex-wrap justify-center gap-3 px-4 md:px-16">
          {items.map((item) => (
            <div 
              key={item._id}
              className="group flex flex-col cursor-pointer bg-orange-600 p-1 rounded-sm shadow-sm border-l-4 border-black w-[45%] sm:w-[30%] md:w-[22%] lg:w-[15%]"
              onClick={() => {
                if (!item.name) return;
                const query = item.name.trim().toLowerCase();
                
                // Prioritize sub-categories first, then main categories
                const subs = allCategories.filter(c => c.type === 'sub');
                const mains = allCategories.filter(c => c.type === 'main');
                
                // Robust matching function
                const isMatch = (cat) => {
                  const catName = cat.name.toLowerCase();
                  const catDesc = (cat.description || '').toLowerCase();
                  // Check if category name contains query OR query contains category name
                  // Also check description
                  return catName.includes(query) || query.includes(catName) || catDesc.includes(query);
                };

                const matchSub = subs.find(isMatch);
                const matchMain = mains.find(isMatch);

                let matchedCategory = matchSub || matchMain;

                // Fallback: If no match, try finding a partial match by splitting words
                if (!matchedCategory) {
                    const words = query.split(/\s+/).filter(w => w.length > 2); // Only consider words > 2 chars
                    if (words.length > 0) {
                        // Try to find a subcategory that matches ANY of the words
                        matchedCategory = subs.find(cat => {
                            const catName = cat.name.toLowerCase();
                            return words.some(w => catName.includes(w));
                        });
                    }
                }
                
                const path = matchedCategory ? matchedCategory.path : (item.link || '/ShopPage/Uncategorized');
                console.log(`Searching for: "${query}" -> Found: ${matchedCategory?.name} (${path})`);
                router.push(path);
              }}
            >
              {/* Image Section */}
              <div className="relative h-48 w-full bg-white overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300"
                />
              </div>

              {/* Footer Section */}
              <div className="py-1 text-center text-white flex flex-col gap-0.2">
                <h3 className="text-sm font-bold truncate uppercase tracking-wider text-white">{item.name}</h3>
                {item.subtitle && (
                  <p className="text-3xl font-black text-white tracking-wide">{item.subtitle}</p>
                )}
                <span className="text-xs font-semibold uppercase tracking-widest text-white">
                  Shop Now
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
