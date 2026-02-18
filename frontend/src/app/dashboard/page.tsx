'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()

  useEffect(() => {
    const role = localStorage.getItem('role')
    
    if (!role) {
      router.push('/login')
      return
    }

    if (role === 'super_admin') {
      router.push('/dashboard/super-admin')
    } else if (role === 'admin') {
      router.push('/dashboard/admin')
    } else {
      router.push('/dashboard/user')
    }
  }, [router])

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      <p>Redirecting...</p>
    </div>
  )
}
