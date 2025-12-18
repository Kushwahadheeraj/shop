"use client";

export default function GalleryPage() {
  const galleryImages = [
    { id: 1, title: "Hardware Products", description: "Wide range of hardware items" },
    { id: 2, title: "Electrical Items", description: "Quality electrical components" },
    { id: 3, title: "Tools & Equipment", description: "Professional tools for all needs" },
    { id: 4, title: "Paints & Colors", description: "Premium paint solutions" },
    { id: 5, title: "Sanitary Products", description: "Modern sanitary solutions" },
    { id: 6, title: "Faucets & Fittings", description: "Stylish faucets and fittings" },
  ];

  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Gallery</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((item) => (
            <div key={item.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <div className="text-center p-4">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-500 text-sm">Image Placeholder</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
