import { motion } from "framer-motion"
import { 
  BarChart3, 
  FileStack, 
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
  Filter
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"

const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
  const content = (
    <>
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </>
  )

  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left",
          active 
            ? "bg-primary/10 text-primary font-semibold" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        active 
          ? "bg-primary/10 text-primary font-semibold" 
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
    { title: 'Senior AI Engineer', company: 'Synthetix AI', location: 'Remote', salary: '160k - 210k', match: 98, type: 'Full-time' },
    { title: 'Full Stack Developer', company: 'FinStream', location: 'San Francisco, CA', salary: '140k - 185k', match: 82, type: 'Hybrid' },
    { title: 'Frontend Architect', company: 'Velocity Systems', location: 'New York, NY', salary: '175k - 225k', match: 75, type: 'Full-time' },
    { title: 'Machine Learning Engineer', company: 'DataFlow Inc', location: 'Austin, TX', salary: '150k - 190k', match: 91, type: 'Remote' },
    { title: 'Lead Product Designer', company: 'Creative Labs', location: 'Remote', salary: '130k - 170k', match: 64, type: 'Contract' },
  ]

  return (
    <div className="min-h-screen bg-background flex font-geist">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white flex flex-col p-6 fixed inset-y-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <span className="text-xl font-bold tracking-tight">CVPilot</span>
        </div>

        <div className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={FileStack} label="Resume Bank" href="/resumes" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" active={location.pathname === '/matches'} />
          <SidebarItem icon={Settings} label="Settings" href="/settings" />
        </div>

        <div className="pt-6 border-t border-border mt-auto space-y-4">
           <div className="space-y-1">
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
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold">Job Matches</h1>
            <p className="text-muted text-sm mt-1">AI-powered recommendations based on your resumes.</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter jobs..." 
                  className="h-10 pl-9 pr-4 bg-white border border-border rounded-xl text-sm w-64"
                />
             </div>
             <button className="w-10 h-10 rounded-xl bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                <Filter className="w-4 h-4" />
             </button>
          </div>
        </header>

        <div className="space-y-4">
           {jobs.map((job, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-6 rounded-[28px] border border-border/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 transition-all group"
             >
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-900 rounded-[20px] flex items-center justify-center text-white">
                      <Briefcase className="w-6 h-6" />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h4 className="font-bold text-lg">{job.title}</h4>
                         <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold uppercase text-slate-600">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                         <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                         <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> {job.salary}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <div className="flex items-center justify-end gap-2 mb-1">
                         <span className={cn(
                           "text-lg font-bold",
                           job.match > 90 ? "text-emerald-600" : job.match > 70 ? "text-blue-600" : "text-muted-foreground"
                         )}>{job.match}%</span>
                         <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Match</span>
                      </div>
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                         <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            job.match > 90 ? "bg-emerald-500" : job.match > 70 ? "bg-blue-500" : "bg-slate-300"
                          )}
                          style={{ width: `${job.match}%` }}
                         />
                      </div>
                   </div>
                   
                   <Button variant="outline" className="rounded-xl h-12 px-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      Apply Now <ChevronRight className="w-4 h-4 ml-2" />
                   </Button>
                </div>
             </motion.div>
           ))}
        </div>
      </main>
    </div>
  )
}

export default Matches
