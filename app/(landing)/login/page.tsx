import { AuthPreview } from "@/features/auth/components/AuthPreview";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { Logo } from "@/shared/Logo";


export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            {/* Kiri: Form Login */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                {/* Logo Product */}
                <div className="mb-8">
                    <Logo variant='full' size={60} priority/>
                </div>
                <LoginForm />
            </div>

            {/* Kanan: Preview */}
            <AuthPreview/>
        </div>
    )
}