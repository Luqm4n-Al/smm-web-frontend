'use client'

import { FiClock } from "react-icons/fi"

export function BestTimeWidget() {
    return(
        <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
                <FiClock className="h-5 w-5 text-green-600"/>
                <h3 className="text-lg font-medium text-gray-900">Best Time to Post</h3>
            </div>
            <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">
                    4:00 PM - 8:00 PM
                </p>
                <p className="mt-1 text-sm text-gray-600">
                    Western Indonesia Time (WIB)
                </p>
                <div className="mt-4 flex justify-center gap-1">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-xs text-gray-500">{day}</span>
                            <div className={`mt-1 h-16 w-6 rounded-sm ${['Tue', 'Wed', 'Thu'].includes(day) ? 'bg-green-200' : 'bg-gray-100'}`}/>
                        </div>
                    ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Based on engagement over the last 30 days</p>
            </div>
        </div>
    )
}