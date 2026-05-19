// halaman utama user management (penghubung agar menjadi satu halaman)

'use client';

import { useMemo, useState } from 'react';

import UserManagementFilters from './UserManagementFilters';
import UserManagementPagination from './UserManagementPagination';
import UserManagementTable from './UserManagementTable';

import { useUserManagementTable } from '../../hooks/useUserManagementTable';

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

  // ROWS
  const [
    usersPerPage,
    setUsersPerPage,
  ] = useState(10);

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
    <div className="space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-[30px] font-semibold tracking-[-0.5px] text-gray-900">
          User Management
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola pengguna platform dan
          pantau status akun.
        </p>
      </div>

      {/* FILTER */}
      <div className="flex justify-end">
        <UserManagementFilters
          role={role}
          setRole={setRole}
          status={status}
          setStatus={setStatus}
          search={search}
          setSearch={setSearch}
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