// src/features/dashboard/components/Header/NotificationPanel.tsx
'use client';

import { FiX, FiMessageSquare, FiHeart, FiUserPlus, FiAlertCircle } from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'comment',
    title: 'Komentar Baru',
    description: '@sarah mengomentari postingan "Tips Karir"',
    time: '2 menit lalu',
    read: false,
  },
  {
    id: '2',
    type: 'like',
    title: 'Like Baru',
    description: 'Postingan "Behind the Scene" mendapat 50 likes',
    time: '10 menit lalu',
    read: false,
  },
  {
    id: '3',
    type: 'follow',
    title: 'Pengikut Baru',
    description: '@john_doe mulai mengikuti Anda',
    time: '1 jam lalu',
    read: true,
  },
  {
    id: '4',
    type: 'system',
    title: 'Laporan Siap',
    description: 'Laporan analitik mingguan telah siap diunduh',
    time: '3 jam lalu',
    read: true,
  },
  {
    id: '5',
    type: 'comment',
    title: 'Komentar Baru',
    description: '@alex menyebut Anda dalam komentar',
    time: '5 jam lalu',
    read: true,
  },
];

const iconMap = {
  comment: FiMessageSquare,
  like: FiHeart,
  follow: FiUserPlus,
  system: FiAlertCircle,
};

const iconColorMap = {
  comment: 'text-blue-500 bg-blue-100',
  like: 'text-red-500 bg-red-100',
  follow: 'text-green-500 bg-green-100',
  system: 'text-yellow-500 bg-yellow-100',
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  if (!isOpen) return null;

  const unreadCount = dummyNotifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l bg-white shadow-xl transition-transform">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Notifikasi</h3>
            <p className="text-xs text-gray-500">{unreadCount} belum dibaca</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Daftar Notifikasi */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
          {dummyNotifications.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-gray-500">Tidak ada notifikasi</p>
            </div>
          ) : (
            <ul className="divide-y">
              {dummyNotifications.map((notification) => {
                const Icon = iconMap[notification.type];
                return (
                  <li
                    key={notification.id}
                    className={`flex gap-3 px-4 py-3 hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className={`rounded-full p-2 ${iconColorMap[notification.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-600">{notification.description}</p>
                      <p className="mt-1 text-xs text-gray-400">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <span className="mt-2 h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}