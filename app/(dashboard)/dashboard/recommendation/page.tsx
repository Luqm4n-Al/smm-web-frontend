import { AIRecommendationCard } from "@/features/dashboard/components/recommendation/AIRecommendationCard";
import { BestTimeWidget } from "@/features/dashboard/components/recommendation/BestTimeWidget";
import { HashtagCloud } from "@/features/dashboard/components/recommendation/HashtagCloud";
import { TopContentRangking } from "@/features/dashboard/components/recommendation/TopContentRangking";


export default function RecommendationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Recommendation</h1>
                <p className="text-gray-600">Saran cerdas untuk optimasi konten dan pertumbuhan akun.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 ">
                {/* Kolom Kiri */}
                <div className="space-y-6 lg:col-span-1">
                    <TopContentRangking />
                    <BestTimeWidget />
                </div>

                {/* Kolom Kanan */}
                <div className="space-y-6 lg:col-span-2">
                    <HashtagCloud />
                    <AIRecommendationCard />
                </div>
            </div>
        </div>
    )
}