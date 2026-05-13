//feature/dashboard/components/DataErrorFallback.tsx
'use client'

import { FiAlertTriangle, FiPhoneOff, FiRefreshCw, FiShield } from "react-icons/fi";
import { extractErrorMessage, isNullDataError, isNetworkError, isForbiddenError } from "@/lib/error-utils";

interface DataErrorFallbackProps {
    error: unknown;
    title?: string;
    onRetry?: () => void;
}

export function DataErrorFallback({
    error,
    title = 'Gagal Memuat Data',
    onRetry,
}: DataErrorFallbackProps) {
    const message = extractErrorMessage(error);
    const isNull = isNullDataError(error);
    const isNetwork = isNetworkError(error);
    const isForbidden = isForbiddenError(error);

    let icon = <FiAlertTriangle className="h-8 w-8 text-yellow-500"/>;
    let description = message;
    let suggestion = 'Silahkan coba lagi nanti';
    let colorScheme = 'yellow'; // default

    if (isForbidden) {
        icon = <FiShield className="h-8 w-8 text-red-500"/>;
        description = "Anda tidak memiliki akses ke halaman ini";
        suggestion = "Pastikan akun anda memiliki izin yang sesuai, atau hubungi administrator.";
        colorScheme = 'red';
    } else if (isNull) {
        icon = <FiAlertTriangle className="h-8 w-8 text-yellow-500"/>
        description = "Beberapa data belum tersedia";
        suggestion = "Data sedang dikumpulkan. Silahkan cek kembali dalam beberapa saat.";
    } else if (isNetwork) {
        icon = <FiPhoneOff className="h-8 w-8 text-red-500"/>;
        description = "Gagal terhubung ke server";
        suggestion = "Periksa koneksi internet anda dan coba lagi.";
        colorScheme = 'red';
    }

    // Warna dinamis berdasarkan jenis error
    const borderColor = colorScheme === 'red' ? 'border-red-200' : 'border-yellow-200';
    const bgColor = colorScheme === 'red' ? 'bg-red-50' : 'bg-yellow-50';
    const titleColor = colorScheme === 'red' ? 'text-red-800' : 'text-yellow-800';
    const descColor = colorScheme === 'red' ? 'text-red-700' : 'text-yellow-700';
    const hintColor = colorScheme === 'red' ? 'text-red-600' : 'text-yellow-600';
    const btnBg = colorScheme === 'red' ? 'bg-red-100 hover:bg-red-200 text-red-800' : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';

    return (
        <div className={`rounded-lg border ${borderColor} ${bgColor} p-6`}>
            <div className="flex items-start gap-4">
                <div className="shrink-0">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className={`text-lg font-medium ${titleColor}`}>{title}</h3>
                    <p className={`mt-1 text-sm ${descColor}`}>{description}</p>
                    <p className={`mt-1 text-xs ${hintColor}`}>{suggestion}</p>
                    {
                        onRetry && (
                            <button
                                onClick={onRetry}
                                className={`mt-3 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium ${btnBg}`}
                            >
                                <FiRefreshCw className="h-4 w-4"/>
                                Coba lagi
                            </button>
                        )
                    }

                </div>
            </div>
            {process.env.NODE_ENV === 'development' && (
                <details className={`mt-3 border-t ${borderColor} pt-3`}>
                    <summary className={`cursor-pointer text-xs ${hintColor}`}>Detail Error (DEV)</summary>
                    <pre className={`mt-2 text-xs ${descColor} whitespace-pre-wrap`}>{message}</pre>
                </details>
            )}

        </div>
    )
}