# 🌟 Características Técnicas Detalladas

## 🎯 Funcionalidades Implementadas

### 1. Sistema de Reconocimiento de Voz (Web Speech API)
- **Idioma**: Español (es-ES)
- **Modo continuo**: Permite dictar múltiples productos seguidos
- **Resultados intermedios**: Muestra lo que está escuchando en tiempo real
- **Detección automática**: Reconoce productos por nombre parcial o completo

**Ejemplo de uso**:
```
Usuario dice: "leche pascual pan bimbo yogur"
Sistema detecta: 
  - Leche Pascual → Pasillo 1
  - Pan Bimbo → Pasillo 2
  - Yogur Danone → Pasillo 1
```

### 2. Sistema de Síntesis de Voz (Speech Synthesis API)
- **Idioma**: Español (es-ES)
- **Velocidad ajustable**: 0.9x (más natural para navegación)
- **Confirmaciones automáticas**: 
  - Cuando se añade un producto
  - Cuando se inicia la compra
  - Al llegar a cada producto
  - Al completar la lista

**Instrucciones proporcionadas**:
- "Sigue recto"
- "Gira a la derecha"
- "Gira a la izquierda"
- "Has llegado al destino"

### 3. Sistema de Proximidad con Audio (Web Audio API)
- **Basado en distancia euclidiana**: `√((x₂-x₁)² + (y₂-y₁)²)`
- **Intervalos de beep adaptativos**:
  - Distancia ≤ 1: Beep continuo (1000ms)
  - Distancia 2-3: Beep rápido (200ms)
  - Distancia 4-5: Beep medio (400ms)
  - Distancia 6-8: Beep lento (600ms)
  - Distancia 9-15: Beep muy lento (1000ms)
  - Distancia > 15: Sin sonido

**Características del beep**:
- Frecuencia: 800 Hz (tono agradable)
- Tipo de onda: Sinusoidal
- Duración: 50ms
- Volumen: 30% (no invasivo)

### 4. Algoritmo de Pathfinding (A*)
- **Implementación**: A* (A-Star) Algorithm
- **Heurística**: Distancia Manhattan (|x₁-x₂| + |y₁-y₂|)
- **Optimización**: Encuentra la ruta más corta evitando paredes
- **Actualización dinámica**: Recalcula la ruta en cada movimiento

**Proceso**:
1. Evalúa posición actual
2. Calcula vecinos accesibles
3. Usa heurística para priorizar direcciones
4. Reconstruye camino óptimo

### 5. Matriz 2D del Supermercado

**Dimensiones**: 18x14 células

**Tipos de células**:
- `empty`: Espacio vacío (blanco)
- `wall`: Pared/límite (gris oscuro)
- `aisle`: Pasillo/estantería (gris claro + número)
- `product`: Producto disponible (rojo + 📦)
- `player`: Posición del jugador (azul + 🚶)

**Distribución**:
- 4 pasillos verticales (posiciones X: 3, 7, 11, 15)
- 12 productos distribuidos en los 4 pasillos
- Paredes perimetrales
- Entrada en posición (1, 1)

### 6. Sistema de Control

**Teclado**:
- Flechas: ↑ ↓ ← →
- WASD: W (arriba), S (abajo), A (izquierda), D (derecha)

**Táctil/Mouse**:
- Arrastra en cualquier dirección
- Umbral de 30px para activar movimiento
- Detecta dirección primaria (horizontal vs vertical)
- Soporte para touch y mouse

**Prevención de colisiones**:
- Detección de límites del grid
- Bloqueo de paredes
- Validación antes de cada movimiento

### 7. Gestión de Lista de Compras

**Estados de productos**:
- `pending`: Por recoger (fondo normal)
- `current`: Objetivo actual (fondo amarillo)
- `collected`: Recogido (fondo verde + tachado)

**Funcionalidades**:
- Añadir productos por voz
- Eliminar productos (modo setup)
- Orden secuencial de recogida
- Progreso visual en tiempo real

### 8. Interfaz Responsive

**Breakpoints**:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Adaptaciones**:
- Grid de productos: escalado automático (8px → 10px → 12px)
- Layout: 1 columna en móvil, 3 columnas en desktop
- Controles táctiles solo visibles en móvil
- Panel de control colapsable

## 🎨 Código de Colores (Tailwind)

```css
/* Jugador */
bg-blue-500: #3b82f6

/* Productos */
bg-red-500: #ef4444 (disponible)
bg-gray-400: #9ca3af (recogido)

/* Objetivo */
bg-yellow-400: #facc15

/* Ruta */
bg-green-300 bg-opacity-30: rgba(134, 239, 172, 0.3)

/* Paredes */
bg-gray-700: #374151

/* Pasillos */
bg-gray-300: #d1d5db

/* Fondo */
bg-white: #ffffff
```

## 📊 Estructura de Datos

### Product
```typescript
interface Product {
  id: string;          // Identificador único
  name: string;        // Nombre del producto
  position: Position;  // Coordenadas X,Y
  aisle: number;       // Número de pasillo
}
```

### Position
```typescript
interface Position {
  x: number;  // Columna (0-17)
  y: number;  // Fila (0-13)
}
```

### ShoppingListItem
```typescript
interface ShoppingListItem {
  product: Product;
  collected: boolean;
}
```

## 🔊 Comandos de Voz Reconocidos

**Productos disponibles**:
1. Leche Pascual
2. Pan Bimbo
3. Agua Mineral
4. Yogur Danone
5. Zumo Naranja
6. Aceite Oliva
7. Galletas
8. Cereales
9. Café
10. Arroz
11. Pasta
12. Tomate

**Variaciones aceptadas**:
- "leche" → detecta "leche pascual"
- "yogur" → detecta "yogur danone"
- "pan" → detecta "pan bimbo"

## 🎮 Flujo de Juego

```
┌─────────────────┐
│   MODO SETUP    │
│  - Dictar voz   │
│  - Ver lista    │
│  - Editar lista │
└────────┬────────┘
         │
         ▼ Click "Comenzar Compra"
┌─────────────────┐
│ MODO SHOPPING   │
│  - Navegar      │
│  - Recoger      │
│  - Completar    │
└────────┬────────┘
         │
         ▼ Todos recogidos
┌─────────────────┐
│   COMPLETADO    │
│  ¡Felicidades!  │
└─────────────────┘
```

## 🧪 Testing Manual

### Test 1: Reconocimiento de Voz
1. Hacer clic en "Dictar Productos"
2. Decir "leche"
3. ✅ Debe aparecer "Leche Pascual - Pasillo 1"

### Test 2: Navegación
1. Añadir producto
2. Comenzar compra
3. Usar flechas para moverse
4. ✅ Debe escucharse guía por voz

### Test 3: Proximidad
1. Acercarse a producto objetivo
2. ✅ Beeps deben acelerarse

### Test 4: Completar Lista
1. Llegar a todos los productos
2. ✅ Mensaje de felicitaciones

### Test 5: Touch (Móvil)
1. Arrastar sobre el grid
2. ✅ Jugador se mueve

## 🚀 Optimizaciones Realizadas

1. **Memoización**: useCallback para funciones pesadas
2. **Refs para audio**: Evita re-renders innecesarios
3. **Pathfinding eficiente**: A* con heurística optimizada
4. **Estado mínimo**: Solo lo necesario en el estado
5. **Eventos optimizados**: Throttling implícito en drag

## 🔮 Mejoras Futuras Posibles

1. **Machine Learning**: Reconocer productos por foto
2. **AR (Realidad Aumentada)**: Usar cámara para navegación real
3. **Multijugador**: Varios usuarios en mismo supermercado
4. **Gamificación**: Puntos, logros, rankings
5. **API Real**: Integración con supermercados reales
6. **Modo sin voz**: Solo táctil + visual para personas sordas
7. **Personalización**: Ajustar velocidad de voz, tono, volumen
8. **Historial**: Guardar listas frecuentes
9. **Notificaciones**: Alertas de ofertas en productos cercanos
10. **Accesibilidad++**: Soporte para screen readers, alto contraste

## 📱 Compatibilidad de APIs

| Navegador | Speech Recognition | Speech Synthesis | Web Audio |
|-----------|-------------------|------------------|-----------|
| Chrome    | ✅ Sí             | ✅ Sí            | ✅ Sí     |
| Edge      | ✅ Sí             | ✅ Sí            | ✅ Sí     |
| Safari    | ⚠️ Parcial        | ✅ Sí            | ✅ Sí     |
| Firefox   | ❌ No             | ✅ Sí            | ✅ Sí     |

**Recomendación**: Usar Chrome o Edge para experiencia completa.

