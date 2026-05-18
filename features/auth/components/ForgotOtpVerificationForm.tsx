'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyForgotOtpMutation } from '../graphql/verify-forgot-otp.mutation';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/lib/error-utils';
import { FiArrowLeft } from 'react-icons/fi';
import { formatCountdownTime } from '@/lib/format-utils';

function ForgotOtpVerificationFormContent() {
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
      toast.error('Please enter the 6-digit OTP code');
      return;
    }
    try {
      const { data } = await verifyOtp({
        variables: { input: { email, phone, otp } },
      });
      if (data?.verifyOTPForgotPassword) {
        toast.success('OTP verified successfully');
        router.push(`/forgot-password/reset?token=${data.verifyOTPForgotPassword}`);
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };



  return (
    <div className="w-full max-w-md">
      <button type="button" onClick={() => router.push('/forgot-password')} className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
        <FiArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">OTP Verification</h1>
        <p className="mt-2 text-sm text-gray-600">Enter the OTP code sent to your email.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" value={email} disabled className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500" />
        </div>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP Code</label>
          <input ref={inputRef} id="otp" type="text" inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="000000" required disabled={loading} />
        </div>
        <div className="text-center">
          {timer === 0 ? (
            <button type="button" onClick={() => { /* resend handler */ }} className="text-sm font-medium text-blue-600 hover:text-blue-500">Resend Code</button>
          ) : (
            <p className="text-sm text-gray-500">Resend code in {formatCountdownTime(timer)}</p>
          )}
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}

export function ForgotOtpVerificationForm() {
  return (
    <Suspense fallback={<div className="w-full max-w-md"><div className="h-64 animate-pulse bg-gray-200 rounded"></div></div>}>
      <ForgotOtpVerificationFormContent />
    </Suspense>
  );
}