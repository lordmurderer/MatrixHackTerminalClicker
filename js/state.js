'use strict';

let state = {
  data: 0,
  clickPower: 1,
  dps: 0,
  level: 1,
  upgrades: {},
  totalClicks: 0,
  critChance: 0,
  discount: 0,
  lastSaveTime: null,
  synergy: false,
  architect: false,
  architectCount: 0,
  lang: 'es',
  prestigeMultiplier: 1,
  prestigeCount: 0,
  totalDataEarned: 0,
  achievements: {},
  totalCrits: 0,
  combo: 0,
  activeSkin: 'default',
  ownedSkins: [],
  soundEnabled: true,
  playTime: 0,
  prestigePoints: 0,
  prestigeShop: {},
  buyMode: 1,
  autoBuyEnabled: false,
  prestigeProgress: 0,
  critMultiplier: 3,
  autoInterval: 8000,
  maxComboMult: 5,
  eventActive: null,
  eventTimer: null,
  bossActive: false,
  bossData: 0,
  bossThreshold: 0,
};

function formatNum(n) {
  if (n < 1000) return Math.floor(n) + '';
  var s = Math.floor(n);
  var units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi'];
  var u = 0;
  while (s >= 1000 && u < units.length - 1) { s /= 1000; u++; }
  return (s < 10 ? s.toFixed(2) : s < 100 ? s.toFixed(1) : s.toFixed(0)) + units[u];
}

function formatData(n) {
  if (n < 1000) return Math.floor(n) + ' MB';
  var units = [' GB', ' TB', ' PB', ' EB', ' ZB', ' YB'];
  var u = -1;
  while (n >= 1000 && u < units.length - 1) { n /= 1000; u++; }
  var val = n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : n.toFixed(0);
  return val + units[u];
}

const dom = {};
const floatingContainer = document.getElementById('floatingDamage');
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

let animId = null;
let dropChars = [];
let autoClickInterval = null;
let gameLoopInterval = null;
let comboTimeout = null;
let lastLevel = 1;
let firewallTimeout = null;
let firewallTimerInterval = null;
let audioCtx = null;

/* --- RENDER DIRTY FLAGS --- */
var RENDER = { hud: true, eventGlow: true, levelBar: true, header: true, synergy: true, prestige: true, combo: true, autoBuy: true, upgradeState: true };

/* --- EVENT BUS --- */
const EVENTS = {
  DATA_CHANGED: 'data_changed',
  COMBO_CHANGED: 'combo_changed',
  UPGRADES_CHANGED: 'upgrades_changed',
  PRESTIGE_CHANGED: 'prestige_changed',
  EVENT_CHANGED: 'event_changed',
  SKIN_CHANGED: 'skin_changed',
  LANGUAGE_CHANGED: 'language_changed',
  GAME_RESET: 'game_reset',
};

var bus = {
  _listeners: {},
  on: function (evt, fn) { (this._listeners[evt] = this._listeners[evt] || []).push(fn); },
  off: function (evt, fn) { var arr = this._listeners[evt]; if (arr) this._listeners[evt] = arr.filter(function (f) { return f !== fn; }); },
  emit: function (evt, data) { (this._listeners[evt] || []).forEach(function (fn) { fn(data); }); },
};

// UI subscriptions map events to RENDER flags
function setupBusUI() {
  bus.on(EVENTS.DATA_CHANGED, function () { RENDER.hud = true; RENDER.levelBar = true; RENDER.header = true; RENDER.upgradeState = true; renderAll(); });
  bus.on(EVENTS.COMBO_CHANGED, function () { RENDER.combo = true; renderAll(); });
  bus.on(EVENTS.UPGRADES_CHANGED, function () { state._upgradesDirty = true; RENDER.hud = true; renderAll(); });
  bus.on(EVENTS.PRESTIGE_CHANGED, function () { state._upgradesDirty = true; RENDER.hud = true; RENDER.prestige = true; renderAll(); });
  bus.on(EVENTS.EVENT_CHANGED, function () { RENDER.hud = true; RENDER.eventGlow = true; renderAll(); });
  bus.on(EVENTS.SKIN_CHANGED, function () { RENDER.hud = true; renderAll(); });
  bus.on(EVENTS.LANGUAGE_CHANGED, function () { state._upgradesDirty = true; RENDER.hud = true; RENDER.eventGlow = true; RENDER.prestige = true; RENDER.combo = true; renderAll(); });
  bus.on(EVENTS.GAME_RESET, function () { RENDER.hud = RENDER.eventGlow = RENDER.levelBar = RENDER.header = RENDER.synergy = RENDER.prestige = RENDER.combo = RENDER.autoBuy = true; state._upgradesDirty = true; renderAll(); });
}

// Floating text pool
var textPool = [];
var textPoolMax = 20;

/* --- MATRIX RAIN --- */
function initMatrixRain() {
  resizeCanvas();
  const cols = Math.floor(canvas.width / 14);
  dropChars = [];
  for (let i = 0; i < cols; i++) {
    dropChars.push({
      x: i * 14,
      y: Math.random() * canvas.height,
      speed: 0.5 + Math.random() * 2,
      chars: [],
    });
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getMatrixChars() {
  const chars = [];
  const base = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
  for (let i = 0; i < 20; i++) {
    chars.push(base[Math.floor(Math.random() * base.length)]);
  }
  return chars;
}

function getSkin() {
  return VISUAL_SKINS.find(function (s) { return s.id === state.activeSkin; }) || VISUAL_SKINS[0];
}

function drawRain() {
  var skin = getSkin();
  var c = skin.colors;
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = '14px monospace';

  // Draw all head characters in one pass
  ctx.shadowBlur = 10;
  ctx.shadowColor = c.shadow;
  for (let i = 0; i < dropChars.length; i++) {
    const drop = dropChars[i];
    if (drop.chars.length === 0) drop.chars = getMatrixChars();
    const headY = drop.y;
    if (headY >= 0) {
      ctx.fillStyle = 'rgba(' + c.head + ', 1)';
      ctx.fillText(drop.chars[0], drop.x, headY);
    }
  }
  // Draw all body characters in a second pass
  ctx.shadowBlur = 0;
  for (let i = 0; i < dropChars.length; i++) {
    const drop = dropChars[i];
    for (let j = 1; j < drop.chars.length; j++) {
      const alpha = 1 - (j / drop.chars.length);
      const y = drop.y - j * 14;
      if (y < 0) break;
      ctx.fillStyle = 'rgba(' + c.body + ', ' + (alpha * 0.6) + ')';
      ctx.fillText(drop.chars[j], drop.x, y);
    }
    ctx.shadowBlur = 0;
    drop.y += drop.speed * skin.speedMult;
    if (drop.y - drop.chars.length * 14 > canvas.height) {
      drop.y = 0;
      drop.chars = getMatrixChars();
      drop.x = Math.floor(Math.random() * (canvas.width / 14)) * 14;
    }
  }
}

function rainLoop() {
  drawRain();
  animId = requestAnimationFrame(rainLoop);
}

/* --- TRANSLATION --- */
function applySkin() {
  var skin = getSkin();
  var sl = document.getElementById('scanlines');
  if (sl) {
    sl.style.background = 'repeating-linear-gradient(0deg, transparent, transparent 2px, ' + skin.colors.scanline + ' 2px, ' + skin.colors.scanline + ' 4px)';
  }
  var style = document.getElementById('skinVars');
  if (!style) {
    style = document.createElement('style');
    style.id = 'skinVars';
    document.head.appendChild(style);
  }
  var bodyRGB = skin.colors.body;
  var shadowHex = skin.colors.shadow;
  style.textContent =
    '.floatingText { color: rgb(' + bodyRGB + '); text-shadow: 0 0 10px ' + shadowHex + ', 0 0 20px rgba(' + bodyRGB + ', 0.5); }' +
    '.blink, .btnCursor { color: ' + shadowHex + '; }';
}

function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  if (dom.langToggle) {
    dom.langToggle.textContent = state.lang === 'es' ? 'EN' : 'ES';
  }
  bus.emit(EVENTS.LANGUAGE_CHANGED);
}

