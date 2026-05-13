'use client';

import { useRef, useEffect } from 'react';
import { FiX, FiCalendar, FiEdit } from 'react-icons/fi';
import { useCreateSchedule } from '../../graphql/create-schedule.mutation';
import { useUpdateSchedule } from '../../graphql/update-schedule.mutation';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/lib/error-utils';

interface PlanData {
  id?: string;
  title: string;
  scheduledUpload?: string;
  status?: 'DRAFT' | 'SCHEDULED' | 'POSTED';
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  existingPlan?: PlanData | null;
}

export function CreatePlanModal({ isOpen, onClose, onSuccess, existingPlan }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const scheduleRef = useRef<HTMLInputElement>(null);

  const [createSchedule, { loading: creating }] = useCreateSchedule();
  const [updateSchedule, { loading: updating }] = useUpdateSchedule();
  const loading = creating || updating;

  const isEditMode = !!existingPlan?.id;
  const defaultTitle = existingPlan?.title || '';
  const defaultSchedule = existingPlan?.scheduledUpload || '';

  if (!isOpen) return null;

  // Keyboard: Escape untuk menutup modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !loading) {
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value?.trim() || '';
    const scheduledUpload = scheduleRef.current?.value || '';

    if (!title) {
      toast.error('Judul wajib diisi');
      return;
    }

    try {
      if (isEditMode && existingPlan?.id) {
        await updateSchedule({
          variables: {
            id: existingPlan.id,
            input: {
              title,
              scheduledUpload: scheduledUpload ? new Date(scheduledUpload).toISOString() : undefined,
            },
          },
        });
        toast.success('Plan berhasil diperbarui');
      } else {
        await createSchedule({
          variables: {
            input: {
              title,
              scheduledUpload: scheduledUpload ? new Date(scheduledUpload).toISOString() : undefined,
            },
          },
        });
        toast.success('Plan berhasil dibuat');
      }
      onSuccess();
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onKeyDown={handleKeyDown}
      >
        <div
          key={existingPlan?.id ?? 'new'}
          className="w-full max-w-md rounded-lg bg-white shadow-xl"
        >
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-lg font-semibold">
              {isEditMode ? 'Edit Planning' : 'Buat Planning'}
            </h3>
            <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100">
              <FiX className="h-5 w-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Plan</label>
              <div className="relative mt-1">
                <FiEdit className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <input
                  ref={titleRef}
                  defaultValue={defaultTitle}
                  className="block w-full pl-10 rounded-md border border-gray-300 py-2.5 text-sm"
                  placeholder="Masukkan nama plan"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Upload</label>
              <div className="relative mt-1">
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <input
                  type="datetime-local"
                  ref={scheduleRef}
                  defaultValue={defaultSchedule}
                  className="block w-full pl-10 rounded-md border border-gray-300 py-2.5 text-sm"
                  disabled={loading}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border px-4 py-2 text-sm"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}