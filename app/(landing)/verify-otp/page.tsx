import { AuthPreview } from "@/features/auth/components/AuthPreview";
import { OtpVerificationForm } from "@/features/auth/components/OtpVerificationForm";
import Link from "next/link";


export default async function verifyOtpPage({
    searchParams,
}: {
    searchParams: Promise<{email? : string; phone? : string; username? : string}>;
}) {
    const params = await searchParams;
    const email = params.email || ''; //Fallback
    const phone = params.phone || '';
    const username = params.username || '';

    return (
        <div className="flex min-h-screen">
            {/* Kiri: Form OTP */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                {/* Logo */}
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
                        <span className="text-3xl">🚀</span>
                        <span>SMM Panel</span>
                    </Link>
                </div>

                <OtpVerificationForm email={email} phone={phone} username={username}/>
            </div>

            {/* Kanan: Preview */}
            <AuthPreview/>
        </div>
    )
}