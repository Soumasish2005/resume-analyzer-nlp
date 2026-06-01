interface EducationItem { degree: string; institute: string }
interface ExperienceItem { title: string; company: string; years?: string }

import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  LayoutDashboard,
  FileStack,
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
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { useAnalysisResult, useAnalysisList } from "@/hooks/useAnalysis"
import { AnalysisListItem } from "@/types/analysis"

// ── Shared Sidebar ──────────────────────────────────────────────────────────
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

const Sidebar = ({ active, onLogout, isPending }: { active: string; onLogout: () => void; isPending: boolean }) => (
  <aside className="w-64 border-r border-border bg-white flex flex-col p-6 fixed inset-y-0 h-screen overflow-y-auto">
    <div className="flex items-center gap-2 mb-10 px-2">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div>
      <span className="text-xl font-bold tracking-tight">CVPilot</span>
    </div>
    <div className="space-y-1 flex-1">
      <SidebarItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" />
      <SidebarItem icon={BarChart3} label="Analytics" href="/analytics" active={active === "analytics"} />
      <SidebarItem icon={FileStack} label="Resume Bank" href="/resumes" />
      <SidebarItem icon={Briefcase} label="Job Matches" href="/matches" />
      <SidebarItem icon={Settings} label="Settings" href="/settings" />
    </div>
    <div className="pt-6 border-t border-border mt-auto space-y-1">
      <SidebarItem icon={HelpCircle} label="Help Center" href="/help" />
      <SidebarItem icon={LogOut} label={isPending ? "Logging out..." : "Logout"} href="#" onClick={onLogout} />
    </div>
  </aside>
)

// ── Helpers ─────────────────────────────────────────────────────────────────
const KeywordTag = ({ label, variant }: { label: string; variant: "match" | "missing" | "skill" }) => {
  const styles = { match: "bg-emerald-50 text-emerald-700 border-emerald-200", missing: "bg-rose-50 text-rose-700 border-rose-200", skill: "bg-blue-50 text-blue-700 border-blue-200" }
  return <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border capitalize", styles[variant])}>{label}</span>
}

const SectionBadge = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl text-sm font-semibold text-amber-800">
    <AlertTriangle className="w-4 h-4 text-amber-500" />{label}
  </div>
)

const scoreColor = (n: number) =>
  n >= 80 ? { label: "Excellent Match", color: "text-emerald-600", bg: "bg-emerald-500", light: "bg-emerald-50", border: "border-emerald-200" }
  : n >= 60 ? { label: "Strong Contender", color: "text-blue-600", bg: "bg-blue-500", light: "bg-blue-50", border: "border-blue-200" }
  : n >= 40 ? { label: "Partial Match", color: "text-amber-600", bg: "bg-amber-500", light: "bg-amber-50", border: "border-amber-200" }
  : { label: "Low Match", color: "text-rose-600", bg: "bg-rose-500", light: "bg-rose-50", border: "border-rose-200" }

