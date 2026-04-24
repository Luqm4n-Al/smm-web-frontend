// src/features/insight/components/ContentGrid.tsx
'use client';

import { ContentCard } from './ContentCard';
import { dummyContents } from '@/lib/dummyDataInsight';

export function ContentGrid() {
  const handleCardClick = (id: string) => {
    // Nanti buka modal detail
    console.log('Klik konten:', id);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Semua Konten</h2>
        <select className="rounded-md border border-gray-300 px-3 py-1.5 text-sm">
          <option>Semua Platform</option>
          <option>Instagram</option>
          <option>TikTok</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dummyContents.map((content) => (
          <ContentCard
            key={content.id}
            {...content}
            onClick={() => handleCardClick(content.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t pt-4">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-medium">1-8</span> dari <span className="font-medium">24</span> konten
        </p>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50" disabled>
            Previous
          </button>
          <button className="rounded-md bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            1
          </button>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">2</button>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">3</button>
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
}