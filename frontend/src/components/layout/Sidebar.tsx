'use client'
import { usePathname, useRouter } from 'next/navigation'
import { BarChart3, Users, Settings, Shield, LogOut, LayoutDashboard, Database, Link as LinkIcon, Network, Share2, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    role?: 'super_admin' | 'user'
    collapsed?: boolean
    onToggle?: () => void
}

export function Sidebar({ className, role = 'super_admin', collapsed = false, onToggle }: SidebarProps) {
    const router = useRouter()
    const pathname = usePathname()

    const handleLogout = () => {
        localStorage.clear()
        router.push('/')
    }

    const menuItems = role === 'super_admin' ? [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/super-admin' },
        { label: 'Network Hierarchy', icon: Share2, href: '/dashboard/super-admin/network' },
        { label: 'Node Map', icon: Network, href: '/dashboard/super-admin/nodes' },
        { label: 'Distributions', icon: DollarSign, href: '/dashboard/super-admin/distributions' },
        { label: 'Users', icon: Users, href: '/dashboard/super-admin/users' },
        { label: 'Database', icon: Database, href: '#' },
    ] : [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard/user' },
        { label: 'My Team', icon: Network, href: '/dashboard/user/network' },
        { label: 'Earnings', icon: BarChart3, href: '/dashboard/user/earnings' },
        { label: 'Settings', icon: Settings, href: '/dashboard/user/settings' }
    ]

    return (
        <div className={cn("flex flex-col h-screen border-r bg-background hidden md:flex fixed left-0 top-0 bottom-0 z-40 transition-all duration-300", collapsed ? "w-20" : "w-72", className)}>

            {/* Logo Section */}
            <div className="h-16 flex items-center px-6 border-b shrink-0 transition-all">
                <h2 className={cn("text-lg font-semibold tracking-tight text-primary flex items-center gap-2 transition-all", collapsed && "justify-center w-full px-0")}>
                    <Shield className="h-6 w-6" />
                    {!collapsed && <span className="whitespace-nowrap">AuthShield</span>}
                </h2>
            </div>

            {/* Scrollable Main Menu */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
                <div className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Button
                                key={item.label}
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start transition-all",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                                    collapsed && "justify-center px-0"
                                )}
                                title={collapsed ? item.label : undefined}
                                onClick={() => router.push(item.href)}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0 transition-all", !collapsed && "mr-3")} />
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </Button>
                        )
                    })}
                </div>
            </div>

            {/* Footer Section (Settings + Toggle + Logout) */}
            <div className="p-3 border-t bg-background shrink-0 space-y-1">
                {!collapsed && <h4 className="px-4 text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Settings</h4>}

                <Button
                    variant="ghost"
                    className={cn("w-full justify-start transition-all", collapsed && "justify-center px-0")}
                    onClick={onToggle}
                    title={collapsed ? "Expand" : "Collapse"}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4 shrink-0" /> : <ChevronLeft className={cn("h-4 w-4 shrink-0", !collapsed && "mr-3")} />}
                    {!collapsed && <span className="truncate">Collapse Sidebar</span>}
                </Button>

                <Button
                    variant="ghost"
                    className={cn("w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all", collapsed && "justify-center px-0")}
                    onClick={handleLogout}
                    title={collapsed ? "Logout" : undefined}
                >
                    <LogOut className={cn("h-4 w-4 shrink-0", !collapsed && "mr-3")} />
                    {!collapsed && <span className="truncate">Logout</span>}
                </Button>
            </div>
        </div>
    )
}
