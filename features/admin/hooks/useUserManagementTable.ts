// hooks/useUserManagementTable.ts

'use client';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useMutation,
  useQuery,
} from '@apollo/client/react';

import { GET_DASHBOARD_USERS } from '../graphql/user-management-query';

import {
  ACTIVATE_USER,
  DEACTIVATE_USER,
} from '../graphql/user-status-mutation';

/**
 * USER TYPE
 */
export interface User {
  id: string;
  avatar?: string | null;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

/**
 * GRAPHQL RESPONSE
 */
interface UsersResponse {
  users: {
    data: User[];
  };
}

/**
 * PROPS
 */
interface Props {
  search: string;
  status: 'All' | 'Active' | 'Inactive';
  sort: string;
  page: number;
  usersPerPage: number;
  startDate: string;
  endDate: string;
}

export function useUserManagementTable({
  search,
  status,
  sort,
  page,
  usersPerPage,
  startDate,
  endDate,
}: Props) {
  /**
   * QUERY
   */
  const {
    data,
    loading,
    error,
  } = useQuery<UsersResponse>(
    GET_DASHBOARD_USERS,
    {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: false,
    }
  );

  /**
   * MUTATION
   */
  const [activateUser] =
    useMutation(
      ACTIVATE_USER
    );

  const [deactivateUser] =
    useMutation(
      DEACTIVATE_USER
    );

  /**
   * LOCAL USERS
   */
  const [
    users,
    setUsers,
  ] = useState<User[]>([]);

  /**
   * SYNC DATA
   */
  useEffect(() => {
    if (
      !Array.isArray(
        data?.users?.data
      )
    ) {
      return;
    }

    const filteredUsers =
      data.users.data.filter(
        (user) => {
          const role =
            user.role?.toUpperCase();

          return (
            role !==
              'ADMIN' &&
            role !==
              'SUPERADMIN'
          );
        }
      );

    setUsers((prev) => {
      if (
        prev.length ===
          filteredUsers.length &&
        JSON.stringify(prev) ===
          JSON.stringify(
            filteredUsers
          )
      ) {
        return prev;
      }

      return filteredUsers;
    });
  }, [data]);

  /**
   * FILTER USERS
   */
  const filteredUsers =
    useMemo(() => {
      let filtered = [
        ...users,
      ];

      /**
       * SEARCH
       */
      if (
        search.trim()
      ) {
        const keyword =
          search
            .toLowerCase()
            .trim();

        filtered =
          filtered.filter(
            (user) => {
              const username =
                user.username?.toLowerCase() ||
                '';

              const email =
                user.email?.toLowerCase() ||
                '';

              return (
                username.includes(
                  keyword
                ) ||
                email.includes(
                  keyword
                )
              );
            }
          );
      }

      /**
       * STATUS
       */
      if (
        status !== 'All'
      ) {
        filtered =
          filtered.filter(
            (user) =>
              status ===
              'Active'
                ? user.isActive ===
                    true
                : user.isActive ===
                    false
          );
      }

      /**
       * LAST LOGIN PERIOD
       */
      if (
        startDate ||
        endDate
      ) {
        filtered =
          filtered.filter(
            (user) => {
              if (
                !user.lastLoginAt
              ) {
                return false;
              }

              const loginTimestamp =
                new Date(
                  user.lastLoginAt
                ).getTime();

              if (
                isNaN(
                  loginTimestamp
                )
              ) {
                return false;
              }

              if (
                startDate
              ) {
                const startTimestamp =
                  new Date(
                    `${startDate}T00:00:00.000Z`
                  ).getTime();

                if (
                  loginTimestamp <
                  startTimestamp
                ) {
                  return false;
                }
              }

              if (
                endDate
              ) {
                const endTimestamp =
                  new Date(
                    `${endDate}T23:59:59.999Z`
                  ).getTime();

                if (
                  loginTimestamp >
                  endTimestamp
                ) {
                  return false;
                }
              }

              return true;
            }
          );
      }

      /**
       * SORT A-Z
       */
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

      /**
       * SORT Z-A
       */
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
      status,
      sort,
      startDate,
      endDate,
    ]);

  /**
   * PAGINATION
   */
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

  /**
   * CHANGE STATUS
   */
  const handleChangeStatus =
    async (
      id: string,
      status:
        | 'Active'
        | 'Inactive'
    ) => {
      const previousUsers =
        [...users];

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? {
                ...user,
                isActive:
                  status ===
                  'Active',
              }
            : user
        )
      );

      try {
        if (
          status ===
          'Active'
        ) {
          await activateUser({
            variables: {
              id,
            },
          });
        } else {
          await deactivateUser({
            variables: {
              userId: id,
            },
          });
        }
      } catch (error) {
        setUsers(
          previousUsers
        );

        console.error(
          'FAILED UPDATE STATUS',
          error
        );
      }
    };

  return {
    loading,
    error,
    users,
    filteredUsers,
    paginatedUsers,
    handleChangeStatus,
  };
}