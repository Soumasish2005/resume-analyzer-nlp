import { motion } from "framer-motion"
import { 
  BarChart3, 
  Search,
  LayoutDashboard,
  Briefcase,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  MapPin,
  Clock,
  DollarSign,
  ChevronRight,
  Filter,
  ArrowUpRight
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
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

const Matches = () => {
  const location = useLocation()
  const logoutMutation = useLogout()
  
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const jobs = [
    { title: 'Senior AI Engineer', company: 'Synthetix AI', location: 'Remote', salary: '160k - 210k', match: 98, type: 'Full-time', gradient: 'from-orange-500 to-red-500' },
    { title: 'Full Stack Developer', company: 'FinStream', location: 'San Francisco, CA', salary: '140k - 185k', match: 82, type: 'Hybrid', gradient: 'from-blue-600 to-indigo-600' },
    { title: 'Frontend Architect', company: 'Velocity Systems', location: 'New York, NY', salary: '175k - 225k', match: 75, type: 'Full-time', gradient: 'from-emerald-500 to-teal-500' },
    { title: 'Machine Learning Engineer', company: 'DataFlow Inc', location: 'Austin, TX', salary: '150k - 190k', match: 91, type: 'Remote', gradient: 'from-violet-600 to-purple-600' },
    { title: 'Lead Product Designer', company: 'Creative Labs', location: 'Remote', salary: '130k - 170k', match: 64, type: 'Contract', gradient: 'from-pink-500 to-rose-500' },
  ]

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 transition-colors duration-500">
      {/* Sidebar */}
      <aside className="w-72 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col p-8 fixed inset-y-0 h-screen overflow-y-auto z-40">
        <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">C</div>
          <span className="text-2xl font-black tracking-tighter text-foreground">CVPilot</span>
        </div>

        <div className="space-y-1.5 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" active={location.pathname === '/matches'} />
          <SidebarItem icon={Settings} label="Settings" href="/settings" />
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
        <header className="flex items-center justify-between mb-16 max-w-6xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">
               Neural Recommendations
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">Matched Opps</h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">Opportunities synchronized with your semantic profile.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground opacity-60" />
                <input 
                  type="text" 
                  placeholder="Query opportunities..." 
                  className="h-12 pl-12 pr-6 bg-card border border-border/50 rounded-2xl text-sm w-72 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
             </div>
             <button className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all shadow-sm">
                <Filter className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="space-y-6 max-w-6xl">
           {jobs.map((job, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className="bg-card p-8 rounded-[40px] border border-border/50 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-8 hover:border-primary/30 hover:shadow-premium transition-all group relative overflow-hidden"
             >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-center gap-8 relative z-10">
                   <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3", `bg-gradient-to-br ${job.gradient}`)}>
                      <Briefcase className="w-8 h-8" />
                   </div>
                   <div>
                      <div className="flex items-center flex-wrap gap-3 mb-2">
                         <h4 className="font-black text-xl tracking-tight text-foreground">{job.title}</h4>
                         <span className="px-3 py-1 bg-secondary/80 rounded-full text-[9px] font-black uppercase tracking-widest text-muted-foreground border border-border/40">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-6 text-xs text-muted-foreground font-bold uppercase tracking-widest opacity-60">
                         <span className="flex items-center gap-2 underline decoration-primary/20 underline-offset-4">{job.company}</span>
                         <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {job.location}</span>
                         <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Posted 2d ago</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center flex-wrap gap-10 lg:gap-14 relative z-10">
                   <div className="flex flex-col items-end">
                      <div className="flex items-center justify-end gap-2.5 mb-3">
                         <span className={cn(
                           "text-3xl font-black tracking-tighter",
                           job.match > 90 ? "text-success" : job.match > 70 ? "text-primary" : "text-muted-foreground"
                         )}>{job.match}%</span>
                         <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">Accuracy</span>
                      </div>
                      <div className="w-40 h-2 bg-secondary/50 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${job.match}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={cn(
                            "h-full rounded-full shadow-lg",
                            job.match > 90 ? "bg-success" : job.match > 70 ? "bg-primary" : "bg-muted/40"
                          )}
                         />
                      </div>
                   </div>
                   
                   <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-1">Payload</span>
                      <span className="text-base font-black text-foreground tracking-tight">{job.salary}</span>
                   </div>

                   <Button className="rounded-2xl h-14 px-8 font-black shadow-xl shadow-primary/20 group uppercase tracking-widest text-xs">
                      Synchronize <ArrowUpRight className="w-4 h-4 ml-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                   </Button>
                </div>
             </motion.div>
           ))}
        </div>
        
        {/* Footer info */}
        <div className="mt-16 max-w-6xl flex justify-center">
           <div className="flex items-center gap-3 px-6 py-3 bg-secondary/20 rounded-full border border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              <TrendingUp className="w-4 h-4 text-primary" />
              Showing 5 of 124 available semantic matches
           </div>
        </div>
      </main>
    </div>
  )
}

function TrendingUp({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  )
}

export default Matches
