import React, { useState } from 'react';
import SudokuGrid from '@/components/SudokuGrid';
import { Button } from "@/components/ui/button";
import { Eraser } from 'lucide-react';

const SudokuPage: React.FC = () => {
  const [difficulty, setDifficulty] = useState('Medium');
  const [selectedTool, setSelectedTool] = useState<number | 'eraser' | null>(null);

  const handleNewGame = () => {
    console.log('Starting new game with difficulty:', difficulty);
    setSelectedTool(null);
  };

  const handleSelectDifficulty = (newDifficulty: string) => {
    setDifficulty(newDifficulty);
    console.log('Difficulty set to:', newDifficulty);
  };

  const handleToolSelect = (tool: number | 'eraser') => {
    setSelectedTool(tool === selectedTool ? null : tool);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center mt-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sudoku</h1>
      
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={handleNewGame} variant="default" size="lg">New Game</Button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Difficulty:</span>
          <Button onClick={() => handleSelectDifficulty('Easy')} variant={difficulty === 'Easy' ? 'secondary' : 'outline'} size="sm">Easy</Button>
          <Button onClick={() => handleSelectDifficulty('Medium')} variant={difficulty === 'Medium' ? 'secondary' : 'outline'} size="sm">Medium</Button>
          <Button onClick={() => handleSelectDifficulty('Hard')} variant={difficulty === 'Hard' ? 'secondary' : 'outline'} size="sm">Hard</Button>
        </div>
      </div>

      <SudokuGrid selectedTool={selectedTool} />

      <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            onClick={() => handleToolSelect(number)}
            variant={selectedTool === number ? 'default' : 'outline'}
            size="icon"
            className="rounded-full w-10 h-10 text-lg"
          >
            {number}
          </Button>
        ))}
        <Button
          key="eraser"
          onClick={() => handleToolSelect('eraser')}
          variant={selectedTool === 'eraser' ? 'default' : 'outline'}
          size="icon"
          className="rounded-full w-10 h-10"
          aria-label="Eraser"
        >
          <Eraser className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default SudokuPage; 