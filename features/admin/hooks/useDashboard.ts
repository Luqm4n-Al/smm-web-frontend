'use client';

import { useEffect, useState } from 'react';

import { getUsers } from '../services/dashboardService';

export function useDashboard() {
  const [users, setUsers] = useState<any[]>(
    []
  );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();

        console.log(data);

        setUsers(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const activeUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() ===
      'active'
  ).length;

  const inactiveUsers = users.filter(
    (user) =>
      user.status?.toLowerCase() ===
      'inactive'
  ).length;

  return {
    users,
    loading,
    activeUsers,
    inactiveUsers,
  };
}