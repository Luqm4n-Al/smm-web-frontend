'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useChangeForgottenPasswordMutation } from '../graphql/change-forgotten-password.mutation';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [changePassword, { loading }] = useChangeForgottenPasswordMutation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Minimal 8 karakter'); return; }
    if (password !== confirmPassword) { toast.error('Password tidak cocok'); return; }
    try {
      const { data } = await changePassword({
        variables: { input: { otp: token, password } },
      });
      if (data?.changeForgotenPassword) {
        toast.success('Password berhasil diubah. Silakan login.');
        router.push('/login');
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengubah password');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buat Password Baru</h1>
        <p className="mt-2 text-sm text-gray-600">Masukkan password baru Anda.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Password Baru</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiLock className="h-4 w-4" /></span>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 text-sm" required minLength={8} disabled={loading} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"><FiEyeOff className="h-5 w-5" /></button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Verifikasi Password Baru</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiLock className="h-4 w-4" /></span>
            <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-10 text-sm" required minLength={8} disabled={loading} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400"><FiEyeOff className="h-5 w-5" /></button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Menyimpan...' : 'Simpan Password Baru'}
        </button>
      </form>
    </div>
  );
}