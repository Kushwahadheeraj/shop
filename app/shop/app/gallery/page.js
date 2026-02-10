"use client";
import { useEffect, useState } from 'react'
import Image from 'next/image'
import API_BASE_URL from '@/lib/apiConfig'


export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true
        const fetchCards = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/gallery/get`)
                const json = await res.json()
                let list = []
                if (json && json.success && Array.isArray(json.data)) list = json.data
                else if (Array.isArray(json)) list = json
                else if (json && Array.isArray(json.galleryImages)) list = json.galleryImages
                if (isMounted) setGalleryImages(list)
            } catch (e) {
                if (isMounted) setGalleryImages([])
            } finally {
                if (isMounted) setLoading(false)
            }
        }
        fetchCards()
        return () => { isMounted = false }
    }, [])

    if (!loading && galleryImages.length === 0) {
        return null
    }
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {galleryImages.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <Image className="w-full h-full stroke-black object-cover"
                                    src={item.image}
                                    alt={item.mainTitle}
                                    width={292}
                                    height={384}
                                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.mainTitle}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
