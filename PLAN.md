# Matrix Hacker Clicker — Plan de Mejoras

## Estado actual

- [x] Juego base (clicker, DPS, 10 mejoras, Matrix rain, auto-save)

---

## Prioridad 1 — Core

- [x] **Critical Hack** — 4% prob. de x3 click
- [x] **SQL Injection** — -2% costo por nivel
- [x] **Trojan Horse** — 1 auto-click cada 8s

---

## Prioridad 2 — Scaling

- [x] **Kernel Exploit** — click total x1.15 por nivel
- [x] **Zion Protocol** — DPS total x1.15 por nivel
- [x] **Rootkit** — 15% DPS mientras offline

---

## Prioridad 3 — Sinergias

- [x] **Synergy** — Si Scanner ≥ 5 → CPU gana +1 DPS/nivel
- [x] **The Architect** — +5% DPS por cada mejora con nivel ≥ 10

---

## Prioridad 4 — Cantidad

- [x] Packet Sniffer (100K, +75 DPS)
- [x] Brute Force (250K, +150 click)
- [x] DDoS Node (750K, +500 DPS)
- [x] Ghost Protocol (2M, +400 click)
- [x] Code Red (10M, +5K click)
- [x] Neural Interface (25M, +10K DPS)

---

## Extras

- [x] **Idioma español** — Sistema i18n con toggle EN/ES en el footer

---

### 8. UI Improvements ✅

- [x] **Data bar with milestones** — Next milestone text + vertical markers on progress bar
- [x] **More informative header** — Two-row header with prestige multiplier and play time
- [x] **Group upgrades by type** — Click / DPS / Special / Multipliers sections with headers
- [x] **Toast notifications** — Slide-in toasts for achievements, level-up, prestige, firewall, offline
- [x] **Tooltips on upgrades** — Hover tooltip showing level, current/next effect, cost
- [x] **Visual mini-refactor** — Body shake animation, toast system, responsive polish, upgraded scrollbar

---

### 9. Mega Update ✅

- [x] **Endgame upgrades** — 4 new upgrades (Morris Worm 500M, Sentinel 5B, Oracle 50B, Prime 1T)
- [x] **Number formatting** — All numbers formatted as K/M/B/T/ Qa/Qi
- [x] **Buy 10x / Buy Max** — Mode selector (1x/10x/Max) in panel header
- [x] **Auto-buy toggle** — Auto-purchases cheapest affordable upgrade
- [x] **Prestige shop** — Spend prestige points on permanent bonuses (click, DPS, start data, combo, crit)
- [x] **Random events** — Data leak, crypto crash, overclock, windfall, DDoS attack (every 45-90s)
- [x] **Boss battles** — Timed DPS challenge, rewards 50% of threshold
- [x] **Export/Import** — Base64 save codes via clipboard

---

## Ideas futuras desarrolladas

---

### 1. Prestige / Reset  ✅

Reiniciar progreso (data, mejoras, niveles) a cambio de un multiplicador permanente global.

**Mecánica:**
- Botón "PURGE & BOOT" en el footer o panel especial
- Requisito: mínimo nivel 10 o 1M datos totales generados
- Al hacer prestige:
  - Data → 0, todas las mejoras → nivel 0
  - Se guarda `state.prestigeMultiplier *= 1.5` (acumulable)
  - `state.prestigeCount++`
- El multiplicador afecta a TODA generación de datos: `dataGained *= state.prestigeMultiplier`
- Se aplica en `doClick` (antes de sumar) y en `gameLoop` (antes de sumar DPS)
- El multiplicador no se pierde al resetear con Ctrl+Shift+R
- Mostrar en UI: "PRESTIGE xN" o "BOOT STACK xN"

**Costo sugerido:**
- 1er prestige: 500K data total earned (no current, sino accumulated lifetime)
- Incrementa 500K cada vez
- Podría requerir también N niveles de mejoras específicas

**Cambios necesarios:**
- `state.prestigeMultiplier` — arranca en 1
- `state.prestigeCount` — contador
- `state.totalDataEarned` — data acumulada lifetime (para calcular requisitos)
- `doClick()` y `gameLoop()` multiplican por prestigeMultiplier
- Botón y lógica de prestige
- Nuevo stat display: "PRESTIGE xN"

---

### 2. Achievements  ✅

Logros desbloqueables que otorgan bonificaciones pasivas.

