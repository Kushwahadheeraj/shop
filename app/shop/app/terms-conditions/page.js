"use client";

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms & Conditions</h1>
        
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-700 leading-relaxed">
              Please read these Terms and Conditions carefully before using Hardware Shack's website 
              and services. By accessing or using our services, you agree to be bound by these terms.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using this website, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">2. Use of Website</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You agree to use our website only for lawful purposes:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• You must not use the website in any way that causes damage or impairs availability</li>
              <li>• You must not use the website for any illegal or unauthorized purpose</li>
              <li>• You must not attempt to gain unauthorized access to any part of the website</li>
              <li>• You are responsible for maintaining the confidentiality of your account credentials</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">3. Products and Pricing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We strive to provide accurate product information and pricing. However:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Product descriptions and images are for reference only</li>
              <li>• Prices are subject to change without notice</li>
              <li>• We reserve the right to correct pricing errors</li>
              <li>• Product availability is subject to change</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">4. Orders and Payment</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you place an order:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• All orders are subject to acceptance and availability</li>
              <li>• We reserve the right to refuse or cancel any order</li>
              <li>• Payment must be received before order processing</li>
              <li>• For Cash on Delivery, payment is due upon delivery</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">5. Delivery</h2>
            <p className="text-gray-700 leading-relaxed">
              Delivery times are estimates and not guaranteed. We are not liable for delays caused by 
              third-party shipping providers or circumstances beyond our control. Risk of loss and title 
              pass to you upon delivery.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">6. Returns and Refunds</h2>
            <p className="text-gray-700 leading-relaxed">
              Please refer to our Return and Refund Policy for detailed information about returns, 
              exchanges, and refunds. All returns must comply with our return policy.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, graphics, logos, images, and software, 
              is the property of Hardware Shack and is protected by copyright and other intellectual property laws.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed">
              Hardware Shack shall not be liable for any indirect, incidental, special, or consequential 
              damages arising from your use of our website or services.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately 
              upon posting. Your continued use of the website constitutes acceptance of the modified terms.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact us at 
              <a href="mailto:legal@hardwareshack.com" className="text-blue-600 hover:underline ml-1">
                legal@hardwareshack.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
