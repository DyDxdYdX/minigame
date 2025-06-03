import React, { useState, useEffect, useCallback } from 'react';
import MinesweeperGrid from '../../components/MinesweeperGrid';
import { Button } from "@/components/ui/button";
import { Bomb, ArrowLeft, Timer, Star, StarHalf, StarOff, Smile, Frown, Meh } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export type Difficulty = 'beginner' | 'intermediate' | 'expert';
export type CellState = 'hidden' | 'revealed' | 'flagged';
export type GameStatus = 'playing' | 'won' | 'lost';

export interface Cell {
  isMine: boolean;
  adjacentMines: number;
  state: CellState;
}

export interface GameState {
  board: Cell[][];
  gameStatus: GameStatus;
  mineCount: number;
  flagCount: number;
  time: number;
  hasStarted: boolean;
}

const DIFFICULTY_CONFIG = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 }
};

const MinesweeperPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isWinDialogOpen, setIsWinDialogOpen] = useState(false);

  const navigate = useNavigate();

  // Initialize a new game
  const initializeGame = useCallback((diff: Difficulty) => {
    const config = DIFFICULTY_CONFIG[diff];
    const board: Cell[][] = Array(config.rows).fill(null).map(() =>
      Array(config.cols).fill(null).map(() => ({
        isMine: false,
        adjacentMines: 0,
        state: 'hidden' as CellState
      }))
    );

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < config.mines) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);
      
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate adjacent mine counts
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!board[row][col].isMine) {
          let count = 0;
          for (let r = Math.max(0, row - 1); r <= Math.min(config.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(config.cols - 1, col + 1); c++) {
              if (board[r][c].isMine) count++;
            }
          }
          board[row][col].adjacentMines = count;
        }
      }
    }

    setGameState({
      board,
      gameStatus: 'playing',
      mineCount: config.mines,
      flagCount: 0,
      time: 0,
      hasStarted: false
    });
  }, []);

  // Initialize game on component mount and difficulty change
  useEffect(() => {
    initializeGame(difficulty);
  }, [difficulty, initializeGame]);

  // Timer effect - only start when game has started
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState?.gameStatus === 'playing' && gameState?.hasStarted) {
      interval = setInterval(() => {
        setGameState(prev => prev ? { ...prev, time: prev.time + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState?.gameStatus, gameState?.hasStarted]);

  const handleNewGame = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setIsWinDialogOpen(false);
  };

  const handleReset = () => {
    initializeGame(difficulty);
    setIsWinDialogOpen(false);
  };

  const handleExit = () => {
    navigate('/games');
    setIsExitDialogOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return <Star className="w-4 h-4" />;
      case 'intermediate':
        return <StarHalf className="w-4 h-4" />;
      case 'expert':
        return <StarOff className="w-4 h-4" />;
    }
  };

  const getGameStatusIcon = () => {
    switch (gameState?.gameStatus) {
      case 'won':
        return <Smile className="w-8 h-8 text-yellow-500" />;
      case 'lost':
        return <Frown className="w-8 h-8 text-red-500" />;
      default:
        return <Meh className="w-8 h-8 text-blue-500" />;
    }
  };

  const onGameWon = () => {
    setIsWinDialogOpen(true);
  };

  const onGameLost = () => {
    // Game lost - no dialog, just update status
  };

  const onGameStart = () => {
    if (gameState && !gameState.hasStarted) {
      setGameState(prev => prev ? { ...prev, hasStarted: true } : null);
    }
  };

  const getDifficultyDisplayName = (diff: Difficulty) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  const getGameStats = () => {
    if (!gameState) return null;
    
    const config = DIFFICULTY_CONFIG[difficulty];
    const totalCells = config.rows * config.cols;
    const revealedCells = gameState.board.flat().filter(cell => cell.state === 'revealed').length;
    const accuracy = totalCells > 0 ? Math.round((revealedCells / (totalCells - config.mines)) * 100) : 0;
    
    return {
      time: formatTime(gameState.time),
      difficulty: getDifficultyDisplayName(difficulty),
      mines: config.mines,
      accuracy: Math.min(100, accuracy)
    };
  };

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const stats = getGameStats();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Exit Button */}
      <div className="mb-6">
        <Button 
          onClick={() => setIsExitDialogOpen(true)}
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Games
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8">Minesweeper</h1>
      
      <div className="flex flex-col items-center gap-6">
        {/* Difficulty Buttons */}
        <div className="flex gap-2 flex-wrap justify-center">
          {(['beginner', 'intermediate', 'expert'] as const).map((diff) => (
            <Button
              key={diff}
              onClick={() => handleNewGame(diff)}
              variant={difficulty === diff ? 'default' : 'outline'}
              size="sm"
              className={`capitalize min-w-[100px] gap-2 transition-all duration-200
                ${difficulty === diff 
                  ? 'shadow-md scale-105' 
                  : 'hover:scale-105 hover:shadow-sm'}`}
            >
              {getDifficultyIcon(diff)}
              {diff}
            </Button>
          ))}
        </div>

        {/* Game Stats and Reset Button */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Bomb className="w-5 h-5 text-red-500" />
              <span className="text-lg font-bold">
                {gameState.mineCount - gameState.flagCount}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Mines</span>
          </div>

          {/* Reset Button with Icon Face */}
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="min-w-[60px] h-[60px] rounded-lg border-2 p-2"
          >
            {getGameStatusIcon()}
          </Button>
          
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-blue-500" />
              <span className="text-lg font-bold">
                {formatTime(gameState.time)}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">Time</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground max-w-md">
          <p className="mb-1">
            <span className="font-semibold">Left click</span> to reveal • <span className="font-semibold">Right click</span> to flag
          </p>
        </div>

        {/* Game Grid */}
        <div className="flex justify-center">
          <MinesweeperGrid 
            gameState={gameState}
            setGameState={setGameState}
            onGameWon={onGameWon}
            onGameLost={onGameLost}
            onGameStart={onGameStart}
            difficulty={difficulty}
          />
        </div>
      </div>

      {/* Win Statistics Dialog */}
      <AlertDialog open={isWinDialogOpen} onOpenChange={setIsWinDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl">
              <Smile className="w-6 h-6 text-yellow-500" />
              Congratulations!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              You successfully cleared the minefield!
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {stats && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.time}</div>
                  <div className="text-sm text-muted-foreground">Time</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.difficulty}</div>
                  <div className="text-sm text-muted-foreground">Difficulty</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.mines}</div>
                  <div className="text-sm text-muted-foreground">Mines</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">{stats.accuracy}%</div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
              </div>
            </div>
          )}

          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <div className="flex gap-2 justify-center w-full sm:w-auto">
              {(['beginner', 'intermediate', 'expert'] as const).map((diff) => (
                <Button
                  key={diff}
                  onClick={() => handleNewGame(diff)}
                  variant='outline'
                  size="sm"
                  className="capitalize min-w-[80px] gap-1"
                >
                  {getDifficultyIcon(diff)}
                  {diff}
                </Button>
              ))}
            </div>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Exit Confirmation Dialog - Only navigation dialog kept */}
      <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Game?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to leave? Your current progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Playing</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit}>
              Exit Game
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MinesweeperPage; 