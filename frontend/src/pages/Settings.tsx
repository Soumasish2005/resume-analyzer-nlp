import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import {
  BarChart3,
  LayoutDashboard,
  Briefcase,
  Settings as SettingsIcon,
  HelpCircle,
  LogOut,
  Bell,
  User,
  Mail,
  Lock,
  Shield,
  Globe,
  Moon,
  Sun,
  Check,
  Eye,
  EyeOff,
  Palette
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { ThemeToggle } from "@/components/ThemeToggle"

// ── Sidebar ───────────────────────────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
  const content = (
    <>
      <Icon className={cn("w-5 h-5 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </>
  )
  if (onClick) {
    return (
      <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left font-medium", active ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
        {content}
      </button>
    )
  }
  return (
    <Link to={href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group font-medium", active ? "bg-primary/10 text-primary font-bold shadow-sm shadow-primary/5" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
      {content}
    </Link>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 bg-foreground text-background px-6 py-4 rounded-2xl shadow-2xl border border-border/10"
      >
        <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 text-background font-bold" />
        </div>
        <span className="text-sm font-bold tracking-tight">{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
)

// ── Toggle Switch ─────────────────────────────────────────────────────────────
const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={cn(
      "relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/40 ring-offset-2 ring-offset-background",
      checked ? "bg-primary" : "bg-muted/30 hover:bg-muted/50"
    )}
  >
    <span className={cn("absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ease-spring", checked ? "translate-x-6" : "translate-x-0")} />
  </button>
)

// ── LocalStorage Hook ─────────────────────────────────────────────────────────
function useLocalStorage<T>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  const set = useCallback((v: T) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }, [key])

  return [value, set]
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "profile" | "security" | "notifications" | "appearance" | "language"

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "profile",       label: "Profile",       icon: User  },
  { id: "security",      label: "Security",      icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell  },
  { id: "appearance",    label: "Appearance",    icon: Palette },
  { id: "language",      label: "Language",      icon: Globe },
]

// ── Main Component ────────────────────────────────────────────────────────────
const Settings = () => {
  const location = useLocation()
  const logoutMutation = useLogout()
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("Settings saved.")

  // ----- Profile -----
  const [profile, setProfile] = useLocalStorage("settings_profile", { name: "Job Seeker", email: "user@example.com", bio: "" })
  const [profileDraft, setProfileDraft] = useState(profile)
  useEffect(() => { setProfileDraft(profile) }, [activeTab, profile])

  // ----- Security -----
  const [twoFAEnabled, setTwoFAEnabled] = useLocalStorage("settings_2fa", false)
  const [currentPw, setCurrentPw] = useState("")
  const [newPw, setNewPw] = useState("")
  const [confirmPw, setConfirmPw] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [pwError, setPwError] = useState("")

  // ----- Notifications -----
  const [notifs, setNotifs] = useLocalStorage("settings_notifs", {
    analysisComplete: true,
    weeklyDigest: false,
    productUpdates: true,
    securityAlerts: true,
  })

  // ----- Appearance -----
  const { theme, setTheme, resolvedTheme } = useTheme()

  // ----- Language -----
  const [language, setLanguage] = useLocalStorage("settings_language", "en")

  const showToast = (msg = "Settings saved.") => {
    setToastMessage(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 3000)
  }

  const handleSave = () => {
    if (activeTab === "profile") {
      setProfile(profileDraft)
      showToast("Profile updated.")
    }
    if (activeTab === "security") {
      if (!currentPw) { setPwError("Current password is required."); return }
      if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return }
      if (newPw !== confirmPw) { setPwError("Passwords do not match."); return }
      setPwError("")
      setCurrentPw(""); setNewPw(""); setConfirmPw("")
      showToast("Password changed successfully.")
    }
    if (activeTab === "notifications") showToast("Notification preferences saved.")
    if (activeTab === "appearance") showToast("Appearance settings saved.")
    if (activeTab === "language") showToast("Language preference saved.")
  }

  const handleReset = () => {
    if (activeTab === "profile") setProfileDraft(profile)
    if (activeTab === "security") { setCurrentPw(""); setNewPw(""); setConfirmPw(""); setPwError("") }
  }

  // ----- Panel renderer -----
  const renderPanel = () => {
    const cardClass = "bg-card p-10 rounded-[32px] border border-border/50 shadow-sm space-y-8"
    
    switch (activeTab) {
      case "profile":
        return (
          <div className={cardClass}>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl tracking-tight">Profile Information</h3>
              <p className="text-sm text-muted-foreground">Update your personal details and how others see you.</p>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-[24px] border border-border/50">
              <div className="relative group">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileDraft.name || "U")}&background=2563EB&color=fff&size=80`}
                  className="w-20 h-20 rounded-[24px] shadow-lg shadow-primary/10 transition-transform group-hover:scale-105"
                  alt="Avatar"
                />
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-background border border-border rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary shadow-sm">
                   <User className="w-4 h-4" />
                </button>
              </div>
              <div>
                <p className="text-base font-bold text-foreground">{profileDraft.name || "Your Name"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Avatar generated from your display name</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={profileDraft.name}
                    onChange={e => setProfileDraft(d => ({ ...d, name: e.target.value }))}
                    className="w-full h-12 pl-12 pr-4 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={profileDraft.email}
                    onChange={e => setProfileDraft(d => ({ ...d, email: e.target.value }))}
                    className="w-full h-12 pl-12 pr-4 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Professional Bio</label>
              <textarea
                value={profileDraft.bio}
                onChange={e => setProfileDraft(d => ({ ...d, bio: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-2xl text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                placeholder="Tell recruiters about your goals and experience..."
              />
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div className={cardClass}>
              <div className="space-y-1">
                <h3 className="font-extrabold text-xl tracking-tight">Security & Privacy</h3>
                <p className="text-sm text-muted-foreground">Manage your account authentication and security protocols.</p>
              </div>

              {pwError && <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 px-4 py-3 rounded-xl font-semibold">{pwError}</p>}
              
              <div className="space-y-6 pt-2">
                {[
                  { label: "Current Password", value: currentPw, onChange: setCurrentPw },
                  { label: "New Password", value: newPw, onChange: setNewPw },
                  { label: "Confirm New Password", value: confirmPw, onChange: setConfirmPw },
                ].map(field => (
                  <div key={field.label} className="space-y-2">
                    <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">{field.label}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type={showPw ? "text" : "password"}
                        value={field.value}
                        onChange={e => field.onChange(e.target.value)}
                        className="w-full h-12 pl-12 pr-12 bg-secondary/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                        placeholder="••••••••"
                      />
                      <button onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1">
                        {showPw ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-8 rounded-[32px] border border-border/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-base font-bold tracking-tight">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Require a verification code for all login attempts</p>
                  </div>
                </div>
                <Toggle checked={twoFAEnabled} onChange={v => { setTwoFAEnabled(v); showToast(v ? "2FA enabled." : "2FA disabled.") }} />
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className={cardClass}>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl tracking-tight">Notification Settings</h3>
              <p className="text-sm text-muted-foreground">Control when and how you stay updated on your analysis.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              {[
                { key: "analysisComplete" as const, label: "Analysis Complete", desc: "Get push or email alerts when your results are ready." },
                { key: "weeklyDigest"    as const, label: "Weekly Careers Digest", desc: "A summary of top job matches and industry trends." },
                { key: "productUpdates" as const, label: "New Tech Features", desc: "Be the first to hear about new AI model updates." },
                { key: "securityAlerts" as const, label: "Account Security", desc: "Instant alerts for logins from new devices." },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-5 border border-border/50 bg-secondary/20 rounded-[24px] hover:border-primary/20 transition-colors">
                  <div>
                    <p className="text-sm font-bold tracking-tight text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                  <Toggle checked={notifs[item.key]} onChange={v => setNotifs({ ...notifs, [item.key]: v })} />
                </div>
              ))}
            </div>
          </div>
        )

      case "appearance":
        return (
          <div className={cardClass}>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl tracking-tight">Visual Interface</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred theme and visual density.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Interface Theme</label>
              <div className="grid grid-cols-3 gap-4">
                {(["light", "dark", "system"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "group relative flex flex-col items-center gap-4 p-8 rounded-[28px] border-2 transition-all duration-300",
                      theme === t 
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/5" 
                        : "border-border/60 hover:border-primary/40 hover:bg-secondary/40"
                    )}
                  >
                    <div className={cn(
                       "w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                       theme === t ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted/10 text-muted-foreground group-hover:text-foreground"
                    )}>
                       {t === "light"  && <Sun   className="w-6 h-6" />}
                       {t === "dark"   && <Moon  className="w-6 h-6" />}
                       {t === "system" && <Globe className="w-6 h-6" />}
                    </div>
                    
                    <div className="text-center">
                       <span className={cn("text-xs font-black uppercase tracking-widest", theme === t ? "text-primary" : "text-muted-foreground")}>{t}</span>
                       {theme === t && (
                        <motion.div layoutId="theme-active" className="h-1 w-1 rounded-full bg-primary mx-auto mt-1" />
                       )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "language":
        return (
          <div className={cardClass}>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xl tracking-tight">Language & Locale</h3>
              <p className="text-sm text-muted-foreground">Set your preferred communication language and regional format.</p>
            </div>
            
            <div className="space-y-4 pt-2">
              <label className="text-[11px] uppercase font-bold text-muted-foreground tracking-[0.2em] px-1">Display Language</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                  className="w-full h-14 pl-12 pr-10 bg-secondary/50 border border-border rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer hover:border-primary/40 transition-all"
                >
                  {[
                    { code: "en", label: "English (US)" },
                    { code: "en-gb", label: "English (UK)" },
                    { code: "hi", label: "Hindi" },
                    { code: "fr", label: "French" },
                    { code: "de", label: "German" },
                    { code: "es", label: "Spanish" },
                  ].map(l => (
                    <option key={l.code} value={l.code} className="bg-card text-foreground">{l.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                   <Check className="w-4 h-4" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground pl-1 italic">Note: Analysis will always be generated in the language of the uploaded document.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 transition-colors duration-300">
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Sidebar */}
      <aside className="w-72 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col p-8 fixed inset-y-0 h-screen overflow-y-auto z-40">
        <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">C</div>
          <span className="text-2xl font-black tracking-tighter text-foreground">CVPilot</span>
        </div>
        
        <div className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
          <SidebarItem icon={SettingsIcon} label="Settings" href="/settings" active={location.pathname === "/settings"} />
        </div>

        <div className="pt-8 border-t border-border/40 mt-auto space-y-2">
          <div className="px-4 py-3 flex items-center justify-between mb-4 bg-muted/10 rounded-2xl border border-border/20">
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Interface</span>
             <ThemeToggle className="w-8 h-8 scale-90" />
          </div>
          <SidebarItem icon={HelpCircle} label="Help Center" href="/help" />
          <SidebarItem icon={LogOut} label={logoutMutation.isPending ? "Logging out..." : "Logout"} href="#" onClick={() => logoutMutation.mutate()} />
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 ml-72 p-10 pb-24 overflow-x-hidden">
        <header className="mb-14 flex items-end justify-between max-w-5xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">
               Account Configuration
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground">Settings</h1>
            <p className="text-muted-foreground text-base mt-3 font-medium">Manage your professional identity and workspace preferences.</p>
          </div>
        </header>

        <div className="max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation Tabs */}
          <div className="lg:col-span-3 space-y-2">
             <div className="p-2 space-y-1 bg-card/60 backdrop-blur-md rounded-[28px] border border-border/40 shadow-sm">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-bold transition-all duration-300",
                      activeTab === tab.id
                        ? "bg-primary text-white shadow-xl shadow-primary/20"
                        : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                    )}
                  >
                    <tab.icon className={cn("w-4.5 h-4.5", activeTab === tab.id ? "text-white" : "text-muted-foreground")} />
                    {tab.label}
                  </button>
                ))}
             </div>
          </div>

          {/* Active Panel View */}
          <div className="lg:col-span-9 space-y-8">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              {renderPanel()}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex items-center justify-between p-6 bg-card rounded-[32px] border border-border/50"
            >
              <div className="hidden sm:block">
                 <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-2">Session Securely Encrypted</p>
              </div>
              <div className="flex gap-4 w-full sm:w-auto">
                <Button variant="ghost" className="rounded-2xl h-14 px-10 font-bold hover:bg-secondary flex-1 sm:flex-none uppercase tracking-widest text-xs" onClick={handleReset}>Discard</Button>
                <Button className="rounded-2xl h-14 px-12 font-black shadow-xl shadow-primary/20 flex-1 sm:flex-none uppercase tracking-widest text-xs" onClick={handleSave}>Save Changes</Button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
