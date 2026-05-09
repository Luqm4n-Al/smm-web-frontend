import { AnalyticFeature } from '@/features/landing/components/AnalyticFeature';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { InsightFeature } from '@/features/landing/components/InsightFeature';
import { RecommendationFeature } from '@/features/landing/components/RecommendationFeature';
import { SchedulingFeature } from '@/features/landing/components/SchedulingFeature';

export default function LandingPage() {
  return (
    <main>
      <HeroSection />
      <AnalyticFeature 
        id="analytic-feature"
      />
      <SchedulingFeature
        id="schedule-feature"
      />
      <InsightFeature
        id="insight-feature"
      />
      <RecommendationFeature
        id='recommendation-feature'
      />
      {/* Nanti tambahkan fitur-fitur di sini */}
    </main>
  );
}