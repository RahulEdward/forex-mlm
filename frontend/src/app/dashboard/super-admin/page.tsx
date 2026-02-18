'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Shield,
  UserPlus,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  MoreVertical,
  Search,
  PanelLeft,
  Menu
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReferralChart from '@/components/referral/ReferralChart'
import { Sidebar } from '@/components/layout/Sidebar'

export default function SuperAdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'super_admin') {
      router.push('/login')
      return
    }
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
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.clear()
        router.push('/login')
      } else {
        console.error('Failed to fetch users:', response.statusText)
        setError('Failed to load users. Please try logging in again.')
      }
    } catch (err) {
      console.error('Failed to fetch users', err)
      setError('Connection error. Is the backend running?')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:8000/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: adminEmail,
          username: adminUsername,
          password: adminPassword,
          permissions: {}
        })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Admin created successfully!')
        setAdminEmail('')
        setAdminUsername('')
        setAdminPassword('')
        setShowCreateAdmin(false)
        fetchUsers()
        setTimeout(() => setMessage(''), 3000)
      } else {
        setError(data.detail || 'Failed to create admin')
      }
    } catch (err) {
      setError('Connection error')
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats for the cards
  const totalUsers = users.length
  const totalAdmins = users.filter(u => u.role === 'admin' && u.role !== 'super_admin').length
  const activeUsers = users.filter(u => u.is_active).length

  return (
    <div className="min-h-screen bg-background text-foreground flex dark">
      {/* Sidebar */}
      <Sidebar collapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col h-screen bg-muted/10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 bg-background sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              Super Admin View
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              SA
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={Users}
              description="+20.1% from last month"
            />
            <StatCard
              title="Active Admins"
              value={totalAdmins}
              icon={Shield}
              description="Manage system access"
            />
            <StatCard
              title="Active Sessions"
              value={activeUsers}
              icon={Activity}
              description="Currently logged in"
            />
            <StatCard
              title="System Health"
              value="99.9%"
              icon={TrendingUp}
              description="All systems operational"
            />
          </div>

          {/* Quick Actions & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={() => setShowCreateAdmin(!showCreateAdmin)}
              className="w-full md:w-auto shadow-sm"
            >
              {showCreateAdmin ? 'Cancel' : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create New Admin
                </>
              )}
            </Button>
          </div>

          {/* Create Admin Form */}
          {showCreateAdmin && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Create New Administrator
              </h3>
              <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Username</label>
                  <input
                    type="text"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="admin_user"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit">Create Account</Button>
              </form>
              {message && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-md flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" /> {message}
                </div>
              )}
              {error && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-md flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4" /> {error}
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Global Referral Tree - Takes up 2 columns */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">Referral Network</h3>
                <Button variant="link" onClick={() => router.push('/dashboard/super-admin/network')}>
                  View Full Hierarchy
                </Button>
              </div>
              <ReferralChart endpoint="/api/referral/admin/tree" maxDepth={5} />
            </div>

            {/* Users Table - Takes up 1 column (Acting as a "Recent Users" list) */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight">Recent Users</h3>
              <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 sticky top-0">
                      <tr className="border-b border-border">
                        <th className="p-3 font-medium text-muted-foreground">User</th>
                        <th className="p-3 font-medium text-muted-foreground text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.slice(0, 10).map((user) => (
                        <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                          <td className="p-3">
                            <div className="font-medium">{user.username}</div>
                            <div className="text-xs text-muted-foreground">{user.email}</div>
                          </td>
                          <td className="p-3 text-right">
                            <span className={`inline-flex h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Full Users Table Block if needed below */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">All Users</h3>
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b border-border">
                    <th className="p-4 font-medium text-muted-foreground">ID</th>
                    <th className="p-4 font-medium text-muted-foreground">User</th>
                    <th className="p-4 font-medium text-muted-foreground">Role</th>
                    <th className="p-4 font-medium text-muted-foreground">Referral Info</th>
                    <th className="p-4 font-medium text-muted-foreground">Status</th>
                    <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-4 font-mono text-muted-foreground">{user.id}</td>
                      <td className="p-4">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="p-4"><Badge role={user.role} /></td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">Code:</span>
                            <span className="font-mono bg-muted/50 px-1 rounded">{user.referral_code || '-'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>Ref By:</span>
                            <span>{user.referred_by_id ? `#${user.referred_by_id}` : 'Root'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${user.is_active ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive'
                          }`}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, description, className }: { title: string, value: string | number, icon: any, description?: string, className?: string }) {
  return (
    <div className={`p-6 rounded-xl bg-card border border-border shadow-sm ${className}`}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div>
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
    </div>
  )
}

function Badge({ role }: { role: string }) {
  const colors: any = {
    super_admin: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    admin: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    user: "border-transparent bg-muted text-muted-foreground hover:bg-muted/80"
  }

  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${colors[role] || colors.user} capitalize`}>
      {role.replace('_', ' ')}
    </div>
  )
}
