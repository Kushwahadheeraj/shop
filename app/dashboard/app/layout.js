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
    icon: [{ url: '/logo1.png', sizes: 'any' }],
    shortcut: [{ url: '/logo1.png', sizes: 'any' }],
    apple: [{ url: '/logo1.png' }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo1.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo1.png" />
        <link rel="shortcut icon" href="/logo1.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
            {children}
        </ClientProviders>
      </body>
    </html>
  );
}
