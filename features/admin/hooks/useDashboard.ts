'use client';

import { useMemo } from 'react';

import { useQuery } from '@apollo/client/react';

import { GET_DASHBOARD_USERS } from '../graphql/user-management-query';

interface User {
  id: string;

  username: string;

  email: string;

  role: string;

  isActive: boolean;

  createdAt: string;

  lastLoginAt: string | null;
}

interface UsersResponse {
  users: {
    data: User[];
  };
}

export function useDashboard() {
  /**
   * QUERY
   */
  const {
    data,
    loading,
    error,
  } = useQuery<UsersResponse>(
    GET_DASHBOARD_USERS
  );

  /**
   * ALL USERS
   */
  const allUsers =
    data?.users?.data || [];

  /**
   * ONLY USER ROLE
   */
  const users = useMemo(() => {
    return allUsers.filter(
      (user) =>
        user.role
          ?.toUpperCase()
          .trim() === 'USER'
    );
  }, [allUsers]);

  /**
   * ACTIVE USERS
   */
  const activeUsers =
    users.filter(
      (user) => user.isActive
    ).length;

  /**
   * INACTIVE USERS
   */
  const inactiveUsers =
    users.filter(
      (user) => !user.isActive
    ).length;

  /**
   * DEBUG
   */
  console.log(
    'ONLY USER ROLE:',
    users
  );

  return {
    users,

    loading,

    error,

    activeUsers,

    inactiveUsers,
  };
}