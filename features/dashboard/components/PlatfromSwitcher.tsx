// src/features/dashboard/components/PlatformSwitcher.tsx
'use client';

interface PlatformSwitcherProps {
  selected: 'all' | 'instagram' | 'tiktok';
  onChange: (platform: 'all' | 'instagram' | 'tiktok') => void;
}

export function PlatformSwitcher({ selected, onChange }: PlatformSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-600">Platform:</label>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value as any)}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="all">Semua</option>
        <option value="instagram">Instagram</option>
        <option value="tiktok">TikTok</option>
      </select>
    </div>
  );
}