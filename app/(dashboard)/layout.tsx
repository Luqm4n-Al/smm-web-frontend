// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/features/dashboard/components/sidebar';
import { Header } from '@/features/dashboard/components/header';
import { DashboardSearchProvider } from '@/features/dashboard/components/DashboardSearchProvider';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardSearchProvider>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </DashboardSearchProvider>
  );
}