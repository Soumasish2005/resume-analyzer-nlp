import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Shield, Zap, FileText } from "lucide-react"
import { Link } from "react-router-dom"

const Landing = () => {
  return (
    <div className="min-h-screen bg-background font-geist">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight">CVPilot</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
          <Button asChild className="rounded-full px-6">
            <Link to="/register">Sign Up</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            V2.0 POWERED ANALYSIS
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Land your dream job with AI-powered resume precision.
          </h1>
          <p className="text-lg text-muted mb-10 max-w-lg">
            Optimize your resume against ATS algorithms in seconds. Get personalized insights and score matching for every application.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full gap-2 group">
              Analyze My Resume <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full">
              View Sample Report
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white p-4 rounded-[32px] shadow-2xl border border-border/50 overflow-hidden">
             <img 
              src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="rounded-[24px] w-full object-cover aspect-[4/3]"
            />
            
            {/* Floating Score Widget */}
            <div className="absolute -right-6 top-8 bg-white p-4 rounded-2xl shadow-xl border border-border/50 flex flex-col items-center gap-1 animate-bounce-slow">
               <div className="relative w-16 h-16 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                    <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={175.9} strokeDashoffset={175.9 * (1 - 0.85)} className="text-primary" />
                  </svg>
                  <span className="absolute text-sm font-bold">85</span>
               </div>
               <span className="text-[10px] font-bold text-success uppercase tracking-wider">Excellent</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Trust Section */}
      <section className="py-12 border-y border-border/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
          <p className="text-xs font-bold text-muted uppercase tracking-[0.2em] mb-8">Trusted by candidates at</p>
          <div className="flex flex-wrap justify-center gap-12 grayscale opacity-50">
            {['GOOGLE', 'STRIPE', 'AIRBNB', 'REVOLUT', 'NETFLIX'].map((name) => (
              <span key={name} className="text-xl font-bold tracking-tighter">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">AI-Driven Professional Growth</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Stop guessing what recruiters want. Our platform uses enterprise-grade AI to dissect job descriptions and optimize your profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-[24px] border border-border/50 hover:shadow-xl transition-shadow group lg:col-span-2">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-4">Semantic Keyword Extraction</h3>
                <p className="text-muted text-sm mb-6">
                  Our AI identifies the exact skills and experience recruiters are looking for, even when they're hidden in complex job descriptions.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Hard skill identification
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success" /> Soft skill contextual matching
                  </li>
                </ul>
              </div>
              <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden aspect-video relative">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2/3 h-1/2 bg-primary/20 blur-3xl" />
                 </div>
                 {/* Decorative elements */}
                 <div className="absolute top-4 left-4 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                 </div>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-[24px] border border-border/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-4">Instant Feedback</h3>
            <p className="text-muted text-sm mb-8">
              See real-time scoring as you edit. See exactly how every change impacts your visibility.
            </p>
             <div className="bg-muted px-4 py-3 rounded-xl flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Perfect Score</span>
                <span className="text-xs font-bold text-success">+15% Increase</span>
             </div>
             <div className="mt-4 h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[85%]" />
             </div>
          </div>

           {/* Feature 3 */}
           <div className="bg-primary p-8 rounded-[24px] text-white">
            <Shield className="w-10 h-10 mb-6" />
            <h3 className="text-xl font-bold mb-4 text-white">Enterprise Privacy</h3>
            <p className="text-white/80 text-sm mb-8">
              Your data is encrypted and never sold. We comply with GDPR and CCPA standards to keep your professional journey private.
            </p>
            <Link to="#" className="text-xs font-bold underline underline-offset-4 uppercase tracking-widest">Learn About Security</Link>
          </div>

           {/* Feature 4 */}
           <div className="bg-blue-100 p-8 rounded-[24px] lg:col-span-2 flex flex-col lg:flex-row justify-between items-center overflow-hidden relative">
             <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4 text-slate-900">Tailored Cover Letters</h3>
                <p className="text-slate-600 text-sm mb-8 max-w-sm">
                  Generate job-specific cover letters that highlight your best matching skills automatically.
                </p>
                <Button variant="outline" className="bg-white border-none shadow-sm rounded-xl">Try Better AI</Button>
             </div>
             <div className="lg:w-1/3 mt-8 lg:mt-0">
                <div className="bg-white p-4 rounded-xl shadow-lg transform rotate-6 scale-110 translate-x-12 translate-y-6">
                  <div className="space-y-2">
                    <div className="h-2 w-2/3 bg-slate-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-full bg-slate-100 rounded" />
                    <div className="h-2 w-1/2 bg-slate-100 rounded" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white/30">
        <div className="max-w-7xl mx-auto px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Three Steps to 10x Your Interviews</h2>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { step: 1, title: 'Upload Resume', desc: 'Drag your PDF or Word doc. Our parser extracts every detail with 99% accuracy.' },
                { step: 2, title: 'Paste Job URL', desc: 'Simply provide the LinkedIn or Indeed link. We analyze the job requirements instantly.' },
                { step: 3, title: 'Optimize & Apply', desc: 'Follow the AI suggestions to bridge skill gaps and beat the ATS filters.' },
              ].map((item) => (
                <div key={item.step} className="text-center group">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-xl mx-auto mb-8 group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Pricing - Simple Version */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">Simple, Transparent Pricing</h2>
          <p className="text-muted">Choose the plan that fits your career goals.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-[24px] border border-border/50">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 block">Essential</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted text-sm">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> 2 Analysis per month</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Basic Keyword Match</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full">Get Started</Button>
           </div>
           
           <div className="bg-white p-8 rounded-[24px] border-2 border-primary relative shadow-xl transform scale-105 z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">Most Popular</div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4 block">Recruiter Pro</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">$19</span>
                <span className="text-muted text-sm">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Unlimited Analysis</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> AI Cover Letter Generator</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Interview Prep AI</li>
              </ul>
              <Button className="w-full rounded-full">Go Pro Now</Button>
           </div>

           <div className="bg-white p-8 rounded-[24px] border border-border/50">
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em] mb-4 block">Enterprise</span>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Bulk Processing</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-success" /> Custom API Access</li>
              </ul>
              <Button variant="outline" className="w-full rounded-full">Contact Sales</Button>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 max-w-7xl mx-auto px-8">
        <div className="bg-primary rounded-[32px] p-12 text-center text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
           <h2 className="text-4xl font-bold mb-6 relative z-10">Ready to beat the ATS?</h2>
           <p className="text-white/80 mb-10 relative z-10 max-w-lg mx-auto">
             Join over 50,000 professionals who landed interviews at top tech companies using ResuMatch AI.
           </p>
           <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-12 relative z-10">
             Get Started for Free
           </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
           <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center text-white font-bold text-sm">C</div>
                <span className="font-bold">ResuMatch AI</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Empowering careers through intelligent AI analysis and strategic resume optimization.
              </p>
           </div>
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Product</h4>
              <ul className="space-y-3 text-xs text-muted">
                <li><Link to="#">How it Works</Link></li>
                <li><Link to="#">AI Resume Checker</Link></li>
                <li><Link to="#">Cover Letter AI</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Resources</h4>
              <ul className="space-y-3 text-xs text-muted">
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Career Advice</Link></li>
                <li><Link to="#">Support Center</Link></li>
              </ul>
           </div>
           <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-6">Legal</h4>
              <ul className="space-y-3 text-xs text-muted">
                <li><Link to="#">Privacy Policy</Link></li>
                <li><Link to="#">Terms of Service</Link></li>
                <li><Link to="#">Security</Link></li>
              </ul>
           </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 pt-8 border-t border-border/10 flex justify-between items-center">
           <p className="text-[10px] text-muted">© 2024 Resumematch AI. All rights reserved.</p>
           <div className="flex gap-4">
              {/* Social icons placeholder */}
           </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
