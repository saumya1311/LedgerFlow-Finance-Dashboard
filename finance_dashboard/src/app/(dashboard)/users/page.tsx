'use client';

import React, { useEffect, useState } from 'react';
import { useFinanceStore } from '@/store/useStore';
import { UserDto, userService } from '@/services/userService';
import { toast } from 'sonner';
import { Users, Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const { currentUser } = useFinanceStore();
  const router = useRouter();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only Admin can view this page
    if (currentUser?.role !== 'Admin') {
      router.push('/');
      return;
    }

    fetchUsers();
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      toast.error('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await userService.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole.toUpperCase() } : u));
    } catch (err: any) {
      toast.error('Failed to update role: ' + err.message);
    }
  };

  if (currentUser?.role !== 'Admin') {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col text-slate-500">
        <ShieldAlert className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold">Unauthorized Access</h2>
        <p className="mt-2">Only Administrators can manage user access levels.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center justify-between py-4 border-b border-slate-200">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-600" />
            User Management
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            Grant or revoke access levels for newly registered members.
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm tracking-wider uppercase">
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Registered</th>
                  <th className="px-6 py-4 font-semibold">Access Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      <p className="text-sm text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-600">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={u.role.toLowerCase()}
                        disabled={u.id === currentUser.id}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-100 border-none outline-none ring-1 ring-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="admin">Admin</option>
                        <option value="analyst">Analyst</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
