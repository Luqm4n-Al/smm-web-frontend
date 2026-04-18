'use client';

import { FiSearch } from 'react-icons/fi';

export function SearchBar() {
  return (
    <div className="relative max-w-md">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        <FiSearch className="h-5 w-5" />
      </span>
      <input
        type="search"
        placeholder="Cari..."
        className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none"
      />
    </div>
  );
}