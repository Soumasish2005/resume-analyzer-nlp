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
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"

// ── Sidebar ───────────────────────────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
  const content = (
    <>
      <Icon className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </>
  )
  if (onClick) {
    return (
      <button onClick={onClick} className={cn("w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left", active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
        {content}
      </button>
    )
  }
  return (
    <Link to={href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group", active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
      {content}
    </Link>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, visible }: { message: string; visible: boolean }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl"
      >
        <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
          <Check className="w-3 h-3" />
        </div>
        <span className="text-sm font-semibold">{message}</span>
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
      "relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50",
      checked ? "bg-primary" : "bg-slate-200"
    )}
  >
    <span className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200", checked ? "translate-x-5" : "translate-x-0")} />
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
  { id: "appearance",    label: "Appearance",    icon: Sun   },
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
  useEffect(() => { setProfileDraft(profile) }, [activeTab])

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
  const { theme, setTheme } = useTheme()

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
    switch (activeTab) {

      case "profile":
        return (
          <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm space-y-6">
            <h3 className="font-bold text-lg">Profile Information</h3>
            <div className="flex items-center gap-6">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profileDraft.name || "U")}&background=0058BE&color=fff&size=80`}
                className="w-20 h-20 rounded-[24px]"
                alt="Avatar"
              />
              <div>
                <p className="text-sm font-semibold">{profileDraft.name || "Your Name"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Avatar generated from your name</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={profileDraft.name}
                    onChange={e => setProfileDraft(d => ({ ...d, name: e.target.value }))}
                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Your full name"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="email"
                    value={profileDraft.email}
                    onChange={e => setProfileDraft(d => ({ ...d, email: e.target.value }))}
                    className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Short Bio</label>
              <textarea
                value={profileDraft.bio}
                onChange={e => setProfileDraft(d => ({ ...d, bio: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Tell us a little about yourself..."
              />
            </div>
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm space-y-5">
              <h3 className="font-bold text-lg">Change Password</h3>
              {pwError && <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 px-4 py-2 rounded-xl">{pwError}</p>}
              {[
                { label: "Current Password", value: currentPw, onChange: setCurrentPw },
                { label: "New Password", value: newPw, onChange: setNewPw },
                { label: "Confirm New Password", value: confirmPw, onChange: setConfirmPw },
              ].map(field => (
                <div key={field.label} className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">{field.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type={showPw ? "text" : "password"}
                      value={field.value}
                      onChange={e => field.onChange(e.target.value)}
                      className="w-full h-12 pl-10 pr-12 bg-slate-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="••••••••"
                    />
                    <button onClick={() => setShowPw(s => !s)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Toggle checked={twoFAEnabled} onChange={v => { setTwoFAEnabled(v); showToast(v ? "2FA enabled." : "2FA disabled.") }} />
              </div>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm space-y-6">
            <h3 className="font-bold text-lg">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { key: "analysisComplete" as const, label: "Analysis Complete", desc: "Get notified when a resume analysis finishes." },
                { key: "weeklyDigest"    as const, label: "Weekly Digest",     desc: "A summary of your activity every week." },
                { key: "productUpdates" as const, label: "Product Updates",   desc: "New features and improvements." },
                { key: "securityAlerts" as const, label: "Security Alerts",   desc: "Unusual login activity and account events." },
              ].map(item => (
                <div key={item.key} className="flex items-center justify-between p-4 border border-border rounded-2xl">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
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
          <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm space-y-6">
            <h3 className="font-bold text-lg">Appearance</h3>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all",
                      theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    {t === "light"  && <Sun  className={cn("w-6 h-6", theme === t ? "text-primary" : "text-muted-foreground")} />}
                    {t === "dark"   && <Moon className={cn("w-6 h-6", theme === t ? "text-primary" : "text-muted-foreground")} />}
                    {t === "system" && <Globe className={cn("w-6 h-6", theme === t ? "text-primary" : "text-muted-foreground")} />}
                    <span className={cn("text-xs font-semibold capitalize", theme === t ? "text-primary" : "text-muted-foreground")}>{t}</span>
                    {theme === t && <div className="w-2 h-2 rounded-full bg-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case "language":
        return (
          <div className="bg-white p-8 rounded-[32px] border border-border/50 shadow-sm space-y-6">
            <h3 className="font-bold text-lg">Language & Region</h3>
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest pl-1">Display Language</label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {[
                  { code: "en", label: "English (US)" },
                  { code: "en-gb", label: "English (UK)" },
                  { code: "hi", label: "Hindi" },
                  { code: "fr", label: "French" },
                  { code: "de", label: "German" },
                  { code: "es", label: "Spanish" },
                  { code: "pt", label: "Portuguese" },
                  { code: "zh", label: "Chinese (Simplified)" },
                  { code: "ja", label: "Japanese" },
                ].map(l => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground pl-1">This changes the display language for the application UI.</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background flex font-geist">
      <Toast message={toastMessage} visible={toastVisible} />

      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-white flex flex-col p-6 fixed inset-y-0 h-screen overflow-y-auto">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
          <span className="text-xl font-bold tracking-tight">CVPilot</span>
        </div>
        <div className="space-y-1 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
          <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" />
          <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
          <SidebarItem icon={SettingsIcon} label="Settings" href="/settings" active={location.pathname === "/settings"} />
        </div>
        <div className="pt-6 border-t border-border mt-auto space-y-1">
          <SidebarItem icon={HelpCircle} label="Help Center" href="/help" />
          <SidebarItem icon={LogOut} label={logoutMutation.isPending ? "Logging out..." : "Logout"} href="#" onClick={() => logoutMutation.mutate()} />
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 p-8 pb-16">
        <header className="mb-10">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your account preferences. All settings are saved locally.</p>
        </header>

        <div className="max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Tab nav */}
          <div className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-white shadow-md"
                    : "text-muted-foreground hover:bg-white hover:text-foreground border border-transparent hover:border-border"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="md:col-span-3 space-y-6">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {renderPanel()}
            </motion.div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" className="rounded-xl h-12 px-8" onClick={handleReset}>Reset</Button>
              <Button className="rounded-xl h-12 px-10 shadow-lg" onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Settings
