// lib/format-utils.ts

/**
 * Format detik menjadi string "m:ss" untuk countdown timer
 * Contoh: 90 → "1:30", 5 → "0:05"
 */
export function formatCountdownTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
