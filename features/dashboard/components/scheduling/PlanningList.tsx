// features/dashboard/components/scheduling/PlanningList.tsx
'use client';

import { useState } from 'react';
import { FiPlus, FiEdit, FiCheck, FiTrash2 } from 'react-icons/fi';
import { CreatePlanModal } from './CreatePlanModal';
import { useMarkAsPosted } from '../../graphql/mark-posted.mutation';
import { useDeleteSchedule } from '../../graphql/delete-schedule.mutation';
import type { ContentSchedule } from '../../graphql/schedule.types';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/lib/error-utils';

interface PlanningListProps {
  schedules?: ContentSchedule[];
  onRefresh: () => Promise<void>;
}

export function PlanningList({ schedules = [], onRefresh }: PlanningListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<{
    id: string;
    title: string;
    scheduledUpload?: string;
  } | null>(null);
  const [markAsPosted] = useMarkAsPosted();
  const [deleteSchedule] = useDeleteSchedule();

  const handleMarkAsPosted = async (id: string) => {
    try {
      await markAsPosted({ variables: { id } });
      toast.success('Status diubah menjadi Dipublikasi');
      await onRefresh();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleDelete = async (id: string, title: string) => {
    const confirmed = window.confirm(`Hapus plan "${title}"?`);
    if (!confirmed) return;

    try {
      await deleteSchedule({ variables: { id } });
      toast.success('Plan berhasil dihapus');
      await onRefresh();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  

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
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {schedules.length === 0 ? (
            <p className="text-center text-sm text-gray-500 py-4">Belum ada rencana.</p>
          ) : (
            schedules.map(s => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-gray-500">
                    {s.scheduledUpload ? new Date(s.scheduledUpload).toLocaleDateString('id-ID') : '-'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {s.status !== 'POSTED' && (
                    <>
                      <button
                        onClick={() =>
                          setEditingPlan({
                            id: s.id,
                            title: s.title,
                            scheduledUpload: s.scheduledUpload || undefined,
                          })
                        }
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        title="Edit plan"
                      >
                        <FiEdit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMarkAsPosted(s.id)}
                        className="ml-2 text-green-600 hover:text-green-800"
                        title="Tandai selesai"
                      >
                        <FiCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Hapus plan"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <CreatePlanModal
        isOpen={isModalOpen || editingPlan !== null}
        onClose={() => { setIsModalOpen(false); setEditingPlan(null); }}
        onSuccess={async () => { setIsModalOpen(false); setEditingPlan(null); await onRefresh(); }}
        existingPlan={editingPlan}
      />
    </>
  );
}