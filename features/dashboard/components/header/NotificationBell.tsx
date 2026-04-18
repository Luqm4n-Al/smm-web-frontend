'use client';

import { FiBell } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function NotificationBell() {
  const handleClick = () => {
    toast('Fitur notifikasi akan segera hadir!', {
      icon: '🔔',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <button
      onClick={handleClick}
      className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100"
    >
      <FiBell className="h-5 w-5" />
      {/* Indikator notif baru */}
      <span className="absolute right-1 top-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
    </button>
  );
}