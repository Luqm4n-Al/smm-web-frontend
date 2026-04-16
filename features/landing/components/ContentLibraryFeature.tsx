interface FeatureSectionProps {
    id: string;
}

export function ContentLibraryFeature({id}: FeatureSectionProps) {
    return (
        <section
            id= {id}
            className="scroll-mt-20 bg-gray-50 py-16 md:py-24"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-8 md:flex-row">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Pustaka Konten <span className="text-blue-600">Anti Ribet</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                        Simpan semua aset visual, caption template, dan grup hashtag favorit Anda. 
                        Cukup pilih, muat ulang, dan posting dalam hitungan detik
                        </p>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="mb-2 h-20 w-full rounded bg-linear-to-br from-purple-100 to-pink-100">

                                </div>
                                <p className="text-xs font-medium">#TipsMarketing</p>
                                <p className="text-xs text-gray-500">Disimpan 2 minggu lalu</p>
                            </div>
                            <div className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="mb-2 h-20 w-full rounded bg-linear-to-br from-blue-100 to-cyan-100">

                                </div>
                                <p className="text-xs font-medium">Caption Promo</p>
                                <p className="text-xs text-gray-500">Di simpan 1 bulan lalu</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}