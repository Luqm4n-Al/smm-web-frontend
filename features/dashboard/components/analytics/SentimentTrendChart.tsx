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

//Dummy data untuk sentiment harian
const data = [
  { day: 'Mon', positive: 65, neutral: 20, negative: 15 },
  { day: 'Tue', positive: 68, neutral: 18, negative: 14 },
  { day: 'Wed', positive: 70, neutral: 15, negative: 15 },
  { day: 'Thu', positive: 67, neutral: 20, negative: 13 },
  { day: 'Fri', positive: 72, neutral: 16, negative: 12 },
  { day: 'Sat', positive: 75, neutral: 15, negative: 10 },
  { day: 'Sun', positive: 70, neutral: 18, negative: 12 },
];

//formatter untuk membuat format persentase
const formatter = (value: unknown): ReactNode => {
  return `${value}%`;
};

export function SentimentTrendChart() {
  return (
    <div>
      <h3 className="mb-2 text-sm font-medium text-gray-700">Sentiment trend</h3>
      <div className="h-40 w-full">
        {/* Recharts container untuk grafik */}
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
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
          <span>Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-gray-400"></span>
          <span>Neutral</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-red-500"></span>
          <span>Negative</span>
        </div>
      </div>
    </div>
  );
}