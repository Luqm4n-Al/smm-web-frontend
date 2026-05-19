'use client';

import {
  FiAlertTriangle,
  FiFileText,
  FiShield,
  FiUserPlus,
  FiX,
} from 'react-icons/fi';

interface Notification {
  id: string;
  type: 'user' | 'report' | 'security' | 'system';
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const iconMap = {
  user: FiUserPlus,
  report: FiFileText,
  security: FiShield,
  system: FiAlertTriangle,
};

const iconStyleMap = {
  user: 'bg-blue-100 text-blue-600',
  report: 'bg-green-100 text-green-600',
  security: 'bg-red-100 text-red-600',
  system: 'bg-yellow-100 text-yellow-600',
};

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
}: NotificationPanelProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-sm border-l border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            <p className="text-xs text-gray-500">
              {unreadCount} unread notifications
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <div className="rounded-full bg-gray-100 p-4">
                <FiFileText className="h-6 w-6 text-gray-400" />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">
                  Tidak ada notifikasi
                </p>

                <p className="text-xs text-gray-400">
                  Semua aktivitas terbaru akan muncul di sini
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((notification) => {
                const Icon = iconMap[notification.type];

                return (
                  <li
                    key={notification.id}
                    className={`flex gap-3 px-5 py-4 transition hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        iconStyleMap[notification.type]
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-relaxed text-gray-500">
                            {notification.description}
                          </p>
                        </div>

                        {!notification.read && (
                          <span className="mt-1 h-2 w-2 rounded-full bg-blue-600"></span>
                        )}
                      </div>

                      <p className="mt-2 text-[11px] text-gray-400">
                        {notification.time}
                      </p>
                    </div>
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