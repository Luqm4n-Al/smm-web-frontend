// features/insight/components/BlacklistPanel.tsx
'use client';

import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import { useAddBlacklistMutation } from '../../graphql/add-blacklist.mutation';
import { useRemoveBlacklistMutation } from '../../graphql/remove-blacklist.mutation';
import type { CommentBlackList } from '../../graphql/insight.types';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '@/lib/error-utils';

interface BlacklistPanelProps {
  blacklists: CommentBlackList[];
}

export function BlacklistPanel({ blacklists }: BlacklistPanelProps) {
  const [newWord, setNewWord] = useState('');
  const [addBlacklist] = useAddBlacklistMutation();
  const [removeBlacklist] = useRemoveBlacklistMutation();

  const handleAdd = async () => {
    if (!newWord.trim()) return;
    try {
      await addBlacklist({ variables: { input: { word: newWord.trim() } } });
      toast.success('Kata ditambahkan');
      setNewWord('');
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeBlacklist({ variables: { id } });
      toast.success('Kata dihapus');
    } catch (err: unknown) {
      toast.error(extractErrorMessage(err));
    }
  };

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-2 text-lg font-medium">Blacklist Keyword</h3>
      <div className="flex gap-2 mb-3">
        <input
          value={newWord}
          onChange={e => setNewWord(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Kata..."
          className="flex-1 rounded-md border px-3 py-1.5 text-sm"
        />
        <button onClick={handleAdd} className="rounded-md bg-blue-600 px-3 py-1.5 text-white text-sm">
          <FiPlus />
        </button>
      </div>
      <ul className="space-y-1 max-h-60 overflow-y-auto">
        {blacklists.map(item => (
          <li key={item.id} className="flex items-center justify-between text-sm py-1">
            <span>{item.word}</span>
            <button onClick={() => handleRemove(item.id)} className="text-red-500 hover:text-red-700">
              <FiX />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}