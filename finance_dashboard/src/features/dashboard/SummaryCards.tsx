'use client';

import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';

interface CardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'balance';
  change?: string;
  isLoading?: boolean;
}

const icons = {
  income: { icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  expense: { icon: TrendingDown, color: 'text-rose-500', bg: 'bg-rose-50' },
  balance: { icon: Wallet, color: 'text-blue-500', bg: 'bg-blue-50' },
};

export function Card({ title, amount, type, change, isLoading }: CardProps) {
  const { icon: Icon, color, bg } = icons[type];

  return (
    <div className="card-premium flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={cn("p-3 rounded-2xl", bg)}>
          <Icon className={cn("w-6 h-6", color)} />
        </div>
        {change && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            change.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
          )}>
            {change} this month
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-md" />
          ) : (
            <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(amount)}</h3>
          )}
        </div>
      </div>
    </div>
  );
}
