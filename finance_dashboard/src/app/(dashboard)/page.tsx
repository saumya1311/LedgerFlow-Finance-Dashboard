'use client';

import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '@/store/useStore';
import { recordService } from '@/services/recordService';
import { Card } from '@/features/dashboard/SummaryCards';
import { DashboardCharts } from '@/features/dashboard/DashboardCharts';
import { RecentTransactions } from '@/features/dashboard/RecentTransactions';
import { DashboardStats } from '@/types';
import { Plus, Download, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { currentUser, records } = useFinanceStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleExportCSV = () => {
    if (!records || records.length === 0) {
      toast.error('No records available to export.');
      return;
    }

    const headers = ['ID,Date,Title,Amount,Type,Category\n'];
    const csvContent = records.map(r => 
      `${r.id},${r.date},"${r.title}",${r.amount},${r.type},${r.category}`
    ).join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Report downloaded successfully!');
  };

  useEffect(() => {
    async function fetchData() {
      if (!currentUser) return;
      
      setLoading(true);
      try {
        const data = await recordService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Welcome back, <span className="text-blue-600">{(currentUser.name || '').split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 font-medium">Here's what's happening with your finances today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center border border-slate-200 bg-white hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 shadow-sm transition-all active:scale-95"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
          
          {currentUser.role === 'Admin' && (
            <button 
              onClick={() => router.push('/records')}
              className="btn-primary flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </button>
          )}
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          title="Total Income" 
          amount={stats?.totalIncome || 0} 
          type="income" 
          change="+12.5%" 
          isLoading={loading}
        />
        <Card 
          title="Total Expenses" 
          amount={stats?.totalExpenses || 0} 
          type="expense" 
          change="-4.2%" 
          isLoading={loading}
        />
        <Card 
          title="Net Balance" 
          amount={stats?.netBalance || 0} 
          type="balance" 
          isLoading={loading}
        />
      </div>

      {/* Main Content: Charts & Transactions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-12">
        <div className="xl:col-span-2 space-y-8">
           <DashboardCharts 
             monthlyData={stats?.monthlyData || []} 
             categoryDistribution={stats?.categoryDistribution || []}
           />
        </div>
        
        <div className="xl:col-span-1">
          <RecentTransactions transactions={stats?.recentTransactions || []} />
        </div>
      </div>
    </div>
  );
}
