'use client';

import { useMemo, useState } from 'react';

import UserManagementFilters from '@/features/admin/components/user-management/UserManagementFilters';
import UserManagementHeader from '@/features/admin/components/user-management/UserManagementHeader';
import UserManagementPagination from '@/features/admin/components/user-management/UserManagementPagination';
import UserManagementTable from '@/features/admin/components/user-management/UserManagementTable';

import { useUserManagementTable } from '@/features/admin/hooks/useUserManagementTable';

export default function UserManagementPage() {
  // SEARCH
  const [search, setSearch] =
    useState('');

  // FILTER ROLE
  const [role, setRole] =
    useState('All Roles');

  // FILTER STATUS
  const [status, setStatus] =
    useState<
      'All' | 'Active' | 'Inactive'
    >('All');

  // SORT
  const [sort, setSort] =
    useState('None');

  // PAGINATION
  const [page, setPage] =
    useState(1);

  // ROWS PER PAGE
  const [
    usersPerPage,
    setUsersPerPage,
  ] = useState(5);

  // HOOK
  const {
    loading,
    filteredUsers,
    paginatedUsers,
    handleChangeStatus,
  } = useUserManagementTable({
    search,
    role,
    status,
    sort,
    page,
    usersPerPage,
  });

  // TOTAL PAGE
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

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <UserManagementHeader />

      {/* FILTER */}
      <div className="flex justify-end">
        <UserManagementFilters
          role={role}
          setRole={setRole}
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
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