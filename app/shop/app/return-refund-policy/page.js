"use client";

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Return and Refund Policy</h1>
        
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-700 leading-relaxed">
              At Hardware Shack, we want you to be completely satisfied with your purchase. 
              This policy outlines our return and refund procedures.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Return Eligibility</h2>
            <p className="text-gray-700 leading-relaxed mb-3">Items can be returned within 7 days of delivery if:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• The product is unused, unopened, and in its original packaging</li>
              <li>• The product is defective or damaged</li>
              <li>• You received the wrong item</li>
              <li>• The product does not match the description</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              <strong>Note:</strong> Some items may not be eligible for return due to hygiene or safety reasons. 
              Please check product details before purchase.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">How to Return</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Step 1:</strong> Contact our customer support team to initiate a return request.</p>
              <p><strong>Step 2:</strong> Provide your order number and reason for return.</p>
              <p><strong>Step 3:</strong> Our team will review your request and provide a Return Authorization (RA) number.</p>
              <p><strong>Step 4:</strong> Pack the item securely in its original packaging with all accessories.</p>
              <p><strong>Step 5:</strong> Ship the item back to us using the provided return address.</p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              Return shipping costs depend on the reason for return:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Defective/Wrong Item:</strong> We will cover return shipping costs</li>
              <li>• <strong>Change of Mind:</strong> Customer is responsible for return shipping</li>
              <li>• <strong>Damaged in Transit:</strong> We will cover return shipping and provide replacement</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Refund Process</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Processing Time:</strong> Once we receive and inspect the returned item, 
              refunds will be processed within 5-7 business days.</p>
              <p><strong>Refund Method:</strong> Refunds will be issued to the original payment method used for purchase.</p>
              <p><strong>Cash on Delivery:</strong> For COD orders, refunds will be processed via bank transfer 
              or store credit, as per your preference.</p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Exchange Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We offer exchanges for defective or wrong items. Exchanges are subject to product availability. 
              If the desired item is not available, we will process a refund instead.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Non-Returnable Items</h2>
            <p className="text-gray-700 leading-relaxed mb-3">The following items cannot be returned:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Items without original packaging</li>
              <li>• Used or damaged items (unless defective)</li>
              <li>• Items purchased more than 7 days ago</li>
              <li>• Customized or personalized products</li>
              <li>• Items marked as "Non-Returnable" on the product page</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              Orders can be cancelled before shipment. Once an order is shipped, it cannot be cancelled 
              but can be returned as per our return policy. Cancelled orders will be refunded within 3-5 business days.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              For any questions about returns or refunds, please contact our customer support at 
              <a href="mailto:support@hardwareshack.com" className="text-blue-600 hover:underline ml-1">
                support@hardwareshack.com
              </a> or call us at +91-8299301972
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
