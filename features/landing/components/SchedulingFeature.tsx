interface FeatureSectionProps {
    id: string
}

export function SchedulingFeature({id}: FeatureSectionProps) {
    return (
        <section
        id={id}
        className="scroll-mt-20 py-16 md:py-24"
        >
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center gap-8 md:flex-row-reverse">
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold text-gray-900">
                            Schedule Your Content with <span className="text-blue-600">Ease & Precision</span>
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Manage your Instagram and TikTok content calendar effortlessly.
                            Set the best time to post and let the system handle the publishing for you.
                        </p>
                    </div>
                    <div className="flex-1 rounded-lg bg-blue-50 p-8 text-center">
                        {/* Calendar Preview */}
                        <div className="mb-2 flex justify-between text-sm font-medium text-gray-500">
                            <span>November 2026</span>
                            <span>← →</span>
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-xs">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                                <div key={d} className="p-1 text-center font-medium">
                                {d}
                                </div>
                            ))}
                            {Array.from({length:30}, (_, i) => (
                                <div
                                    key={i}
                                    className={`rounded p-1 text-center ${i === 14 ? 'bg-blue-100 font-bold text-blue-800' : ''}`}
                                >
                                    {i + 1}
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-left text-sm">
                            <div className="flex items-center gap-2 border-l-4 border-blue-500 bg-gray-50 p-2">
                                <span></span>
                                <span>Career Tips - 09:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}