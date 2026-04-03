import { create } from 'zustand';
import { User, FinanceRecord, Role } from '../types';

export interface FinanceState {
  currentUser: User | null;
  records: FinanceRecord[];
  isLoading: boolean;
  
  // Auth logic
  setUser: (user: User | null) => void;
  
  // Record operations (reactive facade)
  setRecords: (records: FinanceRecord[]) => void;
  addRecord: (record: FinanceRecord) => void;
  updateRecord: (record: FinanceRecord) => void;
  deleteRecord: (id: string | number) => void;
}

export const useFinanceStore = create<FinanceState>((set) => ({
  currentUser: null, // Initially null until logged in
  records: [],
  isLoading: false,

  setUser: (user) => set({ currentUser: user }),

  setRecords: (records) => set({ records }),

  addRecord: (record) => set((state) => ({ 
    records: [record, ...state.records] 
  })),

  updateRecord: (updatedRecord) => set((state) => ({
    records: state.records.map((r) => r.id === updatedRecord.id ? updatedRecord : r)
  })),

  deleteRecord: (id) => set((state) => ({
    records: state.records.filter((r) => r.id !== id)
  })),
}));
