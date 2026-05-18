'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface LoginFormProps {
    isFirstLogin?: boolean;
}

function LoginFormContent({ isFirstLogin: isFirstLoginProp = false }: LoginFormProps = {}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Detect if coming from OTP verification (welcome=true) or from change-password (passwordChanged=true)
    const isFirstLogin = isFirstLoginProp || searchParams.get('welcome') === 'true';
    const justChangedPassword = searchParams.get('passwordChanged') === 'true';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const res = await signIn('credentials', {
            username,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError('Invalid username or password');
            setIsLoading(false);
        } else if (res?.ok) {
            // Cek apakah user baru saja mengganti password
            if (justChangedPassword) {
                // Password sudah berubah, langsung ke dashboard
                router.push('/dashboard');
            } else if (isFirstLogin) {
                // User baru verifikasi OTP, password masih sementara, arahkan ke change-password
                router.push('/change-password');
            } else {
                // Regular login, go to dashboard
                router.push('/dashboard');
            }
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            // 1. Firebase Google popup → ambil ID token
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            // 2. Sign in via NextAuth — authorize akan memanggil firebaseLogin mutation
            //    username = Firebase ID token, password = '__firebase__' (flag)
            const res = await signIn('credentials', {
                username: idToken,
                password: '__firebase__',
                redirect: false,
            });

            if (res?.ok) {
                router.push('/dashboard');
            } else {
                setError('Failed to sign in with Google. Please try again.');
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to sign in with Google';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Header Form */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    {isFirstLogin ? 'Welcome! Please Sign In' : 'Sign In'}
                </h1>

                {isFirstLogin ? (
                    <div className='mt-2'>
                        <p className='text-sm text-gray-600'>
                            Use the username and temporary password sent to your email.
                        </p>
                        <p className='mt-1 text-xs text-blue-600'>
                            You will be asked to change your password after signing in.
                        </p>
                    </div>
                    ):(
                    <p className='mt-2 text-sm text-gray-600'>
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className='font-medium text-blue-600 hover:text-blue-500'>
                            Register Now
                        </Link>
                    </p>
                    )
                }
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">
                    {error}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        Username
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter your username"
                        required
                    />
                </div>

                {/* Password */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    <div className="relative mt-1">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 px-4 py-3 pr-10 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                            >
                            {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                        </button>
                    </div>
                        <div className="mt-1 text-right">
                            <Link href="/forgot-password" className="text-xs text-blue-600 hover:text-blue-500">
                            Forgot password?
                            </Link>
                        </div>
                </div>

                {/* Sign In Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
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

                {/* Sign In with Google */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FcGoogle className="h-5 w-5" />
                    Sign in with Google
                </button>
            </form>
        </div>
    );
}

export function LoginForm(props: LoginFormProps = {}) {
    return (
        <Suspense fallback={<div className="w-full max-w-md"><div className="h-64 animate-pulse bg-gray-200 rounded"></div></div>}>
            <LoginFormContent {...props} />
        </Suspense>
    );
}