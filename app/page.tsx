"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, Product, ShoppingListItem } from '@/types';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { generateSupermarketGrid } from '@/utils/gridGenerator';
import { findProductByName, generateRandomProductDistribution, PRODUCT_NAMES } from '@/data/products';
import { findPath, getNextDirection, getDirectionText } from '@/utils/pathfinding';
import { ProximitySoundSystem } from '@/utils/proximitySound';
import { SupermarketGrid } from '@/components/SupermarketGrid';
import { CHECKOUT_POSITION } from '@/utils/gridGenerator';
import { InstagramFollowPopup } from '@/components/InstagramFollowPopup';

export default function Home() {
  // Generar distribución aleatoria de productos al iniciar
  const [products] = useState<Product[]>(() => generateRandomProductDistribution());
  const [grid] = useState(() => generateSupermarketGrid(products));
  const [playerPosition, setPlayerPosition] = useState<Position>({ x: 1, y: 1 });
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [currentTargetIndex, setCurrentTargetIndex] = useState(0);
  const [path, setPath] = useState<Position[] | null>(null);
  const [collectedProducts, setCollectedProducts] = useState<Set<string>>(new Set());
  const [currentDirection, setCurrentDirection] = useState<'up' | 'down' | 'left' | 'right' | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [gameMode, setGameMode] = useState<'setup' | 'shopping' | 'checkout'>('setup');
  const [totalPrice, setTotalPrice] = useState(0);
  const [showInstagramPopup, setShowInstagramPopup] = useState(false);

  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    resetTranscript,
    isSupported: speechRecognitionSupported 
  } = useSpeechRecognition();

  const { speak, isSpeaking, isSupported: speechSynthesisSupported } = useSpeechSynthesis();
  
  const proximitySystemRef = useRef<ProximitySoundSystem | null>(null);

  useEffect(() => {
    proximitySystemRef.current = new ProximitySoundSystem();
    
    return () => {
      if (proximitySystemRef.current) {
        proximitySystemRef.current.destroy();
      }
    };
  }, []);

  // Instagram popup cada 10 segundos 💕
  useEffect(() => {
    // Mostrar el popup inmediatamente al cargar
    const showPopup = () => setShowInstagramPopup(true);
    
    // Primer popup después de 3 segundos
    const initialTimeout = setTimeout(showPopup, 3000);
    
    // Luego cada 10 segundos
    const interval = setInterval(showPopup, 10000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  // Process voice transcript to add products
  useEffect(() => {
    if (!transcript || gameMode !== 'setup') return;

    // Usar la función mejorada de búsqueda
    const foundProduct = findProductByName(products, transcript);
    
    if (foundProduct) {
      const alreadyInList = shoppingList.some(item => item.product.id === foundProduct.id);
      
      if (!alreadyInList) {
        setShoppingList(prev => [...prev, { product: foundProduct, collected: false }]);
        speak(`${foundProduct.name} añadido a la lista, pasillo ${foundProduct.aisle}, ${foundProduct.price.toFixed(2)} euros`);
        resetTranscript();
      }
    }
  }, [transcript, gameMode, shoppingList, speak, resetTranscript, products]);

  // Calculate path to current target
  useEffect(() => {
    if (gameMode === 'shopping' && shoppingList.length > 0) {
      const currentTarget = shoppingList[currentTargetIndex];
      if (currentTarget && !currentTarget.collected) {
        const newPath = findPath(playerPosition, currentTarget.product.position, grid);
        setPath(newPath);
      }
    } else if (gameMode === 'checkout') {
      // Ir a la caja
      const newPath = findPath(playerPosition, CHECKOUT_POSITION, grid);
      setPath(newPath);
    }
  }, [playerPosition, currentTargetIndex, shoppingList, grid, gameMode]);

  // Check proximity and provide navigation
  useEffect(() => {
    if (!isNavigating) return;

    if (gameMode === 'shopping' && shoppingList.length > 0) {
      const currentTarget = shoppingList[currentTargetIndex];
      if (!currentTarget || currentTarget.collected) return;

      const distance = Math.sqrt(
        Math.pow(playerPosition.x - currentTarget.product.position.x, 2) +
        Math.pow(playerPosition.y - currentTarget.product.position.y, 2)
      );

      // Update proximity sound
      if (proximitySystemRef.current) {
        proximitySystemRef.current.update(distance);
      }

      // Check if reached target
      if (distance < 1.5) {
        // Collected!
        const newCollected = new Set(collectedProducts);
        newCollected.add(currentTarget.product.id);
        setCollectedProducts(newCollected);
        
        const newList = [...shoppingList];
        newList[currentTargetIndex].collected = true;
        setShoppingList(newList);

        if (proximitySystemRef.current) {
          proximitySystemRef.current.stop();
        }

        speak(`¡Has recogido ${currentTarget.product.name}!`, () => {
          // Move to next target
          const nextIndex = currentTargetIndex + 1;
          if (nextIndex < shoppingList.length) {
            setCurrentTargetIndex(nextIndex);
            const nextProduct = shoppingList[nextIndex].product;
            speak(`Siguiente producto: ${nextProduct.name}, pasillo ${nextProduct.aisle}`);
          } else {
            // Todos los productos recogidos, ir a la caja
            const total = shoppingList.reduce((sum, item) => sum + item.product.price, 0);
            setTotalPrice(total);
            setGameMode('checkout');
            speak(`¡Has completado tu lista! Ahora dirígete a la caja para pagar. Total: ${total.toFixed(2)} euros.`);
          }
        });
      }
    } else if (gameMode === 'checkout') {
      // Comprobar si llegó a la caja
      const distance = Math.sqrt(
        Math.pow(playerPosition.x - CHECKOUT_POSITION.x, 2) +
        Math.pow(playerPosition.y - CHECKOUT_POSITION.y, 2)
      );

      if (proximitySystemRef.current) {
        proximitySystemRef.current.update(distance);
      }

      if (distance < 1.5) {
        if (proximitySystemRef.current) {
          proximitySystemRef.current.stop();
        }
        setIsNavigating(false);
        speak(`¡Compra completada! Has pagado ${totalPrice.toFixed(2)} euros. ¡Gracias por tu visita!`);
      }
    }
  }, [playerPosition, shoppingList, currentTargetIndex, collectedProducts, speak, isNavigating, gameMode, totalPrice]);

  const startShopping = () => {
    if (shoppingList.length === 0) {
      speak('Por favor, añade productos a tu lista primero.');
      return;
    }

    // Ordenar lista por pasillos para no saltar de un lado a otro
    const sortedList = [...shoppingList].sort((a, b) => a.product.aisle - b.product.aisle);
    setShoppingList(sortedList);
    setCurrentTargetIndex(0);

    setGameMode('shopping');
    setIsNavigating(true);
    stopListening();

    const firstProduct = sortedList[0].product;
    speak(`Comenzando compra. Primer producto: ${firstProduct.name}, pasillo ${firstProduct.aisle}. Usa las flechas o arrastra para moverte.`);
  };

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (gameMode !== 'shopping' && gameMode !== 'checkout') return;

    setPlayerPosition(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;

      // Check boundaries, walls, and aisles
      if (
        newY >= 0 && newY < grid.length &&
        newX >= 0 && newX < grid[0].length &&
        grid[newY][newX].type !== 'wall' &&
        grid[newY][newX].type !== 'aisle' // No pisar pasillos
      ) {
        // Update direction
        if (dx > 0) setCurrentDirection('right');
        else if (dx < 0) setCurrentDirection('left');
        else if (dy > 0) setCurrentDirection('down');
        else if (dy < 0) setCurrentDirection('up');

        return { x: newX, y: newY };
      }

      return prev;
    });
  }, [grid, gameMode]);

  // Mobile touch controls - click on cell to move there
  const handleCellClick = useCallback((targetX: number, targetY: number) => {
    if (gameMode !== 'shopping' && gameMode !== 'checkout') return;
    
    // Check if it's an adjacent cell
    const dx = targetX - playerPosition.x;
    const dy = targetY - playerPosition.y;
    
    // Only allow movement to adjacent cells
    if (Math.abs(dx) + Math.abs(dy) === 1) {
      movePlayer(dx, dy);
    }
  }, [gameMode, playerPosition, movePlayer]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameMode !== 'shopping' && gameMode !== 'checkout') return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, gameMode]);

  const provideDirections = () => {
    if (!path || path.length < 2) {
      speak('No hay ruta disponible');
      return;
    }

    const nextDir = getNextDirection(playerPosition, path);
    if (!nextDir) {
      speak('Has llegado al destino');
      return;
    }

    const dirText = getDirectionText(currentDirection, nextDir);
    speak(dirText);
  };

  const removeProduct = (productId: string) => {
    setShoppingList(prev => prev.filter(item => item.product.id !== productId));
  };

  const currentTarget = shoppingList[currentTargetIndex];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-2 sm:p-4 pb-20 sm:pb-4">
      {/* Instagram Follow Popup */}
      <InstagramFollowPopup 
        show={showInstagramPopup} 
        onClose={() => setShowInstagramPopup(false)} 
      />
      
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-3 sm:mb-6">
          <h1 className="text-xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">🛒 SuperMercat Inclusiu</h1>
          <p className="text-xs sm:text-sm text-gray-400">Sistema de navegación asistida por voz</p>
        </header>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {/* Control Panel */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 order-2 lg:order-1">
            {/* Voice Recognition Status */}
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">🎤 Control de Voz</h2>
              
              {!speechRecognitionSupported && (
                <div className="bg-red-900 p-2 sm:p-3 rounded mb-2 sm:mb-3 text-xs sm:text-sm">
                  ⚠️ Reconocimiento de voz no soportado
                </div>
              )}

              {!speechSynthesisSupported && (
                <div className="bg-red-900 p-2 sm:p-3 rounded mb-2 sm:mb-3 text-xs sm:text-sm">
                  ⚠️ Síntesis de voz no soportada
                </div>
              )}

              {gameMode === 'setup' && (
                <>
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechRecognitionSupported}
                    className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-bold transition ${
                      isListening
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                  >
                    {isListening ? '🔴 Detener' : '🎤 Dictar Productos'}
                  </button>

                  {transcript && (
                    <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-700 rounded">
                      <p className="text-xs sm:text-sm text-gray-300">Escuchando:</p>
                      <p className="text-sm sm:text-base text-white">{transcript}</p>
                    </div>
                  )}

                  <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-blue-900 rounded text-xs sm:text-sm">
                    <p><strong>Productos disponibles:</strong></p>
                    <p className="text-gray-300 mt-1">
                      {PRODUCT_NAMES.slice(0, 4).map(p => p.name).join(', ')}...
                    </p>
                  </div>
                </>
              )}

              {(gameMode === 'shopping' || gameMode === 'checkout') && (
                <button
                  onClick={provideDirections}
                  disabled={isSpeaking}
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-bold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600"
                >
                  🗣️ Repetir Direcciones
                </button>
              )}
            </div>

            {/* Shopping List */}
            <div className="bg-gray-800 p-3 sm:p-4 rounded-lg">
              <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">📝 Lista de Compra</h2>
              
              {shoppingList.length === 0 ? (
                <p className="text-gray-400 text-xs sm:text-sm">
                  Usa el control de voz para añadir productos
                </p>
              ) : (
                <ul className="space-y-1.5 sm:space-y-2">
                  {shoppingList.map((item, index) => (
                    <li
                      key={item.product.id}
                      className={`p-2 sm:p-2.5 rounded flex items-center justify-between text-xs sm:text-sm ${
                        item.collected
                          ? 'bg-green-900 line-through'
                          : index === currentTargetIndex && gameMode === 'shopping'
                          ? 'bg-yellow-900'
                          : 'bg-gray-700'
                      }`}
                    >
                      <span className="flex-1 min-w-0">
                        {item.collected ? '✅' : '📦'} {item.product.name}
                        <span className="text-[10px] sm:text-xs text-gray-400 ml-1 sm:ml-2 block sm:inline">
                          Pasillo {item.product.aisle} - {item.product.price.toFixed(2)}€
                        </span>
                      </span>
                      {!item.collected && gameMode === 'setup' && (
                        <button
                          onClick={() => removeProduct(item.product.id)}
                          className="text-red-400 hover:text-red-300 ml-2 flex-shrink-0"
                        >
                          ❌
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {gameMode === 'setup' && shoppingList.length > 0 && (
                <button
                  onClick={startShopping}
                  className="w-full mt-3 sm:mt-4 py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg text-sm sm:text-base font-bold bg-green-600 hover:bg-green-700"
                >
                  🚀 Comenzar Compra
                </button>
              )}
            </div>

            {/* Current Navigation */}
            {gameMode === 'shopping' && currentTarget && !currentTarget.collected && (
              <div className="bg-yellow-900 p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2">🎯 Objetivo Actual:</h3>
                <p className="text-base sm:text-lg">{currentTarget.product.name}</p>
                <p className="text-xs sm:text-sm text-gray-300">Pasillo {currentTarget.product.aisle}</p>
                <p className="text-xs sm:text-sm text-gray-300">Precio: {currentTarget.product.price.toFixed(2)}€</p>
                {path && (
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                    Distancia: {path.length - 1} pasos
                  </p>
                )}
              </div>
            )}

            {/* Checkout Mode */}
            {gameMode === 'checkout' && (
              <div className="bg-green-900 p-3 sm:p-4 rounded-lg">
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2">💰 Ir a Caja</h3>
                <p className="text-base sm:text-lg">Dirígete a la caja para pagar</p>
                <p className="text-xs sm:text-sm text-gray-300 mt-1.5 sm:mt-2">Total: {totalPrice.toFixed(2)}€</p>
                {path && (
                  <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5 sm:mt-2">
                    Distancia: {path.length - 1} pasos
                  </p>
                )}
              </div>
            )}

            {/* Controls Info */}
            {(gameMode === 'shopping' || gameMode === 'checkout') && (
              <div className="bg-gray-800 p-3 sm:p-4 rounded-lg text-xs sm:text-sm">
                <h3 className="text-sm sm:text-base font-bold mb-1.5 sm:mb-2">🎮 Controles:</h3>
                <ul className="space-y-0.5 sm:space-y-1 text-gray-300">
                  <li className="hidden sm:block">⬆️ Arriba: ↑ o W</li>
                  <li className="hidden sm:block">⬇️ Abajo: ↓ o S</li>
                  <li className="hidden sm:block">⬅️ Izquierda: ← o A</li>
                  <li className="hidden sm:block">➡️ Derecha: → o D</li>
                  <li className="sm:hidden">⌨️ Usa flechas o WASD</li>
                  <li className="lg:hidden">🎮 Usa el control flotante</li>
                  <li className="lg:hidden">👆 Toca celdas adyacentes</li>
                </ul>
              </div>
            )}
          </div>

          {/* Game Grid */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <SupermarketGrid
              grid={grid}
              playerPosition={playerPosition}
              targetPosition={
                gameMode === 'shopping' && currentTarget && !currentTarget.collected
                  ? currentTarget.product.position
                  : gameMode === 'checkout'
                  ? CHECKOUT_POSITION
                  : null
              }
              path={path}
              collectedProducts={collectedProducts}
              onCellClick={handleCellClick}
            />
            
            {/* Mobile D-Pad Controls */}
            {(gameMode === 'shopping' || gameMode === 'checkout') && (
              <div className="lg:hidden fixed bottom-4 right-4 z-40">
                <div className="relative w-32 h-32 bg-gray-800 bg-opacity-90 rounded-full shadow-2xl">
                  {/* Up */}
                  <button
                    onClick={() => movePlayer(0, -1)}
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    ↑
                  </button>
                  
                  {/* Down */}
                  <button
                    onClick={() => movePlayer(0, 1)}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    ↓
                  </button>
                  
                  {/* Left */}
                  <button
                    onClick={() => movePlayer(-1, 0)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    ←
                  </button>
                  
                  {/* Right */}
                  <button
                    onClick={() => movePlayer(1, 0)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-full flex items-center justify-center text-xl font-bold shadow-lg"
                  >
                    →
                  </button>
                  
                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-700 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