// ── LIST VIEW ────────────────────────────────────────────────────────────────
const AnalyticsList = () => {
  const logoutMutation = useLogout()
  const navigate = useNavigate()
  const { data, isLoading } = useAnalysisList()
  const items: AnalysisListItem[] = data?.results || []

  return (
    <div className="min-h-screen bg-background flex font-geist">
      <Sidebar active="analytics" onLogout={() => logoutMutation.mutate()} isPending={logoutMutation.isPending} />
      <main className="flex-1 ml-64 p-8 pb-16">
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted text-sm mt-0.5">Your resume analysis history</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground relative hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <Link to="/dashboard">
              <Button className="gap-2"><Plus className="w-4 h-4" /> New Analysis</Button>
            </Link>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted text-sm">Loading your analyses...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[55vh] text-center gap-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold">No analyses yet</h3>
            <p className="text-muted max-w-sm text-sm">Upload your resume and job description from the dashboard to get your first match score.</p>
            <Link to="/dashboard"><Button className="mt-4 gap-2"><Plus className="w-4 h-4" /> Start Analysis</Button></Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, i) => {
              const norm = item.finalScore <= 1 ? item.finalScore * 100 : item.finalScore
              const display = Math.round(norm)
              const tier = scoreColor(norm)
              const date = new Date(item.timestamp)
              return (
                <div
                  key={item.resultID}
                  onClick={() => navigate(`/analytics?id=${item.resultID}`)}
                  className="bg-white border border-border/60 rounded-3xl p-6 flex items-center gap-6 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group"
                >
                  {/* Score Ring */}
                  <div className={cn("w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 border-2", tier.light, tier.border)}>
                    <span className={cn("text-xl font-black leading-none", tier.color)}>{display}</span>
                    <span className="text-[9px] font-bold text-muted uppercase tracking-widest">score</span>
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", tier.light, tier.border, tier.color)}>{tier.label}</span>
                      <span className="text-xs text-muted flex items-center gap-1"><Clock className="w-3 h-3" />{date.toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                    </div>
                    <p className="text-sm text-muted mt-1 truncate">
                      <span className="font-semibold text-foreground">{item.matchedKeywords.length}</span> matched keywords &nbsp;·&nbsp;
                      <span className="font-semibold text-foreground">{item.missingCount}</span> gaps identified
                    </p>
                    {/* Progress bar */}
                    <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden w-64">
                      <div className={cn("h-full rounded-full transition-all duration-700", tier.bg)} style={{ width: `${display}%` }} />
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                    <span className="text-sm font-semibold hidden sm:block">View Details</span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              )
            })}
          </div>
        )}
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
          <p className="text-foreground font-semibold text-lg">Analyzing your results...</p>
          <p className="text-muted text-sm">Fetching score, keywords, and suggestions</p>
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
    <div className="min-h-screen bg-background flex font-geist">
      <Sidebar active="analytics" onLogout={() => logoutMutation.mutate()} isPending={logoutMutation.isPending} />
      <main className="flex-1 ml-64 p-8 pb-16">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link to="/analytics" className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Analysis Detail</h1>
              <p className="text-muted text-sm mt-0.5">
                {result?.timestamp ? `Generated on ${new Date(result.timestamp).toLocaleDateString("en-US", { dateStyle: "long" })}` : "Full resume analysis report"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center text-muted-foreground relative hover:bg-muted transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            {profile && (
              <div className="flex items-center gap-3 p-1 pr-4 bg-white border border-border rounded-full">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {profile.candidateName?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-semibold">{profile.candidateName || "Job Seeker"}</span>
              </div>
            )}
          </div>
        </header>

        {!result ? (
          <div className="h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6"><BarChart3 className="w-10 h-10 text-muted-foreground" /></div>
            <h3 className="text-2xl font-bold mb-2">Analysis not found</h3>
            <p className="text-muted max-w-sm">This analysis may have been deleted or the ID is invalid.</p>
            <Link to="/analytics" className="mt-8"><Button>Back to Analytics</Button></Link>
          </div>
        ) : (
          <div className="space-y-8">

            {/* ── Score + Stats ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                <div className={cn("relative w-44 h-44 mb-6 ring-8 rounded-full", tier.border.replace("border-", "ring-"))}>
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="88" cy="88" r="72" fill="transparent" stroke="currentColor" strokeWidth="14" className="text-muted/10" />
                    <circle cx="88" cy="88" r="72" fill="transparent" stroke="currentColor" strokeWidth="14" strokeLinecap="round"
                      strokeDasharray={452.4} strokeDashoffset={452.4 * (1 - normalizedScore / 100)}
                      className={tier.bg.replace("bg-", "text-")} style={{ transition: "stroke-dashoffset 1.5s ease" }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black">{displayScore}</span>
                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">/ 100</span>
                  </div>
                </div>
                <span className={cn("text-lg font-bold", tier.color)}>{tier.label}</span>
                <p className="text-muted text-xs mt-1">Cosine similarity match score</p>
              </div>

              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {[
                  { icon: CheckCircle2, val: matchedKeywords.length, label: "Keywords Matched", sub: "Found in both resume & JD", cls: "emerald" },
                  { icon: AlertCircle, val: missingKeywords.length, label: "Keywords Missing", sub: "In JD but absent in resume", cls: "rose" },
                  { icon: Target, val: `${coveragePercent}%`, label: "Keyword Coverage", sub: "Of total JD keywords matched", cls: "blue" },
                  { icon: Zap, val: suggestions.length, label: "AI Suggestions", sub: "Actionable improvements", cls: "violet" },
                ].map(({ icon: Icon, val, label, sub, cls }) => (
                  <div key={label} className={`bg-${cls}-50 border border-${cls}-100 rounded-3xl p-6 flex flex-col gap-3`}>
                    <div className={`w-10 h-10 bg-${cls}-500 rounded-2xl flex items-center justify-center`}><Icon className="w-5 h-5 text-white" /></div>
                    <div>
                      <p className={`text-3xl font-black text-${cls}-900`}>{val}</p>
                      <p className={`text-sm font-semibold text-${cls}-700 mt-0.5`}>{label}</p>
                      <p className={`text-xs text-${cls}-600/70 mt-1`}>{sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Keywords ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { title: "Matched Keywords", sub: "Skills & terms found in your resume", icon: CheckCircle2, iconCls: "bg-emerald-100 text-emerald-600", items: matchedKeywords, variant: "match" as const, empty: "No matched keywords." },
                { title: "Missing Keywords", sub: "From JD but absent in your resume", icon: AlertCircle, iconCls: "bg-rose-100 text-rose-600", items: missingKeywords, variant: "missing" as const, empty: "No missing keywords — perfect coverage!" },
              ].map(({ title, sub, icon: Icon, iconCls, items, variant, empty }) => (
                <div key={title} className="bg-white rounded-3xl border border-border/60 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", iconCls)}><Icon className="w-5 h-5" /></div>
                    <div><h3 className="font-bold text-lg">{title}</h3><p className="text-xs text-muted">{sub}</p></div>
                  </div>
                  {items.length === 0 ? <p className="text-muted text-sm italic">{empty}</p> : (
                    <div className="flex flex-wrap gap-2">{items.map(kw => <KeywordTag key={kw} label={kw} variant={variant} />)}</div>
                  )}
                </div>
              ))}
            </div>

            {/* ── Sections + Suggestions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {highlightedSections.length > 0 && (
                <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-100 rounded-2xl flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                    <div><h3 className="font-bold text-lg">Sections to Fix</h3><p className="text-xs text-muted">Resume areas needing attention</p></div>
                  </div>
                  <div className="flex flex-col gap-2">{highlightedSections.map(s => <SectionBadge key={s} label={s} />)}</div>
                </div>
              )}
              <div className={cn("bg-white rounded-3xl border border-border/60 shadow-sm p-8", highlightedSections.length > 0 ? "lg:col-span-2" : "lg:col-span-3")}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center"><Lightbulb className="w-5 h-5 text-violet-600" /></div>
                  <div><h3 className="font-bold text-lg">AI-Powered Suggestions</h3><p className="text-xs text-muted">Actionable steps to improve your match score</p></div>
                </div>
                <div className="space-y-4">
                  {suggestions.length === 0 ? <p className="text-muted text-sm italic">No suggestions — your resume looks great!</p> : suggestions.map((s, i) => (
                    <div key={i} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-border/40 hover:border-primary/20 transition-colors">
                      <div className="w-7 h-7 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xs font-black shrink-0 mt-0.5">{i + 1}</div>
                      <p className="text-sm text-foreground/80 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Candidate Profile ── */}
            {profile && (
              <div className="bg-white rounded-3xl border border-border/60 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center"><User className="w-5 h-5 text-slate-600" /></div>
                  <div><h3 className="font-bold text-lg">Extracted Candidate Profile</h3><p className="text-xs text-muted">Information parsed from your resume by the NLP engine</p></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Identity */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-muted uppercase tracking-widest flex items-center gap-2"><User className="w-3.5 h-3.5" /> Identity</h4>
                    {profile.candidateName && <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><User className="w-4 h-4 text-muted-foreground shrink-0" /><div><p className="text-[10px] text-muted uppercase tracking-widest font-bold">Name</p><p className="text-sm font-semibold">{profile.candidateName}</p></div></div>}
                    {profile.email && <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><Mail className="w-4 h-4 text-muted-foreground shrink-0" /><div><p className="text-[10px] text-muted uppercase tracking-widest font-bold">Email</p><p className="text-sm font-semibold break-all">{profile.email}</p></div></div>}
                    {profile.phone && <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"><Phone className="w-4 h-4 text-muted-foreground shrink-0" /><div><p className="text-[10px] text-muted uppercase tracking-widest font-bold">Phone</p><p className="text-sm font-semibold">{profile.phone}</p></div></div>}
                  </div>
                  {/* Skills */}
                  <div>
                    <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><Wrench className="w-3.5 h-3.5" /> Detected Skills</h4>
                    {profile.skills?.length > 0 ? <div className="flex flex-wrap gap-2">{profile.skills.map((sk: string) => <KeywordTag key={sk} label={sk} variant="skill" />)}</div> : <p className="text-sm text-muted italic">No skills detected.</p>}
                  </div>
                  {/* Education + Experience */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5" /> Education</h4>
                      {profile.education?.length > 0 ? (
                        <div className="space-y-2">
                          {(profile.education as EducationItem[]).map((ed, i) => (
                            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                              <BookOpen className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div><p className="text-sm font-semibold">{ed.degree}</p>{ed.institute && <p className="text-xs text-muted">{ed.institute}</p>}</div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-muted italic">No education data detected.</p>}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted uppercase tracking-widest mb-3 flex items-center gap-2"><BriefcaseIcon className="w-3.5 h-3.5" /> Experience</h4>
                      {profile.experience?.length > 0 ? (
                        <div className="space-y-2">
                          {(profile.experience as ExperienceItem[]).map((ex, i) => (
                            <div key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-xl">
                              <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div><p className="text-sm font-semibold">{ex.title}</p><p className="text-xs text-muted">{ex.company}{ex.years ? ` · ${ex.years}` : ""}</p></div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-sm text-muted italic">No experience data detected.</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Score Breakdown Bar ── */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center"><TrendingUp className="w-5 h-5" /></div>
                    <div><h3 className="font-bold text-lg">Score Breakdown</h3><p className="text-white/50 text-xs">Visual representation of your match profile</p></div>
                  </div>
                  <span className={cn("text-4xl font-black", tier.color)}>{displayScore}%</span>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Overall Match", val: displayScore, cls: tier.bg },
                    { label: "Keyword Coverage", val: coveragePercent, cls: "bg-blue-400" },
                    { label: "Profile Completeness", val: profileCompleteness, cls: "bg-violet-400" },
                  ].map(({ label, val, cls }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs font-semibold text-white/60 mb-2"><span>{label}</span><span>{val}%</span></div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", cls)} style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
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
