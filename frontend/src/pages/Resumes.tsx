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
  MoreVertical,
  Plus,
  FileText,
  Clock,
  Eye,
  Download,
  Trash2
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

const Resumes = () => {
  const location = useLocation()
  const logoutMutation = useLogout()
  
  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const resumes = [
    { name: "Senior_AI_Engineer_2024.pdf", size: "1.2 MB", date: "2 hours ago", matches: 12 },
    { name: "Full_Stack_Dev_Resume.pdf", size: "840 KB", date: "3 days ago", matches: 8 },
    { name: "Product_Designer_V2.pdf", size: "2.1 MB", date: "1 week ago", matches: 5 },
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
          <SidebarItem icon={FileStack} label="Resume Bank" href="/resumes" active={location.pathname === '/resumes'} />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
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
            <h1 className="text-3xl font-bold">Resume Bank</h1>
            <p className="text-muted text-sm mt-1">Manage and optimize your professional profiles.</p>
          </div>
          <div className="flex items-center gap-4">
             <Button className="h-10 px-6 rounded-xl flex gap-2">
                <Plus className="w-4 h-4" /> Upload New
             </Button>
             <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground relative hover:bg-muted transition-colors">
                <Bell className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="bg-white rounded-[32px] border border-border/50 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-border flex items-center justify-between bg-slate-50/50">
              <div className="relative w-96">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                 <input 
                  type="text" 
                  placeholder="Search resumes..." 
                  className="w-full h-11 pl-11 pr-4 bg-white border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                 />
              </div>
              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" className="rounded-lg">Recent</Button>
                 <Button variant="outline" size="sm" className="rounded-lg">Popular</Button>
              </div>
           </div>

           <div className="divide-y divide-border">
              {resumes.map((resume, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
                         <FileText className="w-6 h-6" />
                      </div>
                      <div>
                         <h4 className="font-bold text-sm mb-1">{resume.name}</h4>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {resume.date}</span>
                            <span>{resume.size}</span>
                            <span className="text-primary">{resume.matches} matches found</span>
                         </div>
                      </div>
                   </div>

                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors text-muted-foreground hover:text-foreground">
                         <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors text-muted-foreground hover:text-foreground">
                         <Download className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors text-muted-foreground hover:text-red-500">
                         <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center hover:bg-white transition-colors text-muted-foreground">
                         <MoreVertical className="w-4 h-4" />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </main>
    </div>
  )
}

export default Resumes
