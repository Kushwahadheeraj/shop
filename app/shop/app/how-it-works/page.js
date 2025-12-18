"use client";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">How It Works</h1>
        
        <div className="space-y-8">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">1. Browse Products</h2>
            <p className="text-gray-700 leading-relaxed">
              Explore our wide range of hardware products, tools, electrical items, paints, and more. 
              Use our search and filter options to find exactly what you need.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">2. Add to Cart</h2>
            <p className="text-gray-700 leading-relaxed">
              Select your desired products and add them to your shopping cart. 
              Review your selections and quantities before proceeding to checkout.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">3. Checkout</h2>
            <p className="text-gray-700 leading-relaxed">
              Enter your delivery address and contact details. 
              Review your order summary including prices, delivery charges, and total amount.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">4. Payment</h2>
            <p className="text-gray-700 leading-relaxed">
              Choose your preferred payment method - UPI, Credit/Debit Card, Net Banking, or Cash on Delivery. 
              Complete the payment securely.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Order Confirmation</h2>
            <p className="text-gray-700 leading-relaxed">
              Receive an order confirmation email with your order details and tracking information. 
              Track your order status in real-time.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">6. Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              Your order will be delivered to your specified address within the estimated delivery time. 
              For Cash on Delivery orders, please keep exact change ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
