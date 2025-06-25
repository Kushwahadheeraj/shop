"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/Dashboard/Home" },
  { name: "Paint", path: "/Dashboard/Paint" },
  { name: "Electrical", path: "/Dashboard/Electrical" },
  { name: "Tools", path: "/Dashboard/Tools" },
  { name: "Fitting", path: "/Dashboard/Fitting" },
  { name: "Plumbing", path: "/Dashboard/Plumbing" },
  { name: "Sanitary", path: "/Dashboard/Sanitary" },
  { name: "Hardware", path: "/Dashboard/Hardware" },
  { name: "Lighting", path: "/Dashboard/Lighting" },
  { name: "Adhesives", path: "/Dashboard/Adhesives" },
  { name: "Abrasives", path: "/Dashboard/Abrasives" },
];

export default function Sidebar({ onSetting, onLogout }) {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 font-bold text-xl">LOGO</div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="p-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path} legacyBehavior>
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start text-left text-white hover:bg-gray-800 cursor-pointer"
                >
                  <a>{item.name}</a>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t text-black border-gray-700 flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full text-left cursor-pointer"
          onClick={onSetting}
        >
          Setting
        </Button>
        <Button
          variant="destructive"
          className="w-full text-left cursor-pointer"
          onClick={onLogout}
        >
          Logout
        </Button>
      </div>
    </aside>
  );
} 