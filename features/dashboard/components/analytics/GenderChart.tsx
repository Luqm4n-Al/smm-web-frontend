'use client';

//Component Grafik Bar/Batang dari recharts
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';

//Component icon
import { FiUsers } from 'react-icons/fi';

//Dummy data untuk gender
const data = [
  { name: 'Laki-laki', value: 48, color: '#3b82f6' },
  { name: 'Perempuan', value: 52, color: '#ec4899' },
];

export function GenderChart() {
  return (
    //Container
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <FiUsers className="h-5 w-5 text-gray-400" />
        <h2 className="text-lg font-medium text-gray-900">Gender</h2>
      </div>

      {/* Bagian Chart atau grafik */}
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          {/* Grafik Batang */}
          <BarChart layout="vertical" data={data} margin={{ left: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 14, fill: '#374151' }}
              width={80}
            />
            <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
              {/* Memberikan Warna untuk tiap bar nya */}
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

      </div>
      {/* Legend untuk grafik */}
      <div className="mt-4 flex justify-around text-sm">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">

            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>

            <span>
              {item.name}: {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}