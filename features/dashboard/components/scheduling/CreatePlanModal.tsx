'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiEdit } from 'react-icons/fi';
import { useCreateSchedule } from '../../graphql/create-schedule.mutation';
import toast from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreatePlanModal({ isOpen, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [scheduledUpload, setScheduledUpload] = useState('');
  const [createSchedule, { loading }] = useCreateSchedule();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Judul wajib diisi'); return; }
    try {
      await createSchedule({
        variables: {
          input: {
            title,
            scheduledUpload: scheduledUpload ? new Date(scheduledUpload).toISOString() : undefined,
          },
        },
      });
      toast.success('Plan berhasil dibuat');
      setTitle('');
      setScheduledUpload('');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Gagal membuat plan');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-lg font-semibold">Buat Planning</h3>
            <button onClick={onClose} className="rounded-full p-1 text-gray-400 hover:bg-gray-100"><FiX className="h-5 w-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nama Plan</label>
              <div className="relative mt-1">
                <FiEdit className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <input value={title} onChange={e => setTitle(e.target.value)} className="block w-full pl-10 rounded-md border border-gray-300 py-2.5 text-sm" placeholder="Masukkan nama plan" disabled={loading} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal Upload</label>
              <div className="relative mt-1">
                <FiCalendar className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
                <input type="datetime-local" value={scheduledUpload} onChange={e => setScheduledUpload(e.target.value)} className="block w-full pl-10 rounded-md border border-gray-300 py-2.5 text-sm" disabled={loading} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="rounded-md border px-4 py-2 text-sm">Batal</button>
              <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}