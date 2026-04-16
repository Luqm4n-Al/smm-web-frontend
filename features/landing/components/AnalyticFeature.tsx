interface FeatureSectionProps {
    id: string;
}

export function AnalyticFeature({id}: FeatureSectionProps) {
    return (
        <section
        id={id}
        className="scroll-mt-20 py-16 md:py-24"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Pantau statistik media sosial Anda untuk meningkatkan performa media sosial
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Melakukan pengumpulan dan analisis data performa akun media sosial secara berkala untuk memahami perilaku audiens dan efektivitas konten.
                        </p>
                    </div>
                    <div className="flex-1 rounded-lg bg-gray-200 p-8 text-center">
                    { /* Buat Gambar */}
                    <div className="h-48 w-full bg-gray-300 flex items-center justify-center rounded"></div>
                    <span>Ilustrasi 1</span>
                    </div>
                </div>
            </div>
        </section>
    )
}