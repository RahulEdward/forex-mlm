'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import ReferralChart from '@/components/referral/ReferralChart'
import { Network } from 'lucide-react'

export default function NodesPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-background text-foreground flex dark">
            <Sidebar collapsed={!isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            <main className={`flex-1 flex flex-col h-screen bg-muted/10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>

                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-50">
                    <div className="flex items-center gap-2">
                        <Network className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Node Visualization</h1>
                    </div>
                </header>

                {/* Content - Full Screen Graph */}
                <div className="flex-1 p-4 overflow-hidden h-full flex flex-col">
                    <div className="flex-1 border rounded-xl bg-card overflow-hidden shadow-sm relative">
                        {/* We use key to force re-render if needed, but endpoint is static here */}
                        <ReferralChart
                            key="full-chart"
                            endpoint="/api/referral/admin/tree"
                            maxDepth={20}
                        // miniMap={false} // Implicit
                        />
                        {/* Overlay Explainer */}
                        <div className="absolute top-4 left-4 bg-background/80 backdrop-blur border rounded-lg p-3 text-xs text-muted-foreground z-10 max-w-xs shadow-sm pointer-events-none">
                            <h4 className="font-semibold text-foreground mb-1">Hierarchy Map</h4>
                            <p>This page visualizes the entire user database as a node tree. Use scroll to pan and pinch/buttons to zoom.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
