// src/app/(landing)/register/page.tsx
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { AuthPreview } from '@/features/auth/components/AuthPreview';
import { Logo } from '@/shared/Logo';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen">
      {/* Kiri: Form Register */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        {/* Logo */}
        <div className="mb-8">
          <Logo variant='full' size={60} priority/>
        </div>
        <RegisterForm />
      </div>

      {/* Kanan: Preview Fitur */}
      <AuthPreview variant="register" />
    </div>
  );
}