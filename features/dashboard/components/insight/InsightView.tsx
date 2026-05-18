// features/insight/components/InsightView.tsx
'use client';

import { useState } from 'react';
import { PlatformSwitcher } from '../PlatformSwitcher';
import { useGetPostsQuery } from '../../graphql/posts.query';
import { useGetCommentBlackListsQuery } from '../../graphql/commentBlacklists.query';
import { InsightCard } from './InsightCard';
import { BlacklistPanel } from './BlacklistPanel';
import { SearchableSection } from '../SearchableSection';
import { NoSearchResults } from '../NoSearchResults';

const PAGE_SIZE = 12;

// 🆕 Tipe untuk field pengurutan agar tidak menggunakan 'any'
type SortField = 'DATE' | 'LIKE' | 'VIEW' | 'SENTIMENT';

export function InsightView() {
  const [platform, setPlatform] = useState<'all' | 'instagram' | 'tiktok'>('all');
  const [sortField, setSortField] = useState<SortField>('DATE');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [page, setPage] = useState(0);

  const filter = {
    platform: platform === 'all' ? undefined : platform === 'instagram' ? 'INSTAGRAM' as const : 'TIKTOK' as const,
    sortField,
    sortOrder,
    limit: PAGE_SIZE + 1,
    offset: page * PAGE_SIZE,
  };

  const { data: postsData, loading, error } = useGetPostsQuery(filter);
  const { data: blacklistData } = useGetCommentBlackListsQuery();

  if (loading) return <div className="flex justify-center py-20 text-gray-500">Loading insights...</div>;
  if (error) return <div className="flex justify-center py-20 text-red-500">Error: {error.message}</div>;

  const allPosts = postsData?.posts || [];
  const hasNextPage = allPosts.length > PAGE_SIZE;
  const posts = allPosts.slice(0, PAGE_SIZE);

  const blacklists = blacklistData?.commentBlackLists || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Insight</h1>
          <p className="text-gray-600">Analyze performance and sentiment for each post.</p>
        </div>
        <div className="flex items-center gap-4">
          <PlatformSwitcher selected={platform} onChange={setPlatform} />
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as SortField)}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
          >
            <option value="DATE">Date</option>
            <option value="LIKE">Like</option>
            <option value="VIEW">View</option>
            <option value="SENTIMENT">Sentiment</option>
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
        <SearchableSection title="Content Posts" className="flex-1">
          {posts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">No content yet.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {posts.map(post => (
                  <InsightCard key={post.id} post={post} />
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t pt-4">
                <p className="text-sm text-gray-600">
                  Page {page + 1}
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
        </SearchableSection>
        <SearchableSection title="Blacklist Keywords" className="w-full lg:w-80">
          <BlacklistPanel blacklists={blacklists} />
        </SearchableSection>
      </div>

      <NoSearchResults />
    </div>
  );
}