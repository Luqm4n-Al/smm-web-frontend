'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    FiGrid,
    FiBarChart2,
    FiCalendar,
    FiFolder,
    FiInbox,
} from 'react-icons/fi'

const navItems = [
    {label: 'Dashboard', href: '/dashboard', icon: FiGrid},
    {label: 'Analytic', href: '/dashboard/analytics', icon: FiBarChart2},
    {label: 'Schedule', href: '/dashboard/schedule', icon: FiCalendar},
    {label: 'Library', href: '/dashboard/library', icon: FiFolder},
    {label: 'Inbox', href: '/dashboard/inbox', icon: FiInbox},

];

export function SidebarNav() {
    const pathname = usePathname()

    return (
        <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const IconComponent = item.icon;
                    return (
                        <li key={item.href}>
                            <Link 
                            href={item.href}
                            className={` flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors
                                ${
                                    isActive
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
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