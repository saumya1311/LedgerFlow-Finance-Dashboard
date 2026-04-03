'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useFinanceStore } from '@/store/useStore';
import { recordService } from '@/services/recordService';
import { RecordTable } from '@/features/records/RecordTable';
import { RecordFormModal } from '@/features/records/RecordFormModal';
import { FinanceRecord, RecordType } from '@/types';
import { Plus, Search, Filter, RefreshCcw, LayoutGrid, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function RecordsPage() {
  const { currentUser, records } = useFinanceStore();
  const [localRecords, setLocalRecords] = useState<FinanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // States for search and filter
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<RecordType | 'all'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinanceRecord | null>(null);

  const fetchRecords = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await recordService.getRecords();
      setLocalRecords(data);
    } catch (error) {
      toast.error('Failed to load records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchRecords();
    }
  }, [currentUser]);

  const filteredRecords = useMemo(() => {
    return localRecords.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [localRecords, searchTerm, typeFilter]);

  const handleOpenAddModal = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (record: FinanceRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: Omit<FinanceRecord, 'id'> & { id?: string }) => {
    if (!currentUser) return;
    try {
      if (data.id) {
        await recordService.updateRecord(data as FinanceRecord);
        toast.success('Record updated successfully');
      } else {
        await recordService.createRecord(data);
        toast.success('New record created');
      }
      fetchRecords(); // Ideally store takes care of this but we re-fetch to ensure sync
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to delete this record?')) return;
    try {
      await recordService.deleteRecord(id);
      toast.success('Record deleted');
      fetchRecords();
    } catch (err: any) {
      toast.error(err.message || 'Deletion failed');
    }
  };

  if (!currentUser) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (currentUser.role === 'Viewer') {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col text-slate-500">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
          <Filter className="w-8 h-8 text-slate-300" />
        </div>
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p className="mt-2">Viewers are restricted to the Dashboard insights only.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Finance Records</h2>
          <p className="text-slate-500 font-medium">Manage and track your detailed financial transactions.</p>
        </div>

        {currentUser.role === 'Admin' && (
          <button
            onClick={handleOpenAddModal}
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Record
          </button>
        )}
      </header>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or category..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex bg-white border border-slate-200 p-1.5 rounded-2xl shadow-sm">
            {(['all', 'income', 'expense'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={cn(
                  "px-5 py-2 text-xs font-bold uppercase rounded-xl transition-all",
                  typeFilter === type ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {type}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchRecords()}
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-500 shadow-sm transition-all active:rotate-180 duration-500"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center gap-4 card-premium">
          <div className="w-10 h-10 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Records...</p>
        </div>
      ) : (
        <RecordTable
          records={filteredRecords}
          user={currentUser}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />
      )}

      <RecordFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingRecord}
      />
    </div>
  );
}
