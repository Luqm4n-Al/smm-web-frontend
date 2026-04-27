import { AuthPreview } from "@/features/auth/components/AuthPreview";
import { LoginForm } from "@/features/auth/components/LoginForm";
import Link from "next/link";


export default function LoginPage() {
    return (
        <div className="flex min-h-screen">
            {/* Kiri: Form Login */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                {/* Logo Product */}
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                        <span className="text-3xl">🚀</span>
                        <span>SMM Panel</span>
                    </Link>
                </div>
                <LoginForm />
            </div>

            {/* Kanan: Preview */}
            <AuthPreview/>
        </div>
    )
}