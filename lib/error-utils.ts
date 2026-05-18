// lib/error-utils.ts

/**
 * ERROR UTILITIES
 * 
 * helper function
 * untuk menangani dan mengidentifikasi error.
 * 
 * Fungsi utama:
 * - Mengambil pesan error yang readable.
 * - Mendeteksi jenis error tertentu.
 * - Membantu UI menampilkan fallback yang sesuai.
 * - Menstandarisasi penanganan error.
 * 
 * Utility ini digunakan pada:
 * - Apollo GraphQL
 * - Network request
 * - Fetch API
 * - General JavaScript error
 */

import {
    CombinedGraphQLErrors,
    CombinedProtocolErrors
} from '@apollo/client';

/**
 * extractErrorMessage
 * 
 * Mengambil pesan error menjadi format string
 * yang lebih mudah ditampilkan ke UI.
 * 
 * Mendukung:
 * - Apollo GraphQL Error
 * - Protocol Error
 * - Native Error
 * - String Error
 * - Unknown Error
 * 
 * @param error - Object error dari berbagai sumber.
 * 
 * @returns string message error.
 */
export function extractErrorMessage(
    error: unknown
): string {

    /**
     * APOLLO GRAPHQL ERROR
     * 
     * Error dari GraphQL response.
     * 
     * Apollo Client v4 menggunakan:
     * CombinedGraphQLErrors
     */
    if (error instanceof CombinedGraphQLErrors) {

        /**
         * Jika terdapat list error GraphQL.
         */
        if (error.errors.length > 0) {

            /**
             * Ambil seluruh message error.
             */
            const messages = error.errors

                .map((e) => e.message)

                /**
                 * Hapus value kosong/null.
                 */
                .filter(Boolean)

                /**
                 * Gabungkan seluruh pesan.
                 */
                .join(', ');

            /**
             * Return hasil gabungan pesan.
             */
            if (messages) return messages;
        }

        /**
         * Fallback ke error.message utama.
         */
        return error.message;
    }

    /**
     * PROTOCOL / NETWORK ERROR
     * 
     * Error protokol:
     * - network
     * - server
     * - transport layer
     */
    if (error instanceof CombinedProtocolErrors) {

        return error.message;
    }

    /**
     * NATIVE JAVASCRIPT ERROR
     * 
     * Contoh:
     * new Error('Something went wrong')
     */
    if (error instanceof Error) {

        return error.message;
    }

    /**
     * STRING ERROR
     * 
     * Jika error langsung berupa string.
     */
    if (typeof error === 'string') {

        return error;
    }

    /**
     * UNKNOWN ERROR FALLBACK
     */
    return 'Terjadi kesalahan yang tidak diketahui';
}

/**
 * isNullDataError
 * 
 * Mengecek apakah error disebabkan
 * oleh data null atau schema mismatch.
 * 
 * Contoh:
 * - schema GraphQL tidak menerima null
 * - requested element bernilai null
 * 
 * @param error - Object error.
 * 
 * @returns boolean
 */
export function isNullDataError(
    error: unknown
): boolean {

    /**
     * Ambil pesan error dalam lowercase
     * agar pencarian lebih konsisten.
     */
    const message =
        extractErrorMessage(error).toLowerCase();

    /**
     * Validasi pola error null.
     */
    return (

        message.includes('null') &&

        (
            message.includes('the requested element') ||
            message.includes('schema does not allow')
        )
    );
}

/**
 * isNetworkError
 * 
 * Mengecek apakah error disebabkan
 * oleh koneksi/network.
 * 
 * Contoh:
 * - internet terputus
 * - server offline
 * - fetch gagal
 * 
 * @param error - Object error.
 * 
 * @returns boolean
 */
export function isNetworkError(
    error: unknown
): boolean {

    /**
     * Ambil pesan error lowercase.
     */
    const message =
        extractErrorMessage(error).toLowerCase();

    /**
     * Validasi keyword network error.
     */
    return (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('failed to fetch')
    );
}

/**
 * isForbiddenError
 * 
 * Mengecek apakah error disebabkan
 * oleh masalah authorization/access.
 * 
 * Seperti:
 * - 403 Forbidden
 * - Unauthorized
 * - Access Denied
 * - Invalid Permission
 * 
 * @param error - Object error.
 * 
 * @returns boolean
 */
export function isForbiddenError(
    error: unknown
): boolean {

    /**
     * Ambil pesan error lowercase.
     */
    const message =
        extractErrorMessage(error).toLowerCase();

    /**
     * VALIDASI BERDASARKAN MESSAGE
     * 
     * Mengecek keyword umum forbidden error.
     */
    if (

        message.includes('forbidden') ||
        message.includes('403') ||
        message.includes('not authorized') ||
        message.includes('unauthorized') ||
        message.includes('access denied')
    ) {

        return true;
    }

    /**
     * VALIDASI GRAPHQL EXTENSIONS
     * 
     * GraphQL biasanya menyimpan:
     * - status
     * - code
     * 
     * di field extensions.
     */
    if (error instanceof CombinedGraphQLErrors) {

        return error.errors.some((e) => {

            /**
             * Ambil status & code dari extensions.
             */
            const status =
                (e.extensions as Record<string, unknown>)
                    ?.status;

            const code =
                (e.extensions as Record<string, unknown>)
                    ?.code;

            /**
             * Validasi forbidden/authentication code.
             */
            return (
                status === 403 ||
                status === '403' ||
                code === 'FORBIDDEN' ||
                code === 'UNAUTHENTICATED'
            );
        });
    }

    /**
     * Default bukan forbidden error.
     */
    return false;
}