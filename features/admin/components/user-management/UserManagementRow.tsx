'use client';

import { useState } from 'react';

import {
  CheckCircle2,
  Clock3,
  Info,
  Loader2,
  MoreVertical,
  XCircle,
} from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface User {
  id: string;

  username: string;

  email: string;

  role: string;

  isActive: boolean | string;

  createdAt: string;

  lastLoginAt: string | null;
}

interface Props {
  user: User;

  onChangeStatus: (
    id: string,
    status: 'Active' | 'Inactive'
  ) => Promise<void>;
}

export default function UserManagementRow({
  user,
  onChangeStatus,
}: Props) {
 
  // LOCAL STATUS
  
  const [
    localStatus,
    setLocalStatus,
  ] = useState(
    user.isActive === true ||
      user.isActive === 'true'
  );

  
  // LOADING
  const [
    loadingStatus,
    setLoadingStatus,
  ] = useState(false);

  const [
    openStatusMenu,
    setOpenStatusMenu,
  ] = useState(false);

  
  // AVATAR
  const initials =
    user.username
      ?.slice(0, 2)
      .toUpperCase() || 'US';

  
  // FORMAT DATE
  const formatDate = (
    dateString: string
  ) => {
    const splitDate =
      dateString.split('T');

    if (!splitDate[0]) {
      return '-';
    }

    const date = new Date(
      splitDate[0]
    );

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  //  LAST LOGIN DATE
  const formatLastLogin = (
    dateString: string
  ) => {
    const splitDate =
      dateString.split('T');

    if (!splitDate[0]) {
      return '-';
    }

    const date = new Date(
      splitDate[0]
    );

    return date.toLocaleDateString(
      'en-US',
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  };

  //  LAST LOGIN TIME
  const formatLastLoginTime = (
    dateString: string
  ) => {

    const splitDate =
      dateString.split('T');

    if (!splitDate[1]) {
      return '-';
    }

    return splitDate[1]
      .replace('Z', '')
      .split('.')[0];
  };

  // CHANGE STATUS
  const handleStatusChange =
    async (
      status:
        | 'Active'
        | 'Inactive'
    ) => {
      
      // OPTIMISTIC UPDATE
      const previousStatus =
        localStatus;

      setLocalStatus(
        status === 'Active'
      );

      setLoadingStatus(true);

      try {
        await onChangeStatus(
          user.id,
          status
        );
        setOpenStatusMenu(false);
      } catch (error) {
        
        // ROLLBACK
        setLocalStatus(
          previousStatus
        );

        console.error(error);
      } finally {
        setLoadingStatus(false);
      }
    };

  return (
    <div className="grid grid-cols-[2.6fr_2.2fr_1fr_1.3fr_1.7fr_170px] items-center px-7 py-4 transition-all duration-200 hover:bg-gray-50">
      {/* USER */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
          {initials}
        </div>

        <p className="text-sm font-semibold text-gray-900">
          {user.username}
        </p>
      </div>

      {/* EMAIL */}
      <div>
        <p className="truncate text-sm text-gray-500">
          {user.email}
        </p>
      </div>

      {/* ROLE */}
      <div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase text-gray-700">
          {user.role}
        </span>
      </div>

      {/* ADD DATE */}
      <div>
        <p className="text-sm text-gray-500">
          {formatDate(
            user.createdAt
          )}
        </p>
      </div>

      {/* LAST LOGIN */}
      <div>
        {user.lastLoginAt ? (
          <Popover>
            <PopoverTrigger asChild>
              <button className="group flex items-center gap-2 text-sm text-gray-600 transition">
                <span>
                  {formatLastLogin(
                    user.lastLoginAt
                  )}
                </span>

                <Info
                  size={14}
                  className="text-gray-400 transition group-hover:text-gray-700"
                />
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="start"
              sideOffset={8}
              className="
                w-56
                rounded-[10px]
                border
                border-black/10
                bg-white
                px-2
                py-2
                shadow-lg
              "
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Login Detail
                </p>

                <div className="rounded bg-green-100 px-2 py-[2px] text-[10px] font-semibold text-green-700">
                  CURRENT
                </div>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <Clock3
                  size={16}
                  className="text-blue-500"
                />

                <p className="text-sm font-semibold text-gray-900">
                  {formatLastLoginTime(
                    user.lastLoginAt
                  )}
                </p>
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {formatLastLogin(
                  user.lastLoginAt
                )}
              </p>
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-sm text-gray-400">
            Never login
          </p>
        )}
      </div>

      {/* STATUS */}
      <div className="flex items-center">
          <div className="flex items-center gap-2">
            {/* BADGE */}
            <div
              className={`flex min-w-[90px] items-center justify-center rounded-full px-3 py-[7px] text-xs font-semibold transition-all duration-200 ${
                localStatus
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {loadingStatus ? (
                <Loader2
                  size={14}
                  className="animate-spin"
                />
              ) : localStatus ? (
                'Active'
              ) : (
                'Inactive'
              )}
            </div>

            {/* STATUS MENU */}
            <Popover
              open={openStatusMenu}
              onOpenChange={setOpenStatusMenu}
            >
              
              <PopoverTrigger asChild>
                <button
                  disabled={loadingStatus}
                  className="rounded-lg p-1 transition hover:bg-gray-100 disabled:opacity-50"
                >
                  <MoreVertical
                    size={16}
                    className="text-gray-500"
                  />
                </button>
              </PopoverTrigger>

              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="w-40 rounded-[10px] border border-black/10 p-1 shadow-lg"
              >
                {!localStatus && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        'Active'
                      )
                    }
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm hover:bg-green-50"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-green-600"
                    />
                    Active
                  </button>
                )}

                {localStatus && (
                  <button
                    onClick={() =>
                      handleStatusChange(
                        'Inactive'
                      )
                    }
                    className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2.5 text-sm hover:bg-red-50"
                  >
                    <XCircle
                      size={16}
                      className="text-red-500"
                    />
                    Inactive
                  </button>
                )}
              </PopoverContent>
            </Popover>
          </div>
      </div>
    </div>
  );
}