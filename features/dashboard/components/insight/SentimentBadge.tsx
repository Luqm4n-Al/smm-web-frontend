// features/dashboard/components/insight/SentimentBadge.tsx

interface SentimentBadgeProps {
    sentiment: 'positive' | 'neutral' | 'negative';
    score?: number;
}

const styles = {
    positive: 'bg-green-100 text-green-800',
    neutral: 'bg-gray-100 text-gray-800',
    negative: 'bg-red-100 text-red-800',
};

const labels = {
    positive: 'Positif',
    neutral: 'Netral',
    negative: 'Negatif',
}

export function SentimentBadge({ sentiment, score }: SentimentBadgeProps) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
            ${styles[sentiment]}
        `}>
            {labels[sentiment]} {score !== undefined && `(${score}%)`}
        </span>
    )
}