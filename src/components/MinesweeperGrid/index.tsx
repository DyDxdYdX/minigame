import React from 'react';
import { cn } from "@/lib/utils";
import { Flag, Bomb } from 'lucide-react';
import type { GameState, Cell, CellState, Difficulty } from '../../pages/MinesweeperPage';

interface MinesweeperGridProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | null>>;
  onGameWon: () => void;
  onGameLost: () => void;
  onGameStart: () => void;
  difficulty: Difficulty;
}

const DIFFICULTY_CONFIG = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

const MinesweeperGrid: React.FC<MinesweeperGridProps> = ({
  gameState,
  setGameState,
  onGameWon,
  onGameLost,
  onGameStart,
  difficulty
}) => {
  const config = DIFFICULTY_CONFIG[difficulty];

  // Get adjacent cells for a given position
  const getAdjacentCells = (row: number, col: number): [number, number][] => {
    const adjacent: [number, number][] = [];
    for (let r = Math.max(0, row - 1); r <= Math.min(config.rows - 1, row + 1); r++) {
      for (let c = Math.max(0, col - 1); c <= Math.min(config.cols - 1, col + 1); c++) {
        if (r !== row || c !== col) {
          adjacent.push([r, c]);
        }
      }
    }
    return adjacent;
  };

  // Reveal multiple cells with flood fill
  const revealCells = (board: Cell[][], cellsToReveal: [number, number][]): { newBoard: Cell[][], hitMine: boolean } => {
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    let hitMine = false;

    const toReveal: [number, number][] = [...cellsToReveal];
    const visited = new Set<string>();

    while (toReveal.length > 0) {
      const [r, c] = toReveal.pop()!;
      const key = `${r},${c}`;
      
      if (visited.has(key)) continue;
      visited.add(key);

      if (r < 0 || r >= config.rows || c < 0 || c >= config.cols) continue;
      if (newBoard[r][c].state !== 'hidden') continue;

      if (newBoard[r][c].isMine) {
        hitMine = true;
        newBoard[r][c].state = 'revealed';
        continue;
      }

      newBoard[r][c].state = 'revealed';

      // If cell has no adjacent mines, reveal all adjacent cells
      if (newBoard[r][c].adjacentMines === 0) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            toReveal.push([r + dr, c + dc]);
          }
        }
      }
    }

    return { newBoard, hitMine };
  };

  // Reveal cell and handle game logic
  const revealCell = (row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const cell = gameState.board[row][col];
    if (cell.state !== 'hidden') return;

    // Start the timer on first move
    if (!gameState.hasStarted) {
      onGameStart();
    }

    const { newBoard, hitMine } = revealCells(gameState.board, [[row, col]]);
    
    if (hitMine) {
      // Game over - reveal all mines
      newBoard.forEach((r, rowIndex) => {
        r.forEach((c, colIndex) => {
          if (c.isMine) {
            newBoard[rowIndex][colIndex].state = 'revealed';
          }
        });
      });
      
      setGameState(prev => prev ? {
        ...prev,
        board: newBoard,
        gameStatus: 'lost'
      } : null);
      
      setTimeout(() => onGameLost(), 100);
      return;
    }

    // Check if game is won
    const isWon = newBoard.every(r => 
      r.every(c => 
        (c.isMine && c.state !== 'revealed') || 
        (!c.isMine && c.state === 'revealed')
      )
    );

    setGameState(prev => prev ? {
      ...prev,
      board: newBoard,
      gameStatus: isWon ? 'won' : 'playing'
    } : null);

    if (isWon) {
      setTimeout(() => onGameWon(), 100);
    }
  };

  // Chord click - reveal surrounding cells if flag count matches
  const chordClick = (row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const cell = gameState.board[row][col];
    if (cell.state !== 'revealed' || cell.adjacentMines === 0) return;

    const adjacentCells = getAdjacentCells(row, col);
    const flagCount = adjacentCells.filter(([r, c]) => gameState.board[r][c].state === 'flagged').length;
    
    // Only proceed if flag count matches the number in the cell
    if (flagCount !== cell.adjacentMines) return;

    // Start the timer on first move
    if (!gameState.hasStarted) {
      onGameStart();
    }

    // Get all hidden adjacent cells to reveal
    const cellsToReveal = adjacentCells.filter(([r, c]) => gameState.board[r][c].state === 'hidden');
    
    if (cellsToReveal.length === 0) return;

    const { newBoard, hitMine } = revealCells(gameState.board, cellsToReveal);
    
    if (hitMine) {
      // Game over - reveal all mines
      newBoard.forEach((r, rowIndex) => {
        r.forEach((c, colIndex) => {
          if (c.isMine) {
            newBoard[rowIndex][colIndex].state = 'revealed';
          }
        });
      });
      
      setGameState(prev => prev ? {
        ...prev,
        board: newBoard,
        gameStatus: 'lost'
      } : null);
      
      setTimeout(() => onGameLost(), 100);
      return;
    }

    // Check if game is won
    const isWon = newBoard.every(r => 
      r.every(c => 
        (c.isMine && c.state !== 'revealed') || 
        (!c.isMine && c.state === 'revealed')
      )
    );

    setGameState(prev => prev ? {
      ...prev,
      board: newBoard,
      gameStatus: isWon ? 'won' : 'playing'
    } : null);

    if (isWon) {
      setTimeout(() => onGameWon(), 100);
    }
  };

  // Toggle flag on cell
  const toggleFlag = (row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;
    
    const cell = gameState.board[row][col];
    if (cell.state === 'revealed') return;

    // Start the timer on first move (even flagging)
    if (!gameState.hasStarted) {
      onGameStart();
    }

    const newBoard = gameState.board.map(r => r.map(c => ({ ...c })));
    const newState: CellState = cell.state === 'flagged' ? 'hidden' : 'flagged';
    newBoard[row][col].state = newState;

    const flagCountChange = newState === 'flagged' ? 1 : -1;

    setGameState(prev => prev ? {
      ...prev,
      board: newBoard,
      flagCount: prev.flagCount + flagCountChange
    } : null);
  };

  // Handle left click (reveal or chord)
  const handleLeftClick = (row: number, col: number) => {
    const cell = gameState.board[row][col];
    
    if (cell.state === 'revealed') {
      // Chord click on revealed cell
      chordClick(row, col);
    } else {
      // Regular reveal on hidden cell
      revealCell(row, col);
    }
  };

  // Handle right click (flag)
  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault(); // Prevent context menu
    toggleFlag(row, col);
  };

  // Get cell display content
  const getCellContent = (cell: Cell) => {
    if (cell.state === 'flagged') {
      return <Flag className="w-3 h-3 text-red-600" />;
    }
    
    if (cell.state === 'revealed') {
      if (cell.isMine) {
        return <Bomb className="w-4 h-4 text-black" />;
      }
      
      if (cell.adjacentMines > 0) {
        return (
          <span 
            className={cn(
              "font-bold text-sm",
              {
                "text-blue-600": cell.adjacentMines === 1,
                "text-green-600": cell.adjacentMines === 2,
                "text-red-600": cell.adjacentMines === 3,
                "text-purple-600": cell.adjacentMines === 4,
                "text-yellow-600": cell.adjacentMines === 5,
                "text-pink-600": cell.adjacentMines === 6,
                "text-black": cell.adjacentMines === 7,
                "text-gray-600": cell.adjacentMines === 8,
              }
            )}
          >
            {cell.adjacentMines}
          </span>
        );
      }
    }
    
    return null;
  };

  // Get cell styling - Traditional minesweeper look
  const getCellClassName = (cell: Cell, row: number, col: number) => {
    const baseClasses = "flex items-center justify-center font-mono select-none transition-all duration-100";
    
    // Responsive cell sizing
    let sizeClasses = "";
    if (difficulty === 'beginner') {
      sizeClasses = "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-xs sm:text-sm";
    } else if (difficulty === 'intermediate') {
      sizeClasses = "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs";
    } else {
      sizeClasses = "w-5 h-5 sm:w-6 sm:h-6 text-xs";
    }

    if (cell.state === 'revealed') {
      if (cell.isMine) {
        // Exploded mine - red background
        return cn(
          baseClasses, 
          sizeClasses, 
          "bg-red-500 border border-gray-800",
          "text-white"
        );
      }
      // Revealed cell - flat, sunken appearance, but still clickable for chord
      return cn(
        baseClasses, 
        sizeClasses, 
        "bg-gray-200 dark:bg-gray-700 cursor-pointer",
        "border border-gray-400 dark:border-gray-600",
        "border-t-gray-300 border-l-gray-300",
        "border-r-gray-500 border-b-gray-500",
        "dark:border-t-gray-600 dark:border-l-gray-600",
        "dark:border-r-gray-800 dark:border-b-gray-800"
      );
    }
    
    if (cell.state === 'flagged') {
      // Flagged cell - still raised but with flag
      return cn(
        baseClasses, 
        sizeClasses, 
        "bg-gray-300 dark:bg-gray-600 cursor-pointer",
        "border-2",
        "border-t-white border-l-white",
        "border-r-gray-500 border-b-gray-500",
        "dark:border-t-gray-400 dark:border-l-gray-400",
        "dark:border-r-gray-800 dark:border-b-gray-800",
        "hover:bg-gray-250 dark:hover:bg-gray-550",
        "active:border-t-gray-400 active:border-l-gray-400",
        "active:border-r-gray-300 active:border-b-gray-300"
      );
    }
    
    // Hidden cell - traditional raised 3D button appearance
    return cn(
      baseClasses, 
      sizeClasses, 
      "bg-gray-300 dark:bg-gray-600 cursor-pointer",
      "border-2",
      "border-t-white border-l-white",
      "border-r-gray-500 border-b-gray-500",
      "dark:border-t-gray-400 dark:border-l-gray-400",
      "dark:border-r-gray-800 dark:border-b-gray-800",
      "hover:bg-gray-250 dark:hover:bg-gray-550",
      "active:border-t-gray-400 active:border-l-gray-400",
      "active:border-r-gray-300 active:border-b-gray-300",
      "active:bg-gray-250 dark:active:bg-gray-550"
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        className="grid gap-0 border-2 border-gray-500 bg-gray-400 dark:bg-gray-700 p-2"
        style={{ 
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          maxWidth: difficulty === 'expert' ? '90vw' : 'auto'
        }}
        onContextMenu={(e) => e.preventDefault()} // Prevent context menu on grid
      >
        {gameState.board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellClassName(cell, rowIndex, colIndex)}
              onClick={() => handleLeftClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              style={{
                pointerEvents: gameState.gameStatus !== 'playing' ? 'none' : 'auto'
              }}
            >
              {getCellContent(cell)}
            </div>
          ))
        )}
      </div>
      
      {/* Mobile-friendly instructions */}
      <div className="text-center text-sm text-muted-foreground max-w-md">
        <p className="text-xs">
          {difficulty === 'expert' && 'Tip: Scroll horizontally on mobile if needed'}
        </p>
      </div>
    </div>
  );
};

export default MinesweeperGrid; 