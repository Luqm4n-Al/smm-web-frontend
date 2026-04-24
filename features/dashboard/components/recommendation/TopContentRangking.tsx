'use client'

import { FiTrendingUp } from "react-icons/fi"

interface ContentRank {
    id: string;
    title: string;
    engagement: number;
    platform: 'instagram' | 'tiktok';
}

const dummyRanks: ContentRank[] = [
    {id: '1', title: 'Tips Karir Viral', engagement: 12400, platform: 'instagram'},
    {id: '2', title: 'Tutotrial Produk', engagement: 11500, platform: 'instagram'},
    {id: '3', title: 'Behind The Scene', engagement: 8500, platform: 'tiktok'},
]

export function TopContentRangking() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <FiTrendingUp className="h-5 w-5 text-blue-600"/>
                <h3 className="text-lg font-medium text-gray-900">Rangking Konten</h3>
            </div>
            <div className="space-y-3">
                {dummyRanks.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                        <div className="flex items-center gap-3">
                            <span className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold 
                                ${
                                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                                    index === 1 ? 'bg-gray-200 text-gray-700' :
                                    'bg-orange-100 text-orange-800'
                                }
                            `}>
                                {index + 1}
                            </span>
                            <div>
                                <p className="font-medium text-gray-900">{item.title}</p>
                                <p className="text-xs text-gray-500">{item.platform}</p>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                            {item.engagement.toLocaleString()}
                            <span className="text-xs font-normal text-gray-500">
                                imp.
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}