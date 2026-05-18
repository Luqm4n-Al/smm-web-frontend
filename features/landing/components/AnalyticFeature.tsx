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
                            Track & Analyze Your <span className="text-blue-600">Social Media</span> Performance
                        </h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Automatically collect and analyze your account performance data to understand audience behavior and content effectiveness.
                        </p>
                    </div>
                    <div className="flex-1 rounded-lg bg-linear-to-br from-blue-50 to-blue-100 p-6">
                      {/* Analytics Dashboard Preview */}
                      <div className="rounded-lg bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between border-b pb-3">
                          <span className="text-sm font-medium text-gray-700">Performance Overview</span>
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">+18.2%</span>
                        </div>
                        <div className="mt-4 space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Total Reach</span>
                            <span className="font-medium">48,230</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-4/5 rounded-full bg-blue-500" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Engagement Rate</span>
                            <span className="font-medium">5.7%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-3/5 rounded-full bg-green-500" />
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Content Views</span>
                            <span className="font-medium">124,800</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 w-3/4 rounded-full bg-purple-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </section>
    )
}