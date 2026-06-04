import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { 
  LayoutDashboard, 
  BarChart3, 
  Briefcase, 
  Settings as SettingsIcon, 
  HelpCircle, 
  LogOut,
  Bell,
  UploadCloud,
  TrendingUp,
  DollarSign,
  Loader2,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Zap
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { useUploadResume, useAnalyzeResume } from "@/hooks/useAnalysis"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { ThemeToggle } from "@/components/ThemeToggle"

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
  const content = (
    <>
      <Icon className={cn("w-5 h-5 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="font-semibold tracking-tight">{label}</span>
    </>
  )

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-left",
          active 
            ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        )}
      >
        {content}
      </button>
    )
  }

  return (
    <Link 
      to={href} 
      className={cn(
        "flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group",
        active 
          ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {content}
    </Link>
  )
}

const ANALYSIS_STEPS = [
  "Parsing resume structure...",
  "Extracting entities and skills...",
  "Running semantic analysis...",
  "Generating match score...",
  "Preparing your results...",
]

const FullPageLoader = () => {
  const [stepIndex, setStepIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(i => (i + 1) % ANALYSIS_STEPS.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-md flex flex-col items-center justify-center gap-10"
    >
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-[6px] border-primary/10" />
        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Cpu className="w-10 h-10 text-primary" />
          </motion.div>
        </div>
      </div>
      <div className="text-center space-y-4 max-w-sm">
        <h2 className="text-3xl font-black tracking-tighter">Analyzing Resume</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={stepIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="text-muted-foreground text-base font-medium h-6"
          >
            {ANALYSIS_STEPS[stepIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full border border-border">
         <ShieldCheck className="w-4 h-4 text-success" />
         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Privacy Shield Enabled</span>
      </div>
    </motion.div>
  )
}

const Dashboard = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const logoutMutation = useLogout()
  const uploadMutation = useUploadResume()
  const analyzeMutation = useAnalyzeResume()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null) // Reset error on new file
    }
  }

  const handleAnalyze = () => {
    if (file && jd) {
      const formData = new FormData()
      formData.append("resume", file)
      formData.append("job_description", jd)
      setIsAnalyzing(true)
      setError(null)
      
      uploadMutation.mutate(formData, {
        onSuccess: (data: any) => {
          navigate(`/analytics?id=${data.result_id}`)
        },
        onError: (err: any) => {
          setIsAnalyzing(false)
          setError(err.response?.data?.detail || "An error occurred. Please ensure your file is a valid resume.")
        }
      })
    }
  }

  
  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 transition-colors duration-500">
      <AnimatePresence>{isAnalyzing && <FullPageLoader />}</AnimatePresence>
      
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col p-8 fixed inset-y-0 h-screen overflow-y-auto z-40">
        <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">C</div>
          <span className="text-2xl font-black tracking-tighter text-foreground">CVPilot</span>
        </div>

        <div className="space-y-1.5 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
          <SidebarItem icon={SettingsIcon} label="Settings" href="/settings" />
        </div>

        <div className="pt-8 border-t border-border/40 mt-auto space-y-6">
           <div className="px-4 py-3 flex items-center justify-between bg-muted/10 rounded-2xl border border-border/20">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Interface</span>
              <ThemeToggle className="w-8 h-8 scale-90" />
           </div>

           <div className="space-y-1.5">
             <SidebarItem icon={HelpCircle} label="Help Center" href="/help" />
             <SidebarItem 
              icon={LogOut} 
              label={logoutMutation.isPending ? "Logging out..." : "Logout"} 
              href="#" 
              onClick={handleLogout} 
            />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-10 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 max-w-6xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">
               Recruitment Intelligence
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Welcome back,</h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">Ready to optimize your professional trajectory?</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground relative hover:bg-secondary transition-all hover:scale-105 active:scale-95 shadow-sm">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-card animate-pulse" />
             </button>
             <button className="flex items-center gap-4 p-1.5 pr-6 bg-card border border-border/50 rounded-2xl hover:bg-secondary transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm">
                <img src="https://ui-avatars.com/api/?name=User&background=2563EB&color=fff&size=80" alt="Avatar" className="w-10 h-10 rounded-xl shadow-md shadow-primary/10" />
                <span className="text-sm font-bold opacity-80">Job Seeker</span>
             </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 max-w-7xl">
          
          {/* Main Action Column */}
          <div className="xl:col-span-8 space-y-10">
            {/* Analysis Tool Card */}
            <div className="bg-card p-12 rounded-[48px] border border-border/50 relative overflow-hidden group shadow-premium">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
               <div className="relative z-10 text-center mb-12">
                  <h2 className="text-3xl font-black mb-3 tracking-tight">Rapid Analysis</h2>
                  <p className="text-muted-foreground font-medium text-base">Align your skills with the market in under 30 seconds.</p>
               </div>
               
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                  {/* Upload Zone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group-card border-2 border-dashed border-border/60 hover:border-primary/40 hover:bg-primary/[0.02] rounded-[32px] p-10 flex flex-col items-center justify-center gap-5 transition-all cursor-pointer relative"
                  >
                    <div className={cn(
                       "w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-lg shadow-primary/5",
                       file ? "bg-success text-white" : "bg-primary/5 text-primary"
                    )}>
                       {file ? <ShieldCheck className="w-8 h-8" /> : <UploadCloud className="w-8 h-8 group-hover:scale-110 transition-transform" />}
                    </div>
                    <div className="text-center">
                       <p className="font-extrabold text-lg tracking-tight truncate max-w-[200px]">{file ? file.name : "Resume Document"}</p>
                       <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-1.5 opacity-60">
                        {uploadMutation.isPending ? "Processing..." : "PDF, DOCX (Max 10MB)"}
                       </p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="h-10 px-6 rounded-xl text-xs font-bold bg-background/50 hover:bg-secondary border-none"
                    >
                      {file ? "Replace File" : "Select Source"}
                    </Button>
                    <input 
                      ref={fileInputRef}
                      id="resume-upload" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx" 
                      onChange={handleFileChange} 
                    />
                  </div>

                  {/* Context Input */}
                  <div className="border border-border/50 bg-secondary/30 rounded-[32px] p-8 flex flex-col group/jd focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <div className="flex items-center justify-between mb-5">
                       <p className="font-black text-xs uppercase tracking-widest opacity-60">Job Target</p>
                       <Zap className="w-4 h-4 text-orange-500 opacity-60" />
                    </div>
                    <textarea 
                      placeholder="Paste job description or requirements here..." 
                      value={jd}
                      onChange={(e) => setJd(e.target.value)}
                      className="w-full flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium leading-relaxed resize-none placeholder:text-muted-foreground/40"
                    />
                  </div>
               </div>
               
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm font-bold text-center relative z-10"
                    >
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {file && jd && (
                    <motion.div 
                     initial={{ opacity: 0, y: 20 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     className="mt-12 flex flex-col items-center gap-6 relative z-10"
                    >

                      <Button 
                        size="lg"
                        className="h-16 px-16 rounded-[24px] font-black text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        onClick={handleAnalyze}
                        disabled={analyzeMutation.isPending || !file}
                      >
                        {analyzeMutation.isPending && <Loader2 className="w-5 h-5 animate-spin mr-3" />}
                        {analyzeMutation.isPending ? "Initializing..." : "Begin Neural Match"}
                      </Button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>

            {/* Smart Matches */}
            <div>
              <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                   <TrendingUp className="w-6 h-6 text-primary" />
                   Priority Opportunities
                </h3>
                <Link to="/matches" className="group flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:opacity-80 transition-opacity">
                   Explore All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {[
                  { title: 'Senior AI Engineer', company: 'Synthetix', match: 98, salary: '160k - 210k', gradient: 'from-orange-500 to-red-500' },
                  { title: 'Full Stack Tech Lead', company: 'FinStream', match: 82, salary: '140k - 185k', gradient: 'from-blue-600 to-indigo-600' },
                  { title: 'Frontend Architect', company: 'Velocity', match: 75, salary: '175k - 225k', gradient: 'from-emerald-500 to-teal-500' }
                 ].map((job, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-card p-8 rounded-[32px] border border-border/50 shadow-sm hover:shadow-premium transition-all relative overflow-hidden group"
                   >
                     <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2" />
                     <div className="flex justify-between items-start mb-8">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg", `bg-gradient-to-br ${job.gradient}`)}>
                           <Briefcase className="w-6 h-6" />
                        </div>
                        <div className={cn(
                          "text-[10px] font-black px-3 py-1.5 rounded-full tracking-widest shadow-sm",
                          job.match > 90 ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                        )}>
                          {job.match}% MATCH
                        </div>
                     </div>
                     <h4 className="font-extrabold text-lg mb-1 truncate tracking-tight">{job.title}</h4>
                     <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60 mb-8">{job.company}</p>
                     
                     <div className="pt-6 border-t border-border/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{job.salary}</span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>

          {/* Side Context Column */}
          <div className="xl:col-span-4 space-y-10">
             {/* Dynamic Score Analytics */}
             <div className="bg-card p-10 rounded-[40px] border border-border/50 shadow-premium relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                <div className="relative z-10 flex items-center justify-between mb-10 font-black">
                   <p className="text-[11px] text-muted-foreground uppercase tracking-[0.3em]">Trajectory Score</p>
                   <TrendingUp className="w-5 h-5 text-success" />
                </div>
                <div className="relative z-10 flex items-center justify-around">
                   <div className="flex items-baseline gap-1.5">
                      <span className="text-6xl font-black tracking-tighter">84</span>
                      <span className="text-muted-foreground font-bold opacity-40">/100</span>
                   </div>
                   <div className="relative w-24 h-24">
                      <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                        <circle cx="48" cy="48" r="40" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - 0.84)} className="text-primary" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                         <TrendingUp className="w-8 h-8" />
                      </div>
                   </div>
                </div>
                <div className="relative z-10 mt-10 p-4 bg-success/5 rounded-[20px] border border-success/10 flex items-center gap-4">
                   <div className="w-10 h-10 bg-success rounded-xl flex items-center justify-center text-white shadow-lg shadow-success/10">
                      <TrendingUp className="w-5 h-5" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-success uppercase tracking-widest">+12.4% Surge</p>
                      <p className="text-[10px] font-bold text-muted-foreground opacity-70">Impact since last audit</p>
                   </div>
                </div>
             </div>

             {/* Semantic Skill Cloud */}
             <div className="bg-card p-10 rounded-[40px] border border-border/50">
                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-10 opacity-60 font-sans">Top Core Competencies</p>
                <div className="flex flex-wrap gap-3">
                   {[
                    { label: 'TypeScript', lvl: '94%' },
                    { label: 'Cloud Architecture', lvl: '88%' },
                    { label: 'LLM Pipeline', lvl: '91%' },
                    { label: 'React Native', lvl: '76%' },
                    { label: 'Security Ops', lvl: '82%' }
                   ].map((skill) => (
                     <div key={skill.label} className="group cursor-default">
                       <span className="px-5 py-2.5 bg-secondary/80 text-foreground rounded-2xl text-[11px] font-extrabold border border-border/40 flex items-center gap-3 transition-all group-hover:border-primary/40 group-hover:bg-card">
                         {skill.label}
                         <span className="text-[9px] text-primary opacity-40 group-hover:opacity-100">{skill.lvl}</span>
                       </span>
                     </div>
                   ))}
                </div>
             </div>

             {/* Growth Plan Upgrade */}
             <div className="bg-primary p-12 rounded-[40px] text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <h4 className="text-2xl font-black mb-4 tracking-tight">Expand Intelligence</h4>
                <p className="text-sm font-semibold opacity-80 leading-relaxed mb-10">
                  Unlock deep-dives into industry skill gaps and neural interview simulations.
                </p>
                <Button className="w-full h-14 rounded-2xl bg-white text-primary hover:bg-white/90 font-black shadow-xl transition-transform hover:scale-105 active:scale-95 group-hover:rotate-1">
                  UPGRADE TO PRO
                </Button>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard
