'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sun, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StarBackground } from '@/components/landing/StarBackground'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('role', data.user.role)

        if (data.user.role === 'super_admin') {
          router.push('/dashboard/super-admin')
        } else if (data.user.role === 'admin') {
          router.push('/dashboard/admin')
        } else {
          router.push('/dashboard/user')
        }
      } else {
        setError(data.detail || 'Login failed')
        setIsLoading(false)
      }
    } catch (err) {
      setError('Connection error')
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#050505]">
      {/* Left Side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-32 relative z-10 bg-background text-foreground">
        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
                <Sun className="h-6 w-6 text-orange-500" />
              </div>
              <span className="font-bold text-xl tracking-tight">AuthShield</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Password</label>
                  <a href="#" className="text-sm font-medium text-orange-500 hover:text-orange-400">Forgot password?</a>
                </div>
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
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </motion.div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold shadow-lg shadow-orange-500/20">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link href="/register" className="font-semibold text-orange-500 hover:text-orange-400">Sign up</Link>
          </div>
        </div>
      </div>

      {/* Right Side: Image & Content */}
      <div className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden border-l border-zinc-800">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1642790106117-e829e14a795f?q=80&w=2600&auto=format&fit=crop"
            alt="Trading"
            className="w-full h-full object-cover opacity-40 mix-blend-overlay"
          />
        </div>

        {/* Star Overlay for Cosmic Vibe */}
        <StarBackground className="absolute inset-0 z-10 opacity-60" />

        {/* Content Overlay */}
        <div className="relative z-20 max-w-lg text-center space-y-6 p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-2"
          >
            <div className="h-20 w-20 bg-gradient-to-tr from-orange-500 to-amber-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-orange-500/20 mb-6 rotate-3 hover:rotate-6 transition-transform duration-500">
              <Sun className="h-10 w-10 text-white fill-white/20" />
            </div>
            <h2 className="text-4xl font-extrabold text-white tracking-tight">Trade Smarter, <br /> Not Harder</h2>
            <p className="text-lg text-zinc-400">Join the world's most advanced decentralized trading platform and take control of your financial future today.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-8 flex justify-center gap-4"
          >
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-zinc-300">
              Secure
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-zinc-300">
              Fast
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs font-mono text-zinc-300">
              Reliable
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
