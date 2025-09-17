"use client";
import { usePathname } from "next/navigation";
import Header from "./header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/Dashboard") || pathname.startsWith("/login/seller");
  if (hideFooter) return null;
  return <Header />;
}
