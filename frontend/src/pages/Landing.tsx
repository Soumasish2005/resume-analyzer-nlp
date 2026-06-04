import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Shield, Zap, Star, Globe, Zap as ZapIcon, Layout, FileText, Target } from "lucide-react"
import { Link } from "react-router-dom"
import { ThemeToggle } from "@/components/ThemeToggle"

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 transition-colors duration-500">
      {/* Refined Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] mix-blend-multiply" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] mix-blend-multiply" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center shadow-lg shadow-primary/20 transition-all group-hover:rotate-6">
              <span className="text-white font-black text-xl">C</span>
            </div>
            <span className="text-2xl font-black tracking-tight font-heading">CVPilot</span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <a href="#features" className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-[13px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Link to="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Login</Link>
            <Button asChild className="rounded-full px-8 h-11 font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-20 pb-32 lg:pt-14 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <h1 className="text-4xl lg:text-6xl font-black leading-[0.95] mb-10 tracking-tighter font-heading text-gradient">
              Optimize your resume with <span className="text-primary italic">AI Precision</span>.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-14 max-w-xl font-medium">
              Go beyond simple keywords. CVPilot uses advanced semantic analysis to align your professional profile with top-tier job requirements.
            </p>
            <div className="flex flex-wrap gap-6">
              <Button size="lg" className="rounded-[20px] gap-3 h-16 px-10 text-lg font-black shadow-2xl shadow-primary/30 hover:translate-y-[-4px] transition-all">
                Analyze My Resume <ArrowRight className="w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-[20px] h-16 px-10 text-lg font-bold border-2 hover:bg-secondary transition-all">
                View Sample Report
              </Button>
            </div>

            <div className="mt-16 flex items-center gap-6">
              <div className="flex -space-x-3 items-center">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-12 h-12 rounded-2xl border-4 border-background shadow-lg object-cover" alt="User" />
                ))}
                <div className="w-12 h-12 rounded-2xl border-4 border-background bg-secondary flex items-center justify-center text-[10px] font-black shadow-lg">+1k</div>
              </div>
              <p className="text-sm font-bold text-muted-foreground tracking-tight underline decoration-primary/20 underline-offset-8">
                <span className="text-foreground font-black">1,200+</span> professionals analyzed today
              </p>
            </div>
          </motion.div>

          {/* Product View Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 p-2 bg-card rounded-[48px] shadow-premium border border-border/40 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop"
                alt="Architecture"
                className="rounded-[40px] w-full object-cover aspect-[4/5]"
              />

              {/* Overlay HUD Elements */}
              <div className="absolute inset-x-8 bottom-8 p-6 glass rounded-3xl shadow-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Compatibility Vector</span>
                  <span className="text-[10px] font-black text-success">HIGH</span>
                </div>
                <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "92%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            </div>

            {/* Floating UI Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-20 glass p-6 rounded-3xl shadow-2xl z-20 border-primary/20 w-48"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <Target className="w-6 h-6" />
                </div>
                <p className="text-3xl font-black tracking-tight text-foreground">92%</p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Match Score</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ x: [0, 15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -left-12 bottom-24 glass p-5 rounded-2xl shadow-2xl z-20 border-border/40"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center text-success">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Achievement</p>
                  <p className="text-xs font-black text-foreground">Top 1% React Devs</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </header>

      {/* Social Trust */}
      <section className="py-8 border-y border-border/40 bg-secondary/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.4em] text-center mb-16 opacity-40">Success stories at industry leaders</p>
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-12 items-center opacity-40 grayscale group">
            {['GOOGLE', 'STRIPE', 'AIRBNB', 'REVOLUT', 'NETFLIX', 'PIXAR'].map((name) => (
              <span key={name} className="text-2xl font-black tracking-tighter hover:grayscale-0 hover:opacity-100 hover:text-primary transition-all cursor-default duration-500 font-heading">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-40 max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Core Intelligence</span>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter font-heading">AI-Driven Professional Growth</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Stop guessing what recruiters want. CVPilot uses NLP and enterprise-grade intelligence to dissect career patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Featured Feature */}
          <div className="md:col-span-8 bg-card p-12 lg:p-16 rounded-[48px] border border-border/40 hover:border-primary/20 transition-all shadow-sm hover:shadow-premium group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex flex-col lg:flex-row gap-16 relative z-10">
              <div className="flex-1">
                <div className="w-16 h-16 bg-primary/10 rounded-[22px] flex items-center justify-center text-primary mb-10 shadow-inner">
                  <ZapIcon className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-black mb-8 tracking-tight font-heading">Contextual Keyword Analysis</h3>
                <p className="text-lg text-muted-foreground leading-relaxed mb-12 font-medium">
                  Our NLP engine identifies the exact skills and experience patterns recruiters prioritize, even when they're hidden in complex job descriptions.
                </p>
                <div className="flex gap-10">
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-foreground">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    Hard Skill IQ
                  </div>
                  <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-foreground">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center text-success border border-success/20">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    Soft Context
                  </div>
                </div>
              </div>
              <div className="lg:w-[45%] glass rounded-[32px] p-8 border-border/20 group-hover:scale-105 transition-transform duration-700 shadow-2xl relative">
                <div className="space-y-6">
                  {[
                    { label: "Semantic Flow", w: "85%", o: 0.3 },
                    { label: "Entity Density", w: "62%", o: 0.5 },
                    { label: "Recruiter Relevance", w: "92%", o: 0.7 }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                        <span>{bar.label}</span>
                        <span>{bar.w}</span>
                      </div>
                      <div className="h-2 w-full bg-muted/40 rounded-full overflow-hidden p-[2px]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: bar.w }}
                          transition={{ duration: 1.5, delay: 0.2 * i }}
                          className="h-full bg-primary rounded-full shadow-lg shadow-primary/20"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-12 pt-8 border-t border-border/20 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-[10px] font-black italic">!</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">High Data Correlation detected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Vertical */}
          <div className="md:col-span-4 bg-primary p-12 rounded-[48px] text-primary-foreground relative overflow-hidden group shadow-2xl shadow-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="w-16 h-16 bg-white/10 rounded-[22px] flex items-center justify-center mb-10 border border-white/10 backdrop-blur-md">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-black mb-8 tracking-tighter font-heading uppercase">Enterprise Privacy</h3>
            <p className="text-lg text-primary-foreground/70 leading-relaxed mb-12 font-medium">
              Your professional data is encrypted at rest and in transit. We never sell your data to third-party recruiters.
            </p>
            <Link to="#" className="inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] group border-b border-transparent hover:border-white transition-all pb-1">
              READ SECURITY WHITEBOARD
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Instant Feedback Card */}
          <div className="md:col-span-5 bg-card p-12 rounded-[48px] border border-border/40 hover:border-primary/20 transition-all flex flex-col justify-between shadow-sm hover:shadow-premium group">
            <div>
              <div className="w-16 h-16 bg-orange-500/10 rounded-[22px] flex items-center justify-center text-orange-500 mb-10 shadow-inner">
                <ZapIcon className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black mb-8 tracking-tight font-heading">Live Feedback Edge</h3>
              <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                See real-time scoring updates as you refine your resume. Gain an immediate advantage over static applications.
              </p>
            </div>
            <div className="mt-12 p-8 bg-secondary/50 rounded-3xl border border-border border-dashed text-center group-hover:bg-primary/5 group-hover:border-primary/30 transition-colors">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mr-4">Resume Score:</span>
              <span className="text-2xl font-black text-foreground tracking-tighter">85 <span className="text-muted-foreground/30 text-lg">/ 100</span></span>
            </div>
          </div>

          {/* Global Reach Card */}
          <div className="md:col-span-7 bg-secondary/20 p-12 rounded-[48px] border border-border/40 flex flex-col md:flex-row items-center gap-16 overflow-hidden relative shadow-sm group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.03),transparent)] pointer-events-none" />
            <div className="flex-1 relative z-10">
              <div className="w-12 h-12 bg-card rounded-2xl flex items-center justify-center text-primary mb-8 border border-border/50 shadow-sm">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black mb-8 tracking-tight font-heading">Global Compatibility</h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-12 font-medium">
                CVPilot understands international hiring standards, from Silicon Valley startups to Fortune 500 conglomerates in EMEA and APAC.
              </p>
              <div className="flex flex-wrap gap-3">
                {['US/CA', 'EUROPE', 'APAC', 'MENA'].map(region => (
                  <div key={region} className="text-[9px] font-black px-4 py-2 bg-card rounded-full border border-border/60 hover:border-primary/40 transition-colors cursor-default shadow-sm tracking-[0.1em]">{region}</div>
                ))}
              </div>
            </div>
            <div className="flex-1 relative hidden lg:block">
              <Layout className="w-full h-full text-foreground opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 rotate-12" />
              <div className="grid grid-cols-2 gap-4 relative z-10">
                {[
                  { icon: FileText, c: "bg-blue-500" },
                  { icon: Shield, c: "bg-emerald-500" },
                  { icon: Target, c: "bg-primary" },
                  { icon: Globe, c: "bg-violet-500" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, rotate: 2 }}
                    className="bg-card p-6 rounded-3xl border border-border/60 shadow-xl shadow-black/5 flex flex-col gap-4"
                  >
                    <div className={`w-8 h-8 ${item.c} rounded-xl flex items-center justify-center text-white`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-8 bg-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.02),transparent)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Operation Protocol</span>
          <h2 className="text-4xl lg:text-6xl font-black mb-32 tracking-tighter font-heading text-gradient underline underline-offset-[16px] decoration-primary/10">Modern Hiring, <span className="text-primary italic">Simpler</span>.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24 relative">
            {[
              { step: 1, title: 'Intelligent Upload', desc: 'Securely drop your CV. Our parser handles formatting with great precision.', icon: FileText },
              { step: 2, title: 'Context Mapping', desc: 'Provide the job target. We perform a cross-functional semantic alignment in seconds.', icon: Target },
              { step: 3, title: 'Final Refinement', desc: 'Apply our suggestions to bypass automated filters and reach human recruiters.', icon: ZapIcon },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative group p-4"
              >
                <div className="w-24 h-24 rounded-[32px] bg-card border border-border/60 flex items-center justify-center text-primary mx-auto mb-12 shadow-premium transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 group-hover:shadow-primary/30 relative">
                  <item.icon className="w-10 h-10" />
                  <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary border border-border text-[10px] font-black text-foreground flex items-center justify-center shadow-lg group-hover:bg-white group-hover:text-primary transition-colors">0{item.step}</span>
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight font-heading">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium text-base md:px-8">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-48 max-w-7xl mx-auto px-6">
        <div className="text-center mb-32 space-y-4">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Value Engineering</span>
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter font-heading text-gradient">Transparent Value</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">Unlock your full career potential with plans tailored to your journey.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Free Tier */}
          <div className="bg-card p-8 rounded-[48px] border border-border/40 hover:border-primary/20 transition-all shadow-sm flex flex-col group">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-10 block opacity-40">Explorer</span>
            <div className="flex items-baseline gap-3 mb-12">
              <span className="text-7xl font-black tracking-tighter text-foreground">$0</span>
              <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">/ Month</span>
            </div>
            <div className="space-y-6 mb-16 flex-1">
              <div className="flex items-center gap-4 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0 border border-success/20">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                12 Deep Analyses / mo
              </div>
              <div className="flex items-center gap-4 text-sm font-bold opacity-40">
                <div className="w-6 h-6 rounded-full bg-secondary text-muted-foreground/60 flex items-center justify-center shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
                Basic Keyword Match
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-secondary group-hover:scale-105 transition-transform">Start Free</Button>
          </div>

          {/* Pro Tier (Featured) */}
          <div className="bg-foreground p-8 lg:p-10 rounded-[56px] relative shadow-[0_50px_100px_-20px_rgba(37,99,235,0.3)] z-10 lg:scale-[1.1] border border-white/10 group overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-10 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-2xl flex items-center gap-3">
              <Zap className="w-3 h-3 animate-pulse" /> Popular
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-12 block">Recruiter Pro</span>
            <div className="flex items-baseline gap-3 mb-12">
              <span className="text-8xl font-black tracking-tighter text-background">$19</span>
              <span className="text-background/40 font-bold uppercase text-[10px] tracking-widest">/ Month</span>
            </div>
            <div className="space-y-8 mb-20">
              {[
                'Infinite Analyses & Matches',
                'NLP Feedback',
                'Better Semantic matching and scoring',
                'Priority Model Access (v2.0)'
              ].map((text) => (
                <div key={text} className="flex items-center gap-6 text-[15px] font-black text-background tracking-tight group/item">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary/30 group-hover/item:scale-125 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  {text}
                </div>
              ))}
            </div>
            <Button className="w-full rounded-[24px] h-18 font-black text-xl bg-white text-primary hover:bg-white/95 shadow-2xl transition-all hover:scale-105 active:scale-95">Go Pro Now</Button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-card p-8 rounded-[48px] border border-border/40 transition-all flex flex-col group">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-10 block opacity-40">Enterprise</span>
            <div className="flex items-baseline gap-3 mb-12">
              <span className="text-6xl font-black tracking-tighter text-foreground italic">Custom</span>
            </div>
            <div className="space-y-6 mb-16 flex-1">
              <div className="flex items-center gap-4 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                High-Volume Processing
              </div>
              <div className="flex items-center gap-4 text-sm font-bold">
                <div className="w-6 h-6 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                Dedicated API & Webhooks
              </div>
            </div>
            <Button variant="outline" className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-[11px] shadow-sm hover:bg-secondary transition-transform group-hover:scale-105">Talk to Sales</Button>
          </div>
        </div>
      </section>

      {/* Final Conversion Section */}
      <section className="py-8 max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-[64px] p-10 lg:p-12 text-center text-primary-foreground relative overflow-hidden shadow-[0_50px_120px_-20px_rgba(37,99,235,0.5)] group">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none group-hover:scale-110 transition-transform duration-[2000ms]" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-8xl font-black mb-16 tracking-tighter font-heading leading-none">Ready to outperform the algorithms?</h2>
            <p className="text-2xl text-primary-foreground/80 mb-16 max-w-xl mx-auto font-medium tracking-tight">
              Join over 50,000 professionals who transformed their job search.
            </p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/95 rounded-[24px] h-20 px-20 text-2xl font-black shadow-2xl transition-all hover:scale-110 active:scale-95 group-hover:rotate-1">
              Start Free Analysis
            </Button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-32 border-t border-border/40 relative overflow-hidden bg-secondary/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 mb-32">
          <div className="md:col-span-1 space-y-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-primary rounded-[10px] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">C</div>
              <span className="text-2xl font-black tracking-tighter font-heading">CVPilot</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed font-medium">
              Empowering careers through neural CV analysis and strategic recruitment intelligence.
            </p>
            <div className="flex gap-6 opacity-30">
              <div className="w-5 h-5 rounded-full bg-foreground" />
              <div className="w-5 h-5 rounded-full bg-foreground" />
              <div className="w-5 h-5 rounded-full bg-foreground" />
            </div>
          </div>
          {[
            { title: 'Product', links: ['Neural Check', 'ATS Bypass', 'Letter AI', 'Match Score'] },
            { title: 'Company', links: ['Security', 'Our Story', 'Privacy Policy', 'Contact'] },
            { title: 'Support', links: ['Documentation', 'API Guide', 'Help Center', 'Pricing'] }
          ].map((group) => (
            <div key={group.title}>
              <h4 className="text-[11px] font-black uppercase tracking-[0.3em] mb-12 text-foreground/40">{group.title}</h4>
              <ul className="space-y-6">
                {group.links.map(link => (
                  <li key={link}><Link to="#" className="text-base text-muted-foreground hover:text-primary transition-colors font-bold tracking-tight">{link}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-10">
          <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.4em]">© 2024 CVPilot. COHORT OF DEEPMIND AI. <span className="text-primary italic ml-2">Secure Node V4.2</span></p>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
            <Link to="#" className="hover:text-primary transition-colors">Twitter (X)</Link>
            <Link to="#" className="hover:text-primary transition-colors">LinkedIn</Link>
            <Link to="#" className="hover:text-primary transition-colors">GitHub</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
