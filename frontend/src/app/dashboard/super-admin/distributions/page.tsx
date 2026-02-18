'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Zap, DollarSign, Settings, Percent, Save } from 'lucide-react'

export default function DistributionsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    // Simulation of distribution settings
    const [settings, setSettings] = useState({
        generation_levels: 20,
        direct_referral_bonus: 5, // %
        generation_distribution: Array(20).fill(0.5), // % per level
        pool_allocation: 2, // %
        min_withdrawal: 10, // $
    })

    return (
        <div className="min-h-screen bg-background text-foreground flex dark">
            <Sidebar collapsed={!isSidebarOpen} />

            <main className={`flex-1 flex flex-col h-screen bg-muted/10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>

                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Distribution & Commission Settings</h1>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8 max-w-5xl mx-auto w-full space-y-8">

                    {/* Disclaimer */}
                    <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-4">
                        <Zap className="h-5 w-5 text-orange-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-orange-400">Critical Configuration</h3>
                            <p className="text-sm text-zinc-400">Changes here affect real-time money distribution. Ensure all percentages sum up correctly to avoid deficits.</p>
                        </div>
                    </div>

                    {/* Direct Bonus Section */}
                    <div className="bg-card border rounded-xl p-6 space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-primary/10 rounded-lg"><Percent className="h-5 w-5 text-primary" /></div>
                            <h2 className="text-lg font-semibold">Direct & Level Income</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-sm font-medium">Direct Referral Bonus (%)</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={settings.direct_referral_bonus}
                                        onChange={(e) => setSettings({ ...settings, direct_referral_bonus: Number(e.target.value) })}
                                        className="pl-10"
                                    />
                                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-xs text-muted-foreground">Bonus given to the immediate sponsor.</p>
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium">Total Level Breakdown (20 Levels)</label>
                                <div className="max-h-60 overflow-y-auto border rounded-xl divide-y">
                                    {settings.generation_distribution.map((val, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 text-sm hover:bg-muted/30">
                                            <span className="font-mono text-muted-foreground">Level {idx + 1}</span>
                                            <div className="flex items-center gap-2 w-24">
                                                <Input
                                                    type="number"
                                                    className="h-8 text-right"
                                                    value={val}
                                                    onChange={(e) => {
                                                        const newArr = [...settings.generation_distribution]
                                                        newArr[idx] = Number(e.target.value)
                                                        setSettings({ ...settings, generation_distribution: newArr })
                                                    }}
                                                />
                                                <span className="text-muted-foreground">%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Global Pool & Withdrawals */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-card border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Settings className="h-5 w-5 text-muted-foreground" /> Global Pool</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pool Allocation (%)</label>
                                <Input type="number" value={settings.pool_allocation} onChange={(e) => setSettings({ ...settings, pool_allocation: Number(e.target.value) })} />
                                <p className="text-xs text-muted-foreground">Percentage of every deposit sent to the Global Pool.</p>
                            </div>
                        </div>

                        <div className="bg-card border rounded-xl p-6 space-y-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2"><Shield className="h-5 w-5 text-muted-foreground" /> Withdrawal Limits</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Internal User Transfer Limit ($)</label>
                                <Input type="number" value={settings.min_withdrawal} onChange={() => { }} />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="sticky bottom-0 bg-background/80 backdrop-blur-md p-4 border-t flex justify-end">
                        <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                            <Save className="h-4 w-4" /> Save Configuration
                        </Button>
                    </div>

                </div>
            </main>
        </div>
    )
}