**Lista de logros:**

| # | Logro | Requisito | Bonus |
|---|---|---|---|
| 1 | **First Click** | Hacer 1 click | +10% click power |
| 2 | **Clicker** | 1K clicks totales | +20% click power |
| 3 | **Addicted** | 10K clicks totales | +50% click power |
| 4 | **Data Miner** | 1M data total earned | +10% DPS |
| 5 | **Data Lord** | 1B data total earned | +50% DPS |
| 6 | **Hacker** | 5 mejoras distintas a nivel ≥ 5 | +15% DPS |
| 7 | **Elite Hacker** | 10 mejoras distintas a nivel ≥ 10 | +30% DPS |
| 8 | **Scavenger** | Comprar 100 upgrades totales | -5% costo |
| 9 | **Lucky** | 100 críticos | +5% crit chance |
| 10 | **Auto Pilot** | Trojan Horse nivel ≥ 5 | +1 auto-click/8s extra |
| 11 | **Completionist** | Todas las mejoras ≥ nivel 1 | +100% DPS |
| 12 | **Prestige Master** | 5 prestige | prestige escalado +0.5 |

**Mecánica:**
- Array `ACHIEVEMENTS` con `{ id, name, desc, check(), bonus }`
- `state.achievements: { 'first_click': false, ... }`
- En cada `renderAll()` o tras eventos clave (click, compra, crit, prestige), evaluar logros
- Al desbloquear: mostrar notificación "ACHIEVEMENT UNLOCKED: xxx"
- Los bonuses se aplican en `calculateStats()` como multiplicadores extras
- Panel de logros: grid pequeño arriba de las mejoras con iconos locked/unlocked

**UI:**
- Botón "ACHIEVEMENTS" o panel colapsable
- Cada logro muestra: icono, nombre, desc, [LOCKED] / [UNLOCKED]

---

### 3. Click Combos  ✅

Racha de clicks seguidos que multiplica temporalmente la ganancia.

**Mecánica:**
- `state.combo` — contador de clicks consecutivos (sin pausa > 1s)
- `state.comboMultiplier` — 1 + (combo * 0.1), máximo x5 (50 clicks)
- Cada click dentro de 1s del anterior: combo++, multiplicador se aplica
- Si pasa >1s sin click: combo resetea a 0
- Visual: indicador de combo debajo del botón de hack con barra de tiempo
- El multiplicador se aplica en `doClick()` si combo > 0

**Display:**
- "COMBO x2.3" con animación que escala con el combo
- Barra de tiempo circular o lineal que muestra cuánto queda antes de perder el combo

**Cambios necesarios:**
- `state.combo` — contador
- `state.comboMultiplier` — calculado
- `state.lastClickTime` — timestamp del último click
- En `doClick()`: checkear elapsed desde lastClickTime, incrementar o resetear combo
- `setInterval` para decrementar o vigilar timeout del combo
- UI nuevo: combo display con animación

---

### 4. Mejoras Visuales  ✅

Opciones cosméticas que cambian la apariencia del juego.

**Opciones:**

| # | Mejora | Costo | Efecto visual |
|---|---|---|---|
| 1 | **Hacker Vision** | 50K | Matrix rain cambia a verde neón más brillante |
| 2 | **Night Mode** | 100K | Rain azul oscuro / cian |
| 3 | **Firewall Alert** | 250K | Rain rojo / naranja con gotas más rápidas |
| 4 | **Neon City** | 500K | Rain morado / rosa |
| 5 | **Golden Eye** | 1M | Rain dorado, scanlines más gruesas |
| 6 | **Glitch Core** | 5M | Rain con glitch aleatorio (frames distorsionados) |

**Mecánica:**
- Array `VISUAL_SKINS` con `{ id, name, cost, rainColor, rainSpeed, scanlineStyle }`
- Se compran como mejoras (pero no aparecen en UPGRADE_DEFS, son independientes)
- Al comprar: se aplica el skin inmediatamente
- Se puede cambiar entre skins comprados
- El último skin comprado se activa automáticamente
- Persiste en estado: `state.activeSkin` y `state.ownedSkins`

**Cambios necesarios:**
- Nuevo array `VISUAL_SKINS` con configuraciones
- Modificar `drawRain()` para usar colores/velocidad del skin activo
- Panel de skins: grid con preview del color
- Skin por defecto: gratis, siempre disponible

---

### 5. Sonidos  ✅

Efectos de sonido sintetizados con Web Audio API (sin archivos).

| Acción | Sonido |
|---|---|
| Click normal | Beep cuadrado 440Hz 50ms |
| Click crítico | Sawtooth ascendente 440→880Hz 150ms |
| Comprar mejora | Ruido blanco 50ms |
| Level up | Escala 3 notas (sine) |
| Auto-click | Beep suave 220Hz 30ms |
| Offline earnings | 3 notas triángulo ascendentes |

**Mecánica:**
- `function playSound(type)` usando `AudioContext` y `OscillatorNode`
- Toggle de sonido en el footer (🔇/🔊)
- `state.soundEnabled` — boolean, persiste en localStorage
- No requiere archivos externos

**Cambios necesarios:**
- Función `playSound(type)` con Web Audio API
- Botón toggle en footer al lado del lang toggle
- Llamar `playSound()` en los lugares correspondientes

---

### 6. Estadísticas Detalladas  ✅

Panel con métricas del jugador.

| Métrica | Fuente |
|---|---|
| Tiempo jugado | `state.playTime` (acumula cada 100ms) |
| Clicks totales | `state.totalClicks` |
| Datos totales ganados | `state.totalDataEarned` |
| Poder de click | `state.clickPower` |
| Datos por segundo | `state.dps` |
| % crítico | `state.critChance` |
| Críticos totales | `state.totalCrits` |
| Mejoras compradas | suma de niveles en upgrades |
| Prestige | contador + multiplicador |
| Combo actual | `state.combo` + multiplicador |

**Mecánica:**
- `state.playTime` — se incrementa cada segundo en game loop
- `state.totalDataEarned` — se acumula en doClick y gameLoop
- `state.totalCrits` — se incrementa en críticos
- `state.totalUpgradesBought` — opcional, o se calcula sumando niveles
- Botón "STATS" o sección colapsable debajo de mejoras

**Display:**
- Panel con tabla de 2 columnas: métrica | valor
- Formato de números con separadores de miles
- Actualización en tiempo real vía `renderAll()`

---

### 7. Minijuego: "Desactivar Firewall"  ✅

Minijuego opcional que aparece cada 60-120s para ganar bonus.

**Mecánica:**
- Overlay con nodos numerados en posiciones aleatorias
- Hacer click en orden ascendente (1→2→3...)
- 3-8 nodos según nivel del jugador
- Timer: 5-2 segundos según nivel
- Bonus: `dps * 10 * (1 + nivel * 0.1)`
- Se puede ignorar

**Cambios necesarios:**
- Estado: `state.firewallActive`, `state.firewallNodes[]`, `state.firewallTimer`
- Función `startFirewallGame()` — generar nodos, mostrar overlay
- Función `endFirewallGame(success)` — dar bonus o no
- Overlay HTML + CSS para el minijuego
- Timer con `setInterval` o `requestAnimationFrame`
- Llamar `scheduleNextFirewall()` después de cada juego o cada N tiempo

---

## Próximas mejoras (por prioridad)

### P1 — Core UX

- [ ] **Resumen offline** — Overlay al volver mostrando datos ganados, eventos ocurridos, bosses vencidos
- [ ] **Tutorial / Onboarding** — Primera vez: tooltips iniciales que desaparecen al completarlos
- [ ] **Panel de ajustes** — Unificar sonido, idioma, reset, export/import en un overlay

### P2 — Contenido

- [ ] **Más eventos** — 3-4 nuevos (botnet_recruit, backdoor, ransomware, etc.)
- [ ] **Más bosses** — Boss con escudo, boss con regeneración, boss que contraataca
- [ ] **Logros con recompensas cosméticas** — Algunos achievements desbloquean skins

### P3 — Profundidad

- [ ] **Árbol de mejoras** — Prerrequisitos entre upgrades
- [ ] **Perks de prestige** — Elegir bonus temporal al resetear
- [ ] **Boss final** — Jefe que aparece tras X bosses vencidos

### P4 — Polish

- [ ] **Atajos de teclado visibles** — Mostrar [SPACE], [1/2/3], [B] en los botones
- [ ] **Partículas al hacer clic** — Chispas/glitches visuales
- [ ] **Gráfico de data/min** — Mini barra ASCII en estadísticas
