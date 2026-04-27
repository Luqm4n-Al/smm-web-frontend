// src/features/auth/components/RegisterForm.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useRegisterMutation } from '../graphql/register.mutation'; // sesuaikan path
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { signOut } from 'next-auth/react';

export function RegisterForm() {
  const router = useRouter();
  const [registerMutation, { loading }] = useRegisterMutation();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            email: formData.email,
            username: formData.username,
            phone: formData.phone,
          },
        },
      });

      if (data?.register) {
        toast.success('Registrasi berhasil! Silakan cek email untuk kode OTP.');
        // Arahkan ke halaman verifikasi OTP, bawa email sebagai query param
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}&username=${encodeURIComponent(formData.username)}`);
      }
    } catch (err: any) {
      // Tampilkan pesan error dari GraphQL
      const message = err?.message || 'Terjadi kesalahan saat registrasi';
      toast.error(message);
    }
  };

  // ... kode JSX tidak berubah, hanya tambahkan disabled pada button saat loading
  return (
    <div className="w-full max-w-md">
      {/* Back-Button */}
      <Link href="/" className='mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600'>
        <FiArrowLeft className='h-4 w-4'/>
        Kembali ke Beranda
      </Link>
      {/* Header Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Sudah punya akun?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Masuk sekarang
          </Link>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Masukkan username"
            required
            disabled={loading}
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="contoh@email.com"
            required
            disabled={loading}
          />
        </div>

        {/* No. HP */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            No. HP
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="0812-3456-7890"
            required
            disabled={loading}
          />
        </div>



        {/* Tombol Daftar */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mendaftarkan...' : 'Daftar'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">atau</span>
          </div>
        </div>

        {/* Daftar dengan Google */}
        <button
          type="button"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
        >
          <FcGoogle className="h-5 w-5" />
          Daftar dengan Google
        </button>
      </form>
    </div>
  );
}