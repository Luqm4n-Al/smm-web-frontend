'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useVerifyOtpMutation } from '../graphql/verify-otp.mutation';
import { useResendOtpMutation } from '../graphql/resend-otp.mutation'; //import
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { apolloClient } from '@/lib/graphql/client';

interface OtpVerificationFormProps {
  email: string;
  phone: string;
  username: string; 
}

export function OtpVerificationForm({ email, phone, username }: OtpVerificationFormProps) {
  const router = useRouter();
  const [verifyOtp, { loading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { loading: resending }] = useResendOtpMutation(); // 🆕

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
      toast.success('Kode OTP baru telah dikirim ke email Anda.');
      setTimer(60); // reset timer setelah sukses
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim ulang OTP. Coba lagi nanti.';
      toast.error(errorMessage);
      // biarkan timer tetap 0 agar user bisa mencoba lagi
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Mohon masukkan 6 digit kode OTP');
      return;
    }

    console.log('🔍 DEBUG: Starting OTP verification', {
      email,
      phone,
      otp,
      otpLength: otp.length,
      timestamp: new Date().toISOString(),
    });

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

        console.log('📊 DEBUG: VerifyOTP Response', data?.verifyOTP)

      // Karena server mengembalikan string (contoh token), kita anggap sukses jika ada nilainya
        if (data?.verifyOTP) {
            toast.success('Verifikasi berhasil! Silakan cek email untuk password sementara.');
            router.push('/login?welcome=true');
        } else {
            // Jika server mengembalikan null/undefined berarti gagal
            toast.error('OTP tidak valid');
        }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kode OTP salah atau kedaluwarsa';
      console.error('❌ DEBUG: OTP Verification Error', {
        errorMessage,
        errorStack: err instanceof Error ? err.stack : undefined,
      });
      toast.error(errorMessage);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
            Kembali ke Register
        </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Verifikasi OTP</h1>
        <p className="mt-2 text-sm text-gray-600">Masukkan kode OTP yang dikirim via email</p>
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
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">Kode OTP</label>
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
              {resending ? 'Mengirim...' : 'Kirim Ulang Kode'}
            </button>
          ) : (
            <p className="text-sm text-gray-500">Kirim Ulang kode : {formatTime(timer)}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={verifying}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {verifying ? 'Memverifikasi...' : 'Verifikasi'}
        </button>
      </form>
    </div>
  );
}