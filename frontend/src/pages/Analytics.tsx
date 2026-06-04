interface EducationItem { degree: string; institute: string }
interface ExperienceItem { title: string; company: string; years?: string }

import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
  Briefcase,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Loader2,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase as BriefcaseIcon,
  Wrench,
  Lightbulb,
  Calendar,
  Zap,
  Target,
  BookOpen,
  AlertTriangle,
  ChevronRight,
  Clock,
  Plus,
  ShieldCheck
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useAnalysisResult, useAnalysisList } from "@/hooks/useAnalysis"
import { AnalysisListItem } from "@/types/analysis"
import { ThemeToggle } from "@/components/ThemeToggle"
import { motion, AnimatePresence } from "framer-motion"

// ── Shared Sidebar ──────────────────────────────────────────────────────────
const SidebarItem = ({ icon: Icon, label, href, active, onClick }: any) => {
  const content = (
    <>
      <Icon className={cn("w-5 h-5 transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="font-semibold tracking-tight">{label}</span>
    </>
  )
  if (onClick) {
    return (
      <button onClick={onClick} className={cn("w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group text-left", active ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
        {content}
      </button>
    )
  }
  return (
    <Link to={href} className={cn("flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 group", active ? "bg-primary/10 text-primary shadow-sm shadow-primary/5" : "text-muted-foreground hover:bg-secondary hover:text-foreground")}>
      {content}
    </Link>
  )
}

const Sidebar = ({ active, onLogout, isPending }: { active: string; onLogout: () => void; isPending: boolean }) => (
  <aside className="w-72 border-r border-border/40 bg-card/60 backdrop-blur-xl flex flex-col p-8 fixed inset-y-0 h-screen overflow-y-auto z-40">
    <div className="flex items-center gap-3 mb-12 px-2 group cursor-pointer">
      <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform group-hover:scale-105">C</div>
      <span className="text-2xl font-black tracking-tighter text-foreground">CVPilot</span>
    </div>
    <div className="space-y-1.5 flex-1">
      <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
      <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" active={active === "analytics"} />
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
          <SidebarItem icon={LogOut} label={isPending ? "Logging out..." : "Logout"} href="#" onClick={onLogout} />
       </div>
    </div>
  </aside>
)

// ── Helpers ─────────────────────────────────────────────────────────────────
const KeywordTag = ({ label, variant }: { label: string; variant: "match" | "missing" | "skill" }) => {
  const styles = { 
    match: "bg-success/10 text-success border-success/20", 
    missing: "bg-destructive/10 text-destructive border-destructive/20", 
    skill: "bg-primary/10 text-primary border-primary/20" 
  }
  return <span className={cn("inline-flex items-center px-4 py-1.5 rounded-xl text-xs font-bold border capitalize tracking-tight hover:scale-105 transition-transform cursor-default shadow-sm", styles[variant])}>{label}</span>
}

const scoreColor = (n: number) =>
  n >= 80 ? { label: "Elite Core", color: "text-success", bg: "bg-success", light: "bg-success/5", border: "border-success/20" }
  : n >= 60 ? { label: "Strong Match", color: "text-primary", bg: "bg-primary", light: "bg-primary/5", border: "border-primary/20" }
  : n >= 40 ? { label: "Developing", color: "text-orange-500", bg: "bg-orange-500", light: "bg-orange-500/5", border: "border-orange-500/20" }
  : { label: "Re-Audit Needed", color: "text-destructive", bg: "bg-destructive", light: "bg-destructive/5", border: "border-destructive/20" }

// ── LIST VIEW ────────────────────────────────────────────────────────────────
const AnalyticsList = () => {
  const logoutMutation = useLogout()
  const navigate = useNavigate()
  const { data, isLoading } = useAnalysisList()
  const items: AnalysisListItem[] = data?.results || []

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 transition-colors duration-500">
      <Sidebar active="analytics" onLogout={() => logoutMutation.mutate()} isPending={logoutMutation.isPending} />
      <main className="flex-1 ml-72 p-10 pb-24">
        <header className="flex items-center justify-between mb-16 max-w-6xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-muted-foreground">
               Intelligence Archive
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Analytics</h1>
            <p className="text-muted-foreground text-lg mt-2 font-medium">Historical audit of your neural matching trajectory.</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground relative hover:bg-secondary transition-all hover:scale-105 active:scale-95 shadow-sm">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-card" />
             </button>
             <Link to="/dashboard">
               <Button className="h-12 px-6 rounded-2xl font-bold shadow-xl shadow-primary/20 group uppercase tracking-widest text-[11px]">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> New Analysis
               </Button>
             </Link>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-96 gap-6">
              <div className="relative w-16 h-16">
                 <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                 <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
              </div>
              <p className="text-muted-foreground font-bold tracking-tight">Accessing Archive...</p>
            </motion.div>
          ) : items.length === 0 ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[55vh] text-center gap-6">
              <div className="w-24 h-24 bg-secondary rounded-[32px] flex items-center justify-center text-muted-foreground shadow-inner">
                <BarChart3 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black tracking-tighter text-foreground">Archive is currently empty</h3>
                <p className="text-muted-foreground max-w-sm text-base font-medium">Upload source documents to generate your first intelligence report.</p>
              </div>
              <Link to="/dashboard">
                <Button className="h-14 px-12 rounded-[24px] font-black text-base shadow-2xl shadow-primary/20">
                  Initialize Audit
                </Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl">
              {items.map((item, idx) => {
                const norm = item.finalScore <= 1 ? item.finalScore * 100 : item.finalScore
                const display = Math.round(norm)
                const tier = scoreColor(norm)
                const date = new Date(item.timestamp)
                return (
                  <motion.div
                    key={item.resultID}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => navigate(`/analytics?id=${item.resultID}`)}
                    className="bg-card border border-border/50 rounded-[32px] p-8 flex flex-col md:flex-row items-center gap-8 hover:border-primary/30 hover:shadow-premium transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-10", tier.bg)} />
                    
                    {/* Score Disc */}
                    <div className={cn("w-20 h-20 rounded-[24px] flex flex-col items-center justify-center shrink-0 border border-border/10 relative z-10 transition-transform group-hover:scale-105", tier.light)}>
                      <span className={cn("text-3xl font-black leading-none tracking-tighter", tier.color)}>{display}</span>
                      <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-[0.2em] mt-1">match</span>
                    </div>

                    {/* Meta Payload */}
                    <div className="flex-1 min-w-0 relative z-10">
                      <div className="flex items-center flex-wrap gap-3 mb-3">
                        <span className={cn("text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest", tier.light, tier.border, tier.color)}>{tier.label}</span>
                        <span className="text-xs text-muted-foreground font-bold flex items-center gap-2 opacity-60">
                           <Clock className="w-3.5 h-3.5" />
                           {date.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-base text-muted-foreground font-medium truncate">
                        <span className="font-bold text-foreground">{item.matchedKeywords.length}</span> semantic hits &nbsp;·&nbsp;
                        <span className="font-bold text-foreground">{item.missingCount}</span> identified gaps
                      </p>
                      {/* Gradient Progress */}
                      <div className="mt-5 h-2 bg-secondary/50 rounded-full overflow-hidden w-full max-w-md">
                        <motion.div 
                          initial={{ width: 0 }} 
                          whileInView={{ width: `${display}%` }} 
                          transition={{ duration: 1, delay: 0.2 }}
                          className={cn("h-full rounded-full", tier.bg)} 
                        />
                      </div>
                    </div>

                    {/* Engagement */}
                    <div className="shrink-0 flex items-center gap-3 text-muted-foreground group-hover:text-primary transition-all pr-4">
                      <span className="text-xs font-black uppercase tracking-widest hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">Access Intelligence</span>
                      <div className="w-10 h-10 rounded-full bg-secondary group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

// ── DETAIL VIEW ──────────────────────────────────────────────────────────────
const AnalyticsDetail = ({ resultId }: { resultId: string }) => {
  const logoutMutation = useLogout()
  const { data, isLoading } = useAnalysisResult(resultId)

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-10">
          <div className="relative w-24 h-24">
             <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
             <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
             <div className="absolute inset-0 flex items-center justify-center">
                <Zenith className="w-8 h-8 text-primary" />
             </div>
          </div>
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black tracking-tight">Syncing Neural Data</h2>
            <p className="text-muted-foreground font-medium">Reconstructing match profile from archive...</p>
          </div>
      </div>
    )
  }

  const rawScore = data?.result?.finalScore || 0
  const normalizedScore = rawScore <= 1 ? rawScore * 100 : rawScore
  const displayScore = Math.round(normalizedScore)
  const result = data?.result
  const feedback = data?.feedback
  const profile = data?.profile
  const matchedKeywords: string[] = result?.matchedKeywords || []
  const missingKeywords: string[] = feedback?.missingKeywords || []
  const suggestions: string[] = feedback?.suggestions || []
  const highlightedSections: string[] = feedback?.highlightedSections || []
  const totalKeywords = matchedKeywords.length + missingKeywords.length
  const coveragePercent = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0
  const tier = scoreColor(normalizedScore)
  const profileCompleteness = profile
    ? Math.round(([profile.candidateName, profile.email, profile.phone, profile.skills?.length, profile.education?.length, profile.experience?.length].filter(Boolean).length / 6) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 transition-colors duration-500">
      <Sidebar active="analytics" onLogout={() => logoutMutation.mutate()} isPending={logoutMutation.isPending} />
      <main className="flex-1 ml-72 p-10 pb-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-16 max-w-6xl">
          <div className="flex items-center gap-8">
            <Link to="/analytics" className="w-14 h-14 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all hover:scale-105 active:scale-95 shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-primary">
                  Detailed Audit
               </div>
              <h1 className="text-4xl lg:text-5xl font-black tracking-tighter">Neural Profile</h1>
              <p className="text-muted-foreground text-lg mt-1.5 font-medium">
                {result?.timestamp ? `Audit log from ${new Date(result.timestamp).toLocaleDateString("en-US", { dateStyle: "long" })}` : "Deep-dive career alignment report"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="w-12 h-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground relative hover:bg-secondary transition-all shadow-sm">
                <Bell className="w-5.5 h-5.5" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-[3px] border-card" />
             </button>
             {profile && (
               <div className="flex items-center gap-4 p-1.5 pr-6 bg-card border border-border/50 rounded-2xl shadow-sm">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black text-sm shadow-inner transition-transform hover:scale-105">
                   {profile.candidateName?.[0]?.toUpperCase() || "U"}
                 </div>
                 <span className="text-sm font-bold opacity-80">{profile.candidateName || "Job Seeker"}</span>
               </div>
             )}
          </div>
        </header>

        {!result ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center gap-8">
            <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-[32px] flex items-center justify-center shadow-lg"><AlertCircle className="w-12 h-12" /></div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black tracking-tighter text-foreground text-destructive">Record Not Found</h3>
               <p className="text-muted-foreground max-w-sm text-base font-medium">This audit record has been purged or is inaccessible at the moment.</p>
            </div>
            <Link to="/analytics"><Button size="lg" className="rounded-2xl h-14 px-10 font-bold uppercase tracking-widest text-xs">Back to Archive</Button></Link>
          </div>
        ) : (
          <div className="space-y-12 max-w-7xl">

            {/* ── Core Alignment ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-card rounded-[48px] border border-border/50 shadow-premium p-12 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50" />
                <div className={cn("relative w-56 h-56 mb-10 transition-transform duration-1000", tier.color)}>
                  <svg className="w-full h-full -rotate-90 drop-shadow-2xl">
                    <circle cx="112" cy="112" r="96" fill="transparent" stroke="currentColor" strokeWidth="12" className="text-muted/5" />
                    <motion.circle cx="112" cy="112" r="96" fill="transparent" stroke="currentColor" strokeWidth="12" strokeLinecap="round"
                      initial={{ strokeDashoffset: 603 }}
                      animate={{ strokeDashoffset: 603 * (1 - normalizedScore / 100) }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      strokeDasharray={603}
                      className={tier.bg.replace("bg-", "text-")} 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-7xl font-black tracking-tighter text-foreground">{displayScore}</span>
                    <span className="text-[11px] font-black text-muted-foreground/60 uppercase tracking-[0.3em] mt-3">Accuracy Index</span>
                  </div>
                </div>
                <div className={cn("px-8 py-3 rounded-2xl font-black text-lg tracking-tight shadow-lg shadow-primary/5 border border-border/50", tier.light, tier.color)}>
                   {tier.label.toUpperCase()}
                </div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] mt-8 opacity-40">Cosine Similarity Protocol v2.4</p>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  { icon: CheckCircle2, val: matchedKeywords.length, label: "Neural Hits", sub: "Semantic alignment achieved", cls: "success" },
                  { icon: AlertCircle, val: missingKeywords.length, label: "Skill Gaps", sub: "Potential blind spots", cls: "destructive" },
                  { icon: Target, val: `${coveragePercent}%`, label: "Market Fit", sub: "Target requirements coverage", cls: "primary" },
                  { icon: Zap, val: suggestions.length, label: "Live Optimizations", sub: "Actionable priority steps", cls: "orange-500" },
                ].map(({ icon: Icon, val, label, sub, cls }) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={label} 
                    className={cn(
                      "bg-card border border-border/50 rounded-[40px] p-8 flex flex-col justify-between shadow-premium hover:border-primary/20 transition-all",
                      `hover:bg-${cls}/5`
                    )}
                  >
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform hover:scale-110", `bg-${cls}/10 text-${cls}`)}>
                       <Icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={cn("text-4xl font-black tracking-tighter mb-1 animate-in slide-in-from-bottom-2 duration-500 text-foreground")}>{val}</p>
                      <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">{label}</p>
                      <p className="text-[11px] text-muted-foreground/60 mt-2 font-medium leading-relaxed">{sub}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Semantic Map ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {[
                { title: "Matched Patterns", sub: "Identified in Neural Graph", icon: ShieldCheck, iconCls: "bg-success/10 text-success", items: matchedKeywords, variant: "match" as const, empty: "Null hits — adjust source document." },
                { title: "Contextual Gaps", sub: "Absent from Career Vector", icon: AlertTriangle, iconCls: "bg-destructive/10 text-destructive", items: missingKeywords, variant: "missing" as const, empty: "Zero gaps detected — optimal alignment." },
              ].map(({ title, sub, icon: Icon, iconCls, items, variant, empty }) => (
                <div key={title} className="bg-card rounded-[40px] border border-border/50 shadow-premium p-10 group overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center gap-5 mb-8">
                    <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner", iconCls)}><Icon className="w-7 h-7" /></div>
                    <div><h3 className="font-extrabold text-2xl tracking-tighter text-foreground">{title}</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">{sub}</p></div>
                  </div>
                  {items.length === 0 ? <p className="text-muted-foreground text-sm font-medium italic opacity-40">{empty}</p> : (
                    <div className="flex flex-wrap gap-3">{items.map(kw => <KeywordTag key={kw} label={kw} variant={variant} />)}</div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Strategy + Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {highlightedSections.length > 0 && (
                <div className="lg:col-span-4 bg-card rounded-[40px] border border-border/50 shadow-premium p-10">
                  <div className="flex items-center gap-5 mb-10">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-inner"><AlertTriangle className="w-7 h-7" /></div>
                    <div><h3 className="font-extrabold text-2xl tracking-tighter text-foreground">Critical Sections</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">Primary re-audit requirements</p></div>
                  </div>
                  <div className="flex flex-col gap-4">
                    {highlightedSections.map(s => (
                       <div key={s} className="flex items-center gap-4 p-5 bg-secondary/30 rounded-2xl border border-border/50 group hover:border-orange-500/30 transition-colors">
                          <CheckCircle2 className="w-5 h-5 text-orange-500 transition-transform group-hover:scale-110" />
                          <span className="text-sm font-black text-foreground/80 tracking-tight">{s}</span>
                       </div>
                    ))}
                  </div>
                </div>
              )}
              <div className={cn("bg-card rounded-[40px] border border-border/50 shadow-premium p-10", highlightedSections.length > 0 ? "lg:col-span-8" : "lg:col-span-12")}>
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner"><Lightbulb className="w-7 h-7" /></div>
                  <div><h3 className="font-extrabold text-2xl tracking-tighter text-foreground">Adaptive Intelligence Strategy</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-60 mt-0.5">High-fidelity tactical suggestions</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                  {suggestions.length === 0 ? <p className="text-muted-foreground text-sm font-medium italic opacity-40">Zero optimizations needed — vector is locked.</p> : suggestions.map((s, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-6 p-6 bg-secondary/20 rounded-[32px] border border-border/20 hover:border-primary/20 transition-all group"
                    >
                      <div className="w-10 h-10 bg-card text-primary rounded-2xl border border-border/50 flex items-center justify-center text-sm font-black shrink-0 transition-transform group-hover:rotate-6 group-hover:scale-110 shadow-sm">{i + 1}</div>
                      <p className="text-base text-foreground/80 font-medium leading-[1.6]">{s}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Extracted Payload ── */}
            {profile && (
              <div className="bg-card rounded-[48px] border border-border/50 shadow-premium p-12 overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 opacity-60" />
                <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="w-16 h-16 bg-secondary rounded-[24px] flex items-center justify-center text-muted-foreground shadow-inner transition-transform group-hover:scale-105 group-hover:rotate-2"><User className="w-8 h-8 opacity-60" /></div>
                  <div><h3 className="font-black text-3xl tracking-tighter text-foreground">Extracted Career Payload</h3><p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-40 mt-1">Direct NLP-Parsed Identity</p></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
                  {/* Identity Stack */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 mb-6"><div className="w-1.5 h-1.5 bg-primary rounded-full shadow-sm shadow-primary" /> Professional Identity</h4>
                    {[
                      { icon: User, label: "Full Name", val: profile.candidateName },
                      { icon: Mail, label: "Core Email", val: profile.email },
                      { icon: Phone, label: "Contact Trace", val: profile.phone }
                    ].filter(f => f.val).map(f => (
                      <div key={f.label} className="p-5 bg-secondary/30 rounded-2xl border border-border/50 flex flex-col gap-1 transition-all hover:bg-card">
                         <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-50">{f.label}</p>
                         <p className="text-sm font-bold text-foreground break-all">{f.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skills Cluster */}
                  <div>
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 mb-10"><div className="w-1.5 h-1.5 bg-success rounded-full shadow-sm shadow-success" /> Competency Cluster</h4>
                    {profile.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2.5">
                        {profile.skills.map((sk: string) => <KeywordTag key={sk} label={sk} variant="skill" />)}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground font-medium opacity-40 italic">No skills traced by NLP engine.</p>
                    )}
                  </div>

                  {/* Nodes (Edu/Exp) */}
                  <div className="space-y-10">
                    <div className="group/edu">
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 mb-6 group-hover/edu:text-foreground transition-colors"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-sm shadow-blue-500" /> Academic Nodes</h4>
                      {profile.education?.length > 0 ? (
                        <div className="space-y-3">
                          {(profile.education as EducationItem[]).map((ed, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-secondary/30 rounded-2xl border border-border/50 group-hover/edu:border-blue-500/20 transition-all">
                              <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shrink-0 shadow-sm"><GraduationCap className="w-5 h-5 opacity-60" /></div>
                              <div><p className="text-sm font-bold text-foreground leading-tight">{ed.degree}</p><p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">{ed.institute}</p></div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-muted-foreground font-medium opacity-40 italic">Null education nodes.</p>}
                    </div>
                    <div className="group/exp">
                      <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center gap-3 mb-6 group-hover/exp:text-foreground transition-colors"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full shadow-sm shadow-orange-500" /> Career Trajectory</h4>
                      {profile.experience?.length > 0 ? (
                        <div className="space-y-3">
                          {(profile.experience as ExperienceItem[]).map((ex, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-secondary/30 rounded-2xl border border-border/50 group-hover/exp:border-orange-500/20 transition-all">
                              <div className="w-10 h-10 bg-card rounded-xl flex items-center justify-center shrink-0 shadow-sm"><BriefcaseIcon className="w-5 h-5 opacity-60" /></div>
                              <div><p className="text-sm font-bold text-foreground leading-tight">{ex.title}</p><p className="text-[11px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">{ex.company}{ex.years ? ` · ${ex.years}` : ""}</p></div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-muted-foreground font-medium opacity-40 italic">Null experience nodes.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Summary Visualization ── */}
            <div className="bg-foreground rounded-[48px] p-12 lg:p-16 text-background relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(37,99,235,0.2),transparent)] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary opacity-5 blur-[120px] -translate-x-1/2 translate-y-1/2" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-24">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary shadow-inner">
                     Final Summary Matrix
                  </div>
                  <h3 className="text-4xl lg:text-5xl font-black tracking-tighter mb-10 leading-[1.1]">Overall Match <span className="text-primary italic">Distribution</span>.</h3>
                  <div className="space-y-8">
                    {[
                      { label: "Neural Score Alignment", val: displayScore, color: tier.bg },
                      { label: "Semantic Keyword Coverage", val: coveragePercent, color: "bg-blue-400" },
                      { label: "Candidate Profile Completeness", val: profileCompleteness, color: "bg-violet-400" },
                    ].map(({ label, val, color }) => (
                      <div key={label} className="group">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-background/50 mb-3 group-hover:text-background/80 transition-colors"><span>{label}</span><span className="text-background">{val}%</span></div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${val}%` }} transition={{ duration: 1.5, ease: "circOut" }} className={cn("h-full rounded-full shadow-lg", color)} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Visual Artifact */}
                <div className="shrink-0 relative">
                   <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-[60px] bg-gradient-to-br from-primary/20 to-secondary/10 border border-white/10 flex items-center justify-center p-8 backdrop-blur-md shadow-2xl">
                      <div className="text-center group cursor-default">
                         <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block group-hover:scale-110 transition-transform">Aggregated</span>
                         <span className={cn("text-8xl lg:text-9xl font-black tracking-tighter", tier.color)}>{displayScore}</span>
                         <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] block mt-4 group-hover:translate-y-1 transition-transform">Match Index</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

function Zenith({ className }: { className?: string }) {
  return (
    <div className={className}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
    </div>
  )
}

// ── Router ───────────────────────────────────────────────────────────────────
const Analytics = () => {
  const location = useLocation()
  const resultId = new URLSearchParams(location.search).get("id") || ""
  return resultId ? <AnalyticsDetail resultId={resultId} /> : <AnalyticsList />
}

export default Analytics
