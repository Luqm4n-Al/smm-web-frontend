'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiPhone, FiArrowLeft } from 'react-icons/fi';
import { useForgotPasswordMutation } from '../graphql/forgot-password.mutation';
import toast from 'react-hot-toast';

export function ForgotPasswordForm() {
  const router = useRouter();
  const [forgotPassword, { loading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await forgotPassword({
        variables: { input: { email, phone } },
      });
      if (data?.forgotPassword) {
        toast.success('Kode OTP telah dikirim ke email Anda.');
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Gagal mengirim OTP');
    }
  };

  return (
    <div className="w-full max-w-md">
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
      >
        <FiArrowLeft className="h-4 w-4" /> Kembali ke Login
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Lupa Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Masukkan email dan nomor HP Anda untuk menerima kode OTP.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiMail className="h-4 w-4" /></span>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="contoh@email.com" required disabled={loading} />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">No. HP</label>
          <div className="relative mt-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiPhone className="h-4 w-4" /></span>
            <input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="block w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="0812-3456-7890" required disabled={loading} />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Mengirim OTP...' : 'Kirim OTP'}
        </button>
      </form>
    </div>
  );
}