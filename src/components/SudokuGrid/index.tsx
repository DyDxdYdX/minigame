import React from 'react';

interface SudokuGridProps {
  initialPuzzle: number[][];
  selectedTool: number | 'eraser' | null;
  setSelectedTool: React.Dispatch<React.SetStateAction<number | 'eraser' | null>>;
  validationErrors: boolean[][];
  gridData: number[][];
  setGridData: React.Dispatch<React.SetStateAction<number[][]>>;
  isHelperMode: boolean;
  activeCell: {row: number, col: number} | null;
  setActiveCell: React.Dispatch<React.SetStateAction<{row: number, col: number} | null>>;
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ 
  initialPuzzle, 
  selectedTool, 
  setSelectedTool, 
  validationErrors, 
  gridData, 
  setGridData,
  isHelperMode,
  activeCell,
  setActiveCell
}) => {
  // Store the original puzzle to know which cells are pre-filled
  const originalPuzzle = initialPuzzle;

  // Helper function to check if a cell is in the same row, column, or 3x3 box as the active cell
  const isHighlighted = (rowIndex: number, colIndex: number) => {
    if (!isHelperMode || !activeCell) return false;
    
    const { row: activeRow, col: activeCol } = activeCell;
    
    // Same row or column
    if (rowIndex === activeRow || colIndex === activeCol) return true;
    
    // Same 3x3 box
    const boxStartRow = Math.floor(activeRow / 3) * 3;
    const boxStartCol = Math.floor(activeCol / 3) * 3;
    const boxEndRow = boxStartRow + 2;
    const boxEndCol = boxStartCol + 2;
    
    return rowIndex >= boxStartRow && rowIndex <= boxEndRow && 
           colIndex >= boxStartCol && colIndex <= boxEndCol;
  };

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    // Set active cell for highlighting
    if (isHelperMode) {
      setActiveCell({ row: rowIndex, col: colIndex });
      
      // Auto-select the number if helper mode is enabled and cell has a value
      // BUT only if we're not trying to erase
      const cellValue = gridData[rowIndex][colIndex];
      if (cellValue !== 0 && selectedTool !== 'eraser') {
        setSelectedTool(cellValue);
        return; // Exit early if we're just selecting the number
      }
    }

    // Prevent changing pre-filled numbers from the original puzzle
    if (originalPuzzle[rowIndex][colIndex] !== 0) {
      return; // Cell is part of the initial puzzle, do not modify
    }

    if (typeof selectedTool === 'number') {
      const newGridData = gridData.map(row => [...row]);
      newGridData[rowIndex][colIndex] = selectedTool;
      setGridData(newGridData);
    } else if (selectedTool === 'eraser') {
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
          const isPrefilled = originalPuzzle[rowIndex][colIndex] !== 0;
          const isSelectedNumber = typeof selectedTool === 'number' && cellValue !== 0 && cellValue === selectedTool;
          const hasError = validationErrors[rowIndex][colIndex];
          const isActiveCell = activeCell?.row === rowIndex && activeCell?.col === colIndex;
          const isHighlightedCell = isHighlighted(rowIndex, colIndex);

          let cellClassName = `w-12 h-12 flex items-center justify-center text-xl 
                             ${isPrefilled ? 'font-bold text-foreground' : 'font-semibold text-blue-600 dark:text-blue-400'} 
                             bg-card 
                             ${isActiveCell ? 'bg-amber-200 dark:bg-amber-800/50' : ''} 
                             ${isHighlightedCell && !isActiveCell ? 'bg-amber-100 dark:bg-amber-900/30' : ''} 
                             ${isSelectedNumber && !isActiveCell && !isHighlightedCell ? 'bg-primary/20 dark:bg-primary/30' : ''} 
                             ${!isActiveCell && !isHighlightedCell && !isSelectedNumber ? 'hover:bg-muted/70' : ''} 
                             ${isPrefilled ? 'cursor-default' : 'cursor-pointer'} 
                             ${hasError ? 'text-red-500 dark:text-red-400' : ''}
                             transition-colors duration-150`;

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