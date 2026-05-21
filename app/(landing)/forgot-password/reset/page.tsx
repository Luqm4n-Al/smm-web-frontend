import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { AuthPreview } from '@/features/auth/components/AuthPreview';
import { Logo } from '@/shared/Logo';

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 lg:px-20 xl:px-24">
        <div className="mb-8">
          <Logo variant='full' size={60} priority/>
        </div>
        <ResetPasswordForm />
      </div>
      <AuthPreview />
    </div>
  );
}