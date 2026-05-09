// features/landing/components/InsightFeature.tsx
interface FeatureSectionProps {
  id: string;
}

export function InsightFeature({ id }: FeatureSectionProps) {
  return (
    <section id={id} className="scroll-mt-20 bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-900">
              Analisis <span className="text-blue-600">Setiap Konten</span>
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Lihat performa setiap postinganmu, dari likes hingga sentimen audiens. Filter kata-kata tertentu
              untuk menjaga kualitas komunikasi dengan followers.
            </p>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 h-20 w-full rounded bg-linear-to-br from-blue-100 to-blue-200" />
                <p className="text-sm font-medium">Review Produk</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">❤️ 240</span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">Positif</span>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow">
                <div className="mb-2 h-20 w-full rounded bg-linear-to-br from-purple-100 to-purple-200" />
                <p className="text-sm font-medium">Promo Lebaran</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-gray-500">💬 56</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-700">Negatif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}