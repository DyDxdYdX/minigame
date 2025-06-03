import { ThemeProvider } from "@/components/theme-provider"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Routes, Route, useLocation } from "react-router-dom"
import About from "@/pages/About"
import Home from "@/pages/Home"
import Games from "@/pages/Games"
import SudokuPage from "@/pages/SudokuPage"
import MinesweeperPage from "@/pages/MinesweeperPage"

function App() {
  const location = useLocation();
  
  // Hide navigation and footer on game pages
  const isGamePage = location.pathname.startsWith('/games/');

  return (
    <ThemeProvider defaultTheme="system" storageKey="minigame-theme">
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
        {!isGamePage && <Navigation />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/about" element={<About />} />
          <Route path="/games/sudoku" element={<SudokuPage />} />
          <Route path="/games/minesweeper" element={<MinesweeperPage />} />
        </Routes>
        {!isGamePage && <Footer />}
      </div>
    </ThemeProvider>
  )
}

export default App 