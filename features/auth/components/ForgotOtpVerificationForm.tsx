'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyForgotOtpMutation } from '../graphql/verify-forgot-otp.mutation';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';

export function ForgotOtpVerificationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const phone = searchParams.get('phone') || '';

  const [verifyOtp, { loading }] = useVerifyForgotOtpMutation();
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Masukkan 6 digit kode OTP');
      return;
    }
    try {
      const { data } = await verifyOtp({
        variables: { input: { email, phone, otp } },
      });
      if (data?.verifyOTPForgotPassword) {
        toast.success('OTP berhasil diverifikasi');
        router.push(`/forgot-password/reset?token=${data.verifyOTPForgotPassword}`);
      }
    } catch (err: any) {
      toast.error(err.message || 'OTP tidak valid');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="w-full max-w-md">
      <button type="button" onClick={() => router.push('/forgot-password')} className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
        <FiArrowLeft className="h-4 w-4" /> Kembali
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verifikasi OTP</h1>
        <p className="mt-2 text-sm text-gray-600">Masukkan kode OTP yang dikirim ke email Anda.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} disabled className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500" />
        </div>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Kode OTP</label>
          <input ref={inputRef} id="otp" type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="000000" required disabled={loading} />
        </div>
        <div className="text-center">
          {timer === 0 ? (
            <button type="button" onClick={() => { /* nanti bisa resend khusus */ }} className="text-sm font-medium text-blue-600 hover:text-blue-500">Kirim Ulang Kode</button>
          ) : (
            <p className="text-sm text-gray-500">Kirim Ulang kode : {formatTime(timer)}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Memverifikasi...' : 'Verifikasi'}
        </button>
      </form>
    </div>
  );
}