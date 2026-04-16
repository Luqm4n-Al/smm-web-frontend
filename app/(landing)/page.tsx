import { AnalyticFeature } from '@/features/landing/components/AnalyticFeature';
import { ContentLibraryFeature } from '@/features/landing/components/ContentLibraryFeature';
import { HeroSection } from '@/features/landing/components/HeroSection';
import { SchedulingFeature } from '@/features/landing/components/SchedulingFeature';
import { UnifiedInboxFeature } from '@/features/landing/components/UnifiedInboxFeature';

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
      <ContentLibraryFeature
        id="content-library-feature"
      />
      <UnifiedInboxFeature
        id="inbox-feature"
      />
      {/* Nanti tambahkan fitur-fitur di sini */}
    </main>
  );
}