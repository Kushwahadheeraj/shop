"use client";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export default function AccountDetails() {
  return (
    <div className="bg-[#f8f8f8] min-h-screen py-6 md:py-8">
      <div className="w-full max-w-6xl mx-auto bg-white rounded md:rounded-lg shadow-sm">
        <div>
          <div className="px-4 md:px-8 pt-6 md:pt-8">
            <div className="text-2xl font-bold">MY ACCOUNT</div>
            <div className="text-lg text-gray-600">ACCOUNT DETAILS</div>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r px-4 md:px-8 py-6 md:py-8 flex flex-col items-center">
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
                  <Link href="/dashboard" className="block hover:bg-gray-100 px-2 py-2 rounded cursor-pointer">
                    DASHBOARD
                  </Link>
                </li>
                <li>
                  <Link href="/Orders" className="block hover:bg-gray-100 px-2 py-2 rounded cursor-pointer">
                    ORDERS
                  </Link>
                </li>
                <li>
                  <Link href="/downloads" className="block hover:bg-gray-100 px-2 py-2 rounded cursor-pointer">
                    DOWNLOADS
                  </Link>
                </li>
                <li>
                  <Link href="/Address" className="block hover:bg-gray-100 px-2 py-2 rounded cursor-pointer">
                    ADDRESSES
                  </Link>
                </li>
                <li>
                  <Link
                    href="/AccountDetails"
                    className="block font-bold border-l-4 border-yellow-300 px-2 py-2 rounded bg-gray-100"
                  >
                    ACCOUNT DETAILS
                  </Link>
                </li>
                <li>
                  <Link href="/logout" className="block hover:bg-gray-100 px-2 py-2 rounded cursor-pointer">
                    LOGOUT
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
          {/* Main Content */}
          <div className="md:w-2/3 px-4 md:px-8 py-6 md:py-8">
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex-1">
                  <label className="block font-semibold mb-1">First name *</label>
                  <Input type="text" className="w-full" />
                </div>
                <div className="flex-1">
                  <label className="block font-semibold mb-1">Last name *</label>
                  <Input type="text" className="w-full" />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Display name *</label>
                <Input type="text" value="dheerajkushwaha123" readOnly className="w-full" />
                <div className="text-xs text-gray-500 mt-1">
                  This will be how your name will be displayed in the account section and in reviews
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Email address *</label>
                <Input type="email" value="dheeraj01702001@gmail.com" readOnly className="w-full" />
              </div>
              <div className="font-semibold mt-6 mb-2">PASSWORD CHANGE</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block font-semibold mb-1">Current password (leave blank to leave unchanged)</label>
                <Input type="password" className="w-full" />
                <label className="block font-semibold mb-1">New password (leave blank to leave unchanged)</label>
                <Input type="password" className="w-full" />
                <label className="block font-semibold mb-1">Confirm new password</label>
                <Input type="password" className="w-full" />
              </div>
              <Button className="w-full md:w-auto bg-yellow-300 hover:bg-yellow-300 text-white font-bold mt-4" type="submit">
                SAVE CHANGES
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}



