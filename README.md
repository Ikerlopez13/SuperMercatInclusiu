# 🛒 SuperMercat Inclusiu

Sistema de navegación asistida por voz para supermercados, diseñado para ayudar a personas con discapacidad visual.

## 🌟 Características

- **Reconocimiento de voz mejorado**: Dicta los productos que quieres comprar con detección precisa
- **Navegación por voz**: Instrucciones habladas para guiarte por el supermercado
- **Sistema de proximidad**: Sonidos tipo sensor de parking que se aceleran al acercarte al producto
- **Visualización pixel art**: Representación 2D del supermercado como un videojuego
- **Pathfinding optimizado**: Los productos se ordenan por pasillos para rutas eficientes (no salta de pasillo en pasillo)
- **Sistema de caja**: Al terminar de recoger productos, te dirige a la caja para pagar
- **Cálculo de precio**: Cada producto tiene precio y calcula el total de la compra
- **Distribución aleatoria**: Los productos cambian de posición cada vez que recargas
- **Responsive**: Funciona en dispositivos móviles y de escritorio

## 🚀 Inicio Rápido

### Instalación

```bash
npm install
```

### Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build

```bash
npm run build
npm start
```

## 🎮 Cómo Usar

### 1. Crear Lista de Compra

1. Haz clic en "🎤 Dictar Productos"
2. Di en voz alta los productos que quieres comprar (ejemplo: "leche pascual", "pan bimbo", "yogur")
3. El sistema los añadirá automáticamente a tu lista con el número de pasillo

### 2. Comenzar Compra

1. Cuando tengas tu lista completa, haz clic en "🚀 Comenzar Compra"
2. El sistema te dirá el primer producto a buscar

### 3. Navegar por el Supermercado

- Usa las **flechas del teclado** o **W/A/S/D** para moverte
- En móvil: próximamente soporte táctil
- El sistema emitirá sonidos más rápidos conforme te acerques al producto
- Haz clic en "🗣️ Repetir Direcciones" para escuchar las instrucciones nuevamente

### 4. Recoger Productos

- Acércate al producto marcado con 🎯
- Cuando estés muy cerca, el sistema confirmará que lo has recogido
- Automáticamente pasará al siguiente producto de la lista
- **Los productos están ordenados por pasillo** para una ruta eficiente

### 5. Ir a la Caja 💰

- Una vez recogidos todos los productos, el sistema te dirá el total
- Te guiará hasta la caja (marcada con 💰)
- Al llegar, se completará la compra y te dirá cuánto has pagado

## 🎨 Leyenda Visual

- 🚶 **Azul**: Tu posición
- 📦 **Rojo**: Productos disponibles
- ✓ **Gris**: Productos recogidos
- 🎯 **Amarillo**: Objetivo actual
- 💰 **Verde oscuro**: Caja (checkout)
- **Verde claro**: Ruta sugerida
- **Gris oscuro**: Paredes
- **Números**: Pasillos

## 🛠️ Tecnologías

- **Next.js 15**: Framework React
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos
- **Web Speech API**: Reconocimiento y síntesis de voz
- **Web Audio API**: Sistema de proximidad con sonidos
- **A* Algorithm**: Pathfinding inteligente

## 📱 Compatibilidad

- **Chrome/Edge**: ✅ Totalmente soportado
- **Safari**: ⚠️ Reconocimiento de voz limitado
- **Firefox**: ⚠️ Sin soporte para reconocimiento de voz

## 🔧 Configuración

Los productos están definidos en `data/products.ts`. Puedes añadir más productos modificando este archivo:

```typescript
{ 
  id: '13', 
  name: 'nuevo producto', 
  position: { x: 3, y: 14 }, 
  aisle: 5 
}
```

## 📝 Próximas Mejoras

- [ ] Soporte táctil para dispositivos móviles (arrastrar para mover)
- [ ] Más productos y pasillos
- [ ] Modo multijugador
- [ ] Historial de compras
- [ ] Listas de compra guardadas
- [ ] Integración con APIs de supermercados reales

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request.

## 📄 Licencia

MIT

