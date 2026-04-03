'use client';

import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { FinanceRecord } from '@/types';
import { ShoppingCart, Coffee, Home, Briefcase, Zap, Globe, Package } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  Infrastructure: Zap,
  Services: Globe,
  Salary: Briefcase,
  Rent: Home,
  Supplies: Package,
  Learning: Coffee,
  Default: ShoppingCart
};

export function RecentTransactions({ transactions }: { transactions: FinanceRecord[] }) {
  return (
    <div className="card-premium h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition">
          See all logs
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No records found.</div>
        ) : (
          transactions.map((record) => {
            const Icon = categoryIcons[record.category] || categoryIcons.Default;
            return (
              <div key={record.id} className="group flex items-center gap-4 hover:bg-slate-50 transition-all p-2 rounded-2xl cursor-default">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                  record.type === 'income' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" : "bg-rose-50 text-rose-600 group-hover:bg-rose-100"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{record.title}</p>
                  <p className="text-xs text-slate-400 font-medium">{record.category} • {record.date}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    record.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Successful</p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  );
}
