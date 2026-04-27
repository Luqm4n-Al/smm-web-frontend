// src/app/(landing)/register/page.tsx
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { AuthPreview } from '@/features/auth/components/AuthPreview';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Kiri: Form Register */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {/* Logo */}
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🚀</span>
            <span>SMM Panel</span>
          </Link>
        </div>
        <RegisterForm />
      </div>

      {/* Kanan: Preview Fitur */}
      <AuthPreview variant="register" />
    </div>
  );
}