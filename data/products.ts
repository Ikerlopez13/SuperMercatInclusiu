import { Product, Position } from '@/types';

// Lista de productos disponibles (sin posiciones fijas)
export const PRODUCT_NAMES = [
  { id: '1', name: 'leche pascual', price: 1.20 },
  { id: '2', name: 'pan bimbo', price: 1.50 },
  { id: '3', name: 'agua mineral', price: 0.80 },
  { id: '4', name: 'yogur danone', price: 2.30 },
  { id: '5', name: 'zumo naranja', price: 1.80 },
  { id: '6', name: 'aceite oliva', price: 5.50 },
  { id: '7', name: 'galletas', price: 2.00 },
  { id: '8', name: 'cereales', price: 3.20 },
  { id: '9', name: 'café', price: 4.50 },
  { id: '10', name: 'arroz', price: 1.10 },
  { id: '11', name: 'pasta', price: 0.90 },
  { id: '12', name: 'tomate', price: 1.40 },
  { id: '13', name: 'azúcar', price: 1.00 },
  { id: '14', name: 'sal', price: 0.60 },
  { id: '15', name: 'mantequilla', price: 2.80 },
  { id: '16', name: 'queso', price: 3.50 },
];

// Posiciones disponibles JUNTO a los pasillos (no encima)
// Los pasillos están en x=3, 7, 11, 15
// Los productos están a los LADOS (x-1 y x+1)
const AISLE_POSITIONS = [
  // Pasillo 1 (x=3) - Productos a los lados (x=2 y x=4)
  { x: 2, y: 2, aisle: 1 },
  { x: 4, y: 2, aisle: 1 },
  { x: 2, y: 4, aisle: 1 },
  { x: 4, y: 4, aisle: 1 },
  { x: 2, y: 6, aisle: 1 },
  { x: 4, y: 6, aisle: 1 },
  { x: 2, y: 8, aisle: 1 },
  { x: 4, y: 8, aisle: 1 },
  { x: 2, y: 10, aisle: 1 },
  
  // Pasillo 2 (x=7) - Productos a los lados (x=6 y x=8)
  { x: 6, y: 2, aisle: 2 },
  { x: 8, y: 2, aisle: 2 },
  { x: 6, y: 4, aisle: 2 },
  { x: 8, y: 4, aisle: 2 },
  { x: 6, y: 6, aisle: 2 },
  { x: 8, y: 6, aisle: 2 },
  { x: 6, y: 8, aisle: 2 },
  
  // Pasillo 3 (x=11) - Productos a los lados (x=10 y x=12)
  { x: 10, y: 2, aisle: 3 },
  { x: 12, y: 2, aisle: 3 },
  { x: 10, y: 4, aisle: 3 },
  { x: 12, y: 4, aisle: 3 },
  { x: 10, y: 6, aisle: 3 },
  { x: 12, y: 6, aisle: 3 },
  
  // Pasillo 4 (x=15) - Productos a los lados (x=14)
  { x: 14, y: 2, aisle: 4 },
  { x: 14, y: 4, aisle: 4 },
  { x: 14, y: 6, aisle: 4 },
  { x: 14, y: 8, aisle: 4 },
  { x: 14, y: 10, aisle: 4 },
];

// Función para generar distribución aleatoria de productos
export function generateRandomProductDistribution(): Product[] {
  // Copiar y mezclar posiciones
  const shuffledPositions = [...AISLE_POSITIONS].sort(() => Math.random() - 0.5);
  
  // Asignar productos a posiciones aleatorias
  return PRODUCT_NAMES.map((product, index) => ({
    ...product,
    position: shuffledPositions[index],
    aisle: shuffledPositions[index].aisle,
  }));
}

export function findProductByName(products: Product[], name: string): Product | undefined {
  const normalizedSearch = name.toLowerCase().trim();
  
  // Primero buscar coincidencia exacta
  let match = products.find(p => p.name.toLowerCase() === normalizedSearch);
  if (match) return match;
  
  // Luego buscar si el nombre completo del producto está en lo que se dijo
  match = products.find(p => normalizedSearch.includes(p.name.toLowerCase()));
  if (match) return match;
  
  // Finalmente buscar si cada palabra del producto está en lo que se dijo
  match = products.find(p => {
    const productWords = p.name.toLowerCase().split(' ');
    return productWords.every(word => normalizedSearch.includes(word));
  });
  
  return match;
}

