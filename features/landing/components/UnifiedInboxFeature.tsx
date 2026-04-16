interface FeatureSectionProps {
    id: string;
}

export function UnifiedInboxFeature({ id }:FeatureSectionProps) {
    return (
        <section
        id={id}
        className="scroll-mt-20 bg-white py-16 md:py-24"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Satu Inbox untuk <span className="text-blue-600">Semua Percakapan</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Jangan buang waktu bolak-balik aplikasi. Balas komentar Instagram dan TikTok,
                            tanggapi DM, dan pantau mention dari satu dashboard terpadu.
                        </p>
                    </div>
                    <div className="flex-1">
                        <div className="rounded-lg border bg-white p-4 shadow-md">
                            <div className="mb-3 flex items-center gap-2 border-b pb-2">
                                <span className="rounded-full bg-pink-100 px-3 py-1 text-xs font-medium text-pink-800">
                                    Instagram
                                </span>
                                <span className="text-sm text-gray-500">@john_doe</span>
                                <span className="ml-auto text-xs text-gray-400">10 menit lalu</span>
                            </div>
                            <p className="mb-3 text-sm">Postingan keren! Tools apa yang kamu pakai?</p>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Tulis balasan..."
                                    className="flex-1 rounded-full border bg-gray-50 px-3 py-2 text-sm"
                                    disabled
                                />
                                <button className="rounded-full bg-blue-600 p-2 text-white" disabled>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                    </svg>

                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}