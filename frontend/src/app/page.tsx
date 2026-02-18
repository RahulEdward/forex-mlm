'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, ShieldCheck, Zap, Server, Lock, Fingerprint, LayoutDashboard, Moon, Sun } from 'lucide-react'

export default function LandingPage() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check system preference or localStorage
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setIsDark(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.theme = 'light'
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.theme = 'dark'
      setIsDark(true)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Navigation */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Lock className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">AuthShield</span>
        </div>

        <nav className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
          <Link href="#security" className="hover:text-primary transition-colors">Security</Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <div className="h-4 w-[1px] bg-border mx-1 hidden sm:block"></div>
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="hidden sm:inline-flex">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 px-6 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background opacity-70" />

          <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-backwards">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm text-muted-foreground bg-background/50 backdrop-blur-sm mb-4 hover:bg-background/80 transition-colors cursor-default">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              v2.0 is now live
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight pb-2">
              Secure Authentication <br />
              <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">Simplified.</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A production-ready FastAPI + Next.js template featuring role-based access control, JWT authentication, and a modern dashboard.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto text-base h-12 px-8 shadow-lg shadow-primary/25 transition-transform hover:scale-105 active:scale-95">
                  Start Building
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link href="https://github.com/fastapi/fastapi" target="_blank">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base h-12 px-8 bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground transition-transform hover:scale-105 active:scale-95">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Enterprise-Grade Features</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Everything you need to build secure, scalable applications out of the box.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "Role-Based Access",
                  description: "Granular permission controls for Super Admins, Admins, and standard Users."
                },
                {
                  icon: Zap,
                  title: "High Performance",
                  description: "Powered by FastAPI's asynchronous engine and Next.js server-side rendering."
                },
                {
                  icon: LayoutDashboard,
                  title: "Modern Dashboard",
                  description: "Beautiful, responsive admin interfaces built with Tailwind CSS and Radix UI."
                },
                {
                  icon: Lock,
                  title: "JWT Security",
                  description: "Stateless authentication using JSON Web Tokens with automatic expiration."
                },
                {
                  icon: Fingerprint,
                  title: "Secure Identity",
                  description: "Password hashing with bcrypt and secure session management practices."
                },
                {
                  icon: Server,
                  title: "Database Ready",
                  description: "SQLAlchemy ORM integration with SQLite (easily scalable to PostgreSQL)."
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-1.5 rounded-md">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-lg">AuthShield</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AuthShield. Open Source MIT License.
          </p>
        </div>
      </footer>
    </div>
  )
}
