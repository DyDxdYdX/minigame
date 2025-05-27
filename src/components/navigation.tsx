import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { MobileNav } from "@/components/mobile-nav"
import { Link } from "react-router-dom"

export function Navigation() {
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">minigame</h1>
            <span className="text-sm text-muted-foreground">by DyDxSoft</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="ghost"><Link to="/">Home</Link></Button>
            <Button asChild variant="ghost"><Link to="/games">Games</Link></Button>
            <Button asChild variant="ghost"><Link to="/about">About</Link></Button>
            <Button asChild><Link to="/games">Play Now</Link></Button>
            <ThemeToggle />
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <MobileNav />
          </div>
        </nav>
      </div>
    </header>
  )
} 