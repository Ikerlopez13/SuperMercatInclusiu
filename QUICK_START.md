# ⚡ Inicio Rápido - SuperMercat Inclusiu

## 🚀 En 3 Pasos

### 1. Instalar dependencias
```bash
npm install
```

### 2. Ejecutar en modo desarrollo
```bash
npm run dev
```

### 3. Abrir en el navegador
Visita: **http://localhost:3000**

---

## 🎮 Cómo Jugar (Tutorial de 2 minutos)

### Paso 1: Crear Lista de Compra 🎤

1. Haz clic en **"🎤 Dictar Productos"**
2. **Permite el acceso al micrófono** (importante!)
3. Di en voz alta: *"leche pascual"*
4. Di: *"pan bimbo"*
5. Di: *"yogur"*

✅ Verás que se añaden a la lista con sus pasillos

### Paso 2: Comenzar Compra 🚀

1. Haz clic en **"🚀 Comenzar Compra"**
2. Escucharás: *"Primer producto: leche pascual, pasillo 1"*

### Paso 3: Navegar 🎮

**En PC:**
- Usa las **flechas del teclado** ⬆️⬇️⬅️➡️
- O usa **W/A/S/D**

**En Móvil:**
- **Arrastra** sobre el mapa en la dirección que quieres ir

### Paso 4: Seguir las Indicaciones 🔊

- Escucha el **sonido de proximidad** (beep)
- Cuanto **más rápido** el beep, más cerca estás
- Cuando llegas al producto: ✅ **¡Recogido!**
- Automáticamente pasa al siguiente

### Paso 5: Completar 🎉

- Recoge todos los productos
- Al terminar: *"¡Felicidades! Has completado tu lista"*

---

## 🎯 Tips Útiles

### 🎤 Reconocimiento de Voz
- **Habla claro** y a velocidad normal
- No es necesario decir el nombre completo: *"leche"* funciona igual que *"leche pascual"*
- Puedes dictar varios productos seguidos: *"leche pan yogur café"*

### 🗺️ Navegación
- La **ruta verde** muestra el camino sugerido
- El **objetivo amarillo 🎯** es tu destino actual
- Usa **"🗣️ Repetir Direcciones"** si te pierdes

### 🔊 Sonidos
- **Pip lento** = Lejos (más de 8 casillas)
- **Pip medio** = Medio lejos (4-8 casillas)
- **Pip rápido** = Cerca (2-3 casillas)
- **Pip continuo** = ¡Llegaste! (1 casilla)

### 📱 Controles
| Acción | PC | Móvil |
|--------|-----|-------|
| Arriba | ↑ o W | Arrastra ⬆️ |
| Abajo | ↓ o S | Arrastra ⬇️ |
| Izquierda | ← o A | Arrastra ⬅️ |
| Derecha | → o D | Arrastra ➡️ |

---

## 🎨 Leyenda Visual

| Símbolo | Significado |
|---------|-------------|
| 🚶 (Azul) | **Tú** - Tu posición actual |
| 📦 (Rojo) | **Producto** - Producto disponible |
| ✓ (Gris) | **Recogido** - Producto ya recogido |
| 🎯 (Amarillo) | **Objetivo** - Producto que buscas ahora |
| Zona verde clara | **Ruta** - Camino sugerido |
| Gris oscuro | **Pared** - No puedes pasar |
| Números (1-4) | **Pasillo** - Número de pasillo |

---

## 📋 Productos Disponibles

| Producto | Pasillo |
|----------|---------|
| Leche Pascual | 1 |
| Yogur Danone | 1 |
| Galletas | 1 |
| Pan Bimbo | 2 |
| Zumo Naranja | 2 |
| Cereales | 2 |
| Agua Mineral | 3 |
| Aceite Oliva | 3 |
| Café | 3 |
| Arroz | 4 |
| Pasta | 4 |
| Tomate | 4 |

---

## ⚠️ Requisitos Técnicos

### Navegador Recomendado
✅ **Chrome** o **Edge** (Experiencia completa)

### Funcionalidades por Navegador

| Función | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Reconocimiento Voz | ✅ | ✅ | ⚠️ | ❌ |
| Síntesis Voz | ✅ | ✅ | ✅ | ✅ |
| Sonidos | ✅ | ✅ | ✅ | ✅ |
| Táctil | ✅ | ✅ | ✅ | ✅ |

⚠️ Safari: Reconocimiento de voz limitado  
❌ Firefox: Sin reconocimiento de voz

### Permisos Necesarios
- 🎤 **Micrófono** (para dictar productos)
- 🔊 **Audio** (para escuchar indicaciones)

---

## 🆘 Solución de Problemas

### ❌ No funciona el reconocimiento de voz
**Solución:**
1. Verifica que estás en **Chrome** o **Edge**
2. Permite el acceso al **micrófono** (popup del navegador)
3. Si usas **HTTPS**, prueba en **localhost**
4. Recarga la página (F5 o Cmd+R)

### ❌ No escucho las indicaciones
**Solución:**
1. Verifica el **volumen** del dispositivo
2. Desactiva el **silencio** del navegador
3. Revisa la configuración de **audio** del sistema
4. Prueba hacer clic en **"🗣️ Repetir Direcciones"**

### ❌ No puedo moverme
**Solución:**
1. Asegúrate de haber hecho clic en **"Comenzar Compra"**
2. Verifica que no estás intentando atravesar una **pared** (gris oscuro)
3. En móvil: **arrastra** sobre el mapa, no toques

### ❌ El jugador no se mueve al arrastrar (móvil)
**Solución:**
1. Arrastra con **más fuerza** (umbral de 30px)
2. Arrastra **sobre el mapa**, no sobre los controles
3. Asegúrate de estar en **modo Shopping**

---

## 🎓 Video Tutorial (Próximamente)

Por ahora, sigue estos pasos:
1. ✅ Dictar productos por voz
2. ✅ Comenzar compra
3. ✅ Moverse con flechas/arrastrar
4. ✅ Recoger productos
5. ✅ Completar lista

**Tiempo estimado:** 2-3 minutos por lista

---

## 📞 Soporte

Si tienes problemas:
1. Lee **FEATURES.md** - Detalles técnicos
2. Lee **DEVELOPER_GUIDE.md** - Guía de desarrollo
3. Revisa **README.md** - Documentación completa
4. Abre un **issue** en GitHub (si aplica)

---

## 🎉 ¡Listo!

Ya estás preparado para usar **SuperMercat Inclusiu**. 

### Próximos Pasos:
- 🎮 Juega y experimenta
- 🛠️ Personaliza (ver DEVELOPER_GUIDE.md)
- 🚀 Despliega en Vercel/Netlify
- 🌟 Comparte con otros

**¡Disfruta tu experiencia de compra inclusiva!** 🛒✨

