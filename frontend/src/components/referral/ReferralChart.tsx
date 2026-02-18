'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { User, ChevronDown, ChevronRight, Share2, ZoomIn, ZoomOut, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface TreeNode {
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

interface ReferralChartProps {
    endpoint: string
    maxDepth?: number
    viewType?: 'chart' | 'list'
    miniMap?: boolean
}

export default function ReferralChart({ endpoint, maxDepth = 20, viewType = 'chart', miniMap = false }: ReferralChartProps) {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [loading, setLoading] = useState(true)
    const [zoomLevel, setZoomLevel] = useState(miniMap ? 0.8 : 1)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchTree()
    }, [endpoint])

    const fetchTree = async () => {
        setLoading(true)
        setError('')
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('access_token')
            const baseUrl = endpoint.startsWith('http') ? endpoint : `http://localhost:8000${endpoint}`
            const url = new URL(baseUrl)
            if (maxDepth) url.searchParams.append('depth', maxDepth.toString())

            const res = await fetch(url.toString(), {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                const flatList = await res.json()
                const hierarchy = buildHierarchy(flatList)
                setTreeData(hierarchy)
            } else {
                setError('Failed to load hierarchy')
            }
        } catch (err) {
            console.error(err)
            setError('Connection error')
        } finally {
            setLoading(false)
        }
    }

    const buildHierarchy = (nodes: any[]): TreeNode[] => {
        const map: { [key: number]: TreeNode } = {}
        const roots: TreeNode[] = []

        const idsInList = new Set(nodes.map(n => n.id))

        nodes.forEach(node => {
            map[node.id] = { ...node, children: [] }
        })

        nodes.forEach(node => {
            const mappedNode = map[node.id]
            if (node.referred_by_id && idsInList.has(node.referred_by_id)) {
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

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
    if (error) return <div className="text-red-500 p-8 text-center">{error}</div>
    if (treeData.length === 0) return <div className="text-muted-foreground p-8 text-center">No network data found.</div>

    return (
        <div className="relative w-full overflow-hidden bg-zinc-950/50 rounded-xl border border-white/5 min-h-[400px]">
            {/* Background Grid - "Matrix" or "Cosmic" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            {!miniMap && (
                <div className="absolute top-4 right-4 z-20 flex bg-background/80 backdrop-blur border rounded-md shadow-sm">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoomLevel(z => Math.max(0.4, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
                    <div className="px-2 py-1 text-xs font-mono flex items-center min-w-[3rem] justify-center">{Math.round(zoomLevel * 100)}%</div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoomLevel(z => Math.min(2, z + 0.1))}><ZoomIn className="h-4 w-4" /></Button>
                </div>
            )}

            <div className="overflow-auto w-full h-full p-12 cursor-grab active:cursor-grabbing">
                <div
                    className="min-w-max mx-auto flex justify-center origin-top transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                >
                    <div className="flex gap-24">
                        {treeData.map(root => <ChartNode key={root.id} node={root} isRoot={true} />)}
                    </div>
                </div>
            </div>
        </div>
    )
}

const ChartNode = ({ node, isRoot = false }: { node: TreeNode, isRoot?: boolean }) => {
    const [expanded, setExpanded] = useState(true)
    const hasChildren = node.children && node.children.length > 0

    // Wire Color - Glowing Cyan/Primary
    const wireClass = "bg-primary/50 shadow-[0_0_10px_rgba(var(--primary),0.3)]"

    return (
        <div className="flex flex-col items-center">
            {/* Node Circle */}
            <div className={`
                relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-xl transition-all duration-300 group
                ${node.is_active
                    ? 'bg-zinc-900 border-primary shadow-primary/20 hover:shadow-primary/50 hover:scale-110'
                    : 'bg-zinc-900 border-red-500/50 shadow-red-500/10'
                }
            `}>
                <div className="flex flex-col items-center justify-center pointer-events-none">
                    <User className={`h-6 w-6 mb-0.5 ${node.is_active ? 'text-primary' : 'text-red-500'}`} />
                    <span className="text-[9px] font-mono text-muted-foreground opacity-70">
                        {node.role === 'super_admin' ? 'ROOT' : `L${node.level}`}
                    </span>
                </div>

                {/* Tooltip / Label directly below */}
                <div className="absolute top-full mt-3 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                    <div className="px-3 py-1 bg-zinc-900/90 backdrop-blur border border-white/10 rounded-full text-xs font-medium text-foreground shadow-lg flex items-center gap-2">
                        <span>{node.username}</span>
                        {node.total_team_size !== undefined && node.total_team_size > 0 && (
                            <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[10px] font-bold">
                                {node.total_team_size}
                            </span>
                        )}
                    </div>
                </div>

                {/* Expander Toggle (Small bubble on circle edge) */}
                {hasChildren && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                        className={`
                            absolute -bottom-2 w-6 h-6 rounded-full flex items-center justify-center border text-white transition-colors z-30 cursor-pointer shadow-md
                            ${expanded ? 'bg-zinc-800 border-zinc-600 hover:bg-zinc-700' : 'bg-primary border-primary hover:bg-primary/90'}
                        `}
                    >
                        {expanded ? <ChevronDown className="h-3 w-3" /> : <Share2 className="h-3 w-3" />}
                    </button>
                )}
            </div>

            {/* Children & Wires */}
            <AnimatePresence>
                {expanded && hasChildren && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col items-center"
                    >
                        {/* 1. Vertical Line Down from Parent to Bus */}
                        <div className={`h-8 w-0.5 ${wireClass}`}></div>

                        {/* 2. Horizontal Bus & Children */}
                        <div className="flex relative pt-8">
                            {/* The Horizontal Bus Line */}
                            {node.children.length > 1 && (
                                <div
                                    className={`absolute top-0 h-0.5 ${wireClass}`}
                                    style={{
                                        left: '50%',  // Start from center of first child wrapper? No.
                                        // We need to span from the center of the first child to the center of the last child.
                                        // Since flexbox aligns them, we can use simple calc if widths are uniform? 
                                        // No, recursive children vary width.
                                        // Better trick: 
                                        // Use pseudo-elements on the children to draw the top lines towards the center.
                                    }}
                                >
                                    {/* 
                                      Actually, drawing a perfect horizontal line in dynamic width flexbox without JS measures is hard.
                                      BUT, the standard CSS Tree trick:
                                      - Each child has a top border 'bar'.
                                      - First child: bar starts at center (50%) goes right.
                                      - Last child: bar starts left goes to center (50%).
                                      - Middle children: bar spans full width (0 to 100%).
                                      - Then a vertical line joins the bar to the child node.
                                    */}
                                </div>
                            )}

                            {node.children.map((child, index) => {
                                const isFirst = index === 0;
                                const isLast = index === node.children.length - 1;
                                const isOnly = node.children.length === 1;

                                return (
                                    <div key={child.id} className="flex flex-col items-center relative px-4">
                                        {/* 
                                            CSS Tree Connectors (The "Wire" Logic) 
                                            We use ::before and ::after equivalent divs here to draw the horizontal lines.
                                        */}

                                        {/* Top Horizontal Line (Left half) */}
                                        {!isFirst && !isOnly && (
                                            <div className={`absolute top-[-2rem] left-0 right-1/2 h-0.5 ${wireClass}`} style={{ top: '-2rem' }}></div>
                                        )}

                                        {/* Top Horizontal Line (Right half) */}
                                        {!isLast && !isOnly && (
                                            <div className={`absolute top-[-2rem] left-1/2 right-0 h-0.5 ${wireClass}`} style={{ top: '-2rem' }}></div>
                                        )}

                                        {/* Vertical Line Up from Child to Horizontal Line */}
                                        <div className={`absolute top-[-2rem] left-1/2 -ml-[1px] w-0.5 h-8 ${wireClass}`}></div>

                                        <ChartNode node={child} />
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
