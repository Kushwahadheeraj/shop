"use client";
import React from "react";
import { useAuth } from "../../components/AuthContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-white shadow flex items-center justify-between px-6 m-0 p-0">
      <div className="font-semibold text-lg">Dashboard</div>
      <div className="flex items-center gap-4">
        <span className="font-medium">{user?.username}</span>
        <Button variant="destructive" onClick={logout} className="cursor-pointer">Logout</Button>
      </div>
    </header>
  );
} 