"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function Tracking() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow-sm">
        <h1 className="text-3xl font-extrabold text-center py-6 tracking-widest">TRACK YOUR ORDER</h1>
        <Separator />
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/3 border-r px-8 py-8 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <div className="font-semibold text-gray-700">dheerajkushwaha123 <span className="text-gray-400 text-xs">#4548</span></div>
            </div>
            <nav className="w-full">
              <ul className="space-y-1 text-sm">
                <li>
                  <Link
                    href="/dashboard"
                    className="block font-bold border-l-4 border-yellow-400 pl-2 bg-gray-100"
                  >
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link
                    href="/orders"
                    className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer"
                  >
                    ORDERS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/downloads"
                    className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer"
                  >
                    DOWNLOADS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/addresses"
                    className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer"
                  >
                    ADDRESSES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/account-details"
                    className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer"
                  >
                    ACCOUNT DETAILS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/logout"
                    className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer"
                  >
                    LOGOUT
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main Content */}
          <div className="md:w-2/3 px-8 py-8">
            <p className="mb-6 text-gray-600">
              To track your order please enter your Order ID in the box below and press the "Track" button.
              This was given to you on your receipt and in the confirmation email you should have received.
            </p>
            <form className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <label className="block font-bold mb-1">Order ID</label>
                <Input
                  placeholder="Found in your order confirmation email."
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block font-bold mb-1">Billing email</label>
                <Input
                  placeholder="Email you used during checkout."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold px-8 py-2 mt-6 md:mt-0"
              >
                TRACK
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
