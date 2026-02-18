'use client'
import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, User, Network } from 'lucide-react'

interface TreeNode {
    id: number
    username: string
    email: string
    role: string
    is_active: boolean
    level: number
    referred_by_id: number | null
    children: TreeNode[]
}

export default function ReferralTree({ maxDepth = 20, endpoint = '/api/referral/tree' }: { maxDepth?: number, endpoint?: string }) {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [loading, setLoading] = useState(true)
    const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set())

    useEffect(() => {
        const fetchTree = async () => {
            setLoading(true)
            try {
                // Determine token based on role stored (Super Admin vs User)
                // Actually the token is just 'token' or 'access_token' in localStorage
                // The previous code used 'access_token', but login uses 'token'. Let's check both or fix to 'token'.
                const token = localStorage.getItem('token') || localStorage.getItem('access_token')

                // Construct URL correctly
                const baseUrl = endpoint.startsWith('http') ? endpoint : `http://localhost:8000${endpoint}`
                const url = new URL(baseUrl)
                url.searchParams.append('depth', maxDepth.toString())

                const res = await fetch(url.toString(), {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const flatList = await res.json()
                    const hierarchy = buildHierarchy(flatList)
                    setTreeData(hierarchy)
                    // Auto-expand top level
                    if (hierarchy.length > 0) {
                        setExpandedNodes(new Set([hierarchy[0].id]))
                    }
                } else {
                    console.error("Tree fetch failed:", res.status)
                }
            } catch (err) {
                console.error("Failed to fetch tree", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTree()
    }, [endpoint, maxDepth])

    const buildHierarchy = (nodes: any[]): TreeNode[] => {
        const map: { [key: number]: TreeNode } = {}
        const roots: TreeNode[] = []

        // 1. Initialize all nodes
        nodes.forEach(node => {
            map[node.id] = { ...node, children: [] }
        })

        // 2. Link parents and children
        nodes.forEach(node => {
            const mappedNode = map[node.id]
            if (node.referred_by_id && map[node.referred_by_id]) {
                map[node.referred_by_id].children.push(mappedNode)
            } else {
                // If no referred_by_id, OR referrer is not in the fetched set (e.g. we fetched a subtree), it's a root
                roots.push(mappedNode)
            }
        })

        return roots
    }

    const toggleExpand = (id: number) => {
        const newSet = new Set(expandedNodes)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setExpandedNodes(newSet)
    }

    const TreeNodeView = ({ node, level }: { node: TreeNode, level: number }) => {
        const hasChildren = node.children && node.children.length > 0
        const isExpanded = expandedNodes.has(node.id)

        return (
            <div className="select-none">
                <div
                    className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors ${level === 0 ? 'bg-muted/20 mb-1' : ''}`}
                    style={{ marginLeft: `${level * 20}px` }}
                    onClick={() => toggleExpand(node.id)}
                >
                    <div className={`text-muted-foreground w-4 flex justify-center`}>
                        {hasChildren ? (
                            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                        ) : (
                            <div className="w-4" />
                        )}
                    </div>

                    <div className={`flex items-center gap-2 ${node.is_active ? 'text-foreground' : 'text-muted-foreground opacity-70'}`}>
                        <div className={`p-1 rounded-full ${node.is_active ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="font-medium text-sm">{node.username}</span>
                        <span className="text-xs text-muted-foreground hidden sm:inline-block font-mono bg-muted px-1 rounded">
                            {node.role === 'super_admin' ? 'SA' : `L${node.level}`}
                        </span>
                        {!node.is_active && <span className="text-[10px] uppercase text-red-500 font-bold ml-1">Inactive</span>}
                    </div>

                    {hasChildren && (
                        <div className="ml-auto text-xs text-muted-foreground bg-muted/50 px-1.5 rounded-full">
                            {node.children.length}
                        </div>
                    )}
                </div>

                {isExpanded && hasChildren && (
                    <div className="relative">
                        {/* Optional vertical guide line */}
                        <div
                            className="absolute left-0 top-0 bottom-0 border-l border-border/50"
                            style={{ left: `${(level * 20) + 11}px` }}
                        />
                        {node.children.map(child => (
                            <TreeNodeView key={child.id} node={child} level={level + 1} />
                        ))}
                    </div>
                )}
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <p className="text-sm">Loading network...</p>
            </div>
        )
    }

    if (treeData.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border-2 border-dashed border-border rounded-xl">
                <Network className="h-10 w-10 mb-2 opacity-20" />
                <p>No referral network found.</p>
            </div>
        )
    }

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[300px]">
                {treeData.map(root => (
                    <TreeNodeView key={root.id} node={root} level={0} />
                ))}
            </div>
        </div>
    )
}
