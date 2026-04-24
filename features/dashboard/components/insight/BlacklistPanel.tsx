// src/features/insight/components/BlacklistPanel.tsx
'use client';

import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';

export function BlacklistPanel() {
  const [keywords, setKeywords] = useState<string[]>([
    'jelek',
    'scam',
    'penipuan',
    'sampah',
    'bego',
  ]);
  const [newKeyword, setNewKeyword] = useState('');

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">Blacklist Keyword</h3>
      <p className="mb-4 text-sm text-gray-600">
        Komentar yang mengandung kata-kata ini akan otomatis disembunyikan dari analisis.
      </p>

      {/* Input */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newKeyword}
          onChange={(e) => setNewKeyword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
          placeholder="Tambah kata..."
          className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={addKeyword}
          className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
        >
          <FiPlus className="h-4 w-4" />
          Tambah
        </button>
      </div>

      {/* List Keyword */}
      <div className="max-h-80 overflow-y-auto">
        <ul className="space-y-2">
          {keywords.map((keyword) => (
            <li
              key={keyword}
              className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2"
            >
              <span className="text-sm font-medium text-gray-900">{keyword}</span>
              <button
                onClick={() => removeKeyword(keyword)}
                className="text-gray-400 hover:text-red-600"
              >
                <FiX className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t pt-4">
        <p className="text-xs text-gray-500">
          {keywords.length} kata dalam daftar hitam
        </p>
      </div>
    </div>
  );
}