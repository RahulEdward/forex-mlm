'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sun, Mail, Lock, User, Ticket, Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarBackground } from '@/components/landing/StarBackground'

function RegisterComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [referralCode, setReferralCode] = useState(searchParams.get('ref') || '')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const payload: any = { username: name, email, password }
      if (referralCode) payload.referral_code = referralCode

      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...')
        setTimeout(() => router.push('/login'), 2000)
      } else {
        setError(data.detail || 'Registration failed')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Connection error')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505]">

      {/* Left Side: Image & Content (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden border-r border-zinc-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1639322537228-ad71cf7add00?q=80&w=2600&auto=format&fit=crop"
            alt="Network"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>

        <StarBackground className="absolute inset-0 z-10 opacity-60" />

        <div className="relative z-20 max-w-lg text-center space-y-6 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="h-20 w-20 bg-gradient-to-tr from-orange-500 to-rose-500 rounded-full mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6 animate-pulse">
              <User className="h-10 w-10 text-white fill-white/20" />
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Expand Your Network, <br /> Multiply Your Success</h2>
            <p className="text-lg text-zinc-400">Join a community of elite traders and build your own financial empire with our advanced referral system.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 flex justify-center gap-4"
          >
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-xs text-white font-medium">
                  {i > 3 ? '+2k' : ''}
                </div>
              ))}
            </div>
            <div className="flex flex-col text-left justify-center pl-2">
              <span className="text-sm font-bold text-white">2,000+ Traders</span>
              <span className="text-xs text-zinc-500">Joined this week</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 relative z-10 bg-background text-foreground overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-8 py-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
            <p className="text-muted-foreground">Start your journey today. It takes less than a minute.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium leading-none">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none flex items-center gap-2">
                Referral Code <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 uppercase tracking-widest"
                  placeholder="CODE123"
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm font-medium">
                {success}
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold shadow-lg shadow-orange-500/20 h-11">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="font-semibold text-orange-500 hover:text-orange-400">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Register() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-black text-white"><Loader2 className="h-8 w-8 animate-spin text-orange-500" /></div>}>
      <RegisterComponent />
    </Suspense>
  )
}
