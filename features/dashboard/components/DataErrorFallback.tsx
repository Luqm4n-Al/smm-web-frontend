// feature/dashboard/components/DataErrorFallback.tsx

'use client';

// Import icon dari react-icons untuk visualisasi jenis error
import {
    FiAlertTriangle,
    FiPhoneOff,
    FiRefreshCw,
    FiShield
} from "react-icons/fi";

// Import utility helper untuk identifikasi dan parsing error
import {
    extractErrorMessage,
    isNullDataError,
    isNetworkError,
    isForbiddenError
} from "@/lib/error-utils";

/**
 * Interface props untuk component DataErrorFallback
 */
interface DataErrorFallbackProps {

    /**
     * Object error yang diterima dari:
     * - API request
     * - GraphQL
     * - fetch
     * - async process
     */
    error: unknown;

    /**
     * Judul utama error card.
     * 
     * Bersifat optional karena memiliki default value.
     */
    title?: string;

    /**
     * Optional callback retry.
     * 
     * Digunakan ketika user ingin mencoba
     * melakukan request ulang.
     */
    onRetry?: () => void;
}

/**
 * DataErrorFallback
 * 
 * Component reusable untuk menampilkan
 * tampilan error/fallback pada dashboard.
 * 
 * Fungsi utama:
 * - Menampilkan jenis error secara visual.
 * - Memberikan pesan yang lebih user-friendly.
 * - Memberikan saran tindakan kepada user.
 * - Menyediakan tombol retry.
 * - Menampilkan detail error saat mode development.
 * 
 * Component ini mendukung beberapa jenis error:
 * - Forbidden Error (403)
 * - Network Error
 * - Null/Empty Data Error
 * - Generic Error
 */
export function DataErrorFallback({

    error,

    /**
     * Default title jika title tidak diberikan.
     */
    title = 'Failed to Load Data',

    onRetry,

}: DataErrorFallbackProps) {

    /**
     * Mengambil pesan error asli
     * dari utility helper.
     */
    const message = extractErrorMessage(error);

    /**
     * Validasi jenis error.
     */
    const isNull = isNullDataError(error);
    const isNetwork = isNetworkError(error);
    const isForbidden = isForbiddenError(error);

    /**
     * Default tampilan fallback.
     * 
     * Akan digunakan jika error
     * tidak cocok dengan kategori khusus.
     */
    let icon =
        <FiAlertTriangle className="h-8 w-8 text-yellow-500" />;

    let description = message;

    let suggestion = 'Please try again later.';

    /**
     * Warna default:
     * - yellow = warning/general issue
     * - red = critical/error access/network
     */
    let colorScheme = 'yellow';

    /**
     * FORBIDDEN ERROR (403)
     * 
     * Error ketika user tidak memiliki akses.
     */
    if (isForbidden) {

        icon =
            <FiShield className="h-8 w-8 text-red-500" />;

        description =
            "You do not have access to this page.";

        suggestion =
            "Make sure your account has the appropriate permissions, or contact your administrator.";

        colorScheme = 'red';

    }

    /**
     * NULL DATA ERROR
     * 
     * Error ketika data belum tersedia.
     */
    else if (isNull) {

        icon =
            <FiAlertTriangle className="h-8 w-8 text-yellow-500" />;

        description =
            "Some data is not yet available.";

        suggestion =
            "Data is being collected. Please check back in a few moments.";
    }

    /**
     * NETWORK ERROR
     * 
     * Error ketika koneksi ke server gagal.
     */
    else if (isNetwork) {

        icon =
            <FiPhoneOff className="h-8 w-8 text-red-500" />;

        description =
            "Failed to connect to the server.";

        suggestion =
            "Check your internet connection and try again.";

        colorScheme = 'red';
    }

    /**
     * DYNAMIC COLOR STYLING
     * 
     * Styling akan berubah sesuai jenis error.
     */

    // Warna border card
    const borderColor =
        colorScheme === 'red'
            ? 'border-red-200'
            : 'border-yellow-200';

    // Warna background card
    const bgColor =
        colorScheme === 'red'
            ? 'bg-red-50'
            : 'bg-yellow-50';

    // Warna title
    const titleColor =
        colorScheme === 'red'
            ? 'text-red-800'
            : 'text-yellow-800';

    // Warna deskripsi utama
    const descColor =
        colorScheme === 'red'
            ? 'text-red-700'
            : 'text-yellow-700';

    // Warna suggestion/hint
    const hintColor =
        colorScheme === 'red'
            ? 'text-red-600'
            : 'text-yellow-600';

    // Styling tombol retry
    const btnBg =
        colorScheme === 'red'
            ? 'bg-red-100 hover:bg-red-200 text-red-800'
            : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800';

    return (

        /**
         * Container utama error fallback.
         */
        <div
            className={`rounded-lg border ${borderColor} ${bgColor} p-6`}
        >

            {/* Layout horizontal antara icon dan content */}
            <div className="flex items-start gap-4">

                {/* Icon error */}
                <div className="shrink-0">
                    {icon}
                </div>

                {/* Content utama */}
                <div className="flex-1">

                    {/* Judul error */}
                    <h3 className={`text-lg font-medium ${titleColor}`}>
                        {title}
                    </h3>

                    {/* Deskripsi error */}
                    <p className={`mt-1 text-sm ${descColor}`}>
                        {description}
                    </p>

                    {/* Saran tindakan */}
                    <p className={`mt-1 text-xs ${hintColor}`}>
                        {suggestion}
                    </p>

                    {/**
                      * Tombol retry hanya muncul
                      * jika callback onRetry tersedia.
                      */}
                    {
                        onRetry && (

                            <button
                                onClick={onRetry}
                                className={`
                                    mt-3
                                    inline-flex
                                    items-center
                                    gap-1
                                    rounded-md
                                    px-3
                                    py-1.5
                                    text-sm
                                    font-medium
                                    ${btnBg}
                                `}
                            >

                                {/* Icon refresh */}
                                <FiRefreshCw className="h-4 w-4" />

                                Try Again
                            </button>
                        )
                    }

                </div>
            </div>

            {/**
    
             * DEVELOPMENT MODE ONLY
    
             * 
             * Detail error hanya ditampilkan
             * saat aplikasi berjalan di mode development.
             * 
             * Tujuan:
             * - membantu debugging developer
             * - tidak mengekspos detail error ke production
             */}
            {
                process.env.NODE_ENV === 'development' && (

                    <details
                        className={`mt-3 border-t ${borderColor} pt-3`}
                    >

                        {/* Toggle detail error */}
                        <summary
                            className={`cursor-pointer text-xs ${hintColor}`}
                        >
                            Error Details (DEV)
                        </summary>

                        {/* Raw error message */}
                        <pre
                            className={`
                                mt-2
                                whitespace-pre-wrap
                                text-xs
                                ${descColor}
                            `}
                        >
                            {message}
                        </pre>

                    </details>
                )
            }

        </div>
    );
}