'use client';

import { FiSearch } from 'react-icons/fi';

export function SearchBar() {
  return (
    <div className="relative w-full max-w-md">
      <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

      <input
        type="search"
        placeholder="Search users, reports, settings..."
        className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
      />
    </div>
  );
}