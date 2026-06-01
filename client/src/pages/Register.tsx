import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Github, Mail, Eye, EyeOff, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

const Register = () => {
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
             Build your career with precision.
           </h2>
           <p className="text-xl text-white/80 max-w-md">
             Join thousands of seekers using AI to land their dream roles. Your platform for resume optimization and growth.
           </p>
        </div>

        <div className="relative z-10">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[32px] border border-white/20 inline-block max-w-sm">
             <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map(i => <div key={i} className="w-6 h-1 bg-white/20 rounded-full" />)}
             </div>
             <p className="text-lg font-medium leading-relaxed italic">
               "The AI suggestions were spot on. I got 3 interviews in a week after using CVPilot."
             </p>
             <div className="flex items-center gap-3 mt-6">
                <img src="https://ui-avatars.com/api/?name=Sarah+Chen&background=fff&color=0058BE" className="w-10 h-10 rounded-full" alt="User" />
                <div>
                   <p className="text-sm font-bold">Sarah Chen</p>
                   <p className="text-[10px] uppercase font-bold text-white/60">Product Designer at Figma</p>
                </div>
             </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
           <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] bg-blue-400/20 blur-[120px] rounded-full" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/30 blur-[100px] rounded-full" />
        </div>
      </div>

      {/* Right side: Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted text-sm mb-12">Start your journey to a better career today.</p>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                  type="email" 
                  placeholder="name@example.com" 
                  className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
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
              <p className="text-[10px] text-muted-foreground">Must be at least 8 characters long.</p>
            </div>

            <div className="flex items-start gap-3">
               <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
               <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                 By creating an account, you agree to our <Link to="#" className="text-primary hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary hover:underline">Privacy Policy</Link>.
               </label>
            </div>

            <Button className="w-full h-14 rounded-xl shadow-lg">
              Create Account
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground font-medium">Or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button variant="outline" className="rounded-xl flex gap-2 h-12">
               <Github className="w-5 h-5" /> Google
            </Button>
            <Button variant="outline" className="rounded-xl flex gap-2 h-12">
               <Mail className="w-5 h-5" /> LinkedIn
            </Button>
          </div>

          <p className="text-center mt-12 text-sm text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
