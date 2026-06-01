import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  LayoutDashboard, 
  BarChart3, 
  FileStack, 
  Briefcase, 
  Settings, 
  HelpCircle, 
  LogOut,
  Bell,
  Search,
  UploadCloud,
  ChevronRight,
  TrendingUp,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const SidebarItem = ({ icon: Icon, label, href, active }: any) => (
  <Link 
    to={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
      active 
        ? "bg-primary/10 text-primary font-semibold" 
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
    <span>{label}</span>
  </Link>
)

const Dashboard = () => {
  const location = useLocation()
  
  return (
    <div className="min-h-screen bg-background flex font-geist">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white flex flex-col p-6 fixed inset-y-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <span className="text-xl font-bold tracking-tight">CVPilot</span>
        </div>

        <div className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" active={location.pathname === '/dashboard'} />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={FileStack} label="Resume Bank" href="/resumes" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
          <SidebarItem icon={Settings} label="Settings" href="/settings" />
        </div>

        <div className="pt-6 border-t border-border mt-auto space-y-4">
           <Button className="w-full h-12 rounded-xl flex gap-2 shadow-lg mb-8">
              <UploadCloud className="w-4 h-4" /> Analyze Resume
           </Button>

           <div className="space-y-1">
             <SidebarItem icon={HelpCircle} label="Help Center" href="/help" />
             <SidebarItem icon={LogOut} label="Logout" href="/login" />
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Alex</h1>
            <p className="text-muted text-sm mt-1">Here is your recruitment intelligence overview.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground relative hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
             </button>
             <button className="flex items-center gap-3 p-1 pr-4 bg-white border border-border rounded-full hover:bg-muted transition-colors">
                <img src="https://ui-avatars.com/api/?name=Alex+Rivera&background=0058BE&color=fff" alt="Avatar" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-semibold">Alex Rivera</span>
             </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="xl:col-span-2 space-y-8">
            {/* Action Card */}
            <div className="bg-white p-10 rounded-[32px] border border-border/50 text-center relative overflow-hidden">
               <h2 className="text-2xl font-bold mb-2">Ready for a match?</h2>
               <p className="text-muted text-sm mb-10">Connect your resume with the perfect opportunity.</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="border-2 border-dashed border-border rounded-[24px] p-8 flex flex-col items-center justify-center gap-4 hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                       <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                       <p className="font-bold">Drag and drop resume</p>
                       <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">PDF or DOCX</p>
                    </div>
                    <Button variant="outline" className="h-10 px-6 rounded-lg text-xs font-bold border-primary text-primary hover:bg-primary/5">Browse</Button>
                 </div>
                 <div className="border border-border bg-slate-50/50 rounded-[24px] p-8 flex flex-col items-start text-left">
                    <p className="font-bold mb-4">Job Description</p>
                    <textarea 
                      placeholder="Paste job description here..." 
                      className="w-full flex-1 bg-transparent border-none focus:ring-0 text-sm resize-none"
                    />
                 </div>
               </div>
            </div>

            {/* Recent Matches */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Recent Job Matches</h3>
                <Link to="/matches" className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">View All Matches</Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                  { title: 'Senior AI Engineer', company: 'Synthetix AI', match: 98, salary: '160k - 210k', color: 'bg-orange-500' },
                  { title: 'Full Stack Developer', company: 'FinStream', match: 82, salary: '140k - 185k', color: 'bg-blue-500' },
                  { title: 'Frontend Architect', company: 'Velocity Systems', match: 75, salary: '175k - 225k', color: 'bg-slate-800' }
                 ].map((job, i) => (
                   <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-[24px] border border-border/50 shadow-sm"
                   >
                     <div className="flex justify-between items-start mb-6">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white", job.color)}>
                           <Briefcase className="w-5 h-5" />
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-1 rounded-full",
                          job.match > 90 ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"
                        )}>
                          {job.match}% MATCH
                        </span>
                     </div>
                     <h4 className="font-bold mb-1 truncate">{job.title}</h4>
                     <p className="text-muted text-xs mb-6">{job.company} • Remote</p>
                     
                     <div className="pt-6 border-t border-border flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">${job.salary}</span>
                     </div>
                   </motion.div>
                 ))}
              </div>
            </div>
          </div>

          {/* Side Column */}
          <div className="space-y-8">
             {/* Score Card */}
             <div className="bg-white p-8 rounded-[32px] border border-border/50">
                <div className="flex items-center justify-between mb-8">
                   <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Resume Score</p>
                   <TrendingUp className="w-4 h-4 text-success" />
                </div>
                <div className="flex items-center justify-between gap-4">
                   <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">84</span>
                      <span className="text-muted">/100</span>
                   </div>
                   <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                        <circle cx="40" cy="40" r="34" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray={213.6} strokeDashoffset={213.6 * (1 - 0.84)} className="text-primary" />
                      </svg>
                   </div>
                </div>
                <p className="text-xs text-muted mt-6 flex items-center gap-1 group">
                   <TrendingUp className="w-3 h-3 text-success" /> 
                   <span className="font-bold text-success">+12%</span> 
                   <span>this week</span>
                </p>
             </div>

             {/* Skills Card */}
             <div className="bg-white p-8 rounded-[32px] border border-border/50">
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-8">Top Skills Matched</p>
                <div className="flex flex-wrap gap-2">
                   {['TypeScript', 'System Design', 'LLM Integration', 'React', 'Python', 'Cloud Ops'].map((skill) => (
                     <span key={skill} className="px-4 py-2 bg-blue-50 text-primary rounded-full text-xs font-semibold">
                       {skill}
                     </span>
                   ))}
                </div>
             </div>

             {/* Recent Activity or help */}
             <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10">
                <h4 className="font-bold mb-4">Want more insights?</h4>
                <p className="text-xs text-muted leading-relaxed mb-6">
                  Upgrade to Pro to get deep-dives into your skill gaps and personalized interview questions.
                </p>
                <Button className="w-full rounded-xl" variant="outline">Learn More</Button>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Dashboard
