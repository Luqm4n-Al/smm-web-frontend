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
  [key: string]: string | number | undefined; // 🆕 bukan `any`
}

interface LineConfig {
  dataKey: string;
  color: string;
  name?: string;
}

interface GrowthLineChartProps {
  data: DataPoint[];
  title?: string;
  dataKey?: string;
  color?: string;
  lines?: LineConfig[];
}

export function GrowthLineChart({
  data,
  title = 'Pertumbuhan',
  dataKey,
  color = '#2563eb',
  lines,
}: GrowthLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-medium">
          <FiTrendingUp className="h-5 w-5 text-gray-400" />
          {title}
        </h3>
        <div className="flex h-64 w-full items-center justify-center rounded bg-gray-50">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const activeLines = lines || [
    { dataKey: dataKey || 'followers', color, name: dataKey || 'followers' },
  ];

  // ✅ Formatter sesuai tipe Recharts (value bisa undefined)
  const tooltipFormatter = (value: unknown, name: unknown): [string, string] => {
    const formattedValue = typeof value === 'number' ? value.toLocaleString() : String(value ?? '');
    const formattedName = typeof name === 'string' ? name : String(name ?? '');
    return [formattedValue, formattedName];
  };

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
              tickFormatter={(value: number) => value.toLocaleString()}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              formatter={tooltipFormatter}
            />
            {activeLines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 3, fill: line.color }}
                activeDot={{ r: 6, fill: line.color }}
                name={line.name || line.dataKey}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {activeLines.length > 1 && (
        <div className="mt-4 flex justify-center gap-4 text-xs text-gray-600">
          {activeLines.map((line) => (
            <div key={line.dataKey} className="flex items-center gap-1.5">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: line.color }}
              />
              <span>{line.name || line.dataKey}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}