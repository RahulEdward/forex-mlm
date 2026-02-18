'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Check, Menu, X, ChevronRight, Zap, Shield, BarChart3, Globe, Cpu, LayoutDashboard, PieChart, Settings, Users, FileText, TrendingUp, DollarSign, Network, Sun, Moon, Lock, Mail, Search, Headphones, MessageSquare, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { StarBackground } from '@/components/landing/StarBackground'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-[#030303] text-zinc-900 dark:text-white selection:bg-orange-500/30 font-sans transition-colors duration-300">
      <div className="fixed inset-0 z-0 pointer-events-none hidden dark:block">
        <StarBackground />
      </div>

      {/* Cosmic Navbar - Sticky & Floating */}
      <header className="fixed top-2 z-50 w-full lg:top-5 px-4 font-sans">
        <div className="container mx-auto">
          <div className="bg-white/70 dark:bg-black/70 flex items-center justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 p-3 backdrop-blur-xl shadow-sm">

            {/* Logo */}
            <Link href="/" className="flex font-bold items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-tr from-orange-500 via-orange-500/70 to-orange-500 border border-orange-400/50 shadow-lg shadow-orange-500/20">
                <Sun className="h-5 w-5 text-white" />
              </span>
              <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">AuthShield</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="#features">
                <Button variant="ghost" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-white/10">
                  Features
                </Button>
              </Link>
              <Link href="#benefits">
                <Button variant="ghost" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-white/10">
                  Solutions
                </Button>
              </Link>
              <Link href="#">
                <Button variant="ghost" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-white/10">
                  Pricing
                </Button>
              </Link>
              <Link href="#">
                <Button variant="ghost" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-white/10">
                  Team
                </Button>
              </Link>
              <Link href="#">
                <Button variant="ghost" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-white hover:bg-orange-50 dark:hover:bg-white/10">
                  Contact
                </Button>
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {mounted && theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              <div className="h-6 w-px bg-zinc-200 dark:bg-white/10 mx-1" />

              <Link href="/login">
                <Button variant="ghost" className="text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-white/10">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-[#C26E38] hover:bg-[#a85d2e] text-white shadow-lg shadow-orange-500/20">
                  Get Started <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:hidden mt-2 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black/95 backdrop-blur-xl shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <Link href="#features" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 font-medium">Features</Link>
                <Link href="#benefits" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 font-medium">Solutions</Link>
                <Link href="#" className="p-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-400 font-medium">Pricing</Link>
                <div className="h-px bg-zinc-200 dark:bg-white/10 my-2" />
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full justify-center" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    {mounted && theme === 'dark' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />} Theme
                  </Button>
                  <Link href="/login" className="w-full"><Button variant="ghost" className="w-full">Log in</Button></Link>
                </div>
                <Link href="/register"><Button className="w-full bg-[#C26E38]">Get Started</Button></Link>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/[0.03] border border-zinc-200 dark:border-white/[0.08] mb-8 backdrop-blur-sm hover:border-zinc-300 dark:hover:border-white/[0.15] transition-colors cursor-default"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">New: Multi-Broker Bridge Live</span>
            <ChevronRight className="h-3 w-3 text-zinc-400 dark:text-zinc-500 ml-1" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight mb-8 text-zinc-900 dark:text-white leading-[1.1]"
          >
            Automate Trading & <br className="hidden md:block" /> Grow Your Network
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light"
          >
            The ultimate bridge between professional algorithmic trading execution and multi-level marketing growth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 rounded-md bg-[#C26E38] text-white hover:bg-[#a85d2e] font-semibold text-base transition-all">
                Start Trading Now <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="h-12 px-8 rounded-md text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.05] text-base border border-zinc-200 dark:border-white/[0.08]">
              View Strategy
            </Button>
          </motion.div>

          {/* Dashboard Preview / Glow Effect */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative max-w-5xl mx-auto text-left"
          >
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-500/10 via-purple-500/10 to-blue-500/10 blur-xl opacity-75" />
            <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] overflow-hidden shadow-2xl">
              {/* Mock Browser Header */}
              <div className="h-12 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 bg-zinc-50 dark:bg-[#0F0F0F]">
                <div className="flex gap-4 items-center">
                  <Menu className="h-5 w-5 text-zinc-500" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 w-64">
                  <i className="h-4 w-4 text-zinc-500" />
                  <span className="text-xs text-zinc-500">Search Symbols...</span>
                </div>
                <div className="flex gap-4">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-600 dark:text-zinc-300">TR</div>
                </div>
              </div>

              <div className="flex h-[500px]">
                {/* Sidebar Mock */}
                <div className="w-56 border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0F0F0F] p-4 hidden md:block">
                  <div className="space-y-6">
                    <div>
                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Platform</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 rounded-md text-zinc-800 dark:text-zinc-200 text-sm border-l-2 border-orange-500">
                          <TrendingUp className="h-4 w-4 text-orange-500" /> Trading
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-zinc-600 dark:text-zinc-500 text-sm hover:text-zinc-900 dark:hover:text-zinc-300">
                          <Network className="h-4 w-4" /> MLM Tree
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-zinc-600 dark:text-zinc-500 text-sm hover:text-zinc-900 dark:hover:text-zinc-300">
                          <LayoutDashboard className="h-4 w-4" /> Dashboard
                        </div>
                        <div className="flex items-center gap-3 px-3 py-2 text-zinc-600 dark:text-zinc-500 text-sm hover:text-zinc-900 dark:hover:text-zinc-300">
                          <DollarSign className="h-4 w-4" /> Commissions
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content Mock */}
                <div className="flex-1 p-8 bg-zinc-50/50 dark:bg-[#0A0A0A]">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Card 1: Stats */}
                    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0F]">
                      <div className="text-xs text-zinc-500 uppercase">Total Profit</div>
                      <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mt-1">Trading Performance</div>
                      <div className="text-4xl font-bold text-zinc-900 dark:text-white mt-4 mb-6">$4,725.05</div>

                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-500 dark:text-zinc-400">40%</span>
                            <span className="text-zinc-600 dark:text-zinc-500">Forex</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[40%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-500 dark:text-zinc-400">35%</span>
                            <span className="text-zinc-600 dark:text-zinc-500">Crypto</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 w-[35%]" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-zinc-500 dark:text-zinc-400">15%</span>
                            <span className="text-zinc-600 dark:text-zinc-500">Indices</span>
                          </div>
                          <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-pink-500 w-[15%]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card 2: Pie Chart */}
                    <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0F0F0F] flex items-center justify-center">
                      <div className="relative w-48 h-48 rounded-full border-[16px] border-zinc-100 dark:border-zinc-800 flex items-center justify-center">
                        {/* Mock Pie - CSS Conic Gradient */}
                        <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#10b981 0% 25%, #3b82f6 25% 60%, #eab308 60% 85%, #ec4899 85% 100%)', clipPath: 'circle(50% at 50% 50%)', maskImage: 'radial-gradient(transparent 55%, black 56%)' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section - What Do We Bring */}
      <section id="benefits" className="relative z-10 py-32 px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            <div className="sticky top-32">
              <h3 className="text-[#C26E38] font-medium tracking-wide text-sm mb-4 uppercase">Benefits</h3>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">What Do We Bring <br /> to You?</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                All the innovative solutions you need to grow your business are here! We add value to your business with our features that simplify your workflow, increase efficiency and strengthen your decisions.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: "Automated Execution Bridge", desc: "Connect TradingView, Python, or MT4 strategies directly to your broker accounts with zero latency.", num: "01" },
                { title: "Real-Time MLM Tracking", desc: "Monitor your downline, track referral commissions, and manage payouts in real-time.", num: "02" },
                { title: "Secure API Management", desc: "Your broker credentials are encrypted with military-grade security. We never store raw keys.", num: "03" },
                { title: "Multi-Broker Support", desc: "Seamlessly integrate with Angel One, Zerodha, Oanda, and other major brokers from one dashboard.", num: "04" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-2xl bg-[#0F0F0F] hover:bg-[#141414] border border-white/[0.05] hover:border-white/[0.1] transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-12 w-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-[#C26E38]/10 group-hover:border-[#C26E38]/20 transition-colors">
                      <LayoutDashboard className="h-5 w-5 text-zinc-400 group-hover:text-[#C26E38] transition-colors" />
                    </div>
                    <span className="text-4xl font-bold text-zinc-800 group-hover:text-zinc-700 transition-colors select-none">{item.num}</span>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 px-6 bg-[#030303]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h3 className="text-[#C26E38] font-medium tracking-wide text-sm mb-4 uppercase">Features</h3>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Everything You Need to Succeed</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Our comprehensive platform provides all the tools you need to optimize your website, boost performance, and enhance user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "AI-Powered Optimization",
                desc: "Our intelligent algorithms automatically enhance your website's performance, speed, and user experience.",
                icon: Zap
              },
              {
                title: "Real-Time Analytics",
                desc: "Monitor your website's performance metrics and optimization improvements with comprehensive dashboards.",
                icon: BarChart3
              },
              {
                title: "SEO Enhancement",
                desc: "Boost your search engine rankings with AI-driven content and metadata optimization suggestions.",
                icon: Globe
              },
              {
                title: "Advanced Security",
                desc: "Protect your website with intelligent threat detection and automated security enhancements.",
                icon: Shield
              },
              {
                title: "Smart Integrations",
                desc: "Connect seamlessly with your existing tools and platforms through our extensive API ecosystem.",
                icon: Cpu
              },
              {
                title: "24/7 AI Monitoring",
                desc: "Our AI constantly monitors your website, making real-time adjustments to maintain peak performance.",
                icon: Lock
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-[#0A0A0A] border border-white/[0.05] hover:border-[#C26E38]/20 transition-all duration-300 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-white pr-4">{item.title}</h3>
                  <div className="shrink-0 h-10 w-10 rounded-full bg-[#C26E38]/10 border border-[#C26E38]/20 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-[#C26E38]" />
                  </div>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-32 px-6 bg-[#030303]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Loved by Teams Worldwide</h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Don't just take our word for it. See what our customers have to say about their experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { text: "This platform transformed our workflow! The automation features saved us countless hours, and the support team is fantastic!", author: "Sarah J.", role: "CTO, TechFlow" },
              { text: "I can’t imagine running my business without this tool. The insights from the analytics have helped us make smarter decisions.", author: "Michael R.", role: "Founder, ScaleUp" },
              { text: "Great integration options! Connecting our existing tools was a breeze, and it’s improved our overall efficiency.", author: "David L.", role: "Manager, OmniCorp" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-[#0A0A0A] border border-white/[0.05] relative"
              >
                <div className="flex gap-1 text-[#C26E38] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-zinc-300 mb-6 italic">"{item.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500 font-bold">
                    {item.author[0]}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{item.author}</div>
                    <div className="text-zinc-600 text-xs">{item.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative z-10 py-32 px-6 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Get Unlimited Access</h2>
            <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
              Enjoy unlimited access to all features and resources, empowering your business to grow without limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$49", desc: "Perfect for small websites and blogs.", features: ["Up to 5 pages", "Basic optimization", "Weekly reports", "Email support"] },
              { name: "Pro", price: "$99", desc: "Ideal for growing businesses and e-commerce.", features: ["Up to 25 pages", "Advanced optimization", "Daily reports", "Priority email support", "SEO recommendations"], popular: true },
              { name: "Enterprise", price: "$199", desc: "For large websites with complex needs.", features: ["Unlimited pages", "Custom optimization rules", "Real-time monitoring", "24/7 phone & email support", "Advanced API access"] },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-2xl border ${item.popular ? 'bg-[#0f0f0f] border-[#C26E38]/50 ring-1 ring-[#C26E38]/20' : 'bg-[#0A0A0A] border-white/[0.05]'} flex flex-col relative overflow-hidden`}
              >
                {item.popular && (
                  <div className="absolute top-0 right-0 bg-[#C26E38] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <div className="text-3xl font-bold text-white mb-4">{item.price}<span className="text-lg font-normal text-zinc-500">/mo</span></div>
                <p className="text-zinc-400 text-sm mb-8">{item.desc}</p>

                <div className="space-y-4 mb-8 flex-1">
                  {item.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="h-4 w-4 text-[#C26E38]" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button className={`w-full ${item.popular ? 'bg-[#C26E38] hover:bg-[#a85d2e]' : 'bg-white/10 hover:bg-white/20'} text-white`}>
                  Get Started
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 bg-[#030303]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-tight">Ready to Transform <br /> Your Website?</h2>
          <p className="text-zinc-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have optimized their websites and boosted conversions with our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-full text-lg font-medium backdrop-blur-sm transition-all">
              <MessageSquare className="mr-2 h-5 w-5" /> Join Discord
            </Button>
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 bg-[#C26E38] hover:bg-[#a85d2e] text-white rounded-full text-lg font-medium">
                Get Started <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-black pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <span className="font-bold text-orange-500 text-sm">A</span>
                </div>
                <span className="font-bold text-zinc-900 dark:text-zinc-300 text-xl">AuthShield</span>
              </div>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8">
                Meet our AI-powered SaaS solution to lighten your workload, increase efficiency and make more accurate decisions.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:bg-[#C26E38] hover:text-white transition-colors cursor-pointer">
                    <Globe className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Company</h4>
              <div className="space-y-4 flex flex-col text-zinc-500 dark:text-zinc-400">
                <Link href="#" className="hover:text-[#C26E38] transition-colors">About Us</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Careers</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Blog</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Contact</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-zinc-900 dark:text-white mb-6">Resources</h4>
              <div className="space-y-4 flex flex-col text-zinc-500 dark:text-zinc-400">
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Documentation</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Help Center</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Terms of Service</Link>
                <Link href="#" className="hover:text-[#C26E38] transition-colors">Privacy Policy</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-200 dark:border-white/[0.08] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-500 text-sm">
              © 2026 AuthShield Inc. All rights reserved. <span className="text-zinc-400">Built by Abhishek Technology Pvt Ltd.</span>
            </div>
            <div className="flex gap-8 text-sm text-zinc-500">
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
