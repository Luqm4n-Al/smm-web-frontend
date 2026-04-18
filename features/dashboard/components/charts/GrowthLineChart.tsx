// src/features/dashboard/components/Charts/GrowthLineChart.tsx
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { FiTrendingUp } from 'react-icons/fi';

interface DataPoint {
  date: string;
  followers: number;
  likes?: number;
  views?: number;
}

interface GrowthLineChartProps {
  data: DataPoint[];
  title?: string;
  dataKey?: 'followers' | 'likes' | 'views';
  color?: string;
}

export function GrowthLineChart({
  data,
  title = 'Pertumbuhan Followers',
  dataKey = 'followers',
  color = '#2563eb',
}: GrowthLineChartProps) {
  // Jika data kosong, tampilkan placeholder
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
          <FiTrendingUp className="h-5 w-5 text-gray-400" />
          {title}
        </h3>
        <div className="flex h-64 w-full items-center justify-center rounded bg-gray-50">
          <p className="text-gray-500">Belum ada data untuk ditampilkan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
        <FiTrendingUp className="h-5 w-5 text-gray-400" />
        {title}
      </h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              axisLine={{ stroke: '#d1d5db' }}
              tickLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value: any, name: any) => {
                if (typeof value === 'number') {
                  return [value.toLocaleString(), name];
                }
                return [value ?? '', name];
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 6, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}