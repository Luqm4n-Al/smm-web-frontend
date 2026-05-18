// features/dashboard/components/Analytics/GenderChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { FiUsers } from 'react-icons/fi';

interface GenderData {
  gender: string;
  quantity: number;
}

interface GenderChartProps {
  data: GenderData[];
}

// Mapping label & warna untuk setiap gender
const GENDER_DISPLAY: Record<string, { label: string; color: string }> = {
  male: { label: 'Laki-laki', color: '#3b82f6' },   // Biru
  female: { label: 'Perempuan', color: '#ec4899' },   // Pink
  unknown: { label: 'Rahasia', color: '#9ca3af' }, // Abu‑abu
};

// Fallback jika gender tidak dikenali
const DEFAULT_GENDER = { label: 'Lainnya', color: '#6b7280' };

export function GenderChart({ data }: GenderChartProps) {
  // Kondisi tidak ada data
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FiUsers className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">Gender</h2>
        </div>
        <div className="flex h-40 items-center justify-center text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  // Siapkan data untuk chart
  const chartData = data.map((item) => {
    const genderKey = item.gender.toLowerCase();
    const { label, color } = GENDER_DISPLAY[genderKey] || DEFAULT_GENDER;
    return {
      name: label,
      value: item.quantity,
      color,
    };
  });

  // Total semua (termasuk unknown)
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiUsers className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Gender</h2>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={chartData} margin={{ left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14 }}
              width={100}
            />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span>
              {item.name}: {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}