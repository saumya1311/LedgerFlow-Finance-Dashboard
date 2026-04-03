export type Role = 'Admin' | 'Analyst' | 'Viewer';

export type RecordType = 'income' | 'expense';

export interface User {
  id: string | number;
  name: string;
  email: string;
  role: Role;
  token?: string; // Added to store JWT
}

export interface FinanceRecord {
  id: string | number;
  title: string;
  amount: number;
  type: RecordType;
  category: string;
  date: string;
  userId: string | number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: FinanceRecord[];
  categoryDistribution: { name: string; value: number }[];
  monthlyData: { month: string; income: number; expense: number }[];
}
