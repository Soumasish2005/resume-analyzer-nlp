import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Eye, EyeOff, Lock, Loader2, Sparkles, ShieldCheck, Zap } from "lucide-react"
import { GitHubIcon, GoogleIcon } from "@/components/icons"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useLogin } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/ThemeToggle"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const loginMutation = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary/20 transition-colors duration-500 bg-background">
      {/* Left side: Branding/Intelligence */}
      <div className="hidden lg:flex w-[45%] bg-slate-950 relative overflow-hidden flex-col justify-between p-16 text-white border-r border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20 ring-1 ring-white/20">C</div>
            <span className="text-3xl font-black tracking-tighter text-white">CVPilot</span>
          </div>

          <h2 className="text-6xl font-black leading-[1.05] mb-10 tracking-tighter max-w-lg">
            Precision <span className="text-primary italic">Intelligence</span> for the modern workforce.
          </h2>
          <p className="text-xl text-white/50 max-w-md font-medium leading-relaxed">
            Access the world's most advanced neural matching engine to synchronize your career trajectory with the top 1% of opportunities.
          </p>

          <div className="mt-16 space-y-4">
            {[
              { icon: ShieldCheck, text: "Enterprise-grade encryption protocols" },
              { icon: Zap, text: "Sub-30ms neural inference speed" },
              { icon: Sparkles, text: "99.2% matching accuracy index" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-white/60 font-bold uppercase tracking-widest text-[10px]">
                <item.icon className="w-4 h-4 text-primary" />
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl p-8 rounded-[32px] border border-white/10 shadow-2xl inline-block group">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20 shadow-inner group-hover:scale-110 transition-transform">
                <div className="w-4 h-4 bg-success rounded-full animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Network Status</p>
                <p className="text-lg font-black tracking-tight">Active Neural Nodes</p>
              </div>
            </div>
            <div className="w-56 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-primary w-4/5 shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">Load Balance</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest">84% Efficiency</span>
            </div>
          </div>
        </div>

        {/* Decorative Fluid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[10%] right-[-15%] w-[90%] h-[90%] bg-primary/20 blur-[140px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[70%] h-[70%] bg-blue-600/10 blur-[120px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_70%)]" />
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="absolute top-8 right-8 z-50">
          <ThemeToggle />
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="space-y-4 mb-14 text-center lg:text-left">
            <h1 className="text-5xl font-black tracking-tighter text-foreground">Welcome back.</h1>
            <p className="text-muted-foreground text-lg font-medium">Re-establish your intelligence session.</p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-10">
            <Button variant="outline" className="rounded-[20px] flex gap-3 h-14 font-bold border-border/60 hover:bg-secondary transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
              <GoogleIcon className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-[20px] flex gap-3 h-14 font-bold border-border/60 hover:bg-secondary transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
              <GitHubIcon className="w-5 h-5 text-foreground" /> GitHub
            </Button>
          </div>

          <div className="relative mb-14">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
              <span className="bg-background px-6 text-muted-foreground opacity-40 italic">Or utilize email payload</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Email</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@intelligence.com"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-secondary/30 border border-border/60 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-semibold placeholder:text-muted-foreground/30 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">Password</label>
                <Link to="/forgot-password" title="Forgot Access Key" className="text-[10px] font-black text-primary hover:opacity-70 transition-opacity uppercase tracking-widest">Forgot Key?</Link>
              </div>
              <div className="relative group/input">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full h-16 pl-14 pr-14 bg-secondary/30 border border-border/60 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-semibold placeholder:text-muted-foreground/30 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {loginMutation.isError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-destructive font-bold bg-destructive/5 border border-destructive/20 p-4 rounded-2xl flex items-center gap-3 shadow-inner"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Credentials rejected. Please verify and re-submit.
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-4 px-1">
              <input type="checkbox" id="remember" className="w-[18px] h-[18px] rounded-lg border-border/60 bg-secondary text-primary focus:ring-primary/20 cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-muted-foreground font-bold cursor-pointer group hover:text-foreground transition-colors">Maintain authentication for 30 days</label>
            </div>

            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-16 rounded-[24px] shadow-2xl shadow-primary/30 font-black text-lg tracking-tight uppercase tracking-widest text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              {loginMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
              ) : null}
              {loginMutation.isPending ? "Authenticating..." : "Login"}
            </Button>
          </form>

          <p className="text-center mt-16 text-sm font-bold text-muted-foreground">
            New operative? <Link to="/register" className="text-primary hover:underline underline-offset-4 tracking-tight">Initialize new account</Link>
          </p>

          <footer className="mt-24 pt-8 border-t border-border/40 flex justify-center gap-8 text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Protocol</Link>
            <Link to="#" className="hover:text-primary transition-colors">Service Terms</Link>
            <Link to="#" className="hover:text-primary transition-colors">Encryption Info</Link>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  )
}

export default Login
