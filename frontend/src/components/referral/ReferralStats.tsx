'use client'
import { useState, useEffect } from 'react'

export default function ReferralStats() {
    interface Stats {
        total_directs: number;
        total_team_size: number;
        level_breakdown: Record<string, number>;
    }

    const [stats, setStats] = useState<Stats>({
        total_directs: 0,
        total_team_size: 0,
        level_breakdown: {}
    })

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('access_token')
                const res = await fetch('http://localhost:8000/api/referral/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setStats(data)
                }
            } catch (err) {
                console.error("Failed to fetch referral stats", err)
            }
        }
        fetchStats()
    }, [])

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Direct Referrals</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#2563eb' }}>{stats.total_directs}</div>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Direct Team</h4>
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#16a34a' }}>{stats.total_team_size}</div>
            </div>

            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#64748b', fontSize: '0.9rem', textTransform: 'uppercase' }}>Top Levels</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.9rem' }}>
                    {Object.entries(stats.level_breakdown).slice(0, 3).map(([lvl, count]) => (
                        <div key={lvl} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                            <span>Level {lvl}</span>
                            <span style={{ fontWeight: 'bold' }}>{count}</span>
                        </div>
                    ))}
                    {Object.keys(stats.level_breakdown).length === 0 && <span style={{ color: '#94a3b8' }}>No downline yet</span>}
                </div>
            </div>
        </div>
    )
}
