'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import ReferralLink from '@/components/referral/ReferralLink'
import ReferralStats from '@/components/referral/ReferralStats'
import ReferralTree from '@/components/referral/ReferralTree'
import { Button } from '@/components/ui/button'
import { Activity, Bell, Search, User, PanelLeft, Menu } from 'lucide-react'

export default function UserDashboard() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'user') {
      router.push('/login')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar for User */}
      <Sidebar role="user" collapsed={!isSidebarOpen} />

      {/* Main Content Area */}
      <main className={`flex-1 overflow-y-auto h-screen bg-muted/20 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 bg-background sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="mr-4 shrink-0 border-muted-foreground/20">
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">User Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="rounded-full bg-muted pl-9 pr-4 h-9 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64"
              />
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
              <p className="text-muted-foreground">Here's an overview of your referral network and earnings.</p>
            </div>
            <div className="flex gap-2">
              <Button>Download Report</Button>
            </div>
          </div>

          {/* Stats & Referral Link */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ReferralStats />

              <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Referral Network
                </h3>
                {/* We reuse ReferralTree but maybe limit depth or change endpoint if needed, for now default user endpoint works */}
                <ReferralTree maxDepth={5} />
              </div>
            </div>

            <div className="space-y-6">
              {/* Right Column - Referral Link & Quick Actions */}
              <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Your Referral Link</h3>
                <ReferralLink />
                <p className="text-xs text-muted-foreground mt-4">
                  Share this link to grow your network. You earn commissions on 20 levels deep!
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-semibold mb-4">Next Rank</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-primary bg-primary/10">
                        Silver
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-primary">
                        70%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-primary/20">
                    <div style={{ width: "70%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                  </div>
                  <p className="text-xs text-muted-foreground">Recruit 3 more direct members to level up.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
