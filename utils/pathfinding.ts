import { Position, Cell } from '@/types';

interface PathNode {
  position: Position;
  parent: PathNode | null;
  g: number; // cost from start
  h: number; // heuristic cost to goal
  f: number; // g + h
}

function heuristic(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function getNeighbors(pos: Position, grid: Cell[][]): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }, // left
  ];

  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;

    if (
      newY >= 0 && newY < grid.length &&
      newX >= 0 && newX < grid[0].length &&
      grid[newY][newX].type !== 'wall' &&
      grid[newY][newX].type !== 'aisle' // Los pasillos NO se pueden atravesar
    ) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
}

export function findPath(
  start: Position,
  goal: Position,
  grid: Cell[][]
): Position[] | null {
  const openSet: PathNode[] = [];
  const closedSet: Set<string> = new Set();

  const startNode: PathNode = {
    position: start,
    parent: null,
    g: 0,
    h: heuristic(start, goal),
    f: heuristic(start, goal),
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Get node with lowest f score
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    const posKey = `${current.position.x},${current.position.y}`;
    
    // Check if we reached the goal
    if (current.position.x === goal.x && current.position.y === goal.y) {
      // Reconstruct path
      const path: Position[] = [];
      let node: PathNode | null = current;
      while (node) {
        path.unshift(node.position);
        node = node.parent;
      }
      return path;
    }

    closedSet.add(posKey);

    // Check neighbors
    const neighbors = getNeighbors(current.position, grid);
    for (const neighborPos of neighbors) {
      const neighborKey = `${neighborPos.x},${neighborPos.y}`;
      
      if (closedSet.has(neighborKey)) continue;

      const g = current.g + 1;
      const h = heuristic(neighborPos, goal);
      const f = g + h;

      // Check if neighbor is already in open set
      const existingNode = openSet.find(
        n => n.position.x === neighborPos.x && n.position.y === neighborPos.y
      );

      if (existingNode) {
        if (g < existingNode.g) {
          existingNode.g = g;
          existingNode.f = f;
          existingNode.parent = current;
        }
      } else {
        openSet.push({
          position: neighborPos,
          parent: current,
          g,
          h,
          f,
        });
      }
    }
  }

  return null; // No path found
}

export function getNextDirection(
  currentPos: Position,
  path: Position[]
): 'up' | 'down' | 'left' | 'right' | null {
  if (path.length < 2) return null;

  const currentIndex = path.findIndex(
    p => p.x === currentPos.x && p.y === currentPos.y
  );

  if (currentIndex === -1 || currentIndex >= path.length - 1) return null;

  const nextPos = path[currentIndex + 1];
  const dx = nextPos.x - currentPos.x;
  const dy = nextPos.y - currentPos.y;

  if (dy < 0) return 'up';
  if (dy > 0) return 'down';
  if (dx < 0) return 'left';
  if (dx > 0) return 'right';

  return null;
}

export function getDirectionText(
  currentDirection: 'up' | 'down' | 'left' | 'right' | null,
  nextDirection: 'up' | 'down' | 'left' | 'right' | null
): string {
  if (!currentDirection || !nextDirection) return 'Sigue recto';

  if (currentDirection === nextDirection) return 'Sigue recto';

  const turns: Record<string, string> = {
    'up-right': 'Gira a la derecha',
    'up-left': 'Gira a la izquierda',
    'down-right': 'Gira a la izquierda',
    'down-left': 'Gira a la derecha',
    'left-up': 'Gira a la derecha',
    'left-down': 'Gira a la izquierda',
    'right-up': 'Gira a la izquierda',
    'right-down': 'Gira a la derecha',
  };

  const key = `${currentDirection}-${nextDirection}`;
  return turns[key] || 'Sigue recto';
}

