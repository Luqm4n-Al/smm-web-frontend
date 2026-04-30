'use client'

import { FiHeart, FiEye } from "react-icons/fi"
import type { PostAnalytics } from "../../graphql/insight.types"

interface InsightCardProps {
    post: PostAnalytics;
}

const platformColors = {
    INSTAGRAM: 'bg-gradient-to-r from-purple-500 to-pink-500',
    TIKTOK: 'bg-black'
}

export function InsightCard({post}: InsightCardProps) {
    const sentimentColor = post.avgSentiment > 0 ? 'text-green-600' : post.avgSentiment < 0 ? 'text-red-600' : 'text-gray-500';
    const sentimentLabel = post.avgSentiment > 0.1 ? 'Positif' : post.avgSentiment < -0.1 ? 'Negatif' : 'Netral';

    return (
        <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
                {post.fileUrl ? (
                    <img src={post.fileUrl} alt={post.caption}  className="w-full h-full object-cover"/>

                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )
                }
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-medium text-white ${platformColors[post.platform]}`}>
                    {post.platform === 'INSTAGRAM' ? 'IG' : 'TK' }
                </span>
            </div>

            <div className="p-3">
                <p className="text-sm font-medium text-gray-900 line-clamp-2">{post.caption}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(post.createdAt).toLocaleDateString('id-ID')}</p>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiHeart className="w-3.5 h-3.5"/> {post.likeCount.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                            <FiEye className="w-3.5 h-3.5"/> {post.viewCount.toLocaleString()}
                        </span>
                    </div>
                    <span className={`text-xs font-medium ${sentimentColor}`}>
                        {sentimentLabel} ({post.avgSentiment.toFixed(2)})
                    </span>
                </div>
            </div>
        </div>
    )
}