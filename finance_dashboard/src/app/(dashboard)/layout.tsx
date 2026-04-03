'use client';

import { Sidebar } from "@/components/layout/Sidebar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFinanceStore } from "@/store/useStore";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { currentUser } = useFinanceStore();
  const router = useRouter();

  useEffect(() => {
    // Check local storage for user and token
    if (!currentUser && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        router.push('/login');
      } else {
        // Hydrate store from localStorage
        try {
           const user = JSON.parse(userStr);
           useFinanceStore.getState().setUser(user);
        } catch (e) {
           router.push('/login');
        }
      }
    }
  }, [currentUser, router]);

  // Optionally show a loading screen while validating auth
  if (!currentUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen p-8 bg-[#f8fafc]">
        {children}
      </main>
    </div>
  );
}
