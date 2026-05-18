// features/auth/components/ChangePasswordForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { FiEye, FiEyeOff, FiLock, FiArrowLeft } from 'react-icons/fi';
import { useChangePasswordMutation } from '../graphql/change-password.mutation';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/lib/error-utils';
import { isPasswordValid } from '@/lib/validation-utils';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';

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
    if (!isPasswordValid(formData.newPassword)) {
      toast.error('Password must be at least 8 characters and contain an uppercase letter, a number, and a symbol');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirmation do not match');
      return;
    }
    if (formData.oldPassword === formData.newPassword) {
      toast.error('New password must be different from old password');
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
        toast.success('Password changed successfully! Please sign in with your new password.');

        // Logout untuk mengakhiri sesi password sementara
        await signOut({ redirect: false });

        // Redirect ke login dengan flag bahwa password sudah diubah
        router.push('/login?passwordChanged=true');
      }
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
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
                Back to Sign In
        </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Change Password</h1>
        <p className="mt-2 text-sm text-gray-600">
          Replace your previous password with a new one.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Old Password */}
        <div>
          <label htmlFor="oldPassword" className={labelClass}>
            Old Password
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
              placeholder="Enter old password"
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

        {/* New Password */}
        <div>
          <label htmlFor="newPassword" className={labelClass}>
            New Password
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
              placeholder="At least 8 characters"
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
          <PasswordStrengthIndicator password={formData.newPassword} />
        </div>

        {/* Confirm New Password */}
        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm New Password
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
              placeholder="Re-enter new password"
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
          {loading ? 'Changing Password...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
}