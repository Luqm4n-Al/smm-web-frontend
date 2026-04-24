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
                    16:00 - 20:00
                </p>
                <p className="mt-1 text-sm text-gray-600">
                    Waktu Indonesia Barat (WIB)
                </p>
                <div className="mt-4 flex justify-center gap-1">
                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
                        <div key={day} className="flex flex-col items-center">
                            <span className="text-xs text-gray-500">{day}</span>
                            <div className={`mt-1 h-16 w-6 rounded-sm ${['Sel', 'Rab', 'Kam'].includes(day) ? 'bg-green-200' : 'bg-gray-100'}`}/>
                        </div>
                    ))}
                </div>
                <p className="mt-2 text-xs text-gray-500">Berdasarkan engagement 30 hari terakhir</p>
            </div>
        </div>
    )
}