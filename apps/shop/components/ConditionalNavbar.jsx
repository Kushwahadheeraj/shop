"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/Dashboard") || pathname.startsWith("/login/seller");
  if (hideFooter) return null;
  return <Navbar />;
}
