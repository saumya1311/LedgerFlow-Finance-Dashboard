'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Receipt, 
  Settings, 
  LogOut, 
  UserCircle2, 
  ChevronDown,
  Loader2,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFinanceStore } from '@/store/useStore';
import { Role } from '@/types';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

const baseNavItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/', roles: ['Admin', 'Analyst', 'Viewer'] },
  { name: 'Finance Records', icon: Receipt, href: '/records', roles: ['Admin', 'Analyst'] },
  { name: 'Users', icon: Users, href: '/users', roles: ['Admin'] },
  { name: 'Settings', icon: Settings, href: '/settings', roles: ['Admin', 'Analyst'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser, setUser } = useFinanceStore();
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    toast.info('Logged out');
    if (typeof window !== 'undefined') window.location.href = '/login';
  };

  // If no user, we don't render standard sidebar
  if (!currentUser) return null;

  const visibleNavItems = baseNavItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          LedgerFlow
        </h1>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 font-medium border border-blue-600/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-400" : "text-slate-400 group-hover:text-white"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl mb-2">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <UserCircle2 className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 tracking-tight">{currentUser.role} Access</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all group"
        >
          <LogOut className="w-5 h-5 text-slate-500 group-hover:text-red-500 transition-colors" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
