export interface Position {
  x: number;
  y: number;
}

export interface Product {
  id: string;
  name: string;
  position: Position;
  aisle: number;
  price: number; // Precio en euros
}

export interface Cell {
  type: 'empty' | 'wall' | 'aisle' | 'product' | 'player' | 'checkout';
  product?: Product;
  aisleNumber?: number;
}

export interface ShoppingListItem {
  product: Product;
  collected: boolean;
}

export interface NavigationInstruction {
  direction: 'forward' | 'left' | 'right' | 'arrived';
  text: string;
}

