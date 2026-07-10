(function () {
  'use strict';

  const STRINGS = {
    es: {
      title: 'MATRIX HACK TERMINAL v1.0',
      headerPrompt: 'root@matrix:~$',
      handle: '>> NEO_001',
      level: 'NIVEL: {n}',
      mb: 'MB',
      btnPrompt: '[root@matrix]~$',
      btnText: './hack.exe',
      secure: '[CONEXIÓN SEGURA]',
      autoSave: 'AUTO-GUARDADO ACTIVO',
      saved: 'GUARDADO {time}',
      offline: 'OFFLINE +{n} MB',
      synergyDivider: ' | ',
      synergyScanner: 'SCANNER→CPU +{n} DPS',
      synergyArch: 'ARQUITECTO x{n}',
      critText: '¡CRÍTICO! x3',
      autoPrefix: '[AUTO]',
      panelTitle: '> MEJORAS_',
      cardLvl: 'NVL',
      effectClick: 'CLICK +{n}',
      effectDps: 'DPS +{n}',
      effectCrit: '{n}% CRIT',
      effectDiscount: '-{n}% COSTO',
      effectAutoclick: '{n} click/8s',
      effectMultClick: 'CLICK x{n}',
      effectMultDps: 'DPS x{n}',
      effectOffline: '{n}% OFFLINE',
      statClick: 'CLICK',
      statDps: 'DPS',
      statCrit: 'CRIT',
      statDiscount: 'DTO',
      unitPercent: '%',
      offlineExtra: ' GANADOS',
      resetConfirm: '¿Reiniciar todos los datos del juego?',
      prestigeLabel: 'PRESTIGE x{n}',
      prestigeReq: 'SIGUIENTE: {n} MB ({p}%)',
      prestigeBtn: 'PURGE & BOOT',
      prestigeConfirm: '¿PURGE & BOOT? El progreso se reiniciará. Multiplicador: x{n}',
      achTitle: 'LOGROS ({n}/12)',
      achFirstClick: 'First Click',
      achFirstClickDesc: 'Haz tu primer click',
      achClicker: 'Clicker',
      achClickerDesc: 'Alcanza 1K clicks',
      achAddicted: 'Adicto',
      achAddictedDesc: 'Alcanza 10K clicks',
      achDataMiner: 'Minero de Datos',
      achDataMinerDesc: 'Gana 1M de datos totales',
      achDataLord: 'Señor de los Datos',
      achDataLordDesc: 'Gana 1B de datos totales',
      achHacker: 'Hacker',
      achHackerDesc: '5 mejoras a nivel 5+',
      achEliteHacker: 'Hacker Élite',
      achEliteHackerDesc: '10 mejoras a nivel 10+',
      achScavenger: 'Carroñero',
      achScavengerDesc: 'Compra 100 mejoras totales',
      achLucky: 'Suertudo',
      achLuckyDesc: 'Consigue 100 críticos',
      achAutoPilot: 'Piloto Automático',
      achAutoPilotDesc: 'Caballo de Troya nivel 5+',
      achCompletionist: 'Completista',
      achCompletionistDesc: 'Todas las mejoras nivel 1+',
      achPrestigeMaster: 'Maestro del Prestige',
      achPrestigeMasterDesc: '5 prestige',
      achUnlocked: 'LOGRO DESBLOQUEADO: {name}',
      achUnlockedStatus: 'DESBLOQUEADO',
      achLockedStatus: 'BLOQUEADO',
      comboLabel: 'COMBO x{m} ({n})',
      skinTitle: 'SKINS',
      skinActive: 'ACTIVO',
      skinSelect: 'SELECCIONAR',
      skinDefault: 'Matrix Original',
      skinHacker: 'Neón Alto',
      skinNight: 'Modo Noche',
      skinFirewall: 'Alarma',
      skinNeon: 'Ciudad Neón',
      skinGolden: 'Oro',
      skinGlitch: 'Glitch',
      statsTitle: 'ESTADÍSTICAS',
      statTime: 'Tiempo jugado',
      statClicks: 'Clicks totales',
      statDataEarned: 'Datos totales',
      statClickPower: 'Poder de click',
      statDps: 'Datos por segundo',
      statCritChance: '% crítico',
      statCrits: 'Críticos totales',
      statUpgrades: 'Mejoras compradas',
      statPrestige: 'Prestige',
      statCombo: 'Combo actual',
      fwTitle: '⚠ FIREWALL DETECTED',
      fwIgnore: 'IGNORE',
      fwSuccess: 'ACCESO CONCEDIDO +{n} MB',
      fwFail: 'FIREWALL BLOQUEADO',
      upgrade: {
        terminal: { name: 'Terminal Básica', desc: 'Acceso shell inicial' },
        cpu: { name: 'CPU Rápida', desc: 'Procesador overclockeado' },
        scanner: { name: 'Escáner de Red', desc: 'Escanear puertos abiertos' },
        firewall: { name: 'Crack de Firewall', desc: 'Bypass de firewall' },
        ai: { name: 'Asistente IA', desc: 'IA de hackeo neuronal' },
        botnet: { name: 'Ejército Botnet', desc: 'Nodos zombie' },
        zeroday: { name: 'Exploit Zero-Day', desc: 'Vulnerabilidad desconocida' },
        quantum: { name: 'Decrypt Cuántico', desc: 'Rompimiento de clave cuántica' },
        smith: { name: 'Agente Smith', desc: 'Corrompe la Matrix' },
        source: { name: 'La Fuente', desc: 'Acceso al programa primario' },
        critical: { name: 'Hack Crítico', desc: 'Probabilidad de daño x3' },
        sqlinjection: { name: 'Inyección SQL', desc: 'Reduce costos de mejoras' },
        trojan: { name: 'Caballo de Troya', desc: 'Auto-click cada 8s' },
        kernel: { name: 'Exploit del Kernel', desc: 'Multiplica poder de click' },
        zion: { name: 'Protocolo Zion', desc: 'Multiplica DPS' },
        rootkit: { name: 'Rootkit', desc: 'Gana DPS mientras offline' },
        sniffer: { name: 'Sniffer de Paquetes', desc: 'Intercepta paquetes' },
        bruteforce: { name: 'Fuerza Bruta', desc: 'Rompe contraseñas' },
        ddos: { name: 'Nodo DDoS', desc: 'Ataque distribuido' },
        ghost: { name: 'Protocolo Fantasma', desc: 'Intrusión invisible' },
        codered: { name: 'Código Rojo', desc: 'Propagación de gusano' },
        neural: { name: 'Interfaz Neural', desc: 'Enlace cerebral directo' },
      },
    },
    en: {
      title: 'MATRIX HACK TERMINAL v1.0',
      headerPrompt: 'root@matrix:~$',
      handle: '>> NEO_001',
      level: 'LEVEL: {n}',
      mb: 'MB',
      btnPrompt: '[root@matrix]~$',
      btnText: './hack.exe',
      secure: '[CONNECTION SECURE]',
      autoSave: 'AUTO-SAVE ACTIVE',
      saved: 'SAVED {time}',
      offline: 'OFFLINE +{n} MB',
      synergyDivider: ' | ',
      synergyScanner: 'SCANNER→CPU +{n} DPS',
      synergyArch: 'ARCHITECT x{n}',
      critText: 'CRIT! x3',
      autoPrefix: '[AUTO]',
      panelTitle: '> UPGRADES_',
      cardLvl: 'LVL',
      effectClick: 'CLICK +{n}',
      effectDps: 'DPS +{n}',
      effectCrit: '{n}% CRIT',
      effectDiscount: '-{n}% COST',
      effectAutoclick: '{n} click/8s',
      effectMultClick: 'CLICK x{n}',
      effectMultDps: 'DPS x{n}',
      effectOffline: '{n}% OFFLINE',
      statClick: 'CLICK',
      statDps: 'DPS',
      statCrit: 'CRIT',
      statDiscount: 'DISCOUNT',
      unitPercent: '%',
      offlineExtra: ' EARNED',
      resetConfirm: 'Reset all game data?',
      prestigeLabel: 'PRESTIGE x{n}',
      prestigeReq: 'NEXT: {n} MB ({p}%)',
      prestigeBtn: 'PURGE & BOOT',
      prestigeConfirm: 'PURGE & BOOT? Progress will reset. Multiplier: x{n}',
      achTitle: 'ACHIEVEMENTS ({n}/12)',
      achFirstClick: 'First Click',
      achFirstClickDesc: 'Make your first click',
      achClicker: 'Clicker',
      achClickerDesc: 'Reach 1K clicks',
      achAddicted: 'Addicted',
      achAddictedDesc: 'Reach 10K clicks',
      achDataMiner: 'Data Miner',
      achDataMinerDesc: 'Earn 1M total data',
      achDataLord: 'Data Lord',
      achDataLordDesc: 'Earn 1B total data',
      achHacker: 'Hacker',
      achHackerDesc: '5 upgrades at level 5+',
      achEliteHacker: 'Elite Hacker',
      achEliteHackerDesc: '10 upgrades at level 10+',
      achScavenger: 'Scavenger',
      achScavengerDesc: 'Buy 100 total upgrades',
      achLucky: 'Lucky',
      achLuckyDesc: 'Land 100 crits',
      achAutoPilot: 'Auto Pilot',
      achAutoPilotDesc: 'Trojan Horse level 5+',
      achCompletionist: 'Completionist',
      achCompletionistDesc: 'All upgrades level 1+',
      achPrestigeMaster: 'Prestige Master',
      achPrestigeMasterDesc: '5 prestiges',
      achUnlocked: 'ACHIEVEMENT UNLOCKED: {name}',
      achUnlockedStatus: 'UNLOCKED',
      achLockedStatus: 'LOCKED',
      comboLabel: 'COMBO x{m} ({n})',
      skinTitle: 'SKINS',
      skinActive: 'ACTIVE',
      skinSelect: 'SELECT',
      skinDefault: 'Matrix Original',
      skinHacker: 'High Neon',
      skinNight: 'Night Mode',
      skinFirewall: 'Firewall',
      skinNeon: 'Neon City',
      skinGolden: 'Golden',
      skinGlitch: 'Glitch Core',
      statsTitle: 'STATISTICS',
      statTime: 'Play time',
      statClicks: 'Total clicks',
      statDataEarned: 'Data earned',
      statClickPower: 'Click power',
      statDps: 'Data per second',
      statCritChance: 'Crit chance',
      statCrits: 'Total crits',
      statUpgrades: 'Upgrades bought',
      statPrestige: 'Prestige',
      statCombo: 'Current combo',
      fwTitle: '⚠ FIREWALL DETECTED',
      fwIgnore: 'IGNORE',
      fwSuccess: 'ACCESS GRANTED +{n} MB',
      fwFail: 'FIREWALL BLOCKED',
      upgrade: {
        terminal: { name: 'Basic Terminal', desc: 'Init shell access' },
        cpu: { name: 'Faster CPU', desc: 'Overclock processor' },
        scanner: { name: 'Network Scanner', desc: 'Scan open ports' },
        firewall: { name: 'Firewall Crack', desc: 'Bypass firewall' },
        ai: { name: 'AI Assistant', desc: 'Neural hack AI' },
        botnet: { name: 'Botnet Army', desc: 'Zombie nodes' },
        zeroday: { name: 'Zero-Day Exploit', desc: 'Unknown vulnerability' },
        quantum: { name: 'Quantum Decrypt', desc: 'Quantum key crack' },
        smith: { name: 'Agent Smith', desc: 'Corrupt the Matrix' },
        source: { name: 'The Source', desc: 'Access the prime program' },
        critical: { name: 'Critical Hack', desc: 'Chance for 3x damage' },
        sqlinjection: { name: 'SQL Injection', desc: 'Reduce upgrade costs' },
        trojan: { name: 'Trojan Horse', desc: 'Auto-click every 8s' },
        kernel: { name: 'Kernel Exploit', desc: 'Multiplies click power' },
        zion: { name: 'Zion Protocol', desc: 'Multiplies DPS' },
        rootkit: { name: 'Rootkit', desc: 'Earn DPS while offline' },
        sniffer: { name: 'Packet Sniffer', desc: 'Intercept data packets' },
        bruteforce: { name: 'Brute Force', desc: 'Crack passwords' },
        ddos: { name: 'DDoS Node', desc: 'Distributed attack' },
        ghost: { name: 'Ghost Protocol', desc: 'Invisible intrusion' },
        codered: { name: 'Code Red', desc: 'Worm propagation' },
        neural: { name: 'Neural Interface', desc: 'Direct brain link' },
      },
    },
  };

  function t(key, replacements) {
    const lang = state && state.lang ? state.lang : 'es';
    const parts = key.split('.');
    let val = STRINGS[lang];
    for (const p of parts) {
      if (val == null) return '?' + key;
      val = val[p];
    }
    if (val == null) return '?' + key;
    if (replacements) {
      for (const [k, v] of Object.entries(replacements)) {
        val = val.replace('{' + k + '}', v);
      }
    }
    return val;
  }

  const UPGRADE_DEFS = [
    { id: 'terminal', cost: 10, effect: 'click', value: 1, icon: '>' },
    { id: 'cpu', cost: 25, effect: 'dps', value: 0.5, icon: '[]' },
    { id: 'scanner', cost: 50, effect: 'click', value: 2, icon: '@' },
    { id: 'firewall', cost: 100, effect: 'dps', value: 2, icon: '#' },
    { id: 'ai', cost: 250, effect: 'click', value: 5, icon: '&' },
    { id: 'botnet', cost: 500, effect: 'dps', value: 5, icon: '*' },
    { id: 'zeroday', cost: 1000, effect: 'click', value: 15, icon: '!' },
    { id: 'quantum', cost: 2500, effect: 'dps', value: 15, icon: '?' },
    { id: 'smith', cost: 5000, effect: 'click', value: 50, icon: '$' },
    { id: 'source', cost: 10000, effect: 'dps', value: 50, icon: '%' },
    { id: 'critical', cost: 15000, effect: 'crit', value: 4, icon: '!' },
    { id: 'sqlinjection', cost: 25000, effect: 'discount', value: 2, icon: '$' },
    { id: 'trojan', cost: 40000, effect: 'autoclick', value: 1, icon: '@' },
    { id: 'kernel', cost: 80000, effect: 'mult_click', value: 1.15, icon: '*' },
    { id: 'zion', cost: 150000, effect: 'mult_dps', value: 1.15, icon: '#' },
    { id: 'rootkit', cost: 300000, effect: 'offline', value: 15, icon: '&' },
    { id: 'sniffer', cost: 100000, effect: 'dps', value: 75, icon: '~' },
    { id: 'bruteforce', cost: 250000, effect: 'click', value: 150, icon: '!' },
    { id: 'ddos', cost: 750000, effect: 'dps', value: 500, icon: '*' },
    { id: 'ghost', cost: 2000000, effect: 'click', value: 400, icon: '?' },
    { id: 'codered', cost: 10000000, effect: 'click', value: 5000, icon: '#' },
    { id: 'neural', cost: 25000000, effect: 'dps', value: 10000, icon: '@' },
  ];

  const LEVEL_THRESHOLDS = [0, 100, 500, 2000, 5000, 15000, 50000, 150000, 500000, 1500000, 5000000];

  const ACHIEVEMENT_DEFS = [
    { id: 'first_click', bonus: { clickPercent: 10 } },
    { id: 'clicker', bonus: { clickPercent: 20 } },
    { id: 'addicted', bonus: { clickPercent: 50 } },
    { id: 'data_miner', bonus: { dpsPercent: 10 } },
    { id: 'data_lord', bonus: { dpsPercent: 50 } },
    { id: 'hacker', bonus: { dpsPercent: 15 } },
    { id: 'elite_hacker', bonus: { dpsPercent: 30 } },
    { id: 'scavenger', bonus: { discountFlat: 5 } },
    { id: 'lucky', bonus: { critPercent: 5 } },
    { id: 'auto_pilot', bonus: { autoclickExtra: 1 } },
    { id: 'completionist', bonus: { dpsPercent: 100 } },
    { id: 'prestige_master', bonus: { prestigeExtra: 0.5 } },
  ];

  const VISUAL_SKINS = [
    { id: 'default', nameKey: 'skinDefault', cost: 0, colors: { head: '200, 255, 200', body: '0, 255, 0', alpha: 0.3, shadow: '#00ff00', scanline: 'rgba(0, 255, 0, 0.03)' }, speedMult: 1 },
    { id: 'hacker', nameKey: 'skinHacker', cost: 50000, colors: { head: '100, 255, 100', body: '0, 200, 0', alpha: 0.4, shadow: '#00ff00', scanline: 'rgba(0, 255, 0, 0.05)' }, speedMult: 1.2 },
    { id: 'night', nameKey: 'skinNight', cost: 100000, colors: { head: '100, 200, 255', body: '0, 150, 255', alpha: 0.35, shadow: '#0099ff', scanline: 'rgba(0, 150, 255, 0.04)' }, speedMult: 1 },
    { id: 'firewall', nameKey: 'skinFirewall', cost: 250000, colors: { head: '255, 150, 100', body: '255, 80, 0', alpha: 0.35, shadow: '#ff4400', scanline: 'rgba(255, 68, 0, 0.04)' }, speedMult: 1.5 },
    { id: 'neon', nameKey: 'skinNeon', cost: 500000, colors: { head: '255, 100, 255', body: '200, 0, 255', alpha: 0.35, shadow: '#cc00ff', scanline: 'rgba(200, 0, 255, 0.04)' }, speedMult: 1 },
    { id: 'golden', nameKey: 'skinGolden', cost: 1000000, colors: { head: '255, 220, 100', body: '255, 200, 0', alpha: 0.4, shadow: '#ffcc00', scanline: 'rgba(255, 200, 0, 0.05)' }, speedMult: 1 },
    { id: 'glitch', nameKey: 'skinGlitch', cost: 5000000, colors: { head: '0, 255, 0', body: '255, 0, 0', alpha: 0.5, shadow: '#ff0000', scanline: 'rgba(255, 0, 0, 0.06)' }, speedMult: 2 },
  ];

  const SAVE_KEY = 'matrixHackerClicker';
  const SAVE_INTERVAL = 15000;

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
  };

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

    for (let i = 0; i < dropChars.length; i++) {
      const drop = dropChars[i];
      if (drop.chars.length === 0) drop.chars = getMatrixChars();
      for (let j = 0; j < drop.chars.length; j++) {
        const alpha = 1 - (j / drop.chars.length);
        const y = drop.y - j * 14;
        if (y < 0) continue;
        if (j === 0) {
          ctx.fillStyle = 'rgba(' + c.head + ', ' + alpha + ')';
          ctx.shadowBlur = 10;
          ctx.shadowColor = c.shadow;
        } else {
          ctx.fillStyle = 'rgba(' + c.body + ', ' + (alpha * 0.6) + ')';
          ctx.shadowBlur = 0;
        }
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
  }

  function applyLanguage() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    if (dom.langToggle) {
      dom.langToggle.textContent = state.lang === 'es' ? 'EN' : 'ES';
    }
    renderAll();
  }

  /* --- GAME LOGIC --- */
  function initUpgrades() {
    UPGRADE_DEFS.forEach(function (u) {
      if (!state.upgrades[u.id]) state.upgrades[u.id] = 0;
    });
  }

  function getUpgradeCost(def, level) {
    var base = def.cost * Math.pow(1.15, level);
    return Math.floor(base * (1 - (state.discount || 0) / 100));
  }

  function getLevel() {
    var lvl = 1;
    for (var i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (state.data >= LEVEL_THRESHOLDS[i]) {
        lvl = i + 1;
        break;
      }
    }
    return lvl;
  }

  function calculateStats() {
    var click = 1;
    var dpsVal = 0;
    var crit = 0;
    var disc = 0;
    var multClick = 1;
    var multDps = 1;
    UPGRADE_DEFS.forEach(function (u) {
      var owned = state.upgrades[u.id] || 0;
      switch (u.effect) {
        case 'click': click += u.value * owned; break;
        case 'dps': dpsVal += u.value * owned; break;
        case 'crit': crit += u.value * owned; break;
        case 'discount': disc += u.value * owned; break;
        case 'mult_click': multClick *= Math.pow(u.value, owned); break;
        case 'mult_dps': multDps *= Math.pow(u.value, owned); break;
      }
    });

    var scannerLvl = state.upgrades['scanner'] || 0;
    var cpuLvl = state.upgrades['cpu'] || 0;
    state.synergy = scannerLvl >= 5 && cpuLvl > 0;
    if (state.synergy) dpsVal += cpuLvl;

    var archCount = 0;
    UPGRADE_DEFS.forEach(function (u) {
      if ((state.upgrades[u.id] || 0) >= 10) archCount++;
    });
    state.architectCount = archCount;
    state.architect = archCount > 0;
    if (state.architect) multDps *= (1 + archCount * 0.05);

    state.clickPower = Math.floor(click * multClick * state.prestigeMultiplier);
    state.dps = Math.floor(dpsVal * multDps * state.prestigeMultiplier * 10) / 10;

    var achClickMult = 1;
    var achDpsMult = 1;
    var achCrit = 0;
    var achDiscount = 0;
    ACHIEVEMENT_DEFS.forEach(function (ach) {
      if (state.achievements[ach.id]) {
        if (ach.bonus.clickPercent) achClickMult *= (1 + ach.bonus.clickPercent / 100);
        if (ach.bonus.dpsPercent) achDpsMult *= (1 + ach.bonus.dpsPercent / 100);
        if (ach.bonus.critPercent) achCrit += ach.bonus.critPercent;
        if (ach.bonus.discountFlat) achDiscount += ach.bonus.discountFlat;
        if (ach.bonus.autoclickExtra) {
          // handled in setupAutoClick
        }
        if (ach.bonus.prestigeExtra) {
          // handled in doPrestige
        }
      }
    });
    state.clickPower = Math.floor(state.clickPower * achClickMult);
    state.dps = Math.floor(state.dps * achDpsMult * 10) / 10;
    state.critChance = crit + achCrit;
    state.discount = disc + achDiscount;
    state.level = getLevel();
    if (state.level > lastLevel) {
      playSound('levelup');
    }
    lastLevel = state.level;
  }

  function buyUpgrade(id) {
    var def = UPGRADE_DEFS.find(function (u) { return u.id === id; });
    if (!def) return;
    var currentLevel = state.upgrades[id] || 0;
    var cost = getUpgradeCost(def, currentLevel);
    if (state.data < cost) return;
    state.data -= cost;
    state.upgrades[id] = currentLevel + 1;
    playSound('buy');
    calculateStats();
    renderAll();
  }

  function doClick(e, isAuto) {
    var rect = dom.hackBtn.getBoundingClientRect();
    var x = e ? e.clientX - rect.left : rect.width / 2;
    var y = e ? e.clientY - rect.top : (rect.height / 2);
    var gained = state.clickPower;

    // Combo tracking (manual clicks only)
    if (!isAuto) {
      var now = Date.now();
      if (state.lastClickTime && now - state.lastClickTime < 1000) {
        state.combo = Math.min(50, state.combo + 1);
      } else {
        state.combo = 1;
      }
      state.lastClickTime = now;
      if (comboTimeout) clearTimeout(comboTimeout);
      comboTimeout = setTimeout(function () {
        state.combo = 0;
        if (dom.comboDisplay) dom.comboDisplay.style.display = 'none';
      }, 1000);
      var comboMult = 1 + state.combo * 0.1;
      gained = Math.floor(gained * comboMult);
    }

    if (!isAuto && state.critChance > 0 && Math.random() * 100 < state.critChance) {
      gained *= 3;
      state.totalCrits++;
      playSound('crit');
      spawnFloatingCrit(x, y - 30, t('critText'));
      dom.hackBtn.classList.remove('flicker');
      void dom.hackBtn.offsetWidth;
      dom.hackBtn.classList.add('flicker');
    } else if (!isAuto) {
      playSound('click');
      dom.hackBtn.classList.remove('flicker');
      void dom.hackBtn.offsetWidth;
      dom.hackBtn.classList.add('flicker');
    }

    state.data += gained;
    state.totalDataEarned += gained;
    state.totalClicks++;
    calculateStats();
    renderAll();

    var prefix = isAuto ? t('autoPrefix') + ' ' : '';
    spawnFloatingText(x, y, prefix + '+' + gained + ' ' + t('mb'));
  }

  function handleClick(e) {
    doClick(e, false);
  }

  function spawnFloatingText(x, y, text) {
    var el = document.createElement('div');
    el.className = 'floatingText';
    el.textContent = text;
    el.style.left = (x - 30) + 'px';
    el.style.top = (y - 10) + 'px';
    floatingContainer.appendChild(el);
    setTimeout(function () { el.remove(); }, 800);
  }

  function spawnFloatingCrit(x, y, text) {
    var el = document.createElement('div');
    el.className = 'floatingCrit';
    el.textContent = text;
    el.style.left = (x - 50) + 'px';
    el.style.top = (y - 20) + 'px';
    floatingContainer.appendChild(el);
    setTimeout(function () { el.remove(); }, 1000);
  }

  /* --- RENDER --- */
  function renderAll() {
    dom.dataAmount.textContent = Math.floor(state.data).toLocaleString();
    dom.clickPower.textContent = state.clickPower;
    dom.dpsValue.textContent = state.dps;
    dom.critDisplay.textContent = state.critChance;
    dom.discountDisplay.textContent = state.discount;
    dom.playerLevel.textContent = t('level', { n: state.level });

    var nextThreshold = LEVEL_THRESHOLDS[state.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    var prevThreshold = LEVEL_THRESHOLDS[state.level - 1] || 0;
    var progress = (state.data - prevThreshold) / (nextThreshold - prevThreshold);
    dom.dataBarInner.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';

    if (dom.synergyDisplay) {
      var parts = [];
      if (state.synergy) parts.push(t('synergyScanner', { n: state.upgrades['cpu'] || 0 }));
      if (state.architect) parts.push(t('synergyArch', { n: Number(1 + state.architectCount * 0.05).toFixed(2) }));
      dom.synergyDisplay.textContent = parts.length ? '>> ' + parts.join(t('synergyDivider')) : '';
      dom.synergyDisplay.style.display = parts.length ? 'block' : 'none';
    }

    if (dom.prestigeInfo) {
      dom.prestigeInfo.textContent = t('prestigeLabel', { n: Number(state.prestigeMultiplier).toFixed(1) });
    }
    if (dom.prestigeReq) {
      var req = getPrestigeReq();
      var progress = Math.min(100, Math.floor(state.totalDataEarned / req * 100));
      dom.prestigeReq.textContent = t('prestigeReq', { n: req.toLocaleString(), p: progress });
      if (dom.prestigeBtn) {
        dom.prestigeBtn.disabled = state.totalDataEarned < req;
        dom.prestigeBtn.style.display = state.prestigeCount > 0 || state.totalDataEarned >= req * 0.3 ? 'inline-block' : 'none';
      }
    }

    if (dom.comboDisplay) {
      if (state.combo > 1) {
        dom.comboDisplay.textContent = t('comboLabel', { n: state.combo, m: Number(1 + state.combo * 0.1).toFixed(1) });
        dom.comboDisplay.style.display = 'block';
      } else {
        dom.comboDisplay.style.display = 'none';
      }
    }

    renderUpgrades();
    if (document.getElementById('achOverlay').classList.contains('open')) {
      renderAchievements();
    }
  }

  function renderUpgrades() {
    dom.upgradesGrid.innerHTML = '';
    UPGRADE_DEFS.forEach(function (u) {
      var owned = state.upgrades[u.id] || 0;
      var cost = getUpgradeCost(u, owned);
      var card = document.createElement('div');
      card.className = 'upgradeCard';
      if (state.data < cost) card.classList.add('locked');

      var nameRow = document.createElement('div');
      nameRow.className = 'upgradeName';
      nameRow.textContent = u.icon + ' ' + t('upgrade.' + u.id + '.name');

      var descRow = document.createElement('div');
      descRow.className = 'upgradeDesc';
      descRow.textContent = t('upgrade.' + u.id + '.desc');

      var costRow = document.createElement('div');
      costRow.className = 'upgradeCost';
      costRow.textContent = cost.toLocaleString() + ' ' + t('mb');

      var ownedRow = document.createElement('div');
      ownedRow.className = 'upgradeOwned';
      var effectText = '';
      switch (u.effect) {
        case 'click': effectText = t('effectClick', { n: u.value * owned }); break;
        case 'dps': effectText = t('effectDps', { n: u.value * owned }); break;
        case 'crit': effectText = t('effectCrit', { n: u.value * owned }); break;
        case 'discount': effectText = t('effectDiscount', { n: u.value * owned }); break;
        case 'autoclick': effectText = t('effectAutoclick', { n: owned }); break;
        case 'mult_click': effectText = t('effectMultClick', { n: Number(Math.pow(u.value, owned)).toFixed(2) }); break;
        case 'mult_dps': effectText = t('effectMultDps', { n: Number(Math.pow(u.value, owned)).toFixed(2) }); break;
        case 'offline': effectText = t('effectOffline', { n: u.value * owned }); break;
      }
      ownedRow.textContent = t('cardLvl') + ' ' + owned + ' (' + effectText + ')';

      card.appendChild(nameRow);
      card.appendChild(descRow);
      card.appendChild(costRow);
      card.appendChild(ownedRow);

      card.addEventListener('click', function () {
        buyUpgrade(u.id);
      });

      dom.upgradesGrid.appendChild(card);
    });
  }

  /* --- PRESTIGE --- */
  function getPrestigeReq() {
    return 500000 * (state.prestigeCount + 1);
  }

  function doPrestige() {
    var req = getPrestigeReq();
    if (state.totalDataEarned < req) return;
    if (!confirm(t('prestigeConfirm', { n: Number(state.prestigeMultiplier * 1.5).toFixed(2) }))) return;

    var glitch = document.getElementById('glitchOverlay');
    glitch.classList.add('active');

    playSound('crit');

    setTimeout(function () {
      state.prestigeMultiplier *= 1.5;
      state.prestigeCount++;
      state.data = 0;
      state.upgrades = {};
      initUpgrades();
      if (autoClickInterval) clearInterval(autoClickInterval);
      calculateStats();
      renderAll();
      setupAutoClick();
      saveGame();

      glitch.classList.remove('active');

      playSound('levelup');
    }, 1600);
  }

  /* --- ACHIEVEMENTS --- */
  function toggleAchievements() {
    var overlay = document.getElementById('achOverlay');
    if (!overlay) return;
    var isOpen = overlay.classList.toggle('open');
    if (isOpen) renderAchievements();
  }

  function renderAchievements() {
    var grid = document.getElementById('achGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var count = 0;
    ACHIEVEMENT_DEFS.forEach(function (ach) {
      var unlocked = state.achievements[ach.id];
      if (unlocked) count++;
      var nameKey = 'ach' + ach.id.charAt(0).toUpperCase() + ach.id.slice(1);
      var card = document.createElement('div');
      card.className = 'achCard' + (unlocked ? ' unlocked' : ' locked');

      var nameRow = document.createElement('div');
      nameRow.className = 'achCardName';
      nameRow.textContent = (unlocked ? '✓ ' : '○ ') + t(nameKey);

      var descRow = document.createElement('div');
      descRow.className = 'achCardDesc';
      descRow.textContent = t(nameKey + 'Desc');

      var statusRow = document.createElement('div');
      statusRow.className = 'achCardStatus';
      statusRow.textContent = unlocked ? '[' + t('achUnlockedStatus') + ']' : '[' + t('achLockedStatus') + ']';

      card.appendChild(nameRow);
      card.appendChild(descRow);
      card.appendChild(statusRow);
      grid.appendChild(card);
    });
    var title = document.getElementById('achTitle');
    if (title) title.textContent = t('achTitle', { n: count });
    if (dom.achBtn) {
      dom.achBtn.textContent = t('achTitle', { n: count });
    }
  }

  function countUpgradesAtLevel(minLevel) {
    var count = 0;
    UPGRADE_DEFS.forEach(function (u) {
      if ((state.upgrades[u.id] || 0) >= minLevel) count++;
    });
    return count;
  }

  function getTotalUpgradeLevels() {
    var total = 0;
    UPGRADE_DEFS.forEach(function (u) {
      total += state.upgrades[u.id] || 0;
    });
    return total;
  }

  function isAllUpgradesOwned() {
    for (var i = 0; i < UPGRADE_DEFS.length; i++) {
      if (!state.upgrades[UPGRADE_DEFS[i].id]) return false;
    }
    return true;
  }

  function checkAchievements() {
    var checks = {
      'first_click': state.totalClicks >= 1,
      'clicker': state.totalClicks >= 1000,
      'addicted': state.totalClicks >= 10000,
      'data_miner': state.totalDataEarned >= 1000000,
      'data_lord': state.totalDataEarned >= 1000000000,
      'hacker': countUpgradesAtLevel(5) >= 5,
      'elite_hacker': countUpgradesAtLevel(10) >= 10,
      'scavenger': getTotalUpgradeLevels() >= 100,
      'lucky': state.totalCrits >= 100,
      'auto_pilot': (state.upgrades['trojan'] || 0) >= 5,
      'completionist': isAllUpgradesOwned(),
      'prestige_master': state.prestigeCount >= 5,
    };
    var newUnlock = false;
    ACHIEVEMENT_DEFS.forEach(function (ach) {
      if (!state.achievements[ach.id] && checks[ach.id]) {
        state.achievements[ach.id] = true;
        newUnlock = true;
        var nameKey = 'ach' + ach.id.charAt(0).toUpperCase() + ach.id.slice(1);
        if (dom.saveStatus) {
          dom.saveStatus.textContent = t('achUnlocked', { name: t(nameKey) });
          setTimeout(function () {
            dom.saveStatus.textContent = t('autoSave');
          }, 3000);
        }
      }
    });
    return newUnlock;
  }

  /* --- VISUAL SKINS --- */
  function toggleSkins() {
    var overlay = document.getElementById('skinOverlay');
    if (!overlay) return;
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) renderSkins();
  }

  function renderSkins() {
    var grid = document.getElementById('skinGrid');
    if (!grid) return;
    grid.innerHTML = '';
    VISUAL_SKINS.forEach(function (s) {
      var owned = state.ownedSkins.indexOf(s.id) !== -1 || s.cost === 0;
      var active = state.activeSkin === s.id;
      var card = document.createElement('div');
      card.className = 'skinCard' + (active ? ' active' : '') + (!owned ? ' locked' : '');

      var nameRow = document.createElement('div');
      nameRow.className = 'skinName';
      nameRow.textContent = t(s.nameKey);

      var preview = document.createElement('div');
      preview.className = 'skinPreview';
      preview.style.background = 'linear-gradient(180deg, rgba(' + s.colors.head + ',0.6), rgba(' + s.colors.body + ',0.2))';
      preview.style.borderColor = s.colors.shadow;

      var statusRow = document.createElement('div');
      statusRow.className = 'skinStatus';
      if (active) {
        statusRow.textContent = '[' + t('skinActive') + ']';
      } else if (owned) {
        statusRow.textContent = '[' + t('skinSelect') + ']';
      } else {
        statusRow.textContent = s.cost.toLocaleString() + ' ' + t('mb');
      }

      card.appendChild(preview);
      card.appendChild(nameRow);
      card.appendChild(statusRow);

      card.addEventListener('click', function () {
        if (owned) {
          state.activeSkin = s.id;
          applySkin();
          renderSkins();
        } else if (state.data >= s.cost) {
          state.data -= s.cost;
          state.ownedSkins.push(s.id);
          state.activeSkin = s.id;
          applySkin();
          saveGame();
          renderSkins();
          renderAll();
        }
      });

      grid.appendChild(card);
    });
  }

  /* --- SOUND --- */
  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      var actx = new (window.AudioContext || window.webkitAudioContext)();
      if (type === 'click') {
        var osc = actx.createOscillator();
        var gain = actx.createGain();
        osc.type = 'square';
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.08, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.05);
      } else if (type === 'crit') {
        var osc2 = actx.createOscillator();
        var gain2 = actx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(440, actx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(880, actx.currentTime + 0.15);
        gain2.gain.setValueAtTime(0.12, actx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.15);
        osc2.connect(gain2);
        gain2.connect(actx.destination);
        osc2.start();
        osc2.stop(actx.currentTime + 0.15);
      } else if (type === 'buy') {
        var bufferSize = actx.sampleRate * 0.05;
        var buffer = actx.createBuffer(1, bufferSize, actx.sampleRate);
        var data = buffer.getChannelData(0);
        for (var i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.06;
        }
        var noise = actx.createBufferSource();
        noise.buffer = buffer;
        noise.connect(actx.destination);
        noise.start();
        noise.stop(actx.currentTime + 0.05);
      } else if (type === 'levelup') {
        [440, 554, 659].forEach(function (freq, idx) {
          var o = actx.createOscillator();
          var g = actx.createGain();
          o.type = 'sine';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.1, actx.currentTime + idx * 0.1);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.1 + 0.12);
          o.connect(g);
          g.connect(actx.destination);
          o.start(actx.currentTime + idx * 0.1);
          o.stop(actx.currentTime + idx * 0.1 + 0.12);
        });
      } else if (type === 'autoclick') {
        var osc3 = actx.createOscillator();
        var gain3 = actx.createGain();
        osc3.type = 'sine';
        osc3.frequency.value = 220;
        gain3.gain.setValueAtTime(0.04, actx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.03);
        osc3.connect(gain3);
        gain3.connect(actx.destination);
        osc3.start();
        osc3.stop(actx.currentTime + 0.03);
      } else if (type === 'offline') {
        [330, 440, 554].forEach(function (freq, idx) {
          var o = actx.createOscillator();
          var g = actx.createGain();
          o.type = 'triangle';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.08, actx.currentTime + idx * 0.15);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.15 + 0.1);
          o.connect(g);
          g.connect(actx.destination);
          o.start(actx.currentTime + idx * 0.15);
          o.stop(actx.currentTime + idx * 0.15 + 0.1);
        });
      }
      setTimeout(function () { actx.close(); }, 1000);
    } catch (e) {}
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (dom.soundBtn) {
      dom.soundBtn.textContent = state.soundEnabled ? '♪' : '♪̸';
    }
    saveGame();
  }

  /* --- STATISTICS --- */
  function toggleStats() {
    var overlay = document.getElementById('statsOverlay');
    if (!overlay) return;
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) renderStats();
  }

  function renderStats() {
    var body = document.getElementById('statsBody');
    if (!body) return;
    var rows = [
      { label: t('statTime'), value: formatTime(Math.floor(state.playTime)) },
      { label: t('statClicks'), value: state.totalClicks.toLocaleString() },
      { label: t('statDataEarned'), value: Math.floor(state.totalDataEarned).toLocaleString() + ' MB' },
      { label: t('statClickPower'), value: state.clickPower.toLocaleString() + ' MB' },
      { label: t('statDps'), value: state.dps + ' MB/s' },
      { label: t('statCritChance'), value: state.critChance + '%' },
      { label: t('statCrits'), value: (state.totalCrits || 0).toLocaleString() },
      { label: t('statUpgrades'), value: getTotalUpgradeLevels().toLocaleString() },
      { label: t('statPrestige'), value: state.prestigeCount + ' (x' + Number(state.prestigeMultiplier).toFixed(1) + ')' },
      { label: t('statCombo'), value: state.combo + ' (' + Number(1 + state.combo * 0.1).toFixed(1) + 'x)' },
    ];
    body.innerHTML = '';
    rows.forEach(function (r) {
      var row = document.createElement('div');
      row.className = 'statRow';
      row.innerHTML = '<span class="statRowLabel">' + r.label + '</span><span class="statRowValue">' + r.value + '</span>';
      body.appendChild(row);
    });
  }

  function formatTime(secs) {
    var h = Math.floor(secs / 3600);
    var m = Math.floor((secs % 3600) / 60);
    var s = secs % 60;
    return (h > 0 ? h + 'h ' : '') + (m > 0 ? m + 'm ' : '') + s + 's';
  }

  /* --- FIREWALL MINIGAME --- */
  function scheduleFirewall() {
    if (firewallTimeout) clearTimeout(firewallTimeout);
    if (!state.firewallEnabled) return;
    var delay = 60000 + Math.random() * 60000;
    firewallTimeout = setTimeout(startFirewall, delay);
  }

  function startFirewall() {
    if (!state.firewallEnabled) return;
    var overlay = document.getElementById('fwOverlay');
    if (!overlay) return;
    var nodeCount = 3 + Math.floor(state.level / 5);
    if (nodeCount > 8) nodeCount = 8;
    var timeLimit = Math.max(2, 5 - Math.floor(state.level / 10));

    state.firewallNodes = [];
    for (var i = 1; i <= nodeCount; i++) {
      state.firewallNodes.push({
        num: i,
        x: 10 + Math.random() * 70,
        y: 10 + Math.random() * 70,
      });
    }
    state.firewallStep = 0;
    state.firewallActive = true;

    // Render nodes
    var container = document.getElementById('fwNodes');
    container.innerHTML = '';
    state.firewallNodes.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'fwNode';
      el.textContent = n.num;
      el.style.left = n.x + '%';
      el.style.top = n.y + '%';
      el.setAttribute('data-num', n.num);
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        clickFirewallNode(parseInt(el.getAttribute('data-num')));
      });
      container.appendChild(el);
    });

    var timerBar = document.getElementById('fwTimerBar');
    timerBar.style.width = '100%';
    timerBar.style.transition = 'none';

    document.getElementById('fwTimeLimit').textContent = timeLimit + 's';
    document.getElementById('fwStep').textContent = '1/' + nodeCount;
    document.getElementById('fwResult').style.display = 'none';

    overlay.classList.add('open');

    // Force reflow then start transition
    void timerBar.offsetWidth;
    timerBar.style.transition = 'width ' + timeLimit + 's linear';
    timerBar.style.width = '0%';

    if (firewallTimerInterval) clearInterval(firewallTimerInterval);

    firewallTimerInterval = setTimeout(function () {
      if (state.firewallActive) {
        endFirewall(false);
      }
    }, timeLimit * 1000);
  }

  function clickFirewallNode(num) {
    if (!state.firewallActive) return;
    if (num === state.firewallStep + 1) {
      state.firewallStep++;
      document.getElementById('fwStep').textContent = (state.firewallStep + 1) + '/' + state.firewallNodes.length;
      playSound('click');
      if (state.firewallStep >= state.firewallNodes.length) {
        endFirewall(true);
      }
    } else {
      endFirewall(false);
    }
  }

  function endFirewall(success) {
    state.firewallActive = false;
    if (firewallTimerInterval) {
      clearTimeout(firewallTimerInterval);
      firewallTimerInterval = null;
    }

    var result = document.getElementById('fwResult');
    result.style.display = 'block';
    if (success) {
      var bonus = Math.floor(state.dps * 10 * (1 + state.level * 0.1));
      state.data += bonus;
      state.totalDataEarned += bonus;
      result.textContent = t('fwSuccess', { n: bonus.toLocaleString() });
      result.className = 'fwResult success';
      playSound('levelup');
      calculateStats();
      renderAll();
    } else {
      result.textContent = t('fwFail');
      result.className = 'fwResult fail';
    }

    setTimeout(function () {
      document.getElementById('fwOverlay').classList.remove('open');
      scheduleFirewall();
    }, 2000);
  }

  function skipFirewall() {
    if (state.firewallActive) {
      endFirewall(false);
    } else {
      document.getElementById('fwOverlay').classList.remove('open');
      scheduleFirewall();
    }
  }

  /* --- AUTO CLICK --- */
  function setupAutoClick() {
    if (autoClickInterval) clearInterval(autoClickInterval);
    autoClickInterval = setInterval(function () {
      var level = state.upgrades['trojan'] || 0;
      var extra = 0;
      ACHIEVEMENT_DEFS.forEach(function (ach) {
        if (state.achievements[ach.id] && ach.bonus.autoclickExtra) {
          extra += ach.bonus.autoclickExtra;
        }
      });
      var total = level + extra;
      if (total > 0) {
        for (var i = 0; i < total; i++) {
          doClick(null, true);
        }
        playSound('autoclick');
      }
    }, 8000);
  }

  /* --- GAME LOOP --- */
  function gameLoop() {
    if (state.dps > 0) {
      var gain = state.dps / 10;
      state.data += gain;
      state.totalDataEarned += gain;
      state.playTime += 0.1;
      calculateStats();
      checkAchievements();
      renderAll();
    }
  }

  /* --- SAVE / LOAD --- */
  function saveGame() {
    try {
      state.lastSaveTime = Date.now();
      var saveData = JSON.stringify(state);
      localStorage.setItem(SAVE_KEY, saveData);
      dom.saveStatus.textContent = t('saved', { time: new Date().toLocaleTimeString() });
      setTimeout(function () {
        dom.saveStatus.textContent = t('autoSave');
      }, 2000);
    } catch (e) {}
  }

  function loadGame() {
    try {
      var raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        var saved = JSON.parse(raw);
        state = Object.assign(state, saved);
        if (!state.upgrades) state.upgrades = {};
        if (state.totalDataEarned < state.data) state.totalDataEarned = state.data;
        if (!state.achievements) state.achievements = {};
        if (!state.ownedSkins) state.ownedSkins = [];
        if (!state.activeSkin) state.activeSkin = 'default';
        calculateStats();

        var rootkitLevel = state.upgrades['rootkit'] || 0;
        if (rootkitLevel > 0 && state.lastSaveTime && state.dps > 0) {
          var elapsed = (Date.now() - state.lastSaveTime) / 1000;
          var offlineData = Math.floor(state.dps * elapsed * rootkitLevel * 0.15);
          if (offlineData > 0) {
            playSound('offline');
            state.data += offlineData;
            if (dom.saveStatus) {
              dom.saveStatus.textContent = t('offline', { n: offlineData.toLocaleString() }) + t('offlineExtra');
              setTimeout(function () {
                dom.saveStatus.textContent = t('autoSave');
              }, 4000);
            }
          }
        }
        return true;
      }
    } catch (e) {}
    return false;
  }

  function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    if (autoClickInterval) clearInterval(autoClickInterval);
    if (firewallTimeout) clearTimeout(firewallTimeout);
    if (firewallTimerInterval) clearTimeout(firewallTimerInterval);
    state.firewallActive = false;
    var savedLang = state.lang;
    var savedPrestigeMult = state.prestigeMultiplier;
    var savedPrestigeCount = state.prestigeCount;
    var savedAchievements = Object.assign({}, state.achievements);
    var savedSkins = state.ownedSkins.slice();
    var savedActiveSkin = state.activeSkin;
    state = {
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
      lang: savedLang,
      prestigeMultiplier: savedPrestigeMult,
      prestigeCount: savedPrestigeCount,
      totalDataEarned: 0,
      achievements: savedAchievements,
      totalCrits: 0,
      combo: 0,
      activeSkin: savedActiveSkin,
      ownedSkins: savedSkins,
      soundEnabled: state.soundEnabled,
      playTime: 0,
      firewallEnabled: true,
    };
    initUpgrades();
    calculateStats();
    renderAll();
    setupAutoClick();
    scheduleFirewall();
  }

  /* --- LANGUAGE TOGGLE --- */
  function toggleLang() {
    state.lang = state.lang === 'es' ? 'en' : 'es';
    applyLanguage();
    saveGame();
  }

  /* --- DOM CACHE --- */
  function cacheDom() {
    dom.dataAmount = document.getElementById('dataAmount');
    dom.clickPower = document.getElementById('clickPower');
    dom.dpsValue = document.getElementById('dpsValue');
    dom.playerLevel = document.getElementById('playerLevel');
    dom.playerHandle = document.getElementById('playerHandle');
    dom.hackBtn = document.getElementById('hackBtn');
    dom.upgradesGrid = document.getElementById('upgradesGrid');
    dom.dataBarInner = document.getElementById('dataBarInner');
    dom.saveStatus = document.getElementById('saveStatus');
    dom.critDisplay = document.getElementById('critDisplay');
    dom.discountDisplay = document.getElementById('discountDisplay');
    dom.synergyDisplay = document.getElementById('synergyDisplay');
    dom.langToggle = document.getElementById('langToggle');
    dom.prestigeInfo = document.getElementById('prestigeInfo');
    dom.prestigeReq = document.getElementById('prestigeReq');
    dom.prestigeBtn = document.getElementById('prestigeBtn');
    dom.achBtn = document.getElementById('achBtn');
    dom.achClose = document.getElementById('achClose');
    dom.comboDisplay = document.getElementById('comboDisplay');
    dom.skinBtn = document.getElementById('skinBtn');
    dom.soundBtn = document.getElementById('soundBtn');
    dom.statsBtn = document.getElementById('statsBtn');
  }

  /* --- HANDLE SHORTCUT KEY --- */
  function handleKeydown(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      e.preventDefault();
      handleClick(null);
    }
  }

  /* --- INIT --- */
  function init() {
    cacheDom();
    resizeCanvas();
    initMatrixRain();

    loadGame();
    initUpgrades();
    calculateStats();
    applyLanguage();
    applySkin();
    renderAll();

    animId = requestAnimationFrame(rainLoop);
    gameLoopInterval = setInterval(gameLoop, 100);

    dom.hackBtn.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeydown);
    setupAutoClick();
    scheduleFirewall();

    var fwIgnore = document.getElementById('fwIgnore');
    if (fwIgnore) fwIgnore.addEventListener('click', skipFirewall);
    var fwOverlay = document.getElementById('fwOverlay');
    if (fwOverlay) {
      fwOverlay.addEventListener('click', function (e) {
        if (e.target === this) skipFirewall();
      });
    }

    if (dom.soundBtn) {
      dom.soundBtn.addEventListener('click', toggleSound);
    }
    if (dom.statsBtn) {
      dom.statsBtn.addEventListener('click', toggleStats);
    }
    var statsClose = document.getElementById('statsClose');
    if (statsClose) {
      statsClose.addEventListener('click', toggleStats);
    }
    document.getElementById('statsOverlay').addEventListener('click', function (e) {
      if (e.target === this) toggleStats();
    });
    if (dom.langToggle) {
      dom.langToggle.addEventListener('click', toggleLang);
    }
    if (dom.prestigeBtn) {
      dom.prestigeBtn.addEventListener('click', doPrestige);
    }
    if (dom.achBtn) {
      dom.achBtn.addEventListener('click', toggleAchievements);
    }
    if (dom.skinBtn) {
      dom.skinBtn.addEventListener('click', toggleSkins);
    }
    var skinClose = document.getElementById('skinClose');
    if (skinClose) {
      skinClose.addEventListener('click', toggleSkins);
    }
    document.getElementById('skinOverlay').addEventListener('click', function (e) {
      if (e.target === this) toggleSkins();
    });
    if (dom.achClose) {
      dom.achClose.addEventListener('click', toggleAchievements);
    }
    document.getElementById('achOverlay').addEventListener('click', function (e) {
      if (e.target === this) toggleAchievements();
    });

    window.addEventListener('resize', function () {
      resizeCanvas();
      initMatrixRain();
    });

    setInterval(saveGame, SAVE_INTERVAL);

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        saveGame();
      } else {
        loadGame();
        initUpgrades();
        calculateStats();
        applyLanguage();
        renderAll();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        if (confirm(t('resetConfirm'))) {
          resetGame();
          saveGame();
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
