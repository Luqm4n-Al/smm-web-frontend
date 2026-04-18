'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FiSettings } from "react-icons/fi"

export function SidebarFooter() {
    const pathname = usePathname()
    const isActive = pathname === '/dashboard/setting';

    return (
        <div className="border-t p-4">
            <Link
            href="/dashboard/setting"
            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                    isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-700'
                }`}
            >
                <FiSettings className="h-5 w-5"/>
                Settings
            </Link>
        </div>
    )
}