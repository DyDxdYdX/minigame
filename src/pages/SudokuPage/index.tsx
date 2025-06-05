import React, { useState, useEffect, useCallback } from 'react';
import SudokuGrid from '../../components/SudokuGrid';
import { getRandomPuzzle, type Difficulty } from '../../data/sudoku-puzzles';
import { Button } from "@/components/ui/button";
import { Eraser, Star, StarHalf, StarOff, Info, ArrowLeft } from 'lucide-react';
import * as SwitchPrimitives from "@radix-ui/react-switch";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ThemeToggle } from "@/components/theme-toggle";

// Import images
import highlightErrorsImg from '../../assets/images/sudoku/highlight-error.png';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

const SudokuPage: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<number | 'eraser' | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [currentPuzzle, setCurrentPuzzle] = useState(() => getRandomPuzzle('easy'));
  const [gridData, setGridData] = useState<number[][]>(JSON.parse(JSON.stringify(getRandomPuzzle('easy').puzzle)));
  const [isValidationEnabled, setIsValidationEnabled] = useState(false);
  const [validationErrors, setValidationErrors] = useState<boolean[][]>(Array(9).fill(null).map(() => Array(9).fill(false)));
  const [isCongratsDialogOpen, setIsCongratsDialogOpen] = useState(false);
  const [isIncompleteDialogOpen, setIsIncompleteDialogOpen] = useState(false);
  const [isClearAllDialogOpen, setIsClearAllDialogOpen] = useState(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setGridData(JSON.parse(JSON.stringify(currentPuzzle.puzzle)));
  }, [currentPuzzle]);

  const handleNumberSelect = (number: number | 'eraser') => {
    // Toggle selection - if already selected, deselect it
    setSelectedTool(selectedTool === number ? null : number);
  };

  const handleClearAll = () => {
    // Reset grid to original puzzle state (keep pre-filled numbers, clear user entries)
    const clearedGrid = JSON.parse(JSON.stringify(currentPuzzle.puzzle));
    setGridData(clearedGrid);
    setSelectedTool(null);
    setValidationErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setIsClearAllDialogOpen(false);
  };

  const handleExit = () => {
    navigate('/games');
    setIsExitDialogOpen(false);
  };

  const handleNewGame = (newDifficulty: Difficulty) => {
    const newPuzzle = getRandomPuzzle(newDifficulty);
    setDifficulty(newDifficulty);
    setCurrentPuzzle(newPuzzle);
    setGridData(JSON.parse(JSON.stringify(newPuzzle.puzzle)));
    setSelectedTool(null);
    setValidationErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setIsCongratsDialogOpen(false);
    setIsIncompleteDialogOpen(false);
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case 'easy':
        return <Star className="w-4 h-4" />;
      case 'medium':
        return <StarHalf className="w-4 h-4" />;
      case 'hard':
        return <StarOff className="w-4 h-4" />;
    }
  };

  // Validation function that checks against the solution
  const validateSudoku = useCallback((grid: number[][]) => {
    const errors = Array(9).fill(null).map(() => Array(9).fill(false));
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== 0 && currentPuzzle.puzzle[row][col] === 0) {
          if (grid[row][col] !== currentPuzzle.solution[row][col]) {
            errors[row][col] = true;
          }
        }
      }
    }
    return errors;
  }, [currentPuzzle]);

  // Function to check if the puzzle is solved correctly
  const isPuzzleSolved = (grid: number[][]) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0 || grid[row][col] !== currentPuzzle.solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = () => {
    if (isPuzzleSolved(gridData)) {
      setIsCongratsDialogOpen(true);
    } else {
      if (isValidationEnabled) {
        const errors = validateSudoku(gridData);
        setValidationErrors(errors);
      }
      setIsIncompleteDialogOpen(true);
    }
  };

  // Update validation errors when grid changes
  useEffect(() => {
    if (isValidationEnabled) {
      const errors = validateSudoku(gridData);
      setValidationErrors(errors);
    } else {
      setValidationErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    }
  }, [gridData, isValidationEnabled, validateSudoku]);

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
        <h1 className="text-3xl font-bold text-center mb-8">Sudoku</h1>
        
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={() => handleNewGame(difficulty)} 
              variant="default" 
              size="lg"
              className="min-w-[120px]"
            >
              New Game
            </Button>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as const).map((diff) => (
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

            {/* Validation Mode, Default is disabled */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <Switch
                      id="validation-mode"
                      checked={isValidationEnabled}
                      onCheckedChange={setIsValidationEnabled}
                    />
                    <label 
                      htmlFor="validation-mode" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help"
                    >
                      Highlight Errors
                    </label>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-64">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Highlight Errors</h4>
                    <div className="flex flex-col items-center space-y-2">
                      <img 
                        src={highlightErrorsImg} 
                        alt="Highlight Errors Preview" 
                        className="w-32 h-32 rounded-md border object-contain"
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Shows invalid numbers highlighted in red
                      </p>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>

            <SudokuGrid 
              initialPuzzle={currentPuzzle.puzzle}
              selectedTool={selectedTool}
              validationErrors={validationErrors}
              gridData={gridData}
              setGridData={setGridData}
            />
            
            <div className="flex gap-2 flex-wrap justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
                <Button
                  key={number}
                  onClick={() => handleNumberSelect(number)}
                  variant={selectedTool === number ? 'default' : 'outline'}
                  size="icon"
                  className="w-10 h-10 text-lg"
                >
                  {number}
                </Button>
              ))}
              <Button
                onClick={() => handleNumberSelect('eraser')}
                variant={selectedTool === 'eraser' ? 'default' : 'outline'}
                size="icon"
                className="w-10 h-10"
                aria-label="Eraser"
              >
                <Eraser className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleSubmit}
                variant="default"
                size="lg"
                className="min-w-[150px]"
              >
                Submit Solution
              </Button>
              
              <Button 
                onClick={() => setIsClearAllDialogOpen(true)}
                variant="destructive"
                size="lg"
                className="min-w-[100px]"
              >
                Clear All
              </Button>
            </div>

          </div>

          {/* Congratulations AlertDialog */}
          <AlertDialog open={isCongratsDialogOpen} onOpenChange={setIsCongratsDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Congratulations!</AlertDialogTitle>
                <AlertDialogDescription>
                  You have successfully solved the Sudoku puzzle!
                  <br />
                  Ready for a new challenge?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                <div className="flex gap-2 justify-center w-full sm:w-auto">
                  {(['easy', 'medium', 'hard'] as const).map((diff) => (
                    <Button
                      key={diff}
                      onClick={() => {
                        handleNewGame(diff);
                        setIsCongratsDialogOpen(false);
                      }}
                      variant='outline'
                      size="sm"
                      className="capitalize min-w-[70px] gap-1"
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

          {/* Incomplete AlertDialog */}
          <AlertDialog open={isIncompleteDialogOpen} onOpenChange={setIsIncompleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Puzzle Incomplete</AlertDialogTitle>
                <AlertDialogDescription>
                  The puzzle is not yet complete or contains errors. Keep trying!
                  {isValidationEnabled && (
                    <span className="block mt-2 text-xs">
                      Tip: Error highlighting is enabled to help you spot mistakes.
                    </span>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction onClick={() => setIsIncompleteDialogOpen(false)}>
                  Continue Playing
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Exit Confirmation AlertDialog */}
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

          {/* Clear All Confirmation AlertDialog */}
          <AlertDialog open={isClearAllDialogOpen} onOpenChange={setIsClearAllDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Entries?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove all your entered numbers and reset the puzzle to its original state. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
    </div>
  );
};

export default SudokuPage;