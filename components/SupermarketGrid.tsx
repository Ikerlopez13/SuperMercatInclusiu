"use client";

import { Cell, Position } from '@/types';
import { useEffect, useState } from 'react';

interface SupermarketGridProps {
  grid: Cell[][];
  playerPosition: Position;
  targetPosition: Position | null;
  path: Position[] | null;
  collectedProducts: Set<string>;
  onCellClick?: (x: number, y: number) => void;
}

export function SupermarketGrid({ 
  grid, 
  playerPosition, 
  targetPosition,
  path,
  collectedProducts,
  onCellClick
}: SupermarketGridProps) {

  const isOnPath = (x: number, y: number): boolean => {
    if (!path) return false;
    return path.some(p => p.x === x && p.y === y);
  };

  const getCellColor = (cell: Cell, x: number, y: number): string => {
    // Player position
    if (playerPosition.x === x && playerPosition.y === y) {
      return 'bg-blue-500';
    }

    // Target position
    if (targetPosition && targetPosition.x === x && targetPosition.y === y) {
      return 'bg-yellow-400 animate-pulse';
    }

    // Path highlighting
    if (isOnPath(x, y)) {
      return 'bg-green-300 bg-opacity-30';
    }

    // Cell types
    switch (cell.type) {
      case 'wall':
        return 'bg-gray-700';
      case 'product':
        const isCollected = cell.product && collectedProducts.has(cell.product.id);
        return isCollected ? 'bg-gray-400' : 'bg-red-500';
      case 'aisle':
        return 'bg-amber-700 border-2 border-amber-900'; // Estanterías marrones
      case 'checkout':
        return 'bg-green-600';
      default:
        return 'bg-white';
    }
  };

  const getCellContent = (cell: Cell, x: number, y: number): string => {
    if (playerPosition.x === x && playerPosition.y === y) {
      return '🚶';
    }

    if (targetPosition && targetPosition.x === x && targetPosition.y === y) {
      return '🎯';
    }

    switch (cell.type) {
      case 'product':
        const isCollected = cell.product && collectedProducts.has(cell.product.id);
        return isCollected ? '✓' : '📦';
      case 'aisle':
        return cell.aisleNumber?.toString() || '';
      case 'checkout':
        return '💰';
      default:
        return '';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-2 sm:p-4 bg-gray-900 rounded-lg select-none w-full">
      <div className="inline-grid gap-[1px] sm:gap-[2px] bg-gray-800 p-1 sm:p-2 rounded overflow-x-auto max-w-full">
        {grid.map((row, y) => (
          <div key={y} className="flex gap-[1px] sm:gap-[2px]">
            {row.map((cell, x) => {
              // Check if cell is adjacent to player
              const dx = Math.abs(x - playerPosition.x);
              const dy = Math.abs(y - playerPosition.y);
              const isAdjacent = dx + dy === 1;
              const isClickable = isAdjacent && cell.type !== 'wall' && cell.type !== 'aisle';
              
              return (
                <div
                  key={`${x}-${y}`}
                  onClick={() => onCellClick && onCellClick(x, y)}
                  className={`
                    w-5 h-5 xs:w-6 xs:h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12
                    flex items-center justify-center
                    text-[8px] xs:text-[10px] sm:text-xs md:text-sm font-bold
                    transition-all duration-200
                    ${getCellColor(cell, x, y)}
                    ${cell.type === 'wall' ? 'border border-gray-900' : ''}
                    ${isClickable ? 'lg:hover:ring-2 lg:hover:ring-blue-400 cursor-pointer active:scale-95' : ''}
                  `}
                  title={cell.product?.name || cell.type}
                >
                  <span className="select-none leading-none pointer-events-none">
                    {getCellContent(cell, x, y)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gray-800 rounded-lg text-white text-xs sm:text-sm w-full max-w-2xl">
        <h3 className="font-bold mb-2 text-sm sm:text-base">Leyenda:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm">Tú</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded flex items-center justify-center text-xs flex-shrink-0">📦</div>
            <span className="text-xs sm:text-sm">Producto</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded flex items-center justify-center text-xs flex-shrink-0">🎯</div>
            <span className="text-xs sm:text-sm">Objetivo</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-300 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm">Ruta</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gray-700 rounded flex-shrink-0"></div>
            <span className="text-xs sm:text-sm">Pared</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-700 border border-amber-900 rounded flex items-center justify-center text-[8px] sm:text-xs text-white flex-shrink-0">1</div>
            <span className="text-xs sm:text-sm">Estantería</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-600 rounded flex items-center justify-center text-xs flex-shrink-0">💰</div>
            <span className="text-xs sm:text-sm">Caja</span>
          </div>
        </div>
      </div>
    </div>
  );
}

