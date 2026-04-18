'use client';

import { SearchBar } from './SearchBar';
import { NotificationBell } from './NotificationBell';
import { UserMenu } from './UserMenu';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Search Bar - Kiri */}
      <div className="flex-1">
        <SearchBar />
      </div>

      {/* Kanan: Notif + Profile */}
      <div className="flex items-center gap-4">
        <NotificationBell />
        <UserMenu />
      </div>
    </header>
  );
}