// features/landing/components/RecommendationFeature.tsx
interface FeatureSectionProps {
  id: string;
}

export function RecommendationFeature({ id }: FeatureSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">
              Saran <span className="text-blue-600">Pintar</span> untuk Kamu
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Dapatkan rekomendasi waktu terbaik untuk posting, hashtag yang sedang tren, dan ide konten
              berikutnya berdasarkan performa akunmu.
            </p>
          </div>
          <div className="flex-1">
            <div className="rounded-lg bg-white p-6 shadow-lg border">
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  🕐
                </div>
                <div>
                  <p className="font-medium text-gray-900">Best Time to Post</p>
                  <p className="text-sm text-gray-500">Rabu & Kamis, 16:00 – 18:00</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🔹</span>
                  <p className="text-sm text-gray-700">Gunakan hashtag <span className="font-medium">#TipsMarketing</span> – reach +35%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🔹</span>
                  <p className="text-sm text-gray-700">Konten video pendek lebih disukai minggu ini</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}