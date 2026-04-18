// src/features/dashboard/components/Stats/StatsCard.tsx
import { IconType } from 'react-icons';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: IconType;
  trend?: 'up' | 'down' | 'neutral';
}

export function StatCard({ title, value, change, icon: Icon, trend = 'up' }: StatCardProps) {
  const trendColor = 
    trend === 'up' ? 'text-green-600' : 
    trend === 'down' ? 'text-red-600' : 
    'text-gray-500';

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {change && (
        <p className={`mt-2 text-sm ${trendColor}`}>
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change} dari bulan lalu
        </p>
      )}
    </div>
  );
}