import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Github, Mail, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex font-geist">
      {/* Left side: branding/info */}
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-16 text-white">
        <div className="relative z-10">
           <div className="flex items-center gap-2 mb-12">
             <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
               <span className="text-primary font-bold text-xl">C</span>
             </div>
             <span className="text-2xl font-bold tracking-tight">CVPilot</span>
           </div>

           <h2 className="text-5xl font-bold leading-tight mb-8">
             Precision hiring powered by intelligence.
           </h2>
           <p className="text-xl text-white/80 max-w-md">
             Connect with the top 1% of talent using our proprietary AI matching engine and enterprise-grade analytics.
           </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20 inline-block">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                   <div className="w-4 h-4 bg-success rounded-full animate-pulse" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">System Status</p>
                   <p className="text-sm font-bold">Online</p>
                </div>
             </div>
             <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4" />
             </div>
             <p className="text-[10px] mt-3 text-white/60 font-medium">88% Match Accuracy in last 24h</p>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
           <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-blue-400/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 blur-[100px] rounded-full" />
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
          <p className="text-muted text-sm mb-12">Enter your credentials to access your recruiter dashboard.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="rounded-xl flex gap-2 h-12">
               <Github className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-xl flex gap-2 h-12">
               <Mail className="w-5 h-5" /> LinkedIn
            </Button>
          </div>

          <div className="relative mb-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">Or continue with email</span>
            </div>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Work Email</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full h-14 pl-12 pr-12 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
               <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
               <label htmlFor="remember" className="text-sm text-foreground/80 cursor-pointer">Keep me logged in for 30 days</label>
            </div>

            <Button asChild className="w-full h-14 rounded-xl shadow-lg">
              <Link to="/dashboard">Sign In to Dashboard</Link>
            </Button>
          </form>

          <p className="text-center mt-12 text-sm text-muted-foreground">
            Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Get started for free</Link>
          </p>

          <footer className="mt-20 pt-8 border-t border-border flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
             <Link to="#" className="hover:text-primary">Privacy Policy</Link>
             <Link to="#" className="hover:text-primary">Terms of Service</Link>
             <Link to="#" className="hover:text-primary">Contact Support</Link>
          </footer>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
