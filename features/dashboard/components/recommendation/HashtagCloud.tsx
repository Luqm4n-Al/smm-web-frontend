'use client'

import { FiHash } from "react-icons/fi"

const hashtags = [
    '#TipsMarketing',
    '#UMKMNaikKelas',
    '#KontenKreator',
    '#SMMTips',
    '#DigitalMarketing',
    '#GrowthHacking',
];

export function HashtagCloud() {
    return (
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <FiHash className="h-5 w-5 text-purple-600"/>
                <h3 className="text-lg font-medium text-gray-900">Hashtag Recommendation</h3>
            </div>
            <div className="flex flex-wrap gap-2">
                {hashtags.map((tag) => (
                    <span key={tag} className="cursor-pointer rounded-full bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700 hover:bg-purple-100">
                        {tag}
                    </span>
                ))}
            </div>
            <p className="mt-4 text-xs text-gray-500">Hashtag ini meningkatkan reach hingga 35%</p>
        </div>
    )
}