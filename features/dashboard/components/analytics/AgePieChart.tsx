// features/dashboard/components/Analytics/AgePieChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

interface AgeData {
  age: string;
  quantity: number;
}

interface AgePieChartProps {
  data: AgeData[];
}

const UNKNOWN_LABEL = 'Unknown';

/**
 * Formatter untuk Tooltip Recharts yang kompatibel dengan tipe bawaan.
 * Menerima value yang mungkin undefined/null dan mengembalikan string aman.
 */
function tooltipFormatter(value: unknown): string {
  if (value === undefined || value === null) return '0';
  if (typeof value === 'number') return value.toLocaleString('id-ID');
  return String(value);
}

export function AgePieChart({ data }: AgePieChartProps) {
  // Handling data kosong
  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Audience Age</h2>
        <div className="flex h-64 items-center justify-center text-gray-500">No data available</div>
      </div>
    );
  }

  // Pisahkan data "unknown"
  const unknownData = data.find(d => d.age.toLowerCase() === 'unknown');
  const knownData = data.filter(d => d.age.toLowerCase() !== 'unknown');

  const totalKnown = knownData.reduce((sum, d) => sum + d.quantity, 0);
  const unknownQuantity = unknownData?.quantity || 0;
  const totalAll = totalKnown + unknownQuantity;
  const unknownPercent = totalAll > 0 ? Math.round((unknownQuantity / totalAll) * 100) : 0;

  // Warna
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const chartData = knownData.map((item, index) => ({
    name: item.age,
    value: item.quantity,
    color: colors[index % colors.length],
  }));

  const RADIAN = Math.PI / 180;

  // Label custom (PieLabelRenderProps)
  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    percent = 0,
  }: PieLabelRenderProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={500}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Audiens Age</h2>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-500">
          All audiens age is unknown
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              {/* Formatter */}
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {unknownQuantity > 0 && (
        <div className="mt-4 border-t pt-3 text-center text-sm text-gray-600">
          <span className="font-medium">{UNKNOWN_LABEL}:</span> {unknownQuantity} ({unknownPercent}%)
        </div>
      )}
    </div>
  );
}