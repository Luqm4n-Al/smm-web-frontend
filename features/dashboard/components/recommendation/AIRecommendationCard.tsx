'use client';

import { FiCpu } from 'react-icons/fi';

const recommendations = [
  'Focus on short-form video content (Reels/TikTok) as engagement increased 42% this week.',
  'Use a casual and humorous tone — sentiment analysis shows your audience responds positively.',
  'Post on Wednesday and Thursday between 4:00 PM – 6:00 PM for maximum reach.',
];

export function AIRecommendationCard() {
  return (
    <div className="rounded-lg border bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FiCpu className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium text-gray-900">Smart Recommendations</h3>
        <span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">AI</span>
      </div>
      <ul className="space-y-4">
        {recommendations.map((rec, idx) => (
          <li key={idx} className="flex gap-3">
            <span className="mt-1 block h-2 w-2 rounded-full bg-blue-500" />
            <p className="text-sm text-gray-700">{rec}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}