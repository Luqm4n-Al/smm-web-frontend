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
              Smart <span className="text-blue-600">Recommendations</span> for You
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Get the best time to post, trending hashtags, and next content ideas
              based on your account performance.
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
                  <p className="text-sm text-gray-500">Wed & Thu, 4:00 PM – 6:00 PM</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🔹</span>
                  <p className="text-sm text-gray-700">Use hashtag <span className="font-medium">#MarketingTips</span> – reach +35%</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">🔹</span>
                  <p className="text-sm text-gray-700">Short-form video content is trending this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}