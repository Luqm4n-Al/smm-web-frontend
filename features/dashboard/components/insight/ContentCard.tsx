// features/dashboard/components/insight/ContentCard.tsx

'use client'

import Image from "next/image";
import { FiHeart, FiMessageCircle } from "react-icons/fi";
import { SentimentBadge } from "./SentimentBadge";

interface ContentCardProps {
    id: string;
    thumbnail: string;
    caption: string;
    date: string;
    likes: number;
    comments: number;
    sentiment: {
        type: 'positive' | 'neutral' | 'negative';
        score: number;
    };
    onClick?: () => void;
}

export function ContentCard({
    thumbnail,
    caption,
    date,
    likes,
    comments,
    sentiment,
    onClick,
}: ContentCardProps) {
    return (
        <div 
        onClick={onClick}
        className="cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            {/* Thumbnail */}
            <div className="relative aspect-square w-full bg-gray-100">
                {/* Placeholder Image */}
                <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-gray-200 to-gray-300">
                    <span className="text-2xl">HP</span>
                </div>
                {/* Jika pakai next/image:
                    <Image src={thumbnail} alt={caption} fill className="object-cover" />
                */}
            </div>

            {/* Info */}
            <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">{caption}</p>
                <p className="mt-1 text-xs text-gray-500">{date}</p>

                {/* Stats */}
                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiHeart className="h-3.5 w-3.5"/>
                            {likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiMessageCircle className="h-3.5 w-3.5"/>
                            {comments.toLocaleString()}
                        </span>
                    </div>
                    <SentimentBadge sentiment={sentiment.type} score={sentiment.score}/>
                </div>
            </div>
        </div>
    )
}