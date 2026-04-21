// src/features/dashboard/components/Scheduling/PlanningList.tsx
'use client';

import { PlanningItem } from './PlanningItem';
import { FiPlus } from 'react-icons/fi';

// Data dummy
const plans = [
  { id: '1', name: 'Postingan Tips Karir', date: '12 Jan 2026', status: 'scheduled' as const },
  { id: '2', name: 'Giveaway Akhir Bulan', date: '25 Jan 2026', status: 'draft' as const },
  { id: '3', name: 'Behind the Scene', date: '8 Jan 2026', status: 'published' as const },
];

export function PlanningList() {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">List Planning</h3>
        <button className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">
          <FiPlus className="h-4 w-4" />
          Tambah Plan
        </button>
      </div>
      <div className="space-y-2">
        {plans.map((plan) => (
          <PlanningItem key={plan.id} name={plan.name} date={plan.date} status={plan.status} />
        ))}
      </div>
    </div>
  );
}