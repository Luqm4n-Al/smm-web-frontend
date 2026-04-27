'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    toast.success('Anda telah logout');
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium hover:bg-gray-300"
      >
        <FiUser className="h-4 w-4 text-gray-600" />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md border bg-white py-1 shadow-lg">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <FiUser className="h-4 w-4" />
            Profil Saya
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
          >
            <FiLogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}