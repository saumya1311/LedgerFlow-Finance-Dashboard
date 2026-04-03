import { FinanceRecord, User, DashboardStats } from '../types';
import { useFinanceStore } from '../store/useStore';
import { apiFetch } from './apiClient';

/**
 * Service Layer for handling all business logic and data fetching.
 * Swapped mock data with real Spring Boot API calls.
 */
export const recordService = {
  /**
   * Fetch all records from backend with role-based filtering (handled by backend).
   */
  async getRecords(): Promise<FinanceRecord[]> {
    const data: any = await apiFetch('/records?size=100');

    // Spring Data Page returns { content: [...], ... }
    const records = data.content.map((r: any) => ({
        ...r,
        type: r.type.toLowerCase() // Backend enum is uppercase
    })) as FinanceRecord[];

    // Sync reactive store if needed
    useFinanceStore.getState().setRecords(records);
    return records;
  },

  /**
   * Add a new financial record to the backend.
   */
  async createRecord(record: Omit<FinanceRecord, 'id'>): Promise<FinanceRecord> {
    const data: any = await apiFetch('/records', {
      method: 'POST',
      body: JSON.stringify({
        ...record,
        type: record.type.toUpperCase() // Backend enum is uppercase
      }),
    });

    const newRecord = { ...data, type: data.type.toLowerCase() } as FinanceRecord;

    // Update local state reactive store
    useFinanceStore.getState().addRecord(newRecord);
    
    return newRecord;
  },

  /**
   * Update an existing record in the backend.
   */
  async updateRecord(record: FinanceRecord): Promise<FinanceRecord> {
    const data: any = await apiFetch(`/records/${record.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...record,
        type: record.type.toUpperCase()
      }),
    });

    const updatedRecord = { ...data, type: data.type.toLowerCase() } as FinanceRecord;

    useFinanceStore.getState().updateRecord(updatedRecord);
    return updatedRecord;
  },

  /**
   * Delete a record by ID in the backend.
   */
  async deleteRecord(id: string | number): Promise<void> {
    await apiFetch(`/records/${id}`, {
      method: 'DELETE'
    });

    useFinanceStore.getState().deleteRecord(id);
  },

  /**
   * Calculate dashboard stats using backend as data source.
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [allRecords, statsData] = await Promise.all([
      this.getRecords(),
      apiFetch<any>('/dashboard/stats')
    ]);
    
    const totalIncome = statsData.totalIncome || 0;
    const totalExpenses = statsData.totalExpenses || 0;

    // Group by category (Top 5)
    const categoryTotals: Record<string, number> = {};
    allRecords.forEach(r => {
      categoryTotals[r.category] = (categoryTotals[r.category] || 0) + r.amount;
    });

    const categoryDistribution = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Group by month
    const monthlyGroups: Record<string, { month: string, income: number, expense: number }> = {};
    allRecords.forEach(r => {
      const date = new Date(r.date);
      const monthLabel = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyGroups[monthLabel]) {
        monthlyGroups[monthLabel] = { month: monthLabel, income: 0, expense: 0 };
      }
      
      if (r.type === 'income') {
        monthlyGroups[monthLabel].income += r.amount;
      } else {
        monthlyGroups[monthLabel].expense += r.amount;
      }
    });

    const monthlyData = Object.values(monthlyGroups).slice(-6); // last 6 months

    return {
      totalIncome,
      totalExpenses,
      netBalance: statsData.netBalance || (totalIncome - totalExpenses),
      recentTransactions: allRecords.slice(0, 5),
      categoryDistribution: categoryDistribution.length > 0 ? categoryDistribution : [{name: 'None', value: 1}],
      monthlyData: monthlyData.length > 0 ? monthlyData : [
          { month: 'Jan', income: 0, expense: 0 }
      ]
    };
  }
};
