'use client'

import Link from "next/link"
import { SidebarNav } from "./SidebarNav"
import { SidebarFooter } from "./SidebarFooter"


export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-white">
            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b px-4">
                <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold">
                    <span className="text-2xl">🚀</span>
                    <span>SMM Panel</span>
                </Link>
            </div>
            <SidebarNav/>
            <SidebarFooter/>
        </aside>
    )
}