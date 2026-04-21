// features/dashboard/components/Analytics/AgePieChart.tsx
'use client';

//recharts untuk PieChart
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ReactNode } from 'react';

//interface untuk Labeling charts nya
interface LabelProps {
  cx?: number;
  cy?: number;
  midAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  percent?: number;
}

//Data dummy untuk usia
const data = [
  { name: '18-24', value: 35, color: '#3b82f6' },
  { name: '25-34', value: 40, color: '#10b981' },
  { name: '35-44', value: 15, color: '#f59e0b' },
  { name: '45+', value: 10, color: '#ef4444' },
];

// Konstanta untuk mengubah derajat menjadi radian
// Karena fungsi Math.cos dan Math.sin menggunakan satuan radian
const RADIAN = Math.PI / 180;

// Fungsi untuk membuat label custom pada chart (biasanya pie chart)
// Menggunakan tipe LabelProps dan mengembalikan ReactNode (elemen JSX)
const renderCustomizedLabel = ({
  cx = 0,           // koordinat tengah X dari chart
  cy = 0,           // koordinat tengah Y dari chart
  midAngle = 0,     // sudut tengah dari slice (dalam derajat)
  innerRadius = 0,  // radius bagian dalam (untuk donut chart)
  outerRadius = 0,  // radius bagian luar
  percent = 0,      // persentase data dari slice tersebut
}: LabelProps): ReactNode => {

  // Menentukan posisi radius di tengah antara inner dan outer
  // Agar label muncul di tengah slice
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  // Menghitung posisi X label
  // cos digunakan untuk menentukan posisi horizontal
  // midAngle dikonversi ke radian dan dibalik (-) karena sistem koordinat SVG
  const x = cx + radius * Math.cos(-midAngle * RADIAN);

  // Menghitung posisi Y label
  // sin digunakan untuk menentukan posisi vertikal
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Mengembalikan elemen text SVG sebagai label
  return (
    <text
      x={x} // posisi horizontal label
      y={y} // posisi vertikal label
      fill="white" // warna teks
      textAnchor={x > cx ? 'start' : 'end'} 
      // jika posisi label di kanan tengah → align kiri (start)
      // jika di kiri tengah → align kanan (end)

      dominantBaseline="central" // posisi vertikal teks agar center
      fontSize={12} // ukuran font
      fontWeight={500} // ketebalan font
    >
      {/* Menampilkan persentase (dibulatkan tanpa desimal) */}
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function AgePieChart() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-medium text-gray-900">Usia Audiens</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value}%`} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}