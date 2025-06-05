import React, { useState, useRef, useEffect } from 'react';
import { PuzzleState, getValidMoves } from '../../data/sliding-puzzle-data';

interface SlidingPuzzleGridProps {
  puzzleState: PuzzleState;
  size: number;
  onTileClick: (tileIndex: number) => void;
}

interface DragState {
  isDragging: boolean;
  dragIndex: number;
  startPos: { x: number; y: number };
  currentPos: { x: number; y: number };
  dragOffset: { x: number; y: number };
}

const SlidingPuzzleGrid: React.FC<SlidingPuzzleGridProps> = ({ 
  puzzleState, 
  size, 
  onTileClick 
}) => {
  const { tiles, emptyIndex } = puzzleState;
  const validMoves = getValidMoves(emptyIndex, size);
  const gridRef = useRef<HTMLDivElement>(null);
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    dragIndex: -1,
    startPos: { x: 0, y: 0 },
    currentPos: { x: 0, y: 0 },
    dragOffset: { x: 0, y: 0 }
  });

  // Calculate grid size classes based on size
  const getGridSizeClass = () => {
    switch (size) {
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      default: return 'grid-cols-4';
    }
  };

  // Calculate tile size based on grid size - made even bigger
  const getTileSizeClass = () => {
    switch (size) {
      case 3: return 'w-28 h-28 text-4xl';
      case 4: return 'w-24 h-24 text-3xl';
      case 5: return 'w-20 h-20 text-2xl';
      default: return 'w-24 h-24 text-3xl';
    }
  };

  const getTileSize = () => {
    switch (size) {
      case 3: return 112; // w-28 = 7rem = 112px
      case 4: return 96;  // w-24 = 6rem = 96px  
      case 5: return 80;  // w-20 = 5rem = 80px
      default: return 96;
    }
  };

  const getRowCol = (index: number) => {
    return {
      row: Math.floor(index / size),
      col: index % size
    };
  };

  const getIndexFromRowCol = (row: number, col: number) => {
    return row * size + col;
  };

  const handleMouseDown = (e: React.MouseEvent, index: number) => {
    if (tiles[index] === 0 || !validMoves.includes(index)) return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const startPos = {
      x: e.clientX,
      y: e.clientY
    };

    setDragState({
      isDragging: true,
      dragIndex: index,
      startPos,
      currentPos: startPos,
      dragOffset: { x: 0, y: 0 }
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const currentPos = {
      x: e.clientX,
      y: e.clientY
    };

    const dragOffset = {
      x: currentPos.x - dragState.startPos.x,
      y: currentPos.y - dragState.startPos.y
    };

    setDragState(prev => ({
      ...prev,
      currentPos,
      dragOffset
    }));
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!dragState.isDragging) return;

    const tileSize = getTileSize();
    const gap = 4; // gap-1 = 4px
    const threshold = tileSize / 2;
    
    const { dragOffset } = dragState;
    const draggedTilePos = getRowCol(dragState.dragIndex);
    const emptyTilePos = getRowCol(emptyIndex);
    
    let shouldMove = false;

    // Check if drag is significant and towards the empty space
    if (Math.abs(dragOffset.x) > threshold || Math.abs(dragOffset.y) > threshold) {
      // Determine primary drag direction
      if (Math.abs(dragOffset.x) > Math.abs(dragOffset.y)) {
        // Horizontal drag
        if (dragOffset.x > threshold && emptyTilePos.col === draggedTilePos.col + 1 && emptyTilePos.row === draggedTilePos.row) {
          shouldMove = true; // Drag right towards empty
        } else if (dragOffset.x < -threshold && emptyTilePos.col === draggedTilePos.col - 1 && emptyTilePos.row === draggedTilePos.row) {
          shouldMove = true; // Drag left towards empty
        }
      } else {
        // Vertical drag
        if (dragOffset.y > threshold && emptyTilePos.row === draggedTilePos.row + 1 && emptyTilePos.col === draggedTilePos.col) {
          shouldMove = true; // Drag down towards empty
        } else if (dragOffset.y < -threshold && emptyTilePos.row === draggedTilePos.row - 1 && emptyTilePos.col === draggedTilePos.col) {
          shouldMove = true; // Drag up towards empty
        }
      }
    }

    if (shouldMove) {
      onTileClick(dragState.dragIndex);
    }

    setDragState({
      isDragging: false,
      dragIndex: -1,
      startPos: { x: 0, y: 0 },
      currentPos: { x: 0, y: 0 },
      dragOffset: { x: 0, y: 0 }
    });
  };

  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging]);

  const handleTileClick = (index: number) => {
    if (tiles[index] === 0 || dragState.isDragging) return;
    onTileClick(index);
  };

  const getTileTransform = (index: number) => {
    if (!dragState.isDragging || dragState.dragIndex !== index) {
      return 'translate(0px, 0px)';
    }

    const tileSize = getTileSize();
    const gap = 4;
    const { dragOffset } = dragState;
    const draggedTilePos = getRowCol(index);
    const emptyTilePos = getRowCol(emptyIndex);
    
    let constrainedX = 0;
    let constrainedY = 0;

    // Constrain movement only towards the empty space
    const isEmptyRight = emptyTilePos.row === draggedTilePos.row && emptyTilePos.col === draggedTilePos.col + 1;
    const isEmptyLeft = emptyTilePos.row === draggedTilePos.row && emptyTilePos.col === draggedTilePos.col - 1;
    const isEmptyDown = emptyTilePos.col === draggedTilePos.col && emptyTilePos.row === draggedTilePos.row + 1;
    const isEmptyUp = emptyTilePos.col === draggedTilePos.col && emptyTilePos.row === draggedTilePos.row - 1;

    if (isEmptyRight && dragOffset.x > 0) {
      constrainedX = Math.min(dragOffset.x, tileSize + gap);
    } else if (isEmptyLeft && dragOffset.x < 0) {
      constrainedX = Math.max(dragOffset.x, -(tileSize + gap));
    }

    if (isEmptyDown && dragOffset.y > 0) {
      constrainedY = Math.min(dragOffset.y, tileSize + gap);
    } else if (isEmptyUp && dragOffset.y < 0) {
      constrainedY = Math.max(dragOffset.y, -(tileSize + gap));
    }

    return `translate(${constrainedX}px, ${constrainedY}px)`;
  };

  return (
    <div 
      ref={gridRef}
      className={`grid ${getGridSizeClass()} gap-1 bg-border p-4 w-max mx-auto rounded-lg shadow-lg relative`}
      style={{
        background: 'linear-gradient(145deg, hsl(var(--muted)), hsl(var(--background)))'
      }}
    >
      {tiles.map((tileValue, index) => {
        const isEmpty = tileValue === 0;
        const isDragging = dragState.isDragging && dragState.dragIndex === index;

        if (isEmpty) {
          return (
            <div
              key={`empty-${index}`}
              className={`${getTileSizeClass()} bg-muted/30 rounded-md border-2 border-dashed border-muted-foreground/20`}
            />
          );
        }

        return (
          <div
            key={`tile-${index}-${tileValue}`}
            onMouseDown={(e) => handleMouseDown(e, index)}
            onClick={() => handleTileClick(index)}
            className={`
              ${getTileSizeClass()} 
              flex items-center justify-center font-bold rounded-md border-2 
              select-none relative cursor-grab
              ${isDragging 
                ? 'z-10 shadow-2xl scale-105 cursor-grabbing' 
                : 'bg-card hover:bg-card/80 text-foreground border-border hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200'
              }
            `}
            style={{
              transform: getTileTransform(index),
              transition: isDragging ? 'none' : 'transform 0.3s ease, box-shadow 0.2s ease, background-color 0.2s ease, border-color 0.2s ease'
            }}
          >
            {tileValue}
          </div>
        );
      })}
    </div>
  );
};

export default SlidingPuzzleGrid; 