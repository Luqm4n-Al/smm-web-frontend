// src/app/(dashboard)/layout.tsx
// import { redirect } from 'next/navigation';
// import { getServerSession } from 'next-auth';
import { Sidebar } from '@/features/dashboard/components/sidebar';
import { Header } from '@/features/dashboard/components/header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 🚧 Nonaktifkan auth sementara untuk development
  // const session = await getServerSession();
  // if (!session) {
  //   redirect('/login');
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}