"use client";

export default function Covid19FAQPage() {
  const faqs = [
    {
      question: "Are you operating during COVID-19?",
      answer: "Yes, we are fully operational and taking all necessary safety precautions to serve our customers safely."
    },
    {
      question: "What safety measures are you taking?",
      answer: "We follow all government guidelines including regular sanitization, contactless delivery options, and mandatory masks for our delivery personnel."
    },
    {
      question: "Is contactless delivery available?",
      answer: "Yes, we offer contactless delivery. You can opt for this during checkout. Our delivery personnel will place your order at your doorstep and maintain safe distance."
    },
    {
      question: "Are there any delivery delays?",
      answer: "While we strive to deliver on time, there might be slight delays due to COVID-19 restrictions in certain areas. We will keep you informed about any delays."
    },
    {
      question: "Can I return products during COVID-19?",
      answer: "Yes, our return policy remains active. However, we recommend checking the product thoroughly at the time of delivery to minimize returns."
    },
    {
      question: "How can I track my order?",
      answer: "You can track your order using the order tracking feature on our website. You'll receive regular updates via email and SMS."
    }
  ];

  return (
    <div className="min-h-screen mt-32 mb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">COVID-19 FAQ</h1>
        <p className="text-gray-600 text-center mb-8">Frequently asked questions about our services during COVID-19</p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3 text-gray-900">{faq.question}</h2>
              <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-2 text-blue-900">Stay Safe</h3>
          <p className="text-blue-800">
            We are committed to your safety and well-being. If you have any concerns or questions, 
            please contact our support team. Together, we can overcome these challenging times.
          </p>
        </div>
      </div>
    </div>
  );
}
