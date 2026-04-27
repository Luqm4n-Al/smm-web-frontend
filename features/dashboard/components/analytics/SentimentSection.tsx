'use client';

import { FiInfo } from 'react-icons/fi';
import { SentimentTrendChart } from './SentimentTrendChart';

interface SentimentSectionProps {
  positive: number;
  neutral: number;
  negative: number;
}

export function SentimentSection({ positive, neutral, negative }: SentimentSectionProps) {
  const total = positive + neutral + negative;
  const score = total > 0 ? (positive - negative) / total : 0;
  const positivePercent = total > 0 ? Math.round((positive / total) * 100) : 0;
  const neutralPercent = total > 0 ? Math.round((neutral / total) * 100) : 0;
  const negativePercent = total > 0 ? Math.round((negative / total) * 100) : 0;

  const getSentimentLabel = (score: number) => {
    if (score >= 0.1) return 'Positif';
    if (score <= -0.1) return 'Negatif';
    return 'Netral';
  };

  const sentimentLabel = getSentimentLabel(score);

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium text-gray-900">Sentiment Analysis</h2>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">Last 7 Days</span>
        </div>
        <FiInfo className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-sm text-gray-600">Overall Sentiment</p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{score.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Polarity Score</span>
          <span className={`ml-auto rounded-full px-3 py-1 text-sm font-medium ${
            sentimentLabel === 'Positif' ? 'bg-green-100 text-green-800' :
            sentimentLabel === 'Negatif' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>{sentimentLabel}</span>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-green-500"></span><span className="text-sm text-gray-700">Positive</span></div>
          <span className="text-sm font-medium">{positivePercent}% ({positive} comments)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-green-500" style={{ width: `${positivePercent}%` }} /></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-gray-500"></span><span className="text-sm text-gray-700">Neutral</span></div>
          <span className="text-sm font-medium">{neutralPercent}% ({neutral} comments)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-gray-500" style={{ width: `${neutralPercent}%` }} /></div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500"></span><span className="text-sm text-gray-700">Negative</span></div>
          <span className="text-sm font-medium">{negativePercent}% ({negative} comments)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-200"><div className="h-2 rounded-full bg-red-500" style={{ width: `${negativePercent}%` }} /></div>
      </div>

      <SentimentTrendChart />
    </div>
  );
}