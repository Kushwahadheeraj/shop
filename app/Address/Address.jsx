"use client";
import { Separator } from "@/components/ui/separator";

import { User } from "lucide-react";
import Link from "next/link";

export default function Address() {

  return (
    <div className="bg-[#f8f8f8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto bg-white rounded shadow-sm">
        <div>
          <div className="px-8 pt-8">
            <div className="text-2xl font-bold">MY ACCOUNT</div>
            <div className="text-lg text-gray-600">ADDRESSES</div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/3 border-r px-8 py-8 flex flex-col items-center">
            <div className="flex flex-col items-center mb-6">
              <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-2">
                <User className="w-12 h-12 text-gray-400" />
              </div>
              <div className="font-semibold text-gray-700">
                dheerajkushwaha123 <span className="text-gray-400 text-xs">#4548</span>
              </div>
            </div>
            <nav className="w-full">
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/dashboard" className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer">
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link href="/Orders" className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer">
                    ORDERS
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer">
                    DOWNLOADS
                  </Link>
                </li>
                <li>
                  <Link
                    href="/Address"
                    className="block font-bold border-l-4 border-yellow-300 pl-2 bg-gray-100"
                  >
                    ADDRESSES
                  </Link>
                </li>
                <li>
                  <Link href="/AccountDetails" className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer">
                    ACCOUNT DETAILS
                  </Link>
                </li>
                <li>
                  <Link href="/logout" className="block hover:bg-gray-100 pl-2 py-1 cursor-pointer">
                    LOGOUT
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main Content */}
          <div className="md:w-2/3 px-8 py-8">
            <div className="text-gray-600 mb-6">
              The following addresses will be used on the checkout page by default.
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Billing Address */}
              <div className="flex-1">
                <div className="font-bold text-lg mb-2">Billing address</div>
                <Link href="#" className="text-sm text-yellow-300 font-semibold hover:underline">
                  Add
                </Link>
                <div className="text-sm text-gray-500 italic mt-1">
                  You have not set up this type of address yet.
                </div>
              </div>
              {/* Shipping Address */}
              <div className="flex-1">
                <div className="font-bold text-lg mb-2">Shipping address</div>
                <Link href="#" className="text-sm text-yellow-300 font-semibold hover:underline">
                  Add
                </Link>
                <div className="text-sm text-gray-500 italic mt-1">
                  You have not set up this type of address yet.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

