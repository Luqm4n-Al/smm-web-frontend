// /features/dashboard/components/Analytics/SentimentTrendChart.tsx
'use client';

//Component Recharts untuk membuat grafik
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ReactNode } from 'react';

interface SentimentTrendChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

//formatter untuk membuat format persentase
const formatter = (value: unknown): ReactNode => {
  return `${value}%`;
};

export function SentimentTrendChart({ positive, neutral, negative }: SentimentTrendChartProps) {
  const total = positive + neutral + negative;

  // Hitung persentase dari data real
  const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

  // Data untuk chart — distribusi sentiment berdasarkan data real API
  const data = [
    { label: 'Sentiment', positive: positivePercent, neutral: neutralPercent, negative: negativePercent },
  ];

  // Jika tidak ada data sama sekali
  if (total === 0) {
    return (
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Sentiment distribution</h3>
        <div className="flex h-40 items-center justify-center text-sm text-gray-400">
          Belum ada data sentimen
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-gray-700">Sentiment distribution</h3>
      <div className="h-40 w-full">
        {/* Recharts container untuk grafik */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
              formatter={formatter}
            />
            <Area
              type="monotone"
              dataKey="positive"
              stackId="1"
              stroke="#22c55e"
              fill="#dcfce7"
            />
            <Area
              type="monotone"
              dataKey="neutral"
              stackId="1"
              stroke="#9ca3af"
              fill="#f3f4f6"
            />
            <Area
              type="monotone"
              dataKey="negative"
              stackId="1"
              stroke="#ef4444"
              fill="#fee2e2"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-green-500"></span>
          <span>Positive ({positivePercent}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          <span>Neutral ({neutralPercent}%)</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Negative ({negativePercent}%)</span>
        </div>
      </div>
    </div>
  );
}