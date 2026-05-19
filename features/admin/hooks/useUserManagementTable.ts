// Logic UserManagementTablw


'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { User } from '../services/userService';

import {
  getUsers,
  updateUserStatus,
} from '../services/userService';

interface Props {
  search: string;

  role: string;

  status:
    | 'All'
    | 'Active'
    | 'Inactive';

  sort: string;

  page: number;

  usersPerPage: number;
}

export function useUserManagementTable({
  search,
  role,
  status,
  sort,
  page,
  usersPerPage,
}: Props) {
  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(true);

  // FETCH USERS
  useEffect(() => {
    const fetchUsers =
      async () => {
        try {
          setLoading(true);

          const data =
            await getUsers();

          setUsers(data);
        } catch (error) {
          console.error(
            'FETCH ERROR:',
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchUsers();
  }, []);

  // FILTER
  const filteredUsers =
    useMemo(() => {
      let filtered = [...users];

      // SEARCH
      if (search.trim()) {
        filtered =
          filtered.filter(
            (user) =>
              user.username
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                ) ||
              user.email
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
          );
      }

      // ROLE
      if (
        role !==
        'All Roles'
      ) {
        filtered =
          filtered.filter(
            (user) =>
              user.role ===
              role
          );
      }

      // STATUS
      if (
        status !== 'All'
      ) {
        filtered =
          filtered.filter(
            (user) =>
              user.status ===
              status
          );
      }

      // SORT A-Z
      if (
        sort === 'A-Z'
      ) {
        filtered.sort(
          (a, b) =>
            a.username.localeCompare(
              b.username
            )
        );
      }

      // SORT Z-A
      if (
        sort === 'Z-A'
      ) {
        filtered.sort(
          (a, b) =>
            b.username.localeCompare(
              a.username
            )
        );
      }

      return filtered;
    }, [
      users,
      search,
      role,
      status,
      sort,
    ]);

  // PAGINATION
  const startIndex =
    (page - 1) *
    usersPerPage;

  const endIndex =
    startIndex +
    usersPerPage;

  const paginatedUsers =
    filteredUsers.slice(
      startIndex,
      endIndex
    );

  // CHANGE STATUS
  const handleChangeStatus =
    async (
      id: string,
      status:
        | 'Active'
        | 'Inactive'
    ) => {
      try {
        await updateUserStatus(
          id,
          status
        );

        setUsers((prev) =>
          prev.map((user) =>
            user.id === id
              ? {
                  ...user,
                  status,
                }
              : user
          )
        );
      } catch (error) {
        console.error(
          'STATUS ERROR:',
          error
        );
      }
    };

  return {
    loading,
    filteredUsers,
    paginatedUsers,
    handleChangeStatus,
  };
}