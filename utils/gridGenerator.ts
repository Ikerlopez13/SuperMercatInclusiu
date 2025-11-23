import { Cell, Product } from '@/types';

const GRID_WIDTH = 18;
const GRID_HEIGHT = 14;

export function generateSupermarketGrid(products: Product[]): Cell[][] {
  // Initialize empty grid
  const grid: Cell[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < GRID_WIDTH; x++) {
      row.push({ type: 'empty' });
    }
    grid.push(row);
  }

  // Add walls around the perimeter
  for (let x = 0; x < GRID_WIDTH; x++) {
    grid[0][x] = { type: 'wall' };
    grid[GRID_HEIGHT - 1][x] = { type: 'wall' };
  }
  for (let y = 0; y < GRID_HEIGHT; y++) {
    grid[y][0] = { type: 'wall' };
    grid[y][GRID_WIDTH - 1] = { type: 'wall' };
  }

  // Create aisles (vertical shelves) - NO TRANSITABLES
  const aislePositions = [3, 7, 11, 15];
  
  for (let aisleIndex = 0; aisleIndex < aislePositions.length; aisleIndex++) {
    const x = aislePositions[aisleIndex];
    const aisleNumber = aisleIndex + 1;
    
    // Los pasillos son estanterías sólidas de arriba a abajo
    for (let y = 2; y <= 10; y++) {
      grid[y][x] = { type: 'aisle', aisleNumber };
    }
  }

  // Place products (recibidos como parámetro)
  for (const product of products) {
    const { x, y } = product.position;
    if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
      grid[y][x] = { 
        type: 'product', 
        product,
        aisleNumber: product.aisle
      };
    }
  }

  // Add checkout/caja at the exit (bottom right area)
  grid[12][16] = { type: 'checkout' };

  return grid;
}

// Posición de la caja
export const CHECKOUT_POSITION = { x: 16, y: 12 };

