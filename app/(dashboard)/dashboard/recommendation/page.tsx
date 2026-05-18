//app/(dashboard)/dashboard/recommendation/page.tsx
import { AIRecommendationCard } from "@/features/dashboard/components/recommendation/AIRecommendationCard";
import { BestTimeWidget } from "@/features/dashboard/components/recommendation/BestTimeWidget";
import { HashtagCloud } from "@/features/dashboard/components/recommendation/HashtagCloud";
import { TopContentRanking } from "@/features/dashboard/components/recommendation/TopContentRangking";
import { SearchableSection } from "@/features/dashboard/components/SearchableSection";
import { NoSearchResults } from "@/features/dashboard/components/NoSearchResults";


export default function RecommendationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommendation</h1>
                <p className="text-gray-600">Smart suggestions to optimize your content and grow your account.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 ">
                {/* Left Column */}
                <div className="space-y-6 lg:col-span-1">
                    <SearchableSection title="Content Ranking">
                        <TopContentRanking />
                    </SearchableSection>
                    <SearchableSection title="Best Time to Post">
                        <BestTimeWidget />
                    </SearchableSection>
                </div>

                {/* Right Column */}
                <div className="space-y-6 lg:col-span-2">
                    <SearchableSection title="Hashtag Recommendation">
                        <HashtagCloud />
                    </SearchableSection>
                    <SearchableSection title="Smart Recommendations">
                        <AIRecommendationCard />
                    </SearchableSection>
                </div>
            </div>

            <NoSearchResults />
        </div>
    )
}