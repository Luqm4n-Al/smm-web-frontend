'use client';

/**
 * Props untuk PlatformSwitcher
 * 
 * selected  → platform yang sedang dipilih
 * onChange  → function callback saat user mengganti pilihan
 */
interface PlatformSwitcherProps {
  selected: 'all' | 'instagram' | 'tiktok';
  onChange: (platform: 'all' | 'instagram' | 'tiktok') => void;
}

/**
 * Component untuk memilih platform (filter data dashboard)
 * 
 * Digunakan untuk:
 * - Menampilkan data berdasarkan platform tertentu
 * - Mengganti filter (All / Instagram / TikTok)
 */
export function PlatformSwitcher({ selected, onChange }: PlatformSwitcherProps) {
  return (
    <div className="flex items-center gap-2">

      {/* Label dropdown */}
      <label className="text-sm text-gray-600">
        Platform:
      </label>

      {/* Dropdown untuk memilih platform */}
      <select
        value={selected}

        // Saat value berubah → kirim ke parent melalui onChange
        onChange={(e) => onChange(e.target.value as any)}

        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      >
        {/* Semua platform */}
        <option value="all">Semua</option>

        {/* Platform Instagram */}
        <option value="instagram">Instagram</option>

        {/* Platform TikTok */}
        <option value="tiktok">TikTok</option>
      </select>
    </div>
  );
}