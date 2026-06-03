'use client'

import { SidebarNav } from "./SidebarNav"
import { SidebarFooter } from "./SidebarFooter"
import { Logo } from "@/shared/Logo"

export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r border-black/60 bg-white">

            {/* Logo */}
            <div className="flex h-16 items-center justify-center border-b border-black/60 px-4">
                <Logo variant="full" size={50} priority />
            </div>

            {/* Navigation */}
            <SidebarNav />

            {/* Footer */}
            <SidebarFooter />
        </aside>
    )
}