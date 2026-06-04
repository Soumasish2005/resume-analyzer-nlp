import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Eye, EyeOff, User, Lock, Loader2, Star, ShieldCheck, Zap } from "lucide-react"
import { GitHubIcon, GoogleIcon } from "@/components/icons"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useRegister } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/ThemeToggle"

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role] = useState("seeker") 

  const registerMutation = useRegister()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate({ name, email, password, role })
  }

  return (
    <div className="min-h-screen flex font-sans selection:bg-primary/20 transition-colors duration-500 bg-background">
      {/* Left side: branding/Advantage */}
      <div className="hidden lg:flex w-[45%] bg-slate-950 relative overflow-hidden flex-col justify-between p-16 text-white border-r border-white/5">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16 px-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/20 ring-1 ring-white/20">C</div>
            <span className="text-3xl font-black tracking-tighter text-white">CVPilot</span>
          </div>

          <h2 className="text-6xl font-black leading-[1.05] mb-10 tracking-tighter max-w-lg">
             Architect your <span className="text-primary italic">Career</span> with precision.
          </h2>
          <p className="text-xl text-white/50 max-w-md font-medium leading-relaxed">
             Join the elite network of professionals utilizing neural-matching to bypass the noise and land high-impact roles.
          </p>

          <div className="mt-16 space-y-6">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                       <img key={i} src={`https://ui-avatars.com/api/?name=User+${i}&background=random&color=fff`} className="w-10 h-10 rounded-full border-2 border-slate-950 shadow-xl" alt="Match" />
                    ))}
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border-2 border-slate-950 text-[10px] font-black">12k+</div>
                 </div>
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Seekers Optimized</p>
              </div>
          </div>
        </div>

        <div className="relative z-10">
          <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 shadow-2xl max-w-sm group">
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 text-primary fill-primary" />)}
            </div>
            <p className="text-xl font-bold leading-relaxed tracking-tight mb-8">
              "The neural analysis identified gaps I didn't even know existed. Secured a Lead role within 12 days."
            </p>
            <div className="flex items-center gap-4 mt-6">
              <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=2563EB&color=fff" className="w-12 h-12 rounded-2xl shadow-xl transition-transform group-hover:scale-110" alt="User" />
              <div>
                <p className="text-base font-black tracking-tight text-white">Sarah Chen</p>
                <p className="text-[10px] uppercase font-black text-white/40 tracking-widest">Principal at Figma</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Fluid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           <div className="absolute top-[30%] right-[-10%] w-[80%] h-[80%] bg-primary/20 blur-[130px] rounded-full animate-pulse" />
           <div className="absolute bottom-[-5%] left-[-15%] w-[60%] h-[60%] bg-blue-600/10 blur-[100px] rounded-full" />
        </div>
      </div>

      {/* Right side: Register form */}
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
            <h1 className="text-5xl font-black tracking-tighter text-foreground">Create Identity.</h1>
            <p className="text-muted-foreground text-lg font-medium">Initialize your career acceleration sequence.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Professional Label (Full Name)</label>
              <div className="relative group/input">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lexington Dev"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-secondary/30 border border-border/60 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-semibold placeholder:text-muted-foreground/30 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Neural ID (Email)</label>
              <div className="relative group/input">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lex@intelligence.com"
                  required
                  className="w-full h-16 pl-14 pr-6 bg-secondary/30 border border-border/60 rounded-[24px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all font-semibold placeholder:text-muted-foreground/30 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground pl-1">Access Key (Password)</label>
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
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest pl-2 opacity-50">Standard: 8+ Character Entropy Required</p>
            </div>

            <AnimatePresence>
              {registerMutation.isError && (
                 <motion.p 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-destructive font-bold bg-destructive/5 border border-destructive/20 p-4 rounded-2xl shadow-inner"
                 >
                   Sequence Conflict: This identifier is already registered.
                 </motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-start gap-4 px-1">
              <input type="checkbox" id="terms" required className="mt-1 w-[18px] h-[18px] rounded-lg border-border/60 bg-secondary text-primary focus:ring-primary/20 cursor-pointer" />
              <label htmlFor="terms" className="text-xs text-muted-foreground font-bold leading-relaxed cursor-pointer group">
                Agree to the <Link to="#" className="text-primary hover:opacity-70 transition-opacity">Execution Protocols</Link> and <Link to="#" className="text-primary hover:opacity-70 transition-opacity">Privacy Shield</Link>.
              </label>
            </div>

            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-16 rounded-[24px] shadow-2xl shadow-primary/30 font-black text-lg tracking-tight uppercase tracking-widest text-[13px] hover:scale-[1.02] active:scale-[0.98] transition-all mt-4"
            >
              {registerMutation.isPending ? (
                <Loader2 className="w-6 h-6 animate-spin mr-3" />
              ) : null}
              {registerMutation.isPending ? "Configuring Identity..." : "Initialize Session"}
            </Button>
          </form>

          <div className="relative my-12">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.3em] font-black">
              <span className="bg-background px-6 text-muted-foreground opacity-40 italic">Or bridge via</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-10">
            <Button variant="outline" className="rounded-[20px] flex gap-3 h-14 font-bold border-border/60 hover:bg-secondary transition-all shadow-sm">
              <GoogleIcon className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-[20px] flex gap-3 h-14 font-bold border-border/60 hover:bg-secondary transition-all shadow-sm">
              <GitHubIcon className="w-5 h-5 text-foreground" /> GitHub
            </Button>
          </div>

          <p className="text-center mt-12 text-sm font-bold text-muted-foreground">
            Existing operative? <Link to="/login" className="text-primary hover:underline underline-offset-4">Authenticate now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
