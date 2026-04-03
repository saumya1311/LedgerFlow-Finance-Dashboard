'use client';

import React from 'react';
import { useFinanceStore } from '@/store/useStore';
import { Settings as SettingsIcon, Shield, Bell, UserCircle, Database, Lock } from 'lucide-react';

export default function SettingsPage() {
  const { currentUser } = useFinanceStore();

  const sections = [
    { name: 'Profile Information', icon: UserCircle, description: 'Update your personal details and preferences.' },
    { name: 'Security & Access', icon: Lock, description: 'Manage passwords and account security settings.' },
    { name: 'Privacy', icon: Shield, description: 'Control how your data is used and shared.' },
    { name: 'Notifications', icon: Bell, description: 'Configure how you receive alerts and reports.' },
    { name: 'System Connectivity', icon: Database, description: 'Manage Spring Boot backend integration.' },
  ];

  if (!currentUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (currentUser.role === 'Viewer') {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p className="mt-2">Viewers are restricted to the Dashboard insights only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="py-4">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-slate-400" />
          Settings
        </h2>
        <p className="text-slate-500 font-medium">Configure your finance dashboard experience.</p>
      </header>

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.name} className="card-premium flex items-start gap-4 hover:border-blue-500/30 cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600">
              <section.icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 mb-1">{section.name}</h3>
              <p className="text-sm text-slate-500">{section.description}</p>
            </div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
              Manage
            </div>
          </div>
        ))}
      </div>

      <div className="card-premium border-rose-100 bg-rose-50/20">
         <h3 className="font-bold text-rose-800 mb-2">Danger Zone</h3>
         <p className="text-sm text-rose-600 mb-4 opacity-80">Deleting your account is permanent. All finance records will be lost.</p>
         <button className="bg-rose-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-rose-700 transition shadow-lg shadow-rose-500/20">
           Delete Account
         </button>
      </div>
    </div>
  );
}
