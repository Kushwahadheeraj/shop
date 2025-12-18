"use client";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-6">
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>
            <p className="text-gray-700 leading-relaxed">
              At Hardware Shack, we are committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit 
              our website and use our services.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <div className="space-y-3 text-gray-700">
              <p><strong>Personal Information:</strong> We collect information that you provide to us, 
              including name, email address, phone number, shipping address, and payment information.</p>
              <p><strong>Usage Data:</strong> We automatically collect information about how you interact 
              with our website, including IP address, browser type, pages visited, and time spent on pages.</p>
              <p><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your 
              experience and analyze website traffic.</p>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• To process and fulfill your orders</li>
              <li>• To communicate with you about your orders and our services</li>
              <li>• To improve our website and services</li>
              <li>• To send you promotional materials (with your consent)</li>
              <li>• To prevent fraud and ensure security</li>
              <li>• To comply with legal obligations</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• Service providers who assist us in operating our website and conducting business</li>
              <li>• Payment processors to handle transactions</li>
              <li>• Shipping companies to deliver your orders</li>
              <li>• Legal authorities when required by law</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate security measures to protect your personal information. However, 
              no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
            <ul className="space-y-2 text-gray-700">
              <li>• Access your personal information</li>
              <li>• Correct inaccurate information</li>
              <li>• Request deletion of your information</li>
              <li>• Opt-out of marketing communications</li>
              <li>• Withdraw consent at any time</li>
            </ul>
          </div>

          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at 
              <a href="mailto:privacy@hardwareshack.com" className="text-blue-600 hover:underline ml-1">
                privacy@hardwareshack.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
