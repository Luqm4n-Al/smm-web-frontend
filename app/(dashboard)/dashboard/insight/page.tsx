import { BlacklistPanel } from "@/features/dashboard/components/insight/BlacklistPanel";
import { ContentGrid } from "@/features/dashboard/components/insight/ContentGrid";


export default function InsightPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Insight Konten</h1>
                <p className="text-gray-600">Analisis performa dan sentimen setiap konten.</p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Kontent utama - Grid */}
                <div className="flex-1">
                    <ContentGrid />
                </div>

                {/* Sidebar Kanan - Blacklist */}
                <div className="w-full lg:w-80">
                    <BlacklistPanel/>
                </div>
            </div>
        </div>
    );
}