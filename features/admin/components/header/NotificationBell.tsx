'use client';

import { useMemo, useState } from 'react';
import { FiBell } from 'react-icons/fi';
import { NotificationPanel } from './NotificationPanel';

interface Notification {
  id: string;
  type: 'user' | 'report' | 'security' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);

  // nanti isi dari API/backend
  const notifications: Notification[] = [];

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative rounded-full p-2 text-gray-600 transition hover:bg-gray-100"
      >
        <FiBell className="h-5 w-5" />

        {/* Badge */}
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>

            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>

      <NotificationPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
      />
    </>
  );
}