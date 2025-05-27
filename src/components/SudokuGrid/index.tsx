import React, { useState, useEffect } from 'react';

interface SudokuGridProps {
  selectedTool: number | 'eraser' | null;
  // We might add more props later, like the initial puzzle or a callback for when the grid is solved
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ selectedTool }) => {
  // Initialize a 9x9 grid with all zeros (empty cells)
  const initialGrid = Array(9).fill(null).map(() => Array(9).fill(0));
  const [gridData, setGridData] = useState<number[][]>(initialGrid);

  // TODO: Later, we'll need to load an actual puzzle here instead of all zeros
  // and differentiate between pre-filled numbers and user-entered numbers.

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (typeof selectedTool === 'number') {
      // For now, allow overwriting any cell. 
      // Later, we'll need to check if the cell is part of the initial puzzle.
      const newGridData = gridData.map(row => [...row]); // Create a new copy for immutability
      newGridData[rowIndex][colIndex] = selectedTool;
      setGridData(newGridData);
    } else if (selectedTool === 'eraser') {
      // Logic for eraser will be added in the next step
      const newGridData = gridData.map(row => [...row]);
      newGridData[rowIndex][colIndex] = 0; // Assuming 0 means empty
      setGridData(newGridData);
    }
    // If selectedTool is null, do nothing on cell click
  };

  return (
    <div className="grid grid-cols-9 gap-0.5 bg-border p-1 w-max mx-auto rounded-lg shadow-md">
      {gridData.map((row, rowIndex) =>
        row.map((cellValue: number, colIndex: number) => {
          let cellClassName = `w-12 h-12 flex items-center justify-center text-xl font-semibold 
                             bg-card text-card-foreground 
                             hover:bg-muted/70 cursor-pointer transition-colors duration-150`;

          // Thick right border for 3x3 subgrids (but not for the last column)
          if ((colIndex + 1) % 3 === 0 && colIndex < 8) {
            cellClassName += ' border-r-2 border-r-primary/40 dark:border-r-primary/60';
          }
          // Thick bottom border for 3x3 subgrids (but not for the last row)
          if ((rowIndex + 1) % 3 === 0 && rowIndex < 8) {
            cellClassName += ' border-b-2 border-b-primary/40 dark:border-b-primary/60';
          }
          // TODO: Add styling for pre-filled vs user-entered numbers

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={cellClassName}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cellValue !== 0 ? cellValue : ''}
            </div>
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid; 