// src/features/dashboard/components/Scheduling/CreatePlanModal.tsx
'use client';

import { useState } from 'react';
import { FiX, FiCalendar, FiEdit, FiFlag } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePlanModal({ isOpen, onClose }: CreatePlanModalProps) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('draft');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Nama plan wajib diisi');
      return;
    }
    if (!date) {
      toast.error('Tanggal wajib diisi');
      return;
    }

    setIsLoading(true);
    // TODO: Panggil mutation create plan
    setTimeout(() => {
      toast.success('Plan berhasil dibuat');
      setName('');
      setDate('');
      setStatus('draft');
      setIsLoading(false);
      onClose();
    }, 800);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-lg font-semibold text-gray-900">Buat Planning</h3>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-4">
            {/* Nama Plan */}
            <div>
              <label htmlFor="plan-name" className="block text-sm font-medium text-gray-700">
                Nama Plan
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiEdit className="h-4 w-4" />
                </span>
                <input
                  id="plan-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama plan"
                  className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Tanggal */}
            <div>
              <label htmlFor="plan-date" className="block text-sm font-medium text-gray-700">
                Tanggal
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiCalendar className="h-4 w-4" />
                </span>
                <input
                  id="plan-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="plan-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <div className="relative mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FiFlag className="h-4 w-4" />
                </span>
                <select
                  id="plan-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isLoading}
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Terjadwal</option>
                  <option value="published">Dipublikasi</option>
                </select>
              </div>
            </div>

            {/* Tombol */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}