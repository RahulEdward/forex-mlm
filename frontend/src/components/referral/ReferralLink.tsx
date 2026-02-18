'use client'
import { useState, useEffect } from 'react'

export default function ReferralLink() {
    const [link, setLink] = useState('')
    const [code, setCode] = useState('')
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchLink = async () => {
            try {
                const token = localStorage.getItem('access_token')
                const res = await fetch('http://localhost:8000/api/referral/link', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                if (res.ok) {
                    const data = await res.json()
                    setLink(data.link)
                    setCode(data.code)
                }
            } catch (err) {
                console.error("Failed to fetch referral link", err)
            }
        }
        fetchLink()
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(link)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (!code) return null

    return (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3 style={{ margin: '0 0 1rem', color: '#333' }}>Your Referral Link</h3>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                    readOnly
                    value={link}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569' }}
                />
                <button
                    onClick={handleCopy}
                    style={{ background: copied ? '#10b981' : '#667eea', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b' }}>
                Share this link to grow your team. New users will be automatically added to your downline.
            </p>
        </div>
    )
}
