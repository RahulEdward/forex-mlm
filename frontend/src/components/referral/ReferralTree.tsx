'use client'
import { useState, useEffect } from 'react'

export default function ReferralTree({ maxDepth = 3, endpoint = '/api/referral/tree' }: { maxDepth?: number, endpoint?: string }) {
    const [tree, setTree] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTree = async () => {
            try {
                const token = localStorage.getItem('access_token')
                const url = new URL(`http://localhost:8000${endpoint}`)
                url.searchParams.append('depth', maxDepth.toString())

                const res = await fetch(url.toString(), {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setTree(data)
                }
            } catch (err) {
                console.error("Failed to fetch tree", err)
            } finally {
                setLoading(false)
            }
        }
        fetchTree()
    }, [maxDepth])

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>Loading tree...</div>

    // Create a hierarchical view from the flat list
    const buildHierarchy = (nodes: any[]) => {
        const map: any = {}
        const roots: any[] = []

        // Initialize map
        nodes.forEach(node => {
            map[node.id] = { ...node, children: [] }
        })

        // Build parent-child relationships
        nodes.forEach(node => {
            if (node.level === 1) { // In relative view, level 1 is direct child of logged-in user
                if (map[node.id]) roots.push(map[node.id])
            } else {
                const parent = map[node.referred_by_id]
                if (parent) {
                    parent.children.push(map[node.id])
                }
            }
        })

        return roots
    }

    const hierarchy = buildHierarchy(tree)

    const NodeView = ({ node, level = 0 }: { node: any, level?: number }) => (
        <div style={{ marginLeft: level > 0 ? '1.5rem' : '0', borderLeft: level > 0 ? '1px solid #e2e8f0' : 'none', paddingLeft: level > 0 ? '1rem' : '0', paddingBottom: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #cbd5e1', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ fontWeight: 'bold', color: '#334155' }}>{node.username}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>({node.email})</div>
                <span style={{ fontSize: '0.75rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: node.is_active ? '#dcfce7' : '#fee2e2', color: node.is_active ? '#166534' : '#991b1b' }}>
                    {node.is_active ? 'Active' : 'Inactive'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>L{node.level}</span>
            </div>
            {node.children && node.children.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                    {node.children.map((child: any) => (
                        <NodeView key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    )

    return (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#333' }}>Referral Hierarchy</h3>
            {loading ? (
                <div>Loading...</div>
            ) : hierarchy.length === 0 ? (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>No referrals found.</div>
            ) : (
                <div>
                    {hierarchy.map((root: any) => (
                        <NodeView key={root.id} node={root} />
                    ))}
                </div>
            )}
        </div>
    )
}
