'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyOtpMutation } from '../graphql/verify-otp.mutation';
import { useResendOtpMutation } from '../graphql/resend-otp.mutation';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { apolloClient } from '@/lib/graphql/apollo-client';
import { formatCountdownTime } from '@/lib/format-utils';

interface OtpVerificationFormProps {
  email: string;
  phone: string;
  username: string; 
}

export function OtpVerificationForm({ email, phone, username }: OtpVerificationFormProps) {
  const router = useRouter();
  const [verifyOtp, { loading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { loading: resending }] = useResendOtpMutation();

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleResendCode = async () => {
    try {
      await resendOtp({
        variables: {
          input: {
            email,
            username,
            phone,
          },
        },
      });
      toast.success('A new OTP code has been sent to your email.');
      setTimer(60); // reset timer setelah sukses
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to resend OTP. Please try again later.';
      toast.error(errorMessage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code');
      return;
    }


    try {
      const { data } = await verifyOtp({
        variables: {
          input: {
            email,
            phone,
            otp,
          },
        },
      });


      // Karena server mengembalikan string (contoh token), kita anggap sukses jika ada nilainya
        if (data?.verifyOTP) {
            toast.success('Verification successful! Please check your email for a temporary password.');
            router.push('/login?welcome=true');
        } else {
            // Jika server mengembalikan null/undefined berarti gagal
            toast.error('Invalid OTP code');
        }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid or expired OTP code';
      toast.error(errorMessage);
    }
  };



    const handleBack = async () => {
        await apolloClient.resetStore();
        router.push('/register');
    }

  return (
    <div className="w-full max-w-md">
        {/* Back button */}
        <button
            type="button"
            onClick={handleBack}
            className='mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600'
        >
            <FiArrowLeft className='h-4 w-4'/>
            Back to Register
        </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">OTP Verification</h1>
        <p className="mt-2 text-sm text-gray-600">Enter the OTP code sent to your email</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            disabled
            className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
          />
        </div>

        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP Code</label>
          <input
            ref={inputRef}
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-center text-2xl tracking-[0.5em] font-bold shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="000000"
            required
            disabled={verifying}
          />
        </div>

        <div className="text-center">
          {timer === 0 ? (
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resending}
              className="text-sm font-medium text-blue-600 hover:text-blue-500 disabled:text-blue-400 disabled:cursor-not-allowed"
            >
              {resending ? 'Sending...' : 'Resend Code'}
            </button>
          ) : (
            <p className="text-sm text-gray-500">Resend code in {formatCountdownTime(timer)}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={verifying}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>
    </div>
  );
}