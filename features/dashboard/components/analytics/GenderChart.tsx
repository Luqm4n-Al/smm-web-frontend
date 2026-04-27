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

export function GenderChart({ data }: GenderChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <FiUsers className="h-5 w-5 text-gray-400" />
          <h2 className="text-lg font-medium text-gray-900">Gender</h2>
        </div>
        <div className="flex h-40 items-center justify-center text-gray-500">Belum ada data</div>
      </div>
    );
  }

  const genderMap: Record<string, string> = {
    'male': 'Laki-laki',
    'female': 'Perempuan',
  };

  const chartData = data.map(item => ({
    name: genderMap[item.gender.toLowerCase()] || item.gender,
    value: item.quantity,
    color: item.gender.toLowerCase() === 'male' ? '#3b82f6' : '#ec4899',
  }));

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
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 14 }} width={80} />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex justify-around text-sm">
        {chartData.map(item => (
          <div key={item.name} className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
            <span>{item.name}: {total > 0 ? Math.round((item.value / total) * 100) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}