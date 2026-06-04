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
  MoreVertical,
  Plus,
  FileText,
  Clock,
  Eye,
  Download,
  Trash2,
  Filter
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

const Resumes = () => {
  const location = useLocation()
  const logoutMutation = useLogout()
  
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const resumes = [
    { name: "Senior_AI_Engineer_2024.pdf", size: "1.2 MB", date: "2 hours ago", matches: 12, type: 'PDF' },
    { name: "Full_Stack_Dev_Resume.pdf", size: "840 KB", date: "3 days ago", matches: 8, type: 'PDF' },
    { name: "Product_Designer_V2.docx", size: "2.1 MB", date: "1 week ago", matches: 5, type: 'DOCX' },
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
          <SidebarItem icon={FileText} label="Resume Bank" href="/resumes" active={location.pathname === '/resumes'} />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
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
               Source Intelligence
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">Resume Bank</h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">Manage and optimize your neural source documents.</p>
          </div>
          <div className="flex items-center gap-4">
             <Button className="h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/20 group uppercase tracking-widest text-[11px] scale-105">
                <Plus className="w-4 h-4 mr-3 group-hover:rotate-90 transition-transform" /> Initialize Upload
             </Button>
             <button className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground relative hover:bg-secondary transition-all shadow-sm">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-card animate-pulse" />
             </button>
          </div>
        </header>

        <div className="bg-card rounded-[40px] border border-border/50 shadow-premium overflow-hidden group/bank max-w-6xl">
           <div className="p-8 border-b border-border/40 flex flex-col sm:flex-row items-center justify-between gap-6 bg-secondary/10">
              <div className="relative w-full sm:w-96 group/search">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground opacity-60 group-focus-within/search:text-primary transition-colors" />
                 <input 
                  type="text" 
                  placeholder="Query resume archives..." 
                  className="w-full h-12 pl-12 pr-6 bg-card border border-border/50 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/30 shadow-inner"
                 />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <button className="flex-1 sm:flex-none h-11 px-5 rounded-xl border border-border/60 text-[10px] font-black uppercase tracking-widest bg-card hover:bg-secondary transition-all">Latest</button>
                 <button className="flex-1 sm:flex-none h-11 px-5 rounded-xl border border-border/60 text-[10px] font-black uppercase tracking-widest bg-card hover:bg-secondary transition-all">Most Matched</button>
                 <button className="w-11 h-11 rounded-xl border border-border/60 flex items-center justify-center bg-card hover:bg-secondary transition-all"><Filter className="w-4 h-4 opacity-60" /></button>
              </div>
           </div>

           <div className="divide-y divide-border/30">
              {resumes.map((resume, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 flex flex-col md:flex-row items-center justify-between hover:bg-secondary/20 transition-all group relative"
                >
                   <div className="flex items-center gap-6 w-full lg:w-auto">
                      <div className="w-16 h-16 bg-primary/5 rounded-[22px] flex items-center justify-center text-primary border border-primary/10 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-2">
                         <FileText className="w-8 h-8" />
                      </div>
                      <div className="min-w-0">
                         <h4 className="font-black text-lg mb-1.5 tracking-tight truncate max-w-[280px] lg:max-w-md">{resume.name}</h4>
                         <div className="flex items-center flex-wrap gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] opacity-50">
                            <span className="flex items-center gap-2 bg-secondary px-2 py-0.5 rounded-md border border-border/40">{resume.type}</span>
                            <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {resume.date}</span>
                            <span>{resume.size}</span>
                            <span className="text-primary opacity-100">{resume.matches} semantic matches</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-3 mt-6 lg:mt-0 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none group-hover:pointer-events-auto">
                      <button className="w-11 h-11 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:-translate-y-0.5">
                         <Eye className="w-4.5 h-4.5" />
                      </button>
                      <button className="w-11 h-11 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all shadow-sm hover:-translate-y-0.5">
                         <Download className="w-4.5 h-4.5" />
                      </button>
                      <button className="w-11 h-11 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-all shadow-sm hover:-translate-y-0.5">
                         <Trash2 className="w-4.5 h-4.5" />
                      </button>
                      <div className="w-px h-6 bg-border/40 mx-1" />
                      <button className="w-11 h-11 rounded-2xl bg-card border border-border/50 flex items-center justify-center hover:bg-secondary transition-all shadow-sm">
                         <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                   </div>
                </motion.div>
              ))}
           </div>
           
           <div className="p-8 bg-secondary/5 flex justify-center border-t border-border/20">
              <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2">
                 View Historical archives <Plus className="w-3 h-3" />
              </button>
           </div>
        </div>
      </main>
    </div>
  )
}

export default Resumes
