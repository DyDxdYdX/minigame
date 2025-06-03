import easyPuzzles from './sudoku_easy.json';
import mediumPuzzles from './sudoku_medium.json';
import hardPuzzles from './sudoku_hard.json';

export interface SudokuPuzzle {
  puzzle: number[][];
  solution: number[][];
}

export type Difficulty = 'easy' | 'medium' | 'hard';

export const getPuzzlesByDifficulty = (difficulty: Difficulty): SudokuPuzzle[] => {
  switch (difficulty) {
    case 'easy':
      return Object.values(easyPuzzles);
    case 'medium':
      return Object.values(mediumPuzzles);
    case 'hard':
      return Object.values(hardPuzzles);
  }
};

export const getRandomPuzzle = (difficulty: Difficulty): SudokuPuzzle => {
  const puzzles = getPuzzlesByDifficulty(difficulty);
  const randomIndex = Math.floor(Math.random() * puzzles.length);
  return puzzles[randomIndex];
}; 