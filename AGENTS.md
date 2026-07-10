# AGENTS.md — Matrix Hacker Clicker

## Stack

Vanilla HTML/CSS/JS. No build step, no npm, no external libs.

## Commands

```bash
open index.html          # run the game (no dev server needed)
```

## Key conventions

- **JS**: IIFE with `'use strict'`. Single `UPGRADE_DEFS` array determines all upgrades.
- **Upgrade object format**: `{ id, name, desc, cost, effect, value, icon }`. Effect types: `click`, `dps`, `crit`, `discount`, `autoclick`. Cost formula is `baseCost * 1.15^level` with `state.discount`% off (see `getUpgradeCost`).
- **State**: single `state` object saved to `localStorage` key `matrixHackerClicker` every 15s. Fields: `data`, `clickPower`, `dps`, `critChance`, `discount`, `upgrades`, `totalClicks`, `level`.
- **CSS**: Matrix palette (`#00ff00`, `#003300`, `#000`), `font-family: 'Courier New', monospace`, scanlines overlay on `#scanlines`.
- **Game loop**: `setInterval(100ms)` for DPS, `requestAnimationFrame` for Matrix rain canvas.
- **Shortcuts**: `Space`/`Enter` = hack, `Ctrl+Shift+R` = reset (with confirm).

## i18n

- `STRINGS` object has `es` and `en` keys with nested translation strings.
- `t(key, replacements)` looks up `state.lang` path in STRINGS. Keys use dot notation: `'upgrade.cpu.name'`, `'statClick'`.
- HTML static text uses `data-i18n` attributes; `applyLanguage()` updates them all.
- `state.lang` is persisted in localStorage and preserved on reset.
- Language toggle button `#langToggle` calls `toggleLang()` which switches `state.lang`, calls `applyLanguage()`, and re-saves.
- Upgrade names/descs are not in UPGRADE_DEFS — they're looked up via `t('upgrade.' + id + '.name')` and `t('upgrade.' + id + '.desc')`.

## Upgrade system

- Adding a new upgrade: append entry to `UPGRADE_DEFS` and add `upgrade.{id}.name` and `upgrade.{id}.desc` to STRINGS in both languages.
- New effect types need logic in `calculateStats()`. For `crit` also modify `doClick()`. For `discount` modify `getUpgradeCost()`. For `autoclick` modify `setupAutoClick()`. For `mult_click`/`mult_dps` apply multiplicatively in `calculateStats()`. For `offline` implement in `loadGame()`.
- Passive synergies (Synergy, The Architect) are computed in `calculateStats()` and displayed via `#synergyDisplay` — no UPGRADE_DEFS entry needed.
- Upgrade display card classes: `upgradeCard`, `.locked` (afford), `.bought`.

## Notes

- `doClick(e, isAuto)` is the core click handler; `handleClick` calls `doClick(e, false)`; auto-clicks from Trojan Horse call `doClick(null, true)` to skip flicker/floating overlap.
- Crit: `state.critChance`% chance of 3x click power on manual clicks only (not auto-clicks).
- Offline earnings: saved via `state.lastSaveTime` timestamp. On load, if `rootkit` level > 0, earns `dps * elapsed * level * 0.15` bonus data.
- Multipliers (`mult_click`, `mult_dps`) apply after all additive bonuses in `calculateStats()`, compounding multiplicatively per level.
- **Prestige**: `state.prestigeMultiplier` (default 1) multiplies final clickPower and DPS in `calculateStats()`. `state.totalDataEarned` tracks lifetime data. `state.prestigeCount` increments on each purge. `doPrestige()` resets upgrades/data, multiplies multiplier by 1.5, and preserves prestige state on Ctrl+Shift+R reset.
- **Achievements**: `ACHIEVEMENT_DEFS` array defines 12 achievements with bonus types (`clickPercent`, `dpsPercent`, `critPercent`, `discountFlat`, `autoclickExtra`). `checkAchievements()` runs every 100ms in gameLoop. Bonuses applied in `calculateStats()`. UI via `#achOverlay` modal toggled by `#achBtn`. Bonuses persist across prestige/reset.
- **Click Combo**: `state.combo` increments on manual clicks within 1s. Multiplier = 1 + combo * 0.1 (max ×5 at 50 combo). Resets after 1s idle via `comboTimeout`. Displayed via `#comboDisplay`.
- **Visual Skins**: `VISUAL_SKINS` array defines 7 skins with color configs. `getSkin()` returns active skin. `drawRain()` reads skin colors. `applySkin()` updates scanline CSS. `state.activeSkin` and `state.ownedSkins`[] persist in save. Skins preserved on reset. UI via `#skinOverlay` modal.
- **Sound**: `playSound(type)` uses Web Audio API (`OscillatorNode`, `BufferSource`). Types: `click`, `crit`, `buy`, `levelup`, `autoclick`, `offline`. `state.soundEnabled` toggle with `#soundBtn`. No external audio files.
- **Statistics**: `state.playTime` accumulates in gameLoop (0.1s/tick). `toggleStats()` opens `#statsOverlay` modal with 10 metrics rendered by `renderStats()`.
- **Firewall Minigame**: Scheduled every 60-120s via `scheduleFirewall()` → `startFirewall()`. Nodes = 3 + floor(level/5). Timer = max(2, 5 - floor(level/10))s. Bonus = `dps * 10 * (1 + level * 0.1)`. Click nodes in order (1→2→3…). Fail on wrong order or timeout. State: `firewallActive`, `firewallStep`, `firewallNodes[]`. Uses `#fwOverlay`.

## PLAN.md

`PLAN.md` tracks pending improvements with `[x]` checkboxes grouped by priority.
