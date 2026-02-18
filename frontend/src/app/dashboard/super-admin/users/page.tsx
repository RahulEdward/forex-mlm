'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    Users,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Filter,
    Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setIsLoading(true)
        const token = localStorage.getItem('token')
        try {
            const response = await fetch('http://localhost:8000/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (response.ok) {
                const data = await response.json()
                setUsers(data)
            } else {
                setError('Failed to load users')
            }
        } catch (err) {
            setError('Connection error')
        } finally {
            setIsLoading(false)
        }
    }

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-background text-foreground flex dark">
            <Sidebar collapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} role="super_admin" />

            <main className={`flex-1 flex flex-col h-screen bg-muted/10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-8 bg-background sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Users className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold tracking-tight">User Management</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground text-xs font-medium border border-border">
                            {filteredUsers.length} Users
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-1.5 bg-muted/50 border border-border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                            />
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Filter className="h-4 w-4" /> Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Download className="h-4 w-4" /> Export
                        </Button>
                    </div>
                </header>

                {/* Content */}
                <div className="p-8 flex-1 overflow-auto">
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-muted/50 sticky top-0 z-10">
                                <tr className="border-b border-border">
                                    <th className="p-4 font-medium text-muted-foreground">ID</th>
                                    <th className="p-4 font-medium text-muted-foreground">User Details</th>
                                    <th className="p-4 font-medium text-muted-foreground">Role</th>
                                    <th className="p-4 font-medium text-muted-foreground">Referral Info</th>
                                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isLoading ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Loading users...</td></tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No users found matching your search.</td></tr>
                                ) : (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                                            <td className="p-4 font-mono text-muted-foreground w-16 text-center">{user.id}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase text-xs">
                                                        {user.username.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold">{user.username}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide
                                ${user.role === 'super_admin' ? 'bg-primary/20 text-primary border-primary/20' :
                                                        user.role === 'admin' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                            'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                                                    }`}>
                                                    {user.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground w-12">Code:</span>
                                                        <span className="font-mono">{user.referral_code || '-'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-muted-foreground w-12">Ref By:</span>
                                                        <span className="font-medium text-primary cursor-pointer hover:underline">
                                                            {user.referred_by_id ? `#${user.referred_by_id}` : 'ROOT'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.is_active
                                                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                        : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {user.is_active ? (
                                                        <><CheckCircle className="w-3 h-3" /> Active</>
                                                    ) : (
                                                        <><XCircle className="w-3 h-3" /> Inactive</>
                                                    )}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}
