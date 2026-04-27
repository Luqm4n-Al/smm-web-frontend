import { ForgotOtpVerificationForm } from '@/features/auth/components/ForgotOtpVerificationForm';
import { AuthPreview } from '@/features/auth/components/AuthPreview';
import Link from 'next/link';

export default function ForgotOtpVerifyPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:px-20 xl:px-24">
        <div className="mb-8">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🚀</span><span>SMM Panel</span>
          </Link>
        </div>
        <ForgotOtpVerificationForm />
      </div>
      <AuthPreview />
    </div>
  );
}