'use client';

import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { CreatePlanModal } from './CreatePlanModal';
import type { ContentSchedule } from '../../graphql/schedule.types';
import type { ApolloQueryResult } from '@apollo/client';

const statusMap: Record<string, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700' },
  SCHEDULED: { label: 'Terjadwal', className: 'bg-yellow-100 text-yellow-700' },
  POSTED: { label: 'Dipublikasi', className: 'bg-green-100 text-green-700' },
};

interface PlanningListProps {
  schedules: ContentSchedule[];
  onRefresh: () => Promise<ApolloQueryResult<any>>;
}

export function PlanningList({ schedules, onRefresh }: PlanningListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">List Planning</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
          >
            <FiPlus className="h-4 w-4" />
            Tambah Plan
          </button>
        </div>
        <div className="space-y-2 max-h-125 overflow-y-auto">
          {schedules.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">Belum ada rencana.</p>
          ) : (
            schedules.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.scheduleUpload ? new Date(s.scheduleUpload).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusMap[s.status]?.className || 'bg-gray-100'}`}>
                  {statusMap[s.status]?.label || s.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <CreatePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => { setIsModalOpen(false); onRefresh(); }}
      />
    </>
  );
}