// src/features/dashboard/components/Header/NotificationBell.tsx
'use client';

import { useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { NotificationPanel } from './NotificationPanel';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
      >
        <FiBell className="h-5 w-5" />
        {/* Indikator notif baru */}
        <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>

      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}