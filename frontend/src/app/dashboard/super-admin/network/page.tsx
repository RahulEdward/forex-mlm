'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ChevronDown, ChevronRight, Search, ZoomIn, ZoomOut, Layout, ListTree, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'

interface TreeNode {
    id: number
    username: string
    email: string
    role: string
    is_active: boolean
    level: number
    referral_code: string
    referred_by_id: number | null
    children: TreeNode[]
    total_team_size?: number
}

export default function NetworkPage() {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [zoomLevel, setZoomLevel] = useState(1)
    const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart')

    useEffect(() => {
        fetchTree()
    }, [])

    const fetchTree = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:8000/api/referral/admin/tree?depth=20`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (res.ok) {
                const flatList = await res.json()
                const hierarchy = buildHierarchy(flatList)
                setTreeData(hierarchy)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const buildHierarchy = (nodes: any[]): TreeNode[] => {
        const map: { [key: number]: TreeNode } = {}
        const roots: TreeNode[] = []

        nodes.forEach(node => {
            map[node.id] = { ...node, children: [] }
        })

        nodes.forEach(node => {
            const mappedNode = map[node.id]
            if (node.referred_by_id && map[node.referred_by_id]) {
                map[node.referred_by_id].children.push(mappedNode)
            } else {
                roots.push(mappedNode)
            }
        })

        const calcSize = (node: TreeNode): number => {
            let size = 0
            node.children.forEach(child => {
                size += 1 + calcSize(child)
            })
            node.total_team_size = size
            return size
        }
        roots.forEach(root => calcSize(root))
        return roots
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex dark">
            <Sidebar collapsed={!isSidebarOpen} />

            <main className={`flex-1 flex flex-col h-screen bg-muted/10 transition-all duration-300 ${isSidebarOpen ? 'md:ml-72' : 'md:ml-20'}`}>

                {/* Header */}
                <header className="h-16 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-50">
                    <div className="flex items-center gap-4">
                        <Share2 className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Network Hierarchy</h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search user..."
                                className="pl-9 pr-4 py-1.5 text-sm bg-muted rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-64 border border-transparent focus:bg-background"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="flex bg-muted rounded-md p-1 border">
                            <Button
                                variant={viewMode === 'chart' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-7 px-3"
                                onClick={() => setViewMode('chart')}
                            >
                                <Layout className="h-4 w-4 mr-2" /> Chart
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'ghost'}
                                size="sm"
                                className="h-7 px-3"
                                onClick={() => setViewMode('list')}
                            >
                                <ListTree className="h-4 w-4 mr-2" /> List
                            </Button>
                        </div>

                        <div className="flex items-center border rounded-md overflow-hidden bg-background">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-muted" onClick={() => setZoomLevel(z => Math.max(0.5, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
                            <div className="px-2 text-xs font-mono min-w-[3rem] text-center">{Math.round(zoomLevel * 100)}%</div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-muted" onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-auto bg-grid-black/[0.02] dark:bg-grid-white/[0.02] relative">
                    <div
                        className={`p-8 min-w-max mx-auto transition-transform origin-top ${viewMode === 'chart' ? 'flex justify-center' : ''}`}
                        style={{ transform: `scale(${zoomLevel})` }}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center justify-center mt-20 gap-4">
                                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
                                <p className="text-muted-foreground">Loading exact hierarchy...</p>
                            </div>
                        ) : treeData.length === 0 ? (
                            <div className="text-center p-12 text-muted-foreground">No network data found.</div>
                        ) : (
                            viewMode === 'chart' ? (
                                <div className="flex gap-16">
                                    {treeData.map(root => <ChartNode key={root.id} node={root} />)}
                                </div>
                            ) : (
                                <div className="max-w-4xl mx-auto space-y-4">
                                    {treeData.map(root => <ListNode key={root.id} node={root} level={0} />)}
                                </div>
                            )
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

// --- Horizontal Chart View ---
const ChartNode = ({ node }: { node: TreeNode }) => {
    const [expanded, setExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0

    return (
        <div className="flex flex-col items-center">
            {/* Node Card */}
            <div className={`
                relative z-10 w-64 bg-card border rounded-xl shadow-sm transition-all duration-200 group
                ${node.is_active ? 'border-border hover:border-primary/50' : 'border-red-500/30 bg-red-500/5'}
            `}>
                <div className="p-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
                    <div className="flex justify-between items-start mb-2">
                        <div className={`p-1.5 rounded-md ${node.is_active ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                            <User className="h-4 w-4" />
                        </div>
                        <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                            {node.role === 'super_admin' ? 'ROOT' : `L${node.level}`}
                        </span>
                    </div>

                    <div className="space-y-0.5">
                        <h3 className="font-semibold text-sm truncate pr-2">{node.username}</h3>
                        <p className="text-xs text-muted-foreground truncate">{node.email}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t flex justify-between items-center text-xs text-muted-foreground">
                        <span className="font-mono">{node.referral_code || '-'}</span>
                        <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded-full">
                            <Share2 className="h-3 w-3" />
                            <span className="font-semibold text-foreground">{node.total_team_size || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Expander Button */}
                {hasChildren && (
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 h-6 w-6 bg-background border rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors z-20"
                    >
                        {expanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                    </button>
                )}
            </div>

            {/* Children & Lines */}
            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col items-center"
                    >
                        {/* Downward Line from Parent */}
                        <div className="h-8 w-px bg-border/60"></div>

                        {/* Horizontal Bar Wrapper */}
                        <div className="flex relative">
                            {/* Horizontal Line connecting first and last child 
                                We only draw this if there is > 1 child.
                                Absolute positioning with calculated left/right insets works best, 
                                but flex gap is varying. 
                                Easier CSS trick: 
                                - Each child has a top line.
                                - The parent has a bottom-spanning bar? No.
                                - Pseudo-elements on children.
                            */}

                            {/* Simplified Connector: Flex Row with lines going up */}
                            <div className="flex gap-8 relative items-start pt-8">
                                {/* The Magic Horizontal Bar */}
                                {node.children.length > 1 && (
                                    <div className="absolute top-0 left-0 right-0 h-px bg-border/60 mx-[8rem]"></div> /* 8rem = half of w-64 */
                                )}

                                {node.children.map((child, index) => (
                                    <div key={child.id} className="flex flex-col items-center relative">
                                        {/* Upward Line from Child to Horizontal Bar */}
                                        <div className="absolute top-[-2rem] h-8 w-px bg-border/60"></div>
                                        <ChartNode node={child} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// --- Vertical List View ---
const ListNode = ({ node, level }: { node: TreeNode, level: number }) => {
    const [expanded, setExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0

    return (
        <div>
            <div
                className={`
                    flex items-center gap-4 py-2 px-4 rounded-lg border hover:bg-muted/30 transition-colors
                    ${node.is_active ? 'border-border bg-card' : 'border-red-500/20 bg-red-500/5'}
                `}
                style={{ marginLeft: `${level * 24}px` }}
            >
                <div onClick={() => setExpanded(!expanded)} className="cursor-pointer text-muted-foreground hover:text-foreground">
                    {hasChildren ? (
                        expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    ) : <div className="w-4" />}
                </div>

                <div className={`p-1.5 rounded-full ${node.is_active ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
                    <User className="h-4 w-4" />
                </div>

                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{node.username}</span>
                        <span className="text-[10px] font-mono bg-muted px-1.5 rounded text-muted-foreground">{node.role === 'super_admin' ? 'ROOT' : `L${node.level}`}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{node.email}</div>
                </div>

                <div className="hidden sm:flex items-center gap-8 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 w-32">
                        <span className="text-xs uppercase tracking-wider opacity-50">Ref Code</span>
                        <span className="font-mono text-foreground">{node.referral_code || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 w-24 justify-end">
                        <span className="text-xs uppercase tracking-wider opacity-50">Team</span>
                        <span className="font-semibold text-foreground">{node.total_team_size || 0}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Vertical Guide Line */}
                        <div className="relative">
                            <div className="absolute left-[calc(1rem+4px)] top-0 bottom-0 w-px bg-border/40" style={{ left: `${(level * 24) + 21}px` }}></div>
                            {node.children.map(child => (
                                <ListNode key={child.id} node={child} level={level + 1} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
