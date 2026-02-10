"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import API_BASE_URL from "@/lib/apiConfig";

export default function SectionPage() {
  const params = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Decode section from params
  const section = params?.section ? decodeURIComponent(params.section) : "";

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/home/heroproductcard/get?section=${encodeURIComponent(section)}`);
        const json = await res.json();
        if (json.success) {
          setItems(json.data);
        }
      } catch (error) {
        // Error fetching items
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [section]);

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:mt-32 mt-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{section}</h1>
          <p className="text-sm text-gray-500">
            All items in {section} collection
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Home
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No items found in this section yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item) => {
            const href = item.link || getCategoryPath(item.name);
            return (
              <Link
                href={href}
                key={item._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex flex-col items-center gap-3 cursor-pointer hover:shadow-md transition-shadow group block"
              >
                <div className="w-full aspect-square relative mb-1.5 overflow-hidden rounded-md bg-gray-50">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="text-center w-full">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2" title={item.name}>
                    {item.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
