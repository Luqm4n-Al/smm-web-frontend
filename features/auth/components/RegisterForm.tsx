'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useRegisterMutation } from '../graphql/register.mutation';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { extractErrorMessage } from '@/lib/error-utils';
import { validateEmail } from '@/lib/validation-utils';
import { EmailValidationHint } from './EmailValidationHint';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { signIn } from 'next-auth/react';

export function RegisterForm() {
  const router = useRouter();
  const [registerMutation, { loading }] = useRegisterMutation();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);

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
      // Validate email before sending to backend
      const emailResult = validateEmail(formData.email);
      if (!emailResult.isValid) {
        toast.error(emailResult.error || 'Please enter a valid email address');
        return;
      }

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
        toast.success('Registration successful! Please check your email for the OTP code.');
        // Arahkan ke halaman verifikasi OTP, bawa email sebagai query param
        router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&phone=${encodeURIComponent(formData.phone)}&username=${encodeURIComponent(formData.username)}`);
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleGoogleRegister = async () => {
    setIsGoogleLoading(true);
    try {
      // 1. Firebase Google popup → ambil ID token
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      // 2. Sign in via NextAuth — authorize akan memanggil firebaseLogin mutation
      const res = await signIn('credentials', {
        username: idToken,
        password: '__firebase__',
        redirect: false,
      });

      if (res?.ok) {
        toast.success('Successfully registered with Google!');
        router.push('/dashboard');
      } else {
        toast.error('Failed to register with Google. Please try again.');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Back-Button */}
      <Link href="/" className='mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600'>
        <FiArrowLeft className='h-4 w-4'/>
        Back to Home
      </Link>
      {/* Header Form */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-2 text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
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
            placeholder="Enter your username"
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
            onBlur={() => setEmailTouched(true)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="example@gmail.com"
            required
            disabled={loading}
          />
          <EmailValidationHint email={formData.email} touched={emailTouched} />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
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



        {/* Register Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or</span>
          </div>
        </div>

        {/* Register with Google */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={loading || isGoogleLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FcGoogle className="h-5 w-5" />
          {isGoogleLoading ? 'Connecting...' : 'Register with Google'}
        </button>
      </form>
    </div>
  );
}