'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Users,
  Shield,
  LogOut,
  Plus,
  Search,
  Settings,
  LayoutDashboard,
  MoreVertical,
  UserPlus,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReferralTree from '@/components/referral/ReferralTree'

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
      }
    } catch (err) {
      console.error('Failed to fetch users')
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

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  // Filter users based on search
  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Stats for the cards
  const totalUsers = users.length
  const totalAdmins = users.filter(u => u.role === 'admin' || u.role === 'super_admin').length
  const activeUsers = users.filter(u => u.is_active).length

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Navigation Bar with Brown Gradient */}
      <nav className="h-16 bg-gradient-to-r from-amber-950 via-yellow-900 to-amber-900 shadow-lg flex items-center justify-between px-6 sticky top-0 z-50 text-white">
        <div className="flex items-center gap-2">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <Shield className="w-5 h-5 text-amber-100" />
          </div>
          <span className="font-bold text-xl tracking-wide text-amber-50">AuthShield <span className="text-amber-200/60 font-medium text-sm ml-1">Admin</span></span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-amber-100/80">
          <button className="hover:text-white transition-colors flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button className="hover:text-white transition-colors flex items-center gap-2 text-white">
            <Users className="w-4 h-4" /> Users
          </button>
          <button className="hover:text-white transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center text-xs text-amber-200/70 mr-2">
            Super Admin
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-amber-100 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={Users}
            gradient="from-amber-800 to-yellow-700"
          />
          <StatCard
            title="Active Admins"
            value={totalAdmins}
            icon={Shield}
            gradient="from-amber-900 to-amber-800"
          />
          <StatCard
            title="System Status"
            value="Healthy"
            icon={TrendingUp}
            gradient="from-stone-800 to-stone-700"
          />
        </div>

        {/* Action Bar & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
          </div>
          <Button
            onClick={() => setShowCreateAdmin(!showCreateAdmin)}
            className="w-full md:w-auto bg-gradient-to-r from-amber-700 to-yellow-600 hover:from-amber-800 hover:to-yellow-700 text-white shadow-md hover:shadow-lg transition-all"
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
          <div className="bg-card border border-border rounded-xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-primary">
              <Shield className="w-5 h-5" />
              Create New Administrator
            </h3>
            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="admin_user"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                  className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="admin@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full p-2.5 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-[42px]">
                Create Account
              </Button>
            </form>
            {message && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 text-green-600 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> {message}
              </div>
            )}
            {error && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg flex items-center gap-2">
                <XCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </div>
        )}

        {/* Global Referral Tree */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Global Referral Hierarchy
          </h3>
          <ReferralTree endpoint="/api/referral/admin/tree" maxDepth={5} />
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 font-semibold text-muted-foreground text-sm w-16">ID</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm">User Details</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm hidden md:table-cell">Contact</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm">Role</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm text-center">Status</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      No users found matching "{searchTerm}"
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="p-4 text-muted-foreground text-sm font-mono">{user.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">{user.username}</div>
                        <div className="text-xs text-muted-foreground md:hidden">{user.email}</div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{user.email}</td>
                      <td className="p-4">
                        <Badge role={user.role} />
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active
                          ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                          : 'bg-red-500/15 text-red-700 dark:text-red-400'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredUsers.length > 0 && (
            <div className="p-4 border-t border-border bg-muted/20 text-xs text-muted-foreground flex justify-between items-center">
              <span>Showing {filteredUsers.length} users</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled className="h-7 text-xs">Previous</Button>
                <Button variant="outline" size="sm" disabled className="h-7 text-xs">Next</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Helper Components

function StatCard({ title, value, icon: Icon, gradient }: { title: string, value: string | number, icon: any, gradient: string }) {
  return (
    <div className={`p-6 rounded-xl text-white shadow-lg bg-gradient-to-br ${gradient} relative overflow-hidden group`}>
      <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
        <Icon className="w-24 h-24" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 opacity-80 mb-2">
          <Icon className="w-4 h-4" />
          <span className="text-sm font-medium uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-3xl font-bold">{value}</div>
      </div>
    </div>
  )
}

function Badge({ role }: { role: string }) {
  const styles = {
    super_admin: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20',
    admin: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20',
    user: 'bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-500/10 dark:text-stone-300 dark:border-stone-500/20'
  }[role] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold border ${styles} capitalize inline-block min-w-[80px] text-center`}>
      {role.replace('_', ' ')}
    </span>
  )
}
