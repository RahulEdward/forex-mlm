'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ReferralLink from '@/components/referral/ReferralLink'
import ReferralStats from '@/components/referral/ReferralStats'
import ReferralTree from '@/components/referral/ReferralTree'

export default function UserDashboard() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('role')
    if (role !== 'user') {
      router.push('/login')
    }
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/')
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>

      <div style={{ background: '#f8f9fa', padding: '2rem', borderRadius: '8px', textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Welcome User!</h2>
        <p>Manage your trading account and referrals below.</p>
      </div>

      <ReferralLink />
      <ReferralStats />

      <div style={{ marginTop: '2rem' }}>
        <ReferralTree maxDepth={5} />
      </div>
    </div>
  )
}
