"use client";
import { usePathname } from "next/navigation";
import Footer from "./footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const hideFooter =
    pathname.startsWith("/Dashboard") || pathname.startsWith("/login/seller");
  if (hideFooter) return null;
  return <Footer />;
}
