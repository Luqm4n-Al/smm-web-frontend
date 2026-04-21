'use client'

//Component React icons
import { FiInfo } from "react-icons/fi"
import { SentimentTrendChart } from "./SentimentTrendChart";

//Dummy Data
const sentimentData = {
    overallScore: 0.56,
    positive: { percent: 68, count: 847 },
    neutral: { percent: 20, count: 245},
    negative: { percent: 12, count: 155},
    lastUpdated: '10 menit yang lalu'
}


export function SentimentSection() {
    //Fungsi untuk menghitung apakah nilai sentiment positif atau negatif
    const getSentimentLabel = (score: number) => {
        if (score >= 0.3) return "Positif";
        if (score <= -0.3) return "Negatif";
        return "Netral";
    };

    //Panggil fungsi getSentimentLabel dengan dari Overall score dari data dummy
    const sentimentLabel = getSentimentLabel(sentimentData.overallScore);

    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium text-gray-900">Sentiment Analysis</h2>
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        Last 7 Days
                    </span>
                </div>
                <FiInfo className="h-5 w-5 text-gray-400" />
            </div>

            {/* Overall Score */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-600">Overall Sentiment</p>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                        {sentimentData.overallScore.toFixed(2)}
                    </span>
                    {/* Polarity Score dengan menampilkan warna sesuai nilai Sentiment Label */}
                    <span className="text-sm text-gray-500">Polarity Score</span>
                    <span
                        className={`ml-auto rounded-full px-3 py-1 text-sm font-medium ${
                            sentimentLabel === 'Positif'
                            ? 'bg-green-100 text-green-800'
                            : sentimentLabel === 'Negatif'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {sentimentLabel}
                    </span>
                </div>
            </div>

            {/* Persentase Sentiment */}
            <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-green-500"></span>
                        <span className="text-sm text-gray-700">Positive</span>
                    </div>
                    <span className="text-sm font-medium">
                        {sentimentData.positive.percent}% ({sentimentData.positive.count} comments)
                    </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${sentimentData.positive.percent}%` }}
                        />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-gray-400"></span>
                        <span className="text-sm text-gray-700">Neutral</span>
                    </div>
                    <span className="text-sm font-medium">
                        {sentimentData.neutral.percent}% ({sentimentData.neutral.count} comments)
                    </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                    className="h-2 rounded-full bg-gray-400"
                    style={{ width: `${sentimentData.neutral.percent}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-red-500"></span>
                        <span className="text-sm text-gray-700">Negative</span>
                    </div>
                    <span className="text-sm font-medium">
                        {sentimentData.negative.percent}% ({sentimentData.negative.count} comments)
                    </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                    <div
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${sentimentData.neutral.percent}%` }}
                    />
                </div>

                {/* Sentiment Trend Chart */}
                <SentimentTrendChart />

                {/* Timestamp */}
                <p className="mt-4 text-right text-xs text-gray-500">
                    Updated {sentimentData.lastUpdated}
                </p>
            </div>
        </div>
    )
}