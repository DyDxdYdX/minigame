import React, { useState, useEffect } from 'react';
import SlidingPuzzleGrid from '../../components/SlidingPuzzleGrid';
import { 
  generatePuzzle, 
  moveTile, 
  moveTileLine,
  PuzzleState, 
  PUZZLE_SIZES, 
  PuzzleSize 
} from '../../data/sliding-puzzle-data';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy, Timer, Hash } from 'lucide-react';
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
import { ThemeToggle } from "@/components/theme-toggle";

const SlidingPuzzlePage: React.FC = () => {
  const [currentSize, setCurrentSize] = useState<number>(4);
  const [puzzleState, setPuzzleState] = useState<PuzzleState>(() => generatePuzzle(4));
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isCongratsDialogOpen, setIsCongratsDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const navigate = useNavigate();

  // Timer effect - only runs when game has started and puzzle is not completed
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameStarted && startTime && !puzzleState.isCompleted) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStarted, startTime, puzzleState.isCompleted]);

  // Check for completion
  useEffect(() => {
    if (puzzleState.isCompleted) {
      setIsCongratsDialogOpen(true);
    }
  }, [puzzleState.isCompleted]);

  const handleTileClick = (tileIndex: number) => {
    if (puzzleState.isCompleted) return;
    
    // Start timer on first move
    if (!gameStarted) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
    
    // Multi-tile move if in same row or column as empty
    const rowClicked = Math.floor(tileIndex / currentSize);
    const colClicked = tileIndex % currentSize;
    const rowEmpty = Math.floor(puzzleState.emptyIndex / currentSize);
    const colEmpty = puzzleState.emptyIndex % currentSize;
    let newState;
    if ((rowClicked === rowEmpty || colClicked === colEmpty) && tileIndex !== puzzleState.emptyIndex) {
      newState = moveTileLine(puzzleState, tileIndex, currentSize);
    } else {
      newState = moveTile(puzzleState, tileIndex, currentSize);
    }
    setPuzzleState(newState);
  };

  const handleNewGame = (size?: number) => {
    const newSize = size || currentSize;
    const newPuzzle = generatePuzzle(newSize);
    
    setCurrentSize(newSize);
    setPuzzleState(newPuzzle);
    setStartTime(null);
    setElapsedTime(0);
    setGameStarted(false);
    setIsCongratsDialogOpen(false);
    setIsResetDialogOpen(false);
  };

  const handleReset = () => {
    handleNewGame(currentSize);
  };

  const handleExit = () => {
    navigate('/games');
    setIsExitDialogOpen(false);
  };

  const formatTime = (time: number): string => {
    const seconds = Math.floor(time / 1000) % 60;
    const minutes = Math.floor(time / 60000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getSizeIcon = (size: number) => {
    switch (size) {
      case 3: return <Hash className="w-4 h-4" />;
      case 4: return <Hash className="w-4 h-4" />;
      case 5: return <Hash className="w-4 h-4" />;
      default: return <Hash className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => setIsExitDialogOpen(true)}
              variant="ghost" 
              size="sm" 
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Games
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Sliding Puzzle</h1>
        
        <div className="flex flex-col items-center gap-8">
          {/* Game Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center">
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
              <Timer className="w-5 h-5 text-primary" />
              <span className="font-mono text-lg font-semibold">
                {gameStarted ? formatTime(elapsedTime) : "00:00"}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="font-semibold">{puzzleState.moves} moves</span>
            </div>
            <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border">
              <Hash className="w-5 h-5 text-primary" />
              <span className="font-semibold">{currentSize}×{currentSize}</span>
            </div>
          </div>

          {/* Size Selection */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {PUZZLE_SIZES.map((puzzleSize: PuzzleSize) => (
                <Button
                  key={puzzleSize.size}
                  onClick={() => handleNewGame(puzzleSize.size)}
                  variant={currentSize === puzzleSize.size ? 'default' : 'outline'}
                  size="sm"
                  className={`min-w-[80px] gap-2 transition-all duration-200
                    ${currentSize === puzzleSize.size 
                      ? 'shadow-md scale-105' 
                      : 'hover:scale-105 hover:shadow-sm'}`}
                >
                  {getSizeIcon(puzzleSize.size)}
                  {puzzleSize.label}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => handleNewGame()} 
                variant="default" 
                size="lg"
                className="min-w-[120px]"
              >
                New Game
              </Button>
              <Button 
                onClick={() => setIsResetDialogOpen(true)} 
                variant="outline" 
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>
          </div>

          {/* Game Grid */}
          <div className="flex flex-col items-center gap-4">
            <SlidingPuzzleGrid
              puzzleState={puzzleState}
              size={currentSize}
              onTileClick={handleTileClick}
            />
            
            {puzzleState.isCompleted && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                <Trophy className="w-5 h-5" />
                <span>Puzzle Solved!</span>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="max-w-md text-center text-muted-foreground text-sm space-y-2">
            <p>Click or drag a tile adjacent to the empty space to move it.</p>
            <p>Arrange the numbers in order from 1 to {currentSize * currentSize - 1}.</p>
            <p>Timer starts when you make your first move.</p>
          </div>
        </div>

        {/* Congratulations Dialog */}
        <AlertDialog open={isCongratsDialogOpen} onOpenChange={setIsCongratsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Congratulations!
              </AlertDialogTitle>
              <AlertDialogDescription>
                You solved the {currentSize}×{currentSize} sliding puzzle in {puzzleState.moves} moves 
                and {formatTime(elapsedTime)}!
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => handleNewGame()}>
                Play Again
              </AlertDialogAction>
              <AlertDialogCancel onClick={() => setIsCongratsDialogOpen(false)}>
                Continue
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Reset Confirmation Dialog */}
        <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will start a new {currentSize}×{currentSize} puzzle and reset your progress. 
                Your current moves ({puzzleState.moves}) and time will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>
                Reset Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Exit Confirmation Dialog */}
        <AlertDialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Game?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to exit? Your current progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExit}>
                Exit Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default SlidingPuzzlePage; 