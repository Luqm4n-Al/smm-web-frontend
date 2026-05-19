// filter dan search jadi satu
// last active hanya contoh saja bebas mau bagaimana

'use client';

import {
  Filter,
  Search,
} from 'lucide-react';

import { useUserManagementFilters } from '../../hooks/useUserManagementFilters';

interface Props {
  role: string;

  setRole: React.Dispatch<
    React.SetStateAction<string>
  >;

  search: string;

  setSearch: React.Dispatch<
    React.SetStateAction<string>
  >;

  status:
    | 'All'
    | 'Active'
    | 'Inactive';

  setStatus: React.Dispatch<
    React.SetStateAction<
      | 'All'
      | 'Active'
      | 'Inactive'
    >
  >;

  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;
}

export default function UserManagementFilters({
  role,
  setRole,
  search,
  setSearch,
  status,
  setStatus,
  setPage,
}: Props) {
  const {
    open,
    toggleOpen,
    resetFilters,
  } =
    useUserManagementFilters();

  return (
    <div className="flex items-center gap-3">
      {/* SEARCH */}
      <div className="relative w-[240px]">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(
              e.target.value
            );

            setPage(1);
          }}
          placeholder="Search users..."
          className="h-10 w-full rounded-[8px] border border-black-100 bg-white pl-10 pr-4 text-sm text-gray-700 outline-none"
        />
      </div>

      {/* FILTER */}
      <div className="relative">
        <button
          onClick={toggleOpen}
          className="flex h-10 items-center gap-2 rounded-[8px] border border-black-100 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <Filter size={16} />

          Filter
        </button>

        {/* POPUP */}
        {open && (
          <div className="absolute right-0 top-12 z-50 w-[300px] rounded-[10px] border border-black-100 bg-white p-4 shadow-lg">
            {/* TITLE */}
            <h3 className="mb-6 text-sm font-semibold text-gray-900">
              Filter Options
            </h3>

            {/* STATUS */}
            <div className="mb-6">
              <label className="mb-3 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Status
              </label>

              <div className="flex flex-col gap-3">
                {/* ALL */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    checked={
                      status ===
                      'All'
                    }
                    onChange={() => {
                      setStatus(
                        'All'
                      );

                      setPage(1);
                    }}
                  />

                  All
                </label>

                {/* ACTIVE */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    checked={
                      status ===
                      'Active'
                    }
                    onChange={() => {
                      setStatus(
                        'Active'
                      );

                      setPage(1);
                    }}
                  />

                  Active
                </label>

                {/* INACTIVE */}
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="radio"
                    checked={
                      status ===
                      'Inactive'
                    }
                    onChange={() => {
                      setStatus(
                        'Inactive'
                      );

                      setPage(1);
                    }}
                  />

                  Inactive
                </label>
              </div>
            </div>

            {/* ROLE */}
            <div className="mb-6">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Role
              </label>

              <select
                value={role}
                onChange={(e) => {
                  setRole(
                    e.target.value
                  );

                  setPage(1);
                }}
                className="h-10 w-full rounded-[8px] border border-black-100 bg-white px-3 text-sm text-gray-700 outline-none"
              >
                <option value="All Roles">
                  All Roles
                </option>

                <option value="Admin">
                  Admin
                </option>

                <option value="User">
                  User
                </option>

                <option value="Moderator">
                  Moderator
                </option>
              </select>
            </div>

            {/* LAST LOGIN PERIOD */}
            <div className="mb-6">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                Last Login Period
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* START DATE */}
                <input
                  type="date"
                  className="h-10 rounded-[8px] border border-black-100 px-2 text-xs text-gray-600 outline-none"
                />

                {/* END DATE */}
                <input
                  type="date"
                  className="h-10 rounded-[8px] border border-black-100 px-2 text-xs text-gray-600 outline-none"
                />
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  resetFilters();

                  setRole(
                    'All Roles'
                  );

                  setStatus(
                    'All'
                  );

                  setSearch('');
                }}
                className="text-sm text-gray-500 transition hover:text-gray-700"
              >
                Reset
              </button>

              <button
                onClick={toggleOpen}
                className="h-10 rounded-[8px] bg-indigo-500 px-4 text-sm font-medium text-white transition hover:bg-indigo-600"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}