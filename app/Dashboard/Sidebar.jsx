"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/Dashboard/Home" },
  { name: "Paint", path: "/Dashboard/Paint" },
  { name: "Sanitary", path: "/Dashboard/Sanitary" },
  { name: "Plumbing", path: "/Dashboard/Plumbing" },
  { name: "Tools", path: "/Dashboard/Tools" },
  { name: "Hardware", path: "/Dashboard/Hardware" },
  { name: "Cements & POP", path: "/Dashboard/Cements" },
  { name: "Roofer", path: "/Dashboard/Roofer" },
  { name: "PVC Mats", path: "/Dashboard/PvcMats" },
  { name: "Fiber Sheet", path: "/Dashboard/Fiber" },
  { name: "Home Decor", path: "/Dashboard/HomeDecor" },
  { name: "Pipe", path: "/Dashboard/Pipe" },
  { name: "Brush", path: "/Dashboard/Brush" },
  { name: "Adhesives", path: "/Dashboard/Adhesives" },
  { name: "Cleaning", path: "/Dashboard/Cleaning" },
  { name: "Electrical", path: "/Dashboard/Electrical" },
  { name: "Electrical Fitting", path: "/Dashboard/Fitting" },
  { name: "Lighting", path: "/Dashboard/Lighting" },
];

export default function Sidebar({ onSetting, onLogout }) {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 font-bold text-xl">LOGO</div>
      <nav className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <ul className="p-4 space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.path}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left text-white hover:bg-gray-800 cursor-pointer"
                >
                  {item.name}
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