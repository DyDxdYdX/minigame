import easyPuzzles from './minesweeper/minesweeper_easy.json';
import mediumPuzzles from './minesweeper/minesweeper_medium.json';
import hardPuzzles from './minesweeper/minesweeper_hard.json';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MinesweeperPuzzle {
  puzzle: number[][];
  mine_positions: number[][];
}

export interface PuzzleData {
  [key: string]: MinesweeperPuzzle;
}

// Type the imported JSON data
const puzzleCollections: Record<Difficulty, PuzzleData> = {
  easy: easyPuzzles as PuzzleData,
  medium: mediumPuzzles as PuzzleData,
  hard: hardPuzzles as PuzzleData
};

/**
 * Get a random Minesweeper puzzle for the specified difficulty level
 * @param difficulty - The difficulty level ('easy', 'medium', 'hard')
 * @returns A random puzzle with solution and mine positions
 */
export const getRandomMinesweeperPuzzle = (difficulty: Difficulty): MinesweeperPuzzle => {
  const collection = puzzleCollections[difficulty];
  const puzzleKeys = Object.keys(collection);
  const randomIndex = Math.floor(Math.random() * puzzleKeys.length);
  const randomKey = puzzleKeys[randomIndex];
  
  return collection[randomKey];
};

/**
 * Get the total number of puzzles available for a difficulty level
 * @param difficulty - The difficulty level
 * @returns Number of available puzzles
 */
export const getPuzzleCount = (difficulty: Difficulty): number => {
  return Object.keys(puzzleCollections[difficulty]).length;
};

/**
 * Get difficulty configuration
 * @param difficulty - The difficulty level
 * @returns Grid dimensions and mine count
 */
export const getDifficultyConfig = (difficulty: Difficulty) => {
  const configs = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 }
  };
  
  return configs[difficulty];
}; 