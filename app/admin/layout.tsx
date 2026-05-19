import type { ReactNode } from 'react';

import { Header } from '@/features/admin/components/header';
import { Sidebar } from '@/features/admin/components/sidebar/Sidebar';

interface Props {
  children: ReactNode;
}

export default function AdminLayout({
  children,
}: Props) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}