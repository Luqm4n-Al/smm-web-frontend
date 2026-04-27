// src/features/auth/components/ChangePasswordForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiEye, FiEyeOff, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useChangePasswordMutation } from '../graphql/change-password.mutation';
import toast from 'react-hot-toast';

export function ChangePasswordForm() {
  const router = useRouter();
  const [changePassword, { loading }] = useChangePasswordMutation();

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (formData.newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Password baru dan konfirmasi tidak cocok');
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error('Password baru tidak boleh sama dengan password lama');
      return;
    }

    try {
      const { data } = await changePassword({
        variables: {
          input: {
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword,
          },
        },
      });

      // Backend mengembalikan String, bisa berupa pesan sukses atau token baru
      if (data?.changePassword) {
        toast.success('Password berhasil diubah! Silakan login dengan password baru.');

        // Logout untuk mengakhiri sesi password sementara
        await signOut({ redirect: false });

        // Redirect ke login dengan flag bahwa password sudah diubah
        router.push('/login?passwordChanged=true');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Gagal mengubah password');
    }
  };

    const handleBack = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    }

  const inputClass = 'mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500';
  const labelClass = 'block text-sm font-medium text-gray-700';

  return (
    <div className="w-full max-w-md">
        {/* Back button */}
        <button
            type="button"
            onClick={handleBack}
            className='mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600'
        >
            <FiArrowLeft className='h-4 w-4'/>
                Kembali ke Register
        </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Ganti Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Ubah password sebelumnya dengan password baru
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Password Lama */}
        <div>
          <label htmlFor="oldPassword" className={labelClass}>
            Password Lama
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              id="oldPassword"
              type={showOld ? 'text' : 'password'}
              value={formData.oldPassword}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
              placeholder="Masukkan password lama"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showOld ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Password Baru */}
        <div>
          <label htmlFor="newPassword" className={labelClass}>
            Password Baru
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
              placeholder="Minimal 8 karakter"
              required
              minLength={8}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showNew ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Verifikasi Password Baru */}
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Verifikasi Password Baru
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <FiLock className="h-5 w-5" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputClass} pl-10`}
              placeholder="Ulangi password baru"
              required
              minLength={8}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showConfirm ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengganti Password...' : 'Masuk'}
        </button>
      </form>
    </div>
  );
}