import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from '@/components/ClientProviders';

// Optimize: Use static generation with ISR for better performance
export const dynamic = 'auto';
export const revalidate = 60; // Revalidate every 60 seconds

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dashboard - Hardware Shop",
  description: "Seller/Admin Dashboard",
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

