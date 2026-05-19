'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    FiGrid,
    FiUsers,
} from "react-icons/fi"

/**
 * Menu Sidebar Admin
 */
const navItems = [
    {
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: FiGrid,
    },

    {
        label: 'User Management',
        href: '/admin/user-management',
        icon: FiUsers,
    },
]

export function SidebarNav() {

    const pathname = usePathname()

    return (
        <nav className="flex-1 overflow-y-auto p-4">

            <ul className="space-y-1">

                {navItems.map((item) => {

                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + '/')

                    const IconComponent = item.icon

                    return (
                        <li key={item.href}>

                            <Link
                                href={item.href}
                                className={`
                                    flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                                    ${
                                        isActive
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }
                                `}
                            >
                                <IconComponent className="h-5 w-5" />

                                {item.label}
                            </Link>

                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}