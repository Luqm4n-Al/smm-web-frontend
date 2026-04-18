// src/features/dashboard/components/Stats/StatsGrid.tsx
'use client';

import { FiUsers, FiHeart, FiEye } from 'react-icons/fi';
import { StatCard } from './StatCard';

interface StatsGridProps {
  followers?: number;
  likes?: number;
  views?: number;
  changes?: {
    followers?: string;
    likes?: string;
    views?: string;
  };
}

export function StatGrid({ 
  followers = 0, 
  likes = 0, 
  views = 0,
  changes = {} 
}: StatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Followers"
        value={followers}
        change={changes.followers}
        icon={FiUsers}
        trend="up"
      />
      <StatCard
        title="Likes"
        value={likes}
        change={changes.likes}
        icon={FiHeart}
        trend="up"
      />
      <StatCard
        title="Views"
        value={views}
        change={changes.views}
        icon={FiEye}
        trend="up"
      />
    </div>
  );
}