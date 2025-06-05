export interface PuzzleState {
  tiles: number[];
  emptyIndex: number;
  moves: number;
  isCompleted: boolean;
}

export interface PuzzleSize {
  size: number;
  label: string;
}

export const PUZZLE_SIZES: PuzzleSize[] = [
  { size: 3, label: "3x3" },
  { size: 4, label: "4x4" },
  { size: 5, label: "5x5" }
];

// Fisher-Yates shuffle algorithm
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Check if a puzzle configuration is solvable
export function isSolvable(tiles: number[], size: number): boolean {
  const emptyIndex = tiles.indexOf(0);
  const emptyRow = Math.floor(emptyIndex / size);
  
  // Count inversions (pairs where a larger number appears before a smaller number)
  let inversions = 0;
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i] === 0) continue;
    for (let j = i + 1; j < tiles.length; j++) {
      if (tiles[j] === 0) continue;
      if (tiles[i] > tiles[j]) {
        inversions++;
      }
    }
  }
  
  if (size % 2 === 1) {
    // For odd grid width, number of inversions must be even
    return inversions % 2 === 0;
  } else {
    // For even grid width, solvability depends on empty tile row
    if (emptyRow % 2 === 0) {
      // Empty tile on even row from bottom, inversions must be odd
      return inversions % 2 === 1;
    } else {
      // Empty tile on odd row from bottom, inversions must be even
      return inversions % 2 === 0;
    }
  }
}

// Generate a new puzzle
export function generatePuzzle(size: number): PuzzleState {
  const totalTiles = size * size;
  let tiles: number[];
  
  // Keep generating until we get a solvable puzzle
  do {
    // Create ordered array from 1 to size*size-1, with 0 (empty) at the end
    const orderedTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    orderedTiles.push(0);
    tiles = shuffleArray(orderedTiles);
  } while (!isSolvable(tiles, size));
  
  const emptyIndex = tiles.indexOf(0);
  
  return {
    tiles,
    emptyIndex,
    moves: 0,
    isCompleted: false
  };
}

// Check if puzzle is completed
export function isPuzzleCompleted(tiles: number[]): boolean {
  for (let i = 0; i < tiles.length - 1; i++) {
    if (tiles[i] !== i + 1) {
      return false;
    }
  }
  return tiles[tiles.length - 1] === 0;
}

// Get valid moves for the empty tile
export function getValidMoves(emptyIndex: number, size: number): number[] {
  const validMoves: number[] = [];
  const row = Math.floor(emptyIndex / size);
  const col = emptyIndex % size;
  
  // Up
  if (row > 0) validMoves.push(emptyIndex - size);
  // Down
  if (row < size - 1) validMoves.push(emptyIndex + size);
  // Left
  if (col > 0) validMoves.push(emptyIndex - 1);
  // Right
  if (col < size - 1) validMoves.push(emptyIndex + 1);
  
  return validMoves;
}

// Move a tile into the empty space
export function moveTile(puzzleState: PuzzleState, tileIndex: number, size: number): PuzzleState {
  const { tiles, emptyIndex, moves } = puzzleState;
  const validMoves = getValidMoves(emptyIndex, size);
  
  // Check if the move is valid
  if (!validMoves.includes(tileIndex)) {
    return puzzleState; // Invalid move, return unchanged state
  }
  
  // Create new tiles array with the move
  const newTiles = [...tiles];
  [newTiles[emptyIndex], newTiles[tileIndex]] = [newTiles[tileIndex], newTiles[emptyIndex]];
  
  const newState: PuzzleState = {
    tiles: newTiles,
    emptyIndex: tileIndex,
    moves: moves + 1,
    isCompleted: isPuzzleCompleted(newTiles)
  };
  
  return newState;
}

// Move a line of tiles between the clicked tile and the empty space (row or column)
export function moveTileLine(puzzleState: PuzzleState, tileIndex: number, size: number): PuzzleState {
  const { tiles, emptyIndex, moves } = puzzleState;
  const rowClicked = Math.floor(tileIndex / size);
  const colClicked = tileIndex % size;
  const rowEmpty = Math.floor(emptyIndex / size);
  const colEmpty = emptyIndex % size;

  // Only allow if in same row or column and not the same cell
  if (tileIndex === emptyIndex || (rowClicked !== rowEmpty && colClicked !== colEmpty)) {
    return puzzleState;
  }

  const newTiles = [...tiles];
  let moved = false;

  if (rowClicked === rowEmpty) {
    // Same row: move all tiles between clicked and empty (left or right)
    const start = Math.min(colClicked, colEmpty);
    const end = Math.max(colClicked, colEmpty);
    if (colClicked < colEmpty) {
      // Move right: shift tiles right
      for (let c = colEmpty; c > colClicked; c--) {
        newTiles[rowClicked * size + c] = newTiles[rowClicked * size + c - 1];
      }
      newTiles[tileIndex] = 0;
      moved = true;
    } else if (colClicked > colEmpty) {
      // Move left: shift tiles left
      for (let c = colEmpty; c < colClicked; c++) {
        newTiles[rowClicked * size + c] = newTiles[rowClicked * size + c + 1];
      }
      newTiles[tileIndex] = 0;
      moved = true;
    }
  } else if (colClicked === colEmpty) {
    // Same column: move all tiles between clicked and empty (up or down)
    const start = Math.min(rowClicked, rowEmpty);
    const end = Math.max(rowClicked, rowEmpty);
    if (rowClicked < rowEmpty) {
      // Move down: shift tiles down
      for (let r = rowEmpty; r > rowClicked; r--) {
        newTiles[r * size + colClicked] = newTiles[(r - 1) * size + colClicked];
      }
      newTiles[tileIndex] = 0;
      moved = true;
    } else if (rowClicked > rowEmpty) {
      // Move up: shift tiles up
      for (let r = rowEmpty; r < rowClicked; r++) {
        newTiles[r * size + colClicked] = newTiles[(r + 1) * size + colClicked];
      }
      newTiles[tileIndex] = 0;
      moved = true;
    }
  }

  if (!moved) return puzzleState;

  const newState: PuzzleState = {
    tiles: newTiles,
    emptyIndex: tileIndex,
    moves: moves + 1,
    isCompleted: isPuzzleCompleted(newTiles)
  };

  return newState;
} 