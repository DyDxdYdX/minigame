import { useState } from "react"
import { createPortal } from "react-dom"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Link, useLocation } from "react-router-dom"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  // Only render portal in browser
  const portalRoot = typeof window !== "undefined" ? document.body : null

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        className="relative z-50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </Button>

      {isOpen && portalRoot && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* Sidebar */}
          <aside
            className="fixed inset-y-0 right-0 w-3/4 max-w-sm bg-background border-l shadow-lg z-50 flex flex-col h-full animate-in slide-in-from-right duration-300"
            tabIndex={-1}
            aria-modal="true"
            role="dialog"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <ThemeToggle />
            </div>
            <nav className="flex-1 p-6">
              <div className="flex flex-col space-y-4">
                <Button asChild variant="ghost" className={`justify-start w-full ${isActive("/") ? "bg-accent text-accent-foreground" : ""}`}>
                  <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
                </Button>
                <Button asChild variant="ghost" className={`justify-start w-full ${isActive("/games") ? "bg-accent text-accent-foreground" : ""}`}>
                  <Link to="/games" onClick={() => setIsOpen(false)}>Games</Link>
                </Button>
                <Button asChild variant="ghost" className={`justify-start w-full ${isActive("/about") ? "bg-accent text-accent-foreground" : ""}`}>
                  <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
                </Button>
                <Button asChild className="w-full mt-4">
                  <Link to="/games" onClick={() => setIsOpen(false)}>Play Now</Link>
                </Button>
              </div>
            </nav>
            <div className="p-6 border-t">
              <p className="text-sm text-muted-foreground">
                © 2024 minigame by DyDxSoft
              </p>
            </div>
          </aside>
        </>,
        portalRoot
      )}
    </div>
  )
} 