import { SentimentSection } from '@/features/dashboard/components/analytics/SentimentSection';
import { AgePieChart } from '@/features/dashboard/components/analytics/AgePieChart';
import { GenderChart } from '@/features/dashboard/components/analytics/GenderChart';
import { GeoMap } from '@/features/dashboard/components/analytics/GeoMap';

export default function AnalyticPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Analisis sentimen dan demografi audiens.</p>
      </div>

      {/* Grid 2 kolom */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Kolom Kiri: Sentiment Analysis */}
        <SentimentSection />

        {/* Kolom Kanan: Demografi */}
        <div className="space-y-6">
          <AgePieChart />
          <GenderChart />
        </div>
      </div>

      <GeoMap />
    </div>
  );
}