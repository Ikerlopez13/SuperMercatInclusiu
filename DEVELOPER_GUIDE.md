# 👨‍💻 Guía para Desarrolladores

## 📁 Estructura del Proyecto

```
SuperMercat Inclusiu/
├── app/
│   ├── layout.tsx          # Layout principal de Next.js
│   ├── page.tsx           # Página principal con lógica del juego
│   └── globals.css        # Estilos globales + Tailwind
├── components/
│   └── SupermarketGrid.tsx # Componente visual de la matriz
├── hooks/
│   ├── useSpeechRecognition.ts  # Hook de reconocimiento de voz
│   └── useSpeechSynthesis.ts    # Hook de síntesis de voz
├── utils/
│   ├── pathfinding.ts     # Algoritmo A* y direcciones
│   ├── proximitySound.ts  # Sistema de sonido tipo parking
│   └── gridGenerator.ts   # Generador de la matriz del supermercado
├── data/
│   └── products.ts        # Lista de productos disponibles
├── types/
│   └── index.ts          # Definiciones TypeScript
└── public/
    └── favicon.ico       # Icono de la app
```

## 🔧 Cómo Añadir Nuevos Productos

### 1. Editar el archivo `data/products.ts`

```typescript
export const PRODUCTS: Product[] = [
  // ... productos existentes ...
  
  // Añadir nuevo producto
  { 
    id: '13', 
    name: 'manzanas', 
    position: { x: 3, y: 14 }, 
    aisle: 1 
  },
  { 
    id: '14', 
    name: 'plátanos', 
    position: { x: 7, y: 14 }, 
    aisle: 2 
  },
];
```

**Consideraciones**:
- `id`: Debe ser único
- `name`: Nombre que el usuario dirá por voz (lowercase)
- `position`: Coordenadas válidas en el grid (0-17, 0-13)
- `aisle`: Número de pasillo (1-4 por defecto)

### 2. Ajustar el tamaño del grid (si es necesario)

En `utils/gridGenerator.ts`:

```typescript
const GRID_WIDTH = 18;  // Cambiar ancho
const GRID_HEIGHT = 14; // Cambiar alto
```

### 3. Añadir más pasillos

```typescript
const aislePositions = [3, 7, 11, 15, 19]; // Añadir posición X del nuevo pasillo
```

## 🎨 Personalizar la Apariencia

### Cambiar colores de las células

En `components/SupermarketGrid.tsx`, función `getCellColor`:

```typescript
case 'product':
  return 'bg-purple-500'; // Cambiar color de productos
case 'aisle':
  return 'bg-blue-200';   // Cambiar color de pasillos
```

### Cambiar emojis/iconos

En `components/SupermarketGrid.tsx`, función `getCellContent`:

```typescript
if (playerPosition.x === x && playerPosition.y === y) {
  return '🤖'; // Cambiar emoji del jugador
}

case 'product':
  return '🍎'; // Cambiar emoji de productos
```

### Cambiar tamaño de las células

```typescript
<div
  className={`
    w-16 h-16  // Cambiar tamaño (antes: w-8 h-8)
    // ...
  `}
>
```

## 🔊 Personalizar el Sistema de Voz

### Cambiar velocidad y tono

En `hooks/useSpeechSynthesis.ts`:

```typescript
utterance.rate = 1.2;  // Más rápido (0.1-10)
utterance.pitch = 1.5; // Más agudo (0-2)
utterance.volume = 0.8; // Más bajo (0-1)
```

### Cambiar idioma

```typescript
// En useSpeechRecognition.ts
recognitionInstance.lang = 'en-US'; // Inglés americano

// En useSpeechSynthesis.ts
utterance.lang = 'en-US';
```

### Añadir más frases

En `app/page.tsx`, puedes añadir más mensajes:

```typescript
speak(`¡Excelente! Llevas ${collectedProducts.size} productos recogidos`);
```

## 🎵 Modificar el Sistema de Proximidad

En `utils/proximitySound.ts`:

### Cambiar frecuencia del beep

```typescript
oscillator.frequency.value = 1200; // Hz (más agudo)
```

### Cambiar intervalos de distancia

```typescript
if (distance <= 2) {
  interval = 100; // Beep super rápido
} else if (distance <= 5) {
  interval = 300;
}
// ... más casos
```

### Usar diferentes tipos de onda

```typescript
oscillator.type = 'square';   // Sonido más "digital"
// Opciones: 'sine', 'square', 'sawtooth', 'triangle'
```

## 🧭 Modificar el Pathfinding

### Cambiar el algoritmo de heurística

En `utils/pathfinding.ts`:

```typescript
// Manhattan (actual)
function heuristic(a: Position, b: Position): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Euclidiana (distancia directa)
function heuristic(a: Position, b: Position): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)
  );
}

// Chebyshev (diagonal)
function heuristic(a: Position, b: Position): number {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
}
```

### Permitir movimiento diagonal

```typescript
const directions = [
  { x: 0, y: -1 },  // up
  { x: 1, y: 0 },   // right
  { x: 0, y: 1 },   // down
  { x: -1, y: 0 },  // left
  
  // Añadir diagonales
  { x: 1, y: -1 },  // up-right
  { x: 1, y: 1 },   // down-right
  { x: -1, y: 1 },  // down-left
  { x: -1, y: -1 }, // up-left
];
```

## 🎮 Añadir Nuevos Modos de Juego

### Ejemplo: Modo "Contrarreloj"

```typescript
// En app/page.tsx

const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
const [gameMode, setGameMode] = useState<'setup' | 'shopping' | 'timed'>('setup');

useEffect(() => {
  if (gameMode === 'timed' && timeLeft > 0) {
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  } else if (timeLeft === 0) {
    speak('¡Se acabó el tiempo!');
    setIsNavigating(false);
  }
}, [gameMode, timeLeft]);
```

### Ejemplo: Modo "Multijugador"

Necesitarías:
1. Backend con WebSockets (ej: Socket.io)
2. Sincronización de posiciones
3. Múltiples jugadores en el grid

```typescript
// Pseudocódigo
const [players, setPlayers] = useState<Map<string, Position>>(new Map());

socket.on('playerMoved', (playerId, position) => {
  setPlayers(prev => new Map(prev).set(playerId, position));
});
```

## 🔌 Integrar con API Externa

### Ejemplo: API de Supermercado Real

```typescript
// Crear utils/api.ts

export async function fetchProducts() {
  const response = await fetch('https://api.supermarket.com/products');
  const data = await response.json();
  
  return data.map((item: any) => ({
    id: item.id,
    name: item.name.toLowerCase(),
    position: calculatePosition(item.aisle),
    aisle: item.aisle
  }));
}

// Usar en app/page.tsx
useEffect(() => {
  fetchProducts().then(products => {
    // Actualizar productos
  });
}, []);
```

## 📊 Añadir Analytics

### Ejemplo: Google Analytics

```typescript
// Instalar: npm install @vercel/analytics

// En app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Trackear eventos personalizados

```typescript
// En app/page.tsx
import { track } from '@vercel/analytics';

const startShopping = () => {
  track('shopping_started', { 
    items: shoppingList.length 
  });
  // ... resto del código
};
```

## 🗄️ Persistir Datos (LocalStorage)

### Guardar lista de compras

```typescript
// En app/page.tsx

// Guardar
useEffect(() => {
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
}, [shoppingList]);

// Cargar
useEffect(() => {
  const saved = localStorage.getItem('shoppingList');
  if (saved) {
    setShoppingList(JSON.parse(saved));
  }
}, []);
```

### Guardar progreso

```typescript
const saveProgress = () => {
  const progress = {
    playerPosition,
    collectedProducts: Array.from(collectedProducts),
    currentTargetIndex
  };
  localStorage.setItem('gameProgress', JSON.stringify(progress));
};
```

## 🧪 Testing

### Instalar Jest y React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @types/jest jest-environment-jsdom
```

### Ejemplo de test: Pathfinding

```typescript
// __tests__/pathfinding.test.ts

import { findPath } from '@/utils/pathfinding';
import { generateSupermarketGrid } from '@/utils/gridGenerator';

describe('Pathfinding', () => {
  it('encuentra ruta entre dos puntos', () => {
    const grid = generateSupermarketGrid();
    const start = { x: 1, y: 1 };
    const goal = { x: 5, y: 5 };
    
    const path = findPath(start, goal, grid);
    
    expect(path).not.toBeNull();
    expect(path![0]).toEqual(start);
    expect(path![path!.length - 1]).toEqual(goal);
  });
});
```

## 🔐 Seguridad

### Variables de entorno

```typescript
// .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=your_secret_key

// En el código
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### Rate Limiting (para reconocimiento de voz)

```typescript
const MAX_REQUESTS = 10;
const TIME_WINDOW = 60000; // 1 minuto

let requestCount = 0;
let windowStart = Date.now();

const startListening = () => {
  const now = Date.now();
  
  if (now - windowStart > TIME_WINDOW) {
    requestCount = 0;
    windowStart = now;
  }
  
  if (requestCount >= MAX_REQUESTS) {
    speak('Demasiadas solicitudes. Espera un momento.');
    return;
  }
  
  requestCount++;
  // ... iniciar reconocimiento
};
```

## 📱 PWA (Progressive Web App)

### Instalar next-pwa

```bash
npm install next-pwa
```

### Configurar next.config.js

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // ... configuración existente
});
```

### Crear manifest.json

```json
{
  "name": "SuperMercat Inclusiu",
  "short_name": "SuperMercat",
  "description": "Sistema de navegación asistida",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a0a0a",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🚀 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
docker build -t supermercat .
docker run -p 3000:3000 supermercat
```

## 📚 Recursos Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [A* Pathfinding](https://www.redblobgames.com/pathfinding/a-star/introduction.html)

## 🆘 Solución de Problemas Comunes

### Reconocimiento de voz no funciona
- Verificar permisos de micrófono
- Usar HTTPS (requerido por la API)
- Probar en Chrome/Edge

### Pathfinding no encuentra ruta
- Verificar que no haya paredes bloqueando
- Comprobar límites del grid
- Debug con console.log(path)

### Sonidos no se reproducen
- Verificar volumen del sistema
- Interacción de usuario requerida (click)
- Probar en navegador diferente

## 💡 Ideas de Extensión

1. **ML Kit**: Detección de productos por imagen
2. **Geolocalización**: Usar GPS en supermercado real
3. **Blockchain**: NFTs de logros
4. **IoT**: Integrar con beacons Bluetooth
5. **Social**: Compartir listas con amigos
6. **Gamificación**: Sistema de niveles y recompensas
7. **AR**: Realidad aumentada con cámara
8. **Voice Assistant**: Integración con Alexa/Google Assistant

