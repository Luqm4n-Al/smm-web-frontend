'use client';

import {
  useMemo,
  useState,
} from 'react';

import UserManagementFilters from './UserManagementToolbar';

import UserManagementPagination from './UserManagementPagination';

import UserManagementTable from './UserManagementTable';

import { useUserManagementTable } from '../../hooks/useUserManagementTable';

export default function UserManagementPage() {
  /**
   * SEARCH
   */
  const [search, setSearch] =
    useState('');

  /**
   * STATUS
   */
  const [status, setStatus] =
    useState<
      'All' | 'Active' | 'Inactive'
    >('All');

  /**
   * LOGIN PERIOD
   */
  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  /**
   * SORT
   */
  const [sort] =
    useState('None');

  /**
   * PAGE
   */
  const [page, setPage] =
    useState(1);

  /**
   * USERS PER PAGE
   */
  const [
    usersPerPage,
    setUsersPerPage,
  ] = useState(10);

  /**
   * TABLE
   */
  const {
    loading,

    filteredUsers,

    paginatedUsers,

    handleChangeStatus,
  } = useUserManagementTable({
    search,

    status,

    sort,

    page,

    usersPerPage,

    startDate,

    endDate,
  });

  /**
   * TOTAL PAGES
   */
  const totalPages =
    useMemo(() => {
      return Math.max(
        1,
        Math.ceil(
          filteredUsers.length /
            usersPerPage
        )
      );
    }, [
      filteredUsers,
      usersPerPage,
    ]);

  /**
   * HANDLE START DATE
   */
  const handleStartDate =
    (
      value: string
    ) => {
      setStartDate(value);
    };

  /**
   * HANDLE END DATE
   */
  const handleEndDate = (
    value: string
  ) => {
    setEndDate(value);
  };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.5px] text-gray-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola pengguna
          platform dan pantau
          status akun.
        </p>
      </div>

      {/* FILTER */}
      <div className="flex justify-end">
        <UserManagementFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          startDate={startDate}
          endDate={endDate}
          onChangeStartDate={
            handleStartDate
          }
          onChangeEndDate={
            handleEndDate
          }
          setPage={setPage}
        />
      </div>

      {/* TABLE */}
      <UserManagementTable
        loading={loading}
        users={paginatedUsers}
        onChangeStatus={
          handleChangeStatus
        }
      />

      {/* PAGINATION */}
      <UserManagementPagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        usersPerPage={
          usersPerPage
        }
        setUsersPerPage={
          setUsersPerPage
        }
        totalUsers={
          filteredUsers.length
        }
      />
    </div>
  );
}