import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Routes, Route } from "react-router-dom"
import About from "@/pages/About"
import Home from "@/pages/Home"
import Games from "@/pages/Games"
import SudokuPage from "@/pages/SudokuPage"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="minigame-theme">
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/games/sudoku" element={<SudokuPage />} />
        </Routes>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App 