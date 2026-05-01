// features/insight/components/InsightView.tsx
'use client';

import { useState } from 'react';
import { PlatformSwitcher } from '../PlatfromSwitcher';
import { useGetPostsQuery } from '../../graphql/posts.query';
import { useGetCommentBlackListsQuery } from '../../graphql/commentBlacklists.query';
import { InsightCard } from './InsightCard';
import { BlacklistPanel } from './BlacklistPanel';

const PAGE_SIZE = 12; // Jumlah item per halaman

export function InsightView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');
  const [sortField, setSortField] = useState<'DATE' | 'LIKE' | 'VIEW' | 'SENTIMENT'>('DATE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(0);

  const filter = {
    platform: platform === 'all' ? undefined : platform === 'instagram' ? 'INSTAGRAM' as const : 'TIKTOK' as const,
    sortField,
    sortOrder,
    limit: PAGE_SIZE + 1, // Ambil satu ekstra untuk deteksi halaman berikutnya
    offset: page * PAGE_SIZE,
  };

  const { data: postsData, loading, error } = useGetPostsQuery(filter);
  const { data: blacklistData } = useGetCommentBlackListsQuery();

  if (loading) return <div className="flex justify-center py-20 text-gray-500">Memuat insight...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">Error: {error.message}</div>;

  const allPosts = postsData?.posts || [];
  const hasNextPage = allPosts.length > PAGE_SIZE;
  const posts = allPosts.slice(0, PAGE_SIZE); // Hanya tampilkan sejumlah halaman

  const blacklists = blacklistData?.commentBlackLists || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insight Konten</h1>
          <p className="text-gray-600">Analisis performa dan sentimen setiap konten.</p>
        </div>
        <div className="flex items-center gap-4">
          <PlatformSwitcher selected={platform} onChange={setPlatform} />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="DATE">Tanggal</option>
            <option value="LIKE">Like</option>
            <option value="VIEW">View</option>
            <option value="SENTIMENT">Sentimen</option>
          </select>
          <button
            onClick={() => setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
            className="rounded-md border px-2 py-1.5 text-sm"
            title={sortOrder === 'ASC' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'ASC' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">Belum ada konten.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map(post => (
                  <InsightCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-sm text-gray-600">
                  Halaman {page + 1}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(prev => Math.max(0, prev - 1))}
                    disabled={page === 0}
                    className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={!hasNextPage}
                    className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="w-full lg:w-80">
          <BlacklistPanel blacklists={blacklists} />
        </div>
      </div>
    </div>
  );
}