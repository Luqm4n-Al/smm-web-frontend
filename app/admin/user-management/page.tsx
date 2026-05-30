'use client';

import { useMemo, useState } from 'react';

import UserManagementFilters from '@/features/admin/components/user-management/UserManagementToolbar';
import UserManagementHeader from '@/features/admin/components/user-management/UserManagementHeader';
import UserManagementPagination from '@/features/admin/components/user-management/UserManagementPagination';
import UserManagementTable from '@/features/admin/components/user-management/UserManagementTable';

import { useUserManagementTable } from '@/features/admin/hooks/useUserManagementTable';

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
  ] = useState(5);

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
   * TOTAL PAGE
   */
  const totalPages = useMemo(() => {
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
   * START DATE
   */
  const handleStartDate = (
    value: string
  ) => {
    setStartDate(value);
  };

  /**
   * END DATE
   */
  const handleEndDate = (
    value: string
  ) => {
    setEndDate(value);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <UserManagementHeader />

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
        totalUsers={
          filteredUsers.length
        }
        usersPerPage={
          usersPerPage
        }
        setUsersPerPage={
          setUsersPerPage
        }
      />
    </div>
  );
}