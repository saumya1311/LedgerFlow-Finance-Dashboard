'use client';

import React from 'react';
import { formatCurrency, cn } from '@/lib/utils';
import { FinanceRecord, User } from '@/types';
import { Edit2, Trash2, MoreVertical, Search, Filter } from 'lucide-react';

interface RecordTableProps {
  records: FinanceRecord[];
  user: User;
  onEdit: (record: FinanceRecord) => void;
  onDelete: (id: string | number) => void;
}

export function RecordTable({ records, user, onEdit, onDelete }: RecordTableProps) {
  const canModify = user.role === 'Admin';

  return (
    <div className="card-premium overflow-hidden border-none shadow-none bg-transparent p-0">
      <div className="overflow-x-auto rounded-3xl border border-slate-200/60 bg-white shadow-sm transition-all duration-300">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
              {canModify && <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No records found matching your filters.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full shrink-0",
                        record.type === 'income' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                      )} />
                      <span className="font-bold text-slate-700">{record.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{record.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">{record.date}</td>
                  <td className={cn(
                    "px-6 py-4 text-sm font-extrabold text-right",
                    record.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {record.type === 'income' ? '+' : '-'}{formatCurrency(record.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                       <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide border border-blue-100">Verified</span>
                    </div>
                  </td>
                  {canModify && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => onEdit(record)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDelete(record.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
