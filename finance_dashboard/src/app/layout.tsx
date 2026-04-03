import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LedgerFlow Finance - Modern Dashboard",
  description: "Next-gen finance analytics platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen text-slate-900 bg-slate-50`}>
        <Toaster position="top-right" closeButton richColors />
        {children}
      </body>
    </html>
  );
}
