//app/(dashboard)/dashboard/schedule/page.tsx
'use client';

import dynamic from 'next/dynamic';

/**
 * ScheduleView di-import secara dynamic dengan SSR disabled
 * untuk menghindari error "Converting circular structure to JSON"
 * yang terjadi saat server mencoba serialize DOM element (HTMLButtonElement)
 * dari komponen interaktif (buttons, modals, calendar)
 */
const ScheduleView = dynamic(
  () => import('@/features/dashboard/components/scheduling/ScheduleView').then(mod => mod.ScheduleView),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center py-20 text-gray-500">
        Loading schedule...
      </div>
    ),
  }
);

export default function SchedulePage() {
  return (
    <div className="space-y-6">
      <ScheduleView />
    </div>
  );
}