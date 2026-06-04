import { motion } from "framer-motion"
import { useTheme } from "@/contexts/ThemeContext"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full bg-secondary/50 border border-border hover:bg-secondary transition-colors",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        <motion.div
           initial={false}
           animate={{ 
             scale: resolvedTheme === "light" ? 1 : 0, 
             rotate: resolvedTheme === "light" ? 0 : 90,
             opacity: resolvedTheme === "light" ? 1 : 0 
           }}
           transition={{ duration: 0.2 }}
           className="absolute inset-0 flex items-center justify-center text-orange-500"
        >
          <Sun className="w-5 h-5 fill-current" />
        </motion.div>
        
        <motion.div
           initial={false}
           animate={{ 
             scale: resolvedTheme === "dark" ? 1 : 0, 
             rotate: resolvedTheme === "dark" ? 0 : -90,
             opacity: resolvedTheme === "dark" ? 1 : 0 
           }}
           transition={{ duration: 0.2 }}
           className="absolute inset-0 flex items-center justify-center text-blue-400"
        >
          <Moon className="w-5 h-5 fill-current" />
        </motion.div>
      </div>
    </button>
  )
}
