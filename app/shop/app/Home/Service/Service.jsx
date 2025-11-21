import { ShieldCheck, Headphones, Truck } from "lucide-react";

const service = [
  {
    icon: <ShieldCheck className="w-10 h-10 mx-auto mb-4" />,
    title: "SECURE PAYMENT",
    description: (
      <>
        We Process End to End Secure Payments in Credit cards, Debit Cards, UPI. We also accept Cash On Delivery.
      </>
    ),
  },
  {
    icon: <Headphones className="w-10 h-10 mx-auto mb-4" />,
    title: "24/7 CUSTOMER SUPPORT",
    description: (
      <>
        We are here to assist your queries and order details anytime.
      </>
    ),
  },
  {
    icon: <Truck className="w-10 h-10 mx-auto mb-4" />,
    title: "FAST DELIVERY",
    description: (
      <>
        99% Orders are shipped within 48 hours. Safe, Fast, Elegant.
      </>
    ),
  },
];

export default function Service() {
  return (
    <div className="w-full bg-[#fafafa] py-12">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-center items-center gap-8">
        {service.map((feature, idx) => (
          <div key={idx} className="flex-1 text-center px-4">
            <div className="mb-2">{feature.icon}</div>
            <h3 className="text-xl font-extrabold mb-2 whitespace-nowrap">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}