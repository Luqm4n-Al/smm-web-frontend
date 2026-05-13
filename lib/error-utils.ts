//lib/error-utils.ts

import { CombinedGraphQLErrors, CombinedProtocolErrors } from '@apollo/client';

export function extractErrorMessage(error: unknown): string {
    // Cek apakah error dari Apollo GraphQL (Apollo Client v4)
    if (error instanceof CombinedGraphQLErrors) {
        if (error.errors.length > 0) {
            const messages = error.errors
                .map((e) => e.message)
                .filter(Boolean)
                .join(', ');
            if (messages) return messages;
        }
        return error.message;
    }
    // Cek apakah error protokol (network/server error)
    if (error instanceof CombinedProtocolErrors) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'string') return error;
    return 'Terjadi kesalahan yang tidak diketahui';
}

export function isNullDataError(error: unknown): boolean {
    const message = extractErrorMessage(error).toLowerCase();
    return (
        message.includes('null') &&
        (message.includes('the requested element') ||
            message.includes('schema does not allow'))
    );
}

export function isNetworkError(error: unknown): boolean {
    const message = extractErrorMessage(error).toLowerCase();
    return (
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('failed to fetch')
    );
}

export function isForbiddenError(error: unknown): boolean {
    const message = extractErrorMessage(error).toLowerCase();

    // Cek pesan error umum untuk Forbidden
    if (
        message.includes('forbidden') ||
        message.includes('403') ||
        message.includes('not authorized') ||
        message.includes('unauthorized') ||
        message.includes('access denied')
    ) {
        return true;
    }

    // Cek GraphQL error extensions untuk status code 403
    if (error instanceof CombinedGraphQLErrors) {
        return error.errors.some((e) => {
            const status = (e.extensions as Record<string, unknown>)?.status;
            const code = (e.extensions as Record<string, unknown>)?.code;
            return status === 403 || status === '403' ||
                   code === 'FORBIDDEN' || code === 'UNAUTHENTICATED';
        });
    }

    return false;
}