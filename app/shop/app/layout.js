import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UpdateWrapper from "@/components/UpdateWrapper";
import ClientAuthProvider from "@/components/ClientAuthProvider";
import ClientCartProvider from "@/components/ClientCartProvider";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalHeader from "@/components/ConditionalHeader";
import ConditionalNavbar from "@/components/ConditionalNavbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kushwaha Hardware",
  description: "Kushwaha Hardware Shop E-commerce Platform",
  icons: {
    icon: [{ url: '/logo1.png', sizes: 'any' }],
    shortcut: [{ url: '/logo1.png', sizes: 'any' }],
    apple: [{ url: '/logo1.png' }],
  },
};

export const runtime = "nodejs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo1.png?v=20251226" type="image/png" sizes="32x32" />
        <link rel="icon" href="/logo1.png?v=20251226" type="image/png" sizes="16x16" />
        <link rel="icon" href="/shop/logo1.png?v=20251226" type="image/png" sizes="32x32" />
        <link rel="icon" href="/shop/logo1.png?v=20251226" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/logo1.png?v=20251226" />
        <link rel="shortcut icon" href="/logo1.png?v=20251226" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f59e0b" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientAuthProvider>
          <ClientCartProvider>
            <ConditionalHeader />
            <ConditionalNavbar />
            <main>{children}</main>
            <UpdateWrapper />
            <ConditionalFooter />
          </ClientCartProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
