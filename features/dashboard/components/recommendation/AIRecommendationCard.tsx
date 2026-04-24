'use client';

import { FiCpu } from 'react-icons/fi';

const recommendations = [
  'Fokus pada konten video pendek (Reels/TikTok) karena engagement naik 42% minggu ini.',
  'Gunakan tone santai dan humoris - analisis sentimen menunjukkan audiens merespon positif.',
  'Posting pada hari Rabu dan Kamis pukul 16:00-18:00 untuk jangkauan maksimal.',
];

export function AIRecommendationCard() {
  return (
    <div className="rounded-lg border bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiCpu className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Rekomendasi Cerdas</h3>
        <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">AI</span>
      </div>
      <ul className="space-y-4">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
            <p className="text-sm text-gray-700">{rec}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}