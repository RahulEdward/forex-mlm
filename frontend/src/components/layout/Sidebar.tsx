'use client'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Users, Settings, Shield, LogOut, LayoutDashboard, Database, Link as LinkIcon, Network, Share2, DollarSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: 'super_admin' | 'user'
    collapsed?: boolean
}

export function Sidebar({ className, role = 'super_admin', collapsed = false }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.clear()
        router.push('/')
    }

    const menuItems = role === 'super_admin' ? [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/super-admin' },
        { label: 'Network Hierarchy', icon: Share2, href: '/dashboard/super-admin/network' },
        { label: 'Distributions', icon: DollarSign, href: '/dashboard/super-admin/distributions' },
        { label: 'Users', icon: Users, href: '/dashboard/super-admin' }, // Keeping as placeholder or quick link
        { label: 'Database', icon: Database, href: '#' },
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/user' },
        { label: 'My Team', icon: Network, href: '/dashboard/user/network' },
        { label: 'Earnings', icon: BarChart3, href: '/dashboard/user/earnings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/user/settings' }
    ]

    return (
        <div className={cn("pb-12 h-screen border-r bg-background hidden md:block fixed left-0 top-0 bottom-0 z-40 transition-all duration-300", collapsed ? "w-20" : "w-72", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className={cn("mb-2 px-4 text-lg font-semibold tracking-tight text-primary flex items-center gap-2", collapsed && "justify-center px-0")}>
                        <Shield className="h-6 w-6" />
                        {!collapsed && "AuthShield"}
                    </h2>
                    <div className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Button
                                    key={item.label}
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                                        collapsed && "justify-center px-2"
                                    )}
                                    title={collapsed ? item.label : undefined}
                                    onClick={() => router.push(item.href)}
                                >
                                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-2")} />
                                    {!collapsed && item.label}
                                </Button>
                            )
                        })}
                    </div>
                </div>

                <div className="px-3 py-2">
                    {!collapsed && (
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            Settings
                        </h2>
                    )}
                    <div className="space-y-1">
                        <Button variant="ghost" className={cn("w-full justify-start", collapsed && "justify-center px-2")} onClick={handleLogout} title={collapsed ? "Logout" : undefined}>
                            <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
                            {!collapsed && "Logout"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
