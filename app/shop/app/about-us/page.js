"use client";

export default function AboutUsPage() {
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hardware Shack is a leading online platform for hardware products, tools, electrical items, 
              paints, and more. We are committed to providing quality products at competitive prices 
              with excellent customer service.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Founded with a vision to make hardware shopping convenient and accessible, we have grown 
              to become a trusted name in the industry. Our extensive product range and reliable service 
              have made us the preferred choice for customers across the country.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              To provide high-quality hardware products and exceptional customer service, making it easy 
              for customers to find and purchase everything they need for their projects, whether big or small.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Quality:</strong> We ensure all our products meet high quality standards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Customer First:</strong> Your satisfaction is our top priority</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Reliability:</strong> Trusted service you can depend on</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Innovation:</strong> Continuously improving our services and offerings</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Wide Product Range</h3>
                <p className="text-gray-600 text-sm">Extensive selection of hardware products</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Competitive Prices</h3>
                <p className="text-gray-600 text-sm">Best prices in the market</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Fast Delivery</h3>
                <p className="text-gray-600 text-sm">Quick and reliable delivery service</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-gray-600 text-sm">24/7 customer support available</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
