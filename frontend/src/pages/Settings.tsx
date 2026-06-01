import { motion } from "framer-motion"
import { 
  BarChart3, 
  FileStack, 
  LayoutDashboard,
  Briefcase,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Bell,
  User,
  Mail,
  Lock,
  ChevronRight,
  Shield,
  CreditCard,
  Globe
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

const Settings = () => {
  const location = useLocation()
  const logoutMutation = useLogout()
  
  const handleLogout = () => {
    logoutMutation.mutate()
  }

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
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
          <SidebarItem icon={SettingsIcon} label="Settings" href="/settings" active={location.pathname === '/settings'} />
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
        <header className="mb-12">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted text-sm mt-1">Manage your account and preferences.</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
              {[
                { label: 'Profile', icon: User, active: true },
                { label: 'Security', icon: Shield },
                { label: 'Billing', icon: CreditCard },
                { label: 'Notifications', icon: Bell },
                { label: 'Language', icon: Globe },
              ].map(item => (
                <button key={item.label} className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  item.active ? "bg-primary text-white" : "text-muted-foreground hover:bg-white hover:text-foreground border border-transparent hover:border-border"
                )}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
           </div>

           <div className="md:col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm">
                 <h3 className="font-bold mb-6">Profile Information</h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-6">
                       <img src="https://ui-avatars.com/api/?name=User&background=0058BE&color=fff" className="w-20 h-20 rounded-[24px]" alt="Avatar" />
                       <Button variant="outline" className="rounded-xl h-12">Change Photo</Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Name</label>
                          <div className="relative">
                             <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                             <input type="text" defaultValue="Job Seeker" className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-border rounded-xl text-sm" />
                          </div>
                       </div>
                       <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Email</label>
                          <div className="relative">
                             <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                             <input type="email" defaultValue="user@example.com" className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-border rounded-xl text-sm" />
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm">
                 <h3 className="font-bold mb-6">Security</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                             <Lock className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">Password</p>
                             <p className="text-xs text-muted-foreground">Change your password to secure account</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                             <Shield className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">Two-Factor Authentication</p>
                             <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                          </div>
                       </div>
                       <Button variant="outline" size="sm" className="rounded-lg">Enable</Button>
                    </div>
                 </div>
              </div>
              
              <div className="flex justify-end gap-3">
                 <Button variant="ghost" className="rounded-xl h-12 px-8">Reset</Button>
                 <Button className="rounded-xl h-12 px-10 shadow-lg">Save Changes</Button>
              </div>
           </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
