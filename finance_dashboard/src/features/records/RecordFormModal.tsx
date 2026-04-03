'use client';

import React, { useState, useEffect } from 'react';
import { FinanceRecord, RecordType } from '@/types';
import { X, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<FinanceRecord, 'id'> & { id?: FinanceRecord['id'] }) => void;
  initialData?: FinanceRecord | null;
}

const CATEGORIES = ['Salary', 'Services', 'Rent', 'Infrastructure', 'Software', 'Supplies', 'Learning', 'Personal'];

export function RecordFormModal({ isOpen, onClose, onSubmit, initialData }: ModalProps) {
  const [formData, setFormData] = useState<Omit<FinanceRecord, 'id'>>({
    title: '',
    amount: 0,
    type: 'income',
    category: CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    userId: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        amount: initialData.amount,
        type: initialData.type,
        category: initialData.category,
        date: initialData.date,
        userId: initialData.userId,
      });
    } else {
      setFormData({
        title: '',
        amount: 0,
        type: 'income',
        category: CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        userId: '',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Record' : 'Add New Record'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-500 mb-2 block">Record Title</label>
              <input
                type="text"
                placeholder="e.g., Monthly Rent, Salary Invoice"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Amount ($)</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                  />
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Type</label>
                  <div className="flex bg-slate-100 p-1 rounded-2xl">
                    {(['income', 'expense'] as RecordType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={cn(
                          "flex-1 py-2 text-xs font-bold uppercase rounded-xl transition-all shadow-sm",
                          formData.type === type 
                            ? (type === 'income' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white")
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Category</label>
                  <select
                     className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all cursor-pointer"
                     value={formData.category}
                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
               </div>
               <div>
                  <label className="text-sm font-bold text-slate-500 mb-2 block">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
               </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
               type="button"
               onClick={onClose}
               className="flex-1 py-3.5 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
               type="submit"
               className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {initialData ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {initialData ? 'Update Record' : 'Create Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
