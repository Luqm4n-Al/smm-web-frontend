'use client';

import { NotificationBell } from './NotificationBell';
import { SearchBar } from './SearchBar';
import { AdminMenu } from './AdminMenu';

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-black/60 bg-white px-6">
      {/* Search */}
      <div className="flex-1">
        <SearchBar />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <NotificationBell />
        <AdminMenu />
      </div>
    </header>
  );
}