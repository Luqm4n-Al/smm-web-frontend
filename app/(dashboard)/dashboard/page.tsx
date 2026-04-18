import { StatGrid } from '@/features/dashboard/components/stats/StatGrid';
import { GrowthLineChart } from '@/features/dashboard/components/charts/GrowthLineChart';
import { dummyStats, dummyGrowthData } from '@/lib/dummyData';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Pantau performa akun media sosial Anda.</p>
      </div>

      <StatGrid
        followers={dummyStats.followers}
        likes={dummyStats.likes}
        views={dummyStats.views}
        changes={dummyStats.changes}
      />

      <GrowthLineChart
        data={dummyGrowthData}
        title="Pertumbuhan Followers 30 Hari Terakhir"
        dataKey="followers"
        color="#2563eb"
      />
    </div>
  );
}