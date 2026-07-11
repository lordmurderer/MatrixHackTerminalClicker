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
      buyModeLabel: 'COMPRAR:',
      buyMax: 'MAX',
      autoBuyOn: 'AUTO: ON',
      autoBuyOff: 'AUTO: OFF',
      achBtn: 'LOGROS',
      statsBtn: 'ESTADÍSTICAS',
      skinBtn: 'PIELES',
      prestigeShopBtn: '◆ TIENDA',
      exportBtn: '↑ EXPORT',
      importBtn: '↓ IMPORT',
      groupClick: '> CLICK_',
      groupDps: '> DPS_',
      groupSpecial: '> ESPECIAL_',
      groupMult: '> MULTIPLICADORES_',
      milestoneLabel: '{n} MB',
      upgradeCount: '{n}/{m}',
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
      prestigeReady: 'LISTO → PURGAR',
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
        evolution: { name: 'Evolución', desc: 'Adaptación genética al código' },
        transcend: { name: 'Trascender', desc: 'Ir más allá de la Matrix' },
        phantom: { name: 'Fantasma', desc: 'Ataque fantasmal indetectable' },
        overmind: { name: 'Supermente', desc: 'Inteligencia colectiva' },
        sniffer: { name: 'Sniffer de Paquetes', desc: 'Intercepta paquetes' },
        bruteforce: { name: 'Fuerza Bruta', desc: 'Rompe contraseñas' },
        ddos: { name: 'Nodo DDoS', desc: 'Ataque distribuido' },
        ghost: { name: 'Protocolo Fantasma', desc: 'Intrusión invisible' },
        codered: { name: 'Código Rojo', desc: 'Propagación de gusano' },
        neural: { name: 'Interfaz Neural', desc: 'Enlace cerebral directo' },
        worm: { name: 'Gusano Morris', desc: 'Gusano auto-replicante' },
        sentinel: { name: 'Centinela', desc: 'Vigilancia de red global' },
        apocalypse: { name: 'Apocalipsis', desc: 'Protocolo de destrucción masiva' },
        collective: { name: 'Colectivo', desc: 'Red neuronal distribuida' },
        oracle: { name: 'Oráculo', desc: 'Predicción de vectores de ataque' },
        prime: { name: 'Programa Primario', desc: 'Código fuente de la Matrix' },
        cipher: { name: 'Cifrador', desc: 'Encriptación de nivel cuántico' },
        keymaker: { name: 'Creador de Llaves', desc: 'Acceso a todas las puertas' },
      },
      shopAutoBuy: 'Compra automática de la mejora más barata',
      prestigePreviewTitle: '⚠ PURGE & BOOT',
      prestigePreviewMult: 'MULTIPLICADOR',
      prestigePreviewCurrent: 'ACTUAL',
      prestigePreviewNext: 'SIGUIENTE',
      prestigePreviewRewards: 'RECOMPENSAS',
      prestigePreviewPoints: 'PUNTOS PRESTIGE',
      prestigePreviewStart: 'DATOS INICIALES',
      prestigePreviewReset: 'SE REINICIA',
      prestigePreviewData: 'Datos actuales',
      prestigePreviewUpgrades: 'Mejoras',
      prestigePreviewKept: 'SE CONSERVA',
      prestigePreviewAch: 'Logros',
      prestigePreviewSkins: 'Skins',
      prestigePreviewShop: 'Mejoras de tienda',
      prestigePreviewCancel: 'CANCELAR',
      prestigePreviewConfirm: 'PURGAR',
      shopClickBoost: '+25% Poder de click por nivel',
      shopDpsBoost: '+25% DPS por nivel',
      shopStartData: '1K datos iniciales por nivel',
      shopComboBoost: '+0.05 multiplicador de combo por nivel',
      shopCritBoost: '+5% probabilidad crítica por nivel',
      eventLeak: '⚠ FUGA: -5% datos, +50% DPS {dur}s — ¡HAKEA para recuperar!',
      eventCrash: '📉 CRYPTO CRASH: -20% costo {dur}s',
      eventOverclock: '⚡ OVERCLOCK: Click x3 durante {dur}s',
      eventWindfall: '💰 GANANCIA INESPERADA: +10% datos',
      eventDdos: '🔥 DDoS: +100% DPS durante {dur}s',
      bossTitle: '⚠ INTRUSIÓN DE BOSS',
      bossInfo: 'GENERA {n} MB EN {t}s',
      bossFail: 'INTRUSIÓN FALLIDA',
      bossSuccess: '¡INTRUSIÓN EXITOSA! +{n} MB',
      prestigeShopTitle: 'TIENDA DE PRESTIGE',
      prestigePoints: 'PUNTOS: {n}',
      shopLevel: 'NVL {n}/{m}',
      shopCost: '{n} PP',
      shopBtnBuy: 'COMPRAR',
      shopBtnMax: 'MÁX',
      autoBuyOn: 'AUTO: ON',
      autoBuyOff: 'AUTO: OFF',
      exportOk: 'SAVE COPIADO AL PORTAPAPELES',
      importOk: 'SAVE IMPORTADO',
      importFail: 'SAVE INVÁLIDO',
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
      buyModeLabel: 'BUY:',
      buyMax: 'MAX',
      autoBuyOn: 'AUTO: ON',
      autoBuyOff: 'AUTO: OFF',
      achBtn: 'ACHIEVEMENTS',
      statsBtn: 'STATS',
      skinBtn: 'SKINS',
      prestigeShopBtn: '◆ SHOP',
      exportBtn: '↑ EXPORT',
      importBtn: '↓ IMPORT',
      groupClick: '> CLICK_',
      groupDps: '> DPS_',
      groupSpecial: '> SPECIAL_',
      groupMult: '> MULTIPLIERS_',
      milestoneLabel: '{n} MB',
      upgradeCount: '{n}/{m}',
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
      prestigeReady: 'READY → PURGE',
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
        evolution: { name: 'Evolution', desc: 'Genetic code adaptation' },
        transcend: { name: 'Transcend', desc: 'Go beyond the Matrix' },
        phantom: { name: 'Phantom', desc: 'Undetectable ghost attack' },
        overmind: { name: 'Overmind', desc: 'Collective intelligence' },
        sniffer: { name: 'Packet Sniffer', desc: 'Intercept data packets' },
        bruteforce: { name: 'Brute Force', desc: 'Crack passwords' },
        ddos: { name: 'DDoS Node', desc: 'Distributed attack' },
        ghost: { name: 'Ghost Protocol', desc: 'Invisible intrusion' },
        codered: { name: 'Code Red', desc: 'Worm propagation' },
        neural: { name: 'Neural Interface', desc: 'Direct brain link' },
        worm: { name: 'Morris Worm', desc: 'Self-replicating worm' },
        sentinel: { name: 'Sentinel', desc: 'Global network surveillance' },
        apocalypse: { name: 'Apocalypse', desc: 'Mass destruction protocol' },
        collective: { name: 'Collective', desc: 'Distributed neural network' },
        oracle: { name: 'Oracle', desc: 'Attack vector prediction' },
        prime: { name: 'Prime Program', desc: 'Source code of the Matrix' },
        cipher: { name: 'Cipher', desc: 'Quantum-level encryption' },
        keymaker: { name: 'Keymaker', desc: 'Access to all doors' },
      },
      shopAutoBuy: 'Auto-buy the cheapest upgrade',
      prestigePreviewTitle: '⚠ PURGE & BOOT',
      prestigePreviewMult: 'MULTIPLIER',
      prestigePreviewCurrent: 'CURRENT',
      prestigePreviewNext: 'NEXT',
      prestigePreviewRewards: 'REWARDS',
      prestigePreviewPoints: 'PRESTIGE POINTS',
      prestigePreviewStart: 'STARTING DATA',
      prestigePreviewReset: 'RESETS',
      prestigePreviewData: 'Current data',
      prestigePreviewUpgrades: 'Upgrades',
      prestigePreviewKept: 'PRESERVED',
      prestigePreviewAch: 'Achievements',
      prestigePreviewSkins: 'Skins',
      prestigePreviewShop: 'Shop upgrades',
      prestigePreviewCancel: 'CANCEL',
      prestigePreviewConfirm: 'PURGE',
      shopClickBoost: '+25% Click power per level',
      shopDpsBoost: '+25% DPS per level',
      shopStartData: '1K starting data per level',
      shopComboBoost: '+0.05 combo multiplier per level',
      shopCritBoost: '+5% crit chance per level',
      eventLeak: '⚠ LEAK: -5% data, +50% DPS {dur}s — HACK to recover!',
      eventCrash: '📉 CRYPTO CRASH: -20% cost {dur}s',
      eventOverclock: '⚡ OVERCLOCK: Click x3 for {dur}s',
      eventWindfall: '💰 WINDFALL: +10% data',
      eventDdos: '🔥 DDoS: +100% DPS for {dur}s',
      bossTitle: '⚠ BOSS INTRUSION',
      bossInfo: 'GENERATE {n} MB IN {t}s',
      bossFail: 'INTRUSION FAILED',
      bossSuccess: 'INTRUSION SUCCESS! +{n} MB',
      prestigeShopTitle: 'PRESTIGE SHOP',
      prestigePoints: 'POINTS: {n}',
      shopLevel: 'LVL {n}/{m}',
      shopCost: '{n} PP',
      shopBtnBuy: 'BUY',
      shopBtnMax: 'MAX',
      autoBuyOn: 'AUTO: ON',
      autoBuyOff: 'AUTO: OFF',
      exportOk: 'SAVE COPIED TO CLIPBOARD',
      importOk: 'SAVE IMPORTED',
      importFail: 'INVALID SAVE',
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
    { id: 'evolution', cost: 5000000, effect: 'mult_click', value: 1.2, icon: '+' },
    { id: 'transcend', cost: 10000000, effect: 'mult_dps', value: 1.2, icon: '=' },
    { id: 'phantom', cost: 50000000, effect: 'click', value: 1000, icon: '~' },
    { id: 'overmind', cost: 100000000, effect: 'dps', value: 500, icon: '@' },
    { id: 'sniffer', cost: 100000, effect: 'dps', value: 75, icon: '~' },
    { id: 'bruteforce', cost: 250000, effect: 'click', value: 150, icon: '!' },
    { id: 'ddos', cost: 750000, effect: 'dps', value: 500, icon: '*' },
    { id: 'ghost', cost: 2000000, effect: 'click', value: 400, icon: '?' },
    { id: 'codered', cost: 10000000, effect: 'click', value: 5000, icon: '#' },
    { id: 'neural', cost: 25000000, effect: 'dps', value: 10000, icon: '@' },
    { id: 'worm', cost: 500000000, effect: 'click', value: 500000, icon: '~' },
    { id: 'sentinel', cost: 5000000000, effect: 'dps', value: 500000, icon: '%' },
    { id: 'oracle', cost: 50000000000, effect: 'mult_click', value: 1.5, icon: '?' },
    { id: 'apocalypse', cost: 100000000000, effect: 'click', value: 100000, icon: '!' },
    { id: 'collective', cost: 500000000000, effect: 'dps', value: 50000, icon: '#' },
    { id: 'prime', cost: 1000000000000, effect: 'mult_dps', value: 1.5, icon: '$' },
    { id: 'cipher', cost: 10000000000000, effect: 'mult_click', value: 2, icon: '?' },
    { id: 'keymaker', cost: 100000000000000, effect: 'mult_dps', value: 2, icon: '$' },
  ];

  const UPGRADE_GROUPS = [
    { id: 'click', labelKey: 'groupClick', ids: ['terminal', 'scanner', 'ai', 'zeroday', 'smith', 'bruteforce', 'ghost', 'phantom', 'codered', 'worm', 'apocalypse'] },
    { id: 'dps', labelKey: 'groupDps', ids: ['cpu', 'firewall', 'botnet', 'quantum', 'source', 'sniffer', 'overmind', 'ddos', 'neural', 'sentinel', 'collective'] },
    { id: 'special', labelKey: 'groupSpecial', ids: ['critical', 'sqlinjection', 'trojan'] },
    { id: 'mult', labelKey: 'groupMult', ids: ['kernel', 'zion', 'rootkit', 'evolution', 'transcend', 'oracle', 'prime', 'cipher', 'keymaker'] },
  ];

  const MILESTONES = [100, 1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 100000000000, 10000000000000];

  const LEVEL_THRESHOLDS = [0, 100, 500, 2000, 5000, 15000, 50000, 150000, 500000, 1500000, 5000000, 50000000, 500000000];

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

  const PRESTIGE_SHOP_DEFS = [
    { id: 'autoBuy', costBase: 5, maxLevel: 1, effectLabel: '⟳ AUTO-BUY', descKey: 'shopAutoBuy' },
    { id: 'clickBoost', costBase: 2, maxLevel: 10, effectLabel: '+25% CLICK/lvl', descKey: 'shopClickBoost' },
    { id: 'dpsBoost', costBase: 2, maxLevel: 10, effectLabel: '+25% DPS/lvl', descKey: 'shopDpsBoost' },
    { id: 'startData', costBase: 3, maxLevel: 5, effectLabel: '+1K DATA START/lvl', descKey: 'shopStartData' },
    { id: 'comboBoost', costBase: 3, maxLevel: 5, effectLabel: '+0.05 COMBO/lvl', descKey: 'shopComboBoost' },
    { id: 'critBoost', costBase: 4, maxLevel: 5, effectLabel: '+5% CRIT/lvl', descKey: 'shopCritBoost' },
  ];

  const EVENT_DEFS = [
    { id: 'data_leak', dur: 30, chance: 0.25, descKey: 'eventLeak', icon: '⚠' },
    { id: 'crypto_crash', dur: 60, chance: 0.25, descKey: 'eventCrash', icon: '📉' },
    { id: 'overclock', dur: 15, chance: 0.2, descKey: 'eventOverclock', icon: '⚡' },
    { id: 'windfall', dur: 0, chance: 0.15, descKey: 'eventWindfall', icon: '💰' },
    { id: 'ddos_attack', dur: 30, chance: 0.15, descKey: 'eventDdos', icon: '🔥' },
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
    prestigePoints: 0,
    prestigeShop: {},
    buyMode: 1,
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
    state._upgradesDirty = true;
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
    var discountMult = Math.max(0.1, 1 - (state.discount || 0) / 100);
    var costMult = discountMult * getEventMultiplier().cost;
    return Math.max(1, Math.floor(base * costMult));
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

    // Prestige shop bonuses
    state.clickPower = Math.floor(state.clickPower * getShopBonus('clickBoost'));
    state.dps = Math.floor(state.dps * getShopBonus('dpsBoost') * 10) / 10;
    crit += getShopBonus('critBoost');

    // Event multipliers
    var evtMult = getEventMultiplier();
    state.clickPower = Math.floor(state.clickPower * evtMult.click);
    state.dps = Math.floor(state.dps * evtMult.dps * 10) / 10;

    state.critChance = crit + achCrit;
    state.discount = disc + achDiscount;
    state.level = getLevel();
    if (state.level > lastLevel) {
      playSound('levelup');
      showToast(t('level', { n: state.level }), 'info');
    }
    lastLevel = state.level;
  }

  function buyUpgrade(id, count) {
    var def = UPGRADE_DEFS.find(function (u) { return u.id === id; });
    if (!def) return;
    if (count == null) count = state.buyMode === 'max' ? 999 : state.buyMode;
    var bought = 0;
    for (var i = 0; i < count; i++) {
      var currentLevel = state.upgrades[id] || 0;
      var cost = getUpgradeCost(def, currentLevel);
      if (state.data < cost) break;
      state.data -= cost;
      state.upgrades[id] = currentLevel + 1;
      bought++;
    }
    if (bought === 0) return;
    playSound('buy');
    calculateStats();
    state._upgradesDirty = true;
    renderAll();
  }

  function tryBuyCheapest() {
    var best = null;
    var bestCost = Infinity;
    UPGRADE_DEFS.forEach(function (u) {
      var lvl = state.upgrades[u.id] || 0;
      var cost = getUpgradeCost(u, lvl);
      if (state.data >= cost && cost < bestCost) {
        best = u;
        bestCost = cost;
      }
    });
    if (best) buyUpgrade(best.id, 1);
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
        if (dom.comboDisplay) {
          dom.comboDisplay.classList.add('comboBreak');
          setTimeout(function () {
            dom.comboDisplay.style.display = 'none';
            dom.comboDisplay.classList.remove('comboBreak');
          }, 300);
        }
      }, 1000);
      var comboAdd = getShopBonus('comboBoost');
      var comboMult = 1 + state.combo * (0.1 + comboAdd);
      gained = Math.floor(gained * comboMult);
    }

    if (!isAuto && state.critChance > 0 && Math.random() * 100 < state.critChance) {
      gained *= 3;
      state.totalCrits++;
      playSound('crit');
      spawnFloatingCrit(x, y - 30, t('critText'));
      dom.hackBtn.animate([
        { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)' },
        { opacity: 0.2, boxShadow: '0 0 30px rgba(0,255,0,0.6)', offset: 0.25 },
        { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)', offset: 0.5 },
        { opacity: 0.3, boxShadow: '0 0 20px rgba(0,255,0,0.4)', offset: 0.75 },
        { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)' }
      ], { duration: 150, easing: 'ease' });
    } else if (!isAuto) {
      playSound('click');
      dom.hackBtn.animate([
        { opacity: 1 },
        { opacity: 0.2, offset: 0.25 },
        { opacity: 1, offset: 0.5 },
        { opacity: 0.3, offset: 0.75 },
        { opacity: 1 }
      ], { duration: 150, easing: 'ease' });
    }

    state.data += gained;
    state.totalDataEarned += gained;
    state.totalClicks++;
    calculateStats();
    renderAll();

    var prefix = isAuto ? t('autoPrefix') + ' ' : '';
    spawnFloatingText(x, y, prefix + '+' + formatNum(gained) + ' ' + t('mb'));
  }

  function handleClick(e) {
    doClick(e, false);
  }

  function getPooledElement(className) {
    for (var i = 0; i < textPool.length; i++) {
      if (!textPool[i].parentNode && textPool[i].className === className) {
        textPool[i].style.opacity = '';
        textPool[i].style.transform = '';
        return textPool[i];
      }
    }
    if (textPool.length < textPoolMax) {
      var el = document.createElement('div');
      textPool.push(el);
      return el;
    }
    return null;
  }

  function spawnFloatingText(x, y, text) {
    var el = getPooledElement('floatingText');
    if (!el) {
      el = document.createElement('div');
      el.className = 'floatingText';
    }
    el.className = 'floatingText';
    el.textContent = text;
    el.style.left = (x - 30) + 'px';
    el.style.top = (y - 10) + 'px';
    el.classList.remove('floatingCrit');
    floatingContainer.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  function spawnFloatingCrit(x, y, text) {
    var el = getPooledElement('floatingCrit');
    if (!el) {
      el = document.createElement('div');
    }
    el.className = 'floatingCrit';
    el.textContent = text;
    el.style.left = (x - 50) + 'px';
    el.style.top = (y - 20) + 'px';
    floatingContainer.appendChild(el);
    el.addEventListener('animationend', function () { el.remove(); });
  }

  /* --- TOAST --- */
  function showToast(message, type) {
    var container = document.getElementById('toastContainer');
    if (!container) return;
    var el = document.createElement('div');
    el.className = 'toast' + (type ? ' toast-' + type : '');
    el.textContent = message;
    container.appendChild(el);
    setTimeout(function () {
      el.classList.add('toast-out');
      setTimeout(function () { el.remove(); }, 300);
    }, 3000);
  }

  /* --- TOOLTIP --- */
  var tooltipEl = null;
  var tooltipTimeout = null;

  function showTooltip(e, content) {
    var tt = document.getElementById('tooltip');
    if (!tt) return;
    tooltipEl = tt;
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    tt.innerHTML = content;
    tt.style.display = 'block';
    positionTooltip(e, tt);
    requestAnimationFrame(function () { tt.classList.add('visible'); });
  }

  function positionTooltip(e, tt) {
    var pad = 10;
    var x = e.clientX + pad;
    var y = e.clientY + pad;
    var w = tt.offsetWidth;
    var h = tt.offsetHeight;
    if (x + w > window.innerWidth - pad) x = e.clientX - w - pad;
    if (y + h > window.innerHeight - pad) y = e.clientY - h - pad;
    if (x < pad) x = pad;
    if (y < pad) y = pad;
    tt.style.left = x + 'px';
    tt.style.top = y + 'px';
  }

  function hideTooltip() {
    if (tooltipTimeout) clearTimeout(tooltipTimeout);
    tooltipTimeout = setTimeout(function () {
      var tt = document.getElementById('tooltip');
      if (tt) {
        tt.classList.remove('visible');
        tt.style.display = 'none';
      }
    }, 50);
  }

  /* --- RENDER --- */
  function renderAll() {
    var dataFloor = Math.floor(state.data);
    dom.dataAmount.textContent = formatNum(dataFloor);
    dom.clickPower.textContent = formatNum(state.clickPower);
    dom.dpsValue.textContent = formatNum(state.dps);
    dom.critDisplay.textContent = state.critChance;
    dom.discountDisplay.textContent = state.discount;
    dom.playerLevel.textContent = t('level', { n: state.level });

    // Event buff glow on relevant stats
    var evtMult = getEventMultiplier();
    var statEls = document.querySelectorAll('#stats .stat');
    if (statEls.length >= 2) {
      statEls[0].classList.toggle('event-active', evtMult.click > 1);
      statEls[1].classList.toggle('event-active', evtMult.dps > 1);
      statEls[3].classList.toggle('event-active', evtMult.cost < 1);
    }

    var nextThreshold = LEVEL_THRESHOLDS[state.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
    var prevThreshold = LEVEL_THRESHOLDS[state.level - 1] || 0;
    var progress = (state.data - prevThreshold) / (nextThreshold - prevThreshold);
    dom.dataBarInner.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';

    // Milestones
    var nextMilestone = null;
    for (var i = 0; i < MILESTONES.length; i++) {
      if (dataFloor < MILESTONES[i]) {
        nextMilestone = MILESTONES[i];
        break;
      }
    }
    var milestoneText = '';
    if (nextMilestone) {
      milestoneText = t('milestoneLabel', { n: formatNum(nextMilestone) });
    } else {
      milestoneText = '∞';
    }
    if (dom.milestoneInfo) dom.milestoneInfo.textContent = '>> ' + milestoneText;

    // Milestone markers on bar
    if (dom.milestoneMarkers) {
      dom.milestoneMarkers.innerHTML = '';
      var barWidth = dom.dataBarOuter ? dom.dataBarOuter.offsetWidth : 300;
      for (var i = 0; i < MILESTONES.length; i++) {
        var m = MILESTONES[i];
        var prev = 0;
        var nextM = nextThreshold;
        for (var j = 0; j < LEVEL_THRESHOLDS.length - 1; j++) {
          if (m >= LEVEL_THRESHOLDS[j] && m < LEVEL_THRESHOLDS[j + 1]) {
            prev = LEVEL_THRESHOLDS[j];
            nextM = LEVEL_THRESHOLDS[j + 1];
            break;
          }
        }
        if (m < prevThreshold || m > nextThreshold) continue;
        var pct = ((m - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
        if (pct < 0 || pct > 100) continue;
        var marker = document.createElement('div');
        marker.className = 'milestoneMarker' + (dataFloor >= m ? ' reached' : '');
        marker.style.left = pct + '%';
        dom.milestoneMarkers.appendChild(marker);
      }
    }

    // Header extras
    if (dom.headerPrestige) {
      dom.headerPrestige.textContent = state.prestigeCount > 0
        ? 'x' + Number(state.prestigeMultiplier).toFixed(1)
        : '';
    }
    if (dom.headerTime) {
      dom.headerTime.textContent = formatTime(Math.floor(state.playTime));
    }

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
      dom.prestigeReq.textContent = t('prestigeReq', { n: formatNum(req), p: progress });
      if (dom.prestigeBtn) {
        var ready = state.totalDataEarned >= req;
        dom.prestigeBtn.disabled = !ready;
        dom.prestigeBtn.classList.toggle('ready', ready);
        dom.prestigeBtn.style.display = state.prestigeCount > 0 || state.totalDataEarned >= req * 0.3 ? 'inline-flex' : 'none';
        var btnSpan = dom.prestigeBtn.querySelector('span');
        if (btnSpan) btnSpan.textContent = ready ? t('prestigeReady') : t('prestigeBtn');
      }
      var bar = document.getElementById('prestigeProgressInner');
      if (bar) {
        bar.style.width = progress + '%';
        bar.classList.toggle('ready', ready);
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

    var autoIndicator = document.getElementById('autoBuyIndicator');
    if (autoIndicator) autoIndicator.classList.toggle('active', (state.prestigeShop['autoBuy'] || 0) >= 1);

    if (state._upgradesDirty) {
      renderUpgrades();
      state._upgradesDirty = false;
    } else {
      refreshUpgradeState();
    }
    if (document.getElementById('achOverlay').classList.contains('open')) {
      renderAchievements();
    }
  }

  function getEffectText(u, owned) {
    switch (u.effect) {
      case 'click': return t('effectClick', { n: u.value * owned });
      case 'dps': return t('effectDps', { n: u.value * owned });
      case 'crit': return t('effectCrit', { n: u.value * owned });
      case 'discount': return t('effectDiscount', { n: u.value * owned });
      case 'autoclick': return t('effectAutoclick', { n: owned });
      case 'mult_click': return t('effectMultClick', { n: Number(Math.pow(u.value, owned)).toFixed(2) });
      case 'mult_dps': return t('effectMultDps', { n: Number(Math.pow(u.value, owned)).toFixed(2) });
      case 'offline': return t('effectOffline', { n: u.value * owned });
    }
    return '';
  }

  function buildUpgradeTooltipHTML(u, owned, cost) {
    var nextEffect = getEffectText(u, owned + 1);
    var curEffect = owned > 0 ? getEffectText(u, owned) : t('upgrade.' + u.id + '.desc');
    var html = '<div class="tooltipTitle">' + t('upgrade.' + u.id + '.name') + '</div>';
    html += '<div class="tooltipDesc">' + t('upgrade.' + u.id + '.desc') + '</div>';
    html += '<div class="tooltipRow"><span>' + t('cardLvl') + '</span><span class="tooltipVal">' + owned + '</span></div>';
    if (owned > 0) {
      html += '<div class="tooltipRow"><span>NOW</span><span class="tooltipVal">' + curEffect + '</span></div>';
    }
    html += '<div class="tooltipRow"><span>NEXT</span><span class="tooltipVal">' + nextEffect + '</span></div>';
    html += '<div class="tooltipRow"><span>COST</span><span class="tooltipVal">' + formatNum(cost) + ' ' + t('mb') + '</span></div>';
    return html;
  }

  function renderUpgrades() {
    dom.upgradesGrid.innerHTML = '';
    var totalOwned = 0;
    var totalDefs = UPGRADE_DEFS.length;

    UPGRADE_GROUPS.forEach(function (group) {
      var groupDefs = UPGRADE_DEFS.filter(function (u) { return group.ids.indexOf(u.id) !== -1; });
      if (groupDefs.length === 0) return;

      var header = document.createElement('div');
      header.className = 'upgradeGroupHeader';
      header.textContent = t(group.labelKey);
      dom.upgradesGrid.appendChild(header);

      groupDefs.forEach(function (u) {
        var owned = state.upgrades[u.id] || 0;
        totalOwned += owned;
        var cost = getUpgradeCost(u, owned);
        var card = document.createElement('div');
        card.className = 'upgradeCard';
        card.dataset.upgradeId = u.id;
        if (owned === 0) card.classList.add('unowned');
        if (owned > 0) card.classList.add('bought');
        if (state.data < cost) card.classList.add('locked');

        var headerRow = document.createElement('div');
        headerRow.className = 'upgradeHeader';

        var iconSpan = document.createElement('span');
        iconSpan.className = 'upgradeIcon effect-' + u.effect;
        iconSpan.textContent = u.icon;

        var nameSpan = document.createElement('span');
        nameSpan.className = 'upgradeNameText';
        nameSpan.textContent = t('upgrade.' + u.id + '.name');

        headerRow.appendChild(iconSpan);
        headerRow.appendChild(nameSpan);

        var descRow = document.createElement('div');
        descRow.className = 'upgradeDesc';
        descRow.textContent = t('upgrade.' + u.id + '.desc');

        var costRow = document.createElement('div');
        costRow.className = 'upgradeCost';
        costRow.textContent = formatNum(cost) + ' ' + t('mb');

        var ownedRow = document.createElement('div');
        ownedRow.className = 'upgradeOwned';
        var nextText = (u.maxLevel > 1 && owned < u.maxLevel) ? ' → ' + getEffectText(u, owned + 1) : '';
        ownedRow.textContent = t('cardLvl') + ' ' + owned + ' (' + getEffectText(u, owned) + ')' + nextText;

        card.appendChild(headerRow);
        card.appendChild(descRow);
        card.appendChild(costRow);
        card.appendChild(ownedRow);

        card.addEventListener('click', function () {
          buyUpgrade(u.id);
        });

        // Tooltip on hover (skip on touch/hover-less devices — card already shows all info)
        if (window.matchMedia('(hover: hover)').matches) {
          card.addEventListener('mouseenter', function (e) {
            showTooltip(e, buildUpgradeTooltipHTML(u, owned, cost));
          });
          card.addEventListener('mousemove', function (e) {
            var tt = document.getElementById('tooltip');
            if (tt && tt.style.display === 'block') positionTooltip(e, tt);
          });
          card.addEventListener('mouseleave', hideTooltip);
        }

        dom.upgradesGrid.appendChild(card);
      });
    });

    if (dom.upgradeCount) {
      dom.upgradeCount.textContent = t('upgradeCount', { n: totalOwned, m: totalDefs });
    }
  }

  function refreshUpgradeState() {
    var cards = dom.upgradesGrid.querySelectorAll('.upgradeCard');
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var id = card.dataset.upgradeId;
      if (!id) continue;
      var def = UPGRADE_DEFS.find(function (u) { return u.id === id; });
      if (!def) continue;
      var owned = state.upgrades[id] || 0;
      var cost = getUpgradeCost(def, owned);
      var costEl = card.querySelector('.upgradeCost');
      if (costEl) costEl.textContent = formatNum(cost) + ' ' + t('mb');
      card.classList.toggle('locked', state.data < cost);
    }
  }

  /* --- PRESTIGE --- */
  function getPrestigeReq() {
    return 500000 * (state.prestigeCount + 1);
  }

  function showPrestigePreview() {
    var req = getPrestigeReq();
    if (state.totalDataEarned < req) return;
    var overlay = document.getElementById('prestigePreviewOverlay');
    if (!overlay) return;
    document.getElementById('previewMultCurrent').textContent = 'x' + Number(state.prestigeMultiplier).toFixed(1);
    document.getElementById('previewMultNext').textContent = 'x' + Number(state.prestigeMultiplier * 1.5).toFixed(1);
    document.getElementById('previewPoints').textContent = '+' + 1;
    var startData = Math.floor(getShopBonus('startData'));
    document.getElementById('previewStartData').textContent = formatNum(startData) + ' MB';
    overlay.classList.add('open');
  }

  function executePrestige() {
    document.getElementById('prestigePreviewOverlay').classList.remove('open');
    var glitch = document.getElementById('glitchOverlay');
    glitch.classList.add('active');
    document.body.classList.add('shake');

    playSound('crit');

    setTimeout(function () {
      state.prestigeMultiplier *= 1.5;
      state.prestigeCount++;
      state.prestigePoints = (state.prestigePoints || 0) + 1;
      state.data = Math.floor(getShopBonus('startData'));
      state.upgrades = {};
      initUpgrades();
      if (autoClickInterval) clearInterval(autoClickInterval);
      calculateStats();
      state._upgradesDirty = true;
      renderAll();
      setupAutoClick();
      setupAutoBuy();
      saveGame();

      glitch.classList.remove('active');
      document.body.classList.remove('shake');

      playSound('levelup');
      showToast(t('prestigeLabel', { n: Number(state.prestigeMultiplier).toFixed(1) }), 'info');
    }, 1600);
  }

  function doPrestige() {
    showPrestigePreview();
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
      var achSpan = dom.achBtn.querySelector('span');
      if (achSpan) achSpan.textContent = t('achTitle', { n: count });
      else dom.achBtn.textContent = t('achTitle', { n: count });
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
        showToast(t('achUnlocked', { name: t(nameKey) }), 'ach');
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
        statusRow.textContent = formatNum(s.cost) + ' ' + t('mb');
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
      } else if (type === 'event') {
        [440, 554, 440].forEach(function (freq, idx) {
          var o = actx.createOscillator();
          var g = actx.createGain();
          o.type = 'sine';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.07, actx.currentTime + idx * 0.08);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.08 + 0.1);
          o.connect(g);
          g.connect(actx.destination);
          o.start(actx.currentTime + idx * 0.08);
          o.stop(actx.currentTime + idx * 0.08 + 0.1);
        });
      } else if (type === 'event_bad') {
        var osc4 = actx.createOscillator();
        var gain4 = actx.createGain();
        osc4.type = 'sawtooth';
        osc4.frequency.setValueAtTime(300, actx.currentTime);
        osc4.frequency.exponentialRampToValueAtTime(100, actx.currentTime + 0.3);
        gain4.gain.setValueAtTime(0.1, actx.currentTime);
        gain4.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + 0.3);
        osc4.connect(gain4);
        gain4.connect(actx.destination);
        osc4.start();
        osc4.stop(actx.currentTime + 0.3);
      } else if (type === 'boss_start') {
        [220, 330, 440, 550].forEach(function (freq, idx) {
          var o = actx.createOscillator();
          var g = actx.createGain();
          o.type = 'square';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.06, actx.currentTime + idx * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.12 + 0.15);
          o.connect(g);
          g.connect(actx.destination);
          o.start(actx.currentTime + idx * 0.12);
          o.stop(actx.currentTime + idx * 0.12 + 0.15);
        });
      } else if (type === 'boss_end') {
        [550, 440, 330].forEach(function (freq, idx) {
          var o = actx.createOscillator();
          var g = actx.createGain();
          o.type = 'sawtooth';
          o.frequency.value = freq;
          g.gain.setValueAtTime(0.05, actx.currentTime + idx * 0.12);
          g.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + idx * 0.12 + 0.15);
          o.connect(g);
          g.connect(actx.destination);
          o.start(actx.currentTime + idx * 0.12);
          o.stop(actx.currentTime + idx * 0.12 + 0.15);
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
    var combAdd = getShopBonus('comboBoost');
    var rows = [
      { label: t('statTime'), value: formatTime(Math.floor(state.playTime)) },
      { label: t('statClicks'), value: formatNum(state.totalClicks) },
      { label: t('statDataEarned'), value: formatNum(state.totalDataEarned) + ' MB' },
      { label: t('statClickPower'), value: formatNum(state.clickPower) + ' MB' },
      { label: t('statDps'), value: formatNum(state.dps) + ' MB/s' },
      { label: t('statCritChance'), value: state.critChance + '%' },
      { label: t('statCrits'), value: formatNum(state.totalCrits || 0) },
      { label: t('statUpgrades'), value: formatNum(getTotalUpgradeLevels()) },
      { label: t('statPrestige'), value: state.prestigeCount + ' (x' + Number(state.prestigeMultiplier).toFixed(1) + ')' },
      { label: t('statCombo'), value: state.combo + ' (' + Number(1 + state.combo * (0.1 + combAdd)).toFixed(1) + 'x)' },
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

  /* --- EVENTS --- */
  var eventScheduleTimeout = null;

  function scheduleEvent() {
    if (eventScheduleTimeout) clearTimeout(eventScheduleTimeout);
    var delay = 45000 + Math.random() * 45000;
    eventScheduleTimeout = setTimeout(startRandomEvent, delay);
  }

  function startRandomEvent() {
    if (state.bossActive || state.firewallActive) { scheduleEvent(); return; }
    var roll = Math.random();
    var cum = 0;
    for (var i = 0; i < EVENT_DEFS.length; i++) {
      cum += EVENT_DEFS[i].chance;
      if (roll < cum) { applyEvent(EVENT_DEFS[i]); return; }
    }
    scheduleEvent();
  }

  var eventTickInterval = null;

  function clearEventTick() {
    if (eventTickInterval) { clearInterval(eventTickInterval); eventTickInterval = null; }
  }

  function updateEventDisplay() {
    var el = document.getElementById('eventDisplay');
    if (!el) return;
    if (!state.eventActive) { el.classList.remove('open'); clearEventTick(); return; }
    var dur = state.eventTimer;
    if (dur != null && dur > 0) {
      document.getElementById('eventTimer').textContent = dur + 's';
    }
  }

  function applyEvent(evt) {
    var el = document.getElementById('eventDisplay');
    if (!el) return;
    clearEventTick();
    if (evt.id === 'windfall') {
      var bonus = Math.floor(state.data * 0.1);
      if (bonus < 1) return;
      state.data += bonus;
      state.totalDataEarned += bonus;
      playSound('event');
      showToast(t('eventWindfall') + ' +' + formatNum(bonus), 'info');
      document.getElementById('eventIcon').textContent = evt.icon;
      document.getElementById('eventText').textContent = t('eventWindfall') + ' +' + formatNum(bonus);
      document.getElementById('eventTimer').textContent = '';
      el.className = 'open event-info';
      setTimeout(function () { el.classList.remove('open'); }, 3000);
      renderAll();
      scheduleEvent();
      return;
    }
    state.eventActive = evt.id;
    state.eventTimer = evt.dur;
    if (evt.id === 'data_leak') {
      var penalty = Math.floor(state.data * 0.05);
      state.data = Math.max(0, state.data - penalty);
      showToast('-' + formatNum(penalty) + ' ' + t('mb') + ' | ' + t('eventLeak', { dur: evt.dur }), 'warn');
    } else {
      showToast(t(evt.descKey, { dur: evt.dur }), 'info');
    }
    playSound(evt.id === 'data_leak' ? 'event_bad' : 'event');
    document.getElementById('eventIcon').textContent = evt.icon;
    document.getElementById('eventText').textContent = t(evt.descKey, { dur: evt.dur });
    document.getElementById('eventTimer').textContent = evt.dur + 's';
    el.className = 'open ' + (evt.id === 'data_leak' ? 'event-warn' : 'event-buff');
    calculateStats();
    renderAll();
    scheduleEvent();
    eventTickInterval = setInterval(function () {
      if (!state.eventActive) { clearEventTick(); return; }
      if (state.eventTimer != null) {
        state.eventTimer--;
        if (state.eventTimer <= 0) {
          state.eventActive = null;
          state.eventTimer = null;
          el.classList.remove('open');
          clearEventTick();
          calculateStats();
          renderAll();
          return;
        }
        document.getElementById('eventTimer').textContent = state.eventTimer + 's';
      }
    }, 1000);
  }

  function getEventMultiplier() {
    if (!state.eventActive) return { click: 1, dps: 1, cost: 1 };
    var m = { click: 1, dps: 1, cost: 1 };
    if (state.eventActive === 'overclock') m.click = 3;
    if (state.eventActive === 'ddos_attack') m.dps = 2;
    if (state.eventActive === 'crypto_crash') m.cost = 0.8;
    if (state.eventActive === 'data_leak') m.dps = 1.5;
    return m;
  }

  /* --- BOSS BATTLES --- */
  var bossScheduleTimeout = null;
  var bossInterval = null;

  function scheduleBoss() {
    if (bossScheduleTimeout) clearTimeout(bossScheduleTimeout);
    if (state.dps < 1) { bossScheduleTimeout = setTimeout(scheduleBoss, 10000); return; }
    var delay = 120000 + Math.random() * 60000;
    bossScheduleTimeout = setTimeout(startBoss, delay);
  }

  function startBoss() {
    if (state.bossActive || state.firewallActive || state.eventActive) { scheduleBoss(); return; }
    state.bossActive = true;
    state.bossData = 0;
    var timeLimit = Math.max(5, 15 - Math.floor(state.level / 5));
    state.bossThreshold = Math.floor(state.dps * timeLimit * (1 + state.level * 0.15));
    playSound('boss_start');
    var overlay = document.getElementById('bossOverlay');
    overlay.classList.add('open');
    document.getElementById('bossInfo').textContent = t('bossInfo', { n: formatNum(state.bossThreshold), t: timeLimit + 's' });
    document.getElementById('bossBarInner').style.width = '0%';
    document.getElementById('bossReward').textContent = '';
    var remaining = timeLimit;
    document.getElementById('bossTimer').textContent = remaining + 's';
    if (bossInterval) clearInterval(bossInterval);
    bossInterval = setInterval(function () {
      remaining--;
      if (remaining <= 0) {
        endBoss(false);
        return;
      }
      document.getElementById('bossTimer').textContent = remaining + 's';
    }, 1000);
  }

  function endBoss(success) {
    state.bossActive = false;
    if (bossInterval) { clearInterval(bossInterval); bossInterval = null; }
    var reward = document.getElementById('bossReward');
    if (success) {
      var bonus = Math.floor(state.bossThreshold * 0.5);
      state.data += bonus;
      state.totalDataEarned += bonus;
      reward.textContent = t('bossSuccess', { n: formatNum(bonus) });
      reward.style.color = '#00ff00';
      playSound('levelup');
      showToast(t('bossSuccess', { n: formatNum(bonus) }), 'info');
    } else {
      reward.textContent = t('bossFail');
      reward.style.color = '#ff0044';
      playSound('boss_end');
    }
    calculateStats();
    renderAll();
    setTimeout(function () {
      document.getElementById('bossOverlay').classList.remove('open');
      scheduleBoss();
    }, 2000);
  }

  /* --- PRESTIGE SHOP --- */
  function getShopCost(def) {
    var lvl = state.prestigeShop[def.id] || 0;
    return def.costBase * (lvl + 1);
  }

  function buyShopItem(id) {
    var def = PRESTIGE_SHOP_DEFS.find(function (d) { return d.id === id; });
    if (!def) return;
    var lvl = state.prestigeShop[id] || 0;
    if (lvl >= def.maxLevel) return;
    var cost = getShopCost(def);
    if ((state.prestigePoints || 0) < cost) return;
    state.prestigePoints -= cost;
    state.prestigeShop[id] = lvl + 1;
    if (id === 'autoBuy') setupAutoBuy();
    saveGame();
    renderPrestigeShop();
  }

  function getShopBonus(id) {
    var lvl = state.prestigeShop[id] || 0;
    switch (id) {
      case 'clickBoost': return 1 + lvl * 0.25;
      case 'dpsBoost': return 1 + lvl * 0.25;
      case 'startData': return lvl * 1000;
      case 'comboBoost': return lvl * 0.05;
      case 'critBoost': return lvl * 5;
    }
    return 0;
  }

  // apply shop bonuses in calculateStats
  // clickBoost and dpsBoost are applied multiplicatively
  // startData is applied on prestige
  // comboBoost applied in doClick
  // critBoost applied in calculateStats

  function togglePrestigeShop() {
    var overlay = document.getElementById('prestigeShopOverlay');
    overlay.classList.toggle('open');
    if (overlay.classList.contains('open')) renderPrestigeShop();
  }

  function renderPrestigeShop() {
    var grid = document.getElementById('prestigeShopGrid');
    if (!grid) return;
    grid.innerHTML = '';
    document.getElementById('prestigePointsDisplay').textContent = t('prestigePoints', { n: state.prestigePoints || 0 });
    PRESTIGE_SHOP_DEFS.forEach(function (def) {
      var lvl = state.prestigeShop[def.id] || 0;
      var maxed = lvl >= def.maxLevel;
      var cost = getShopCost(def);
      var card = document.createElement('div');
      card.className = 'shopCard' + (maxed ? ' bought' : '');
      var info = document.createElement('div');
      info.className = 'shopCardInfo';
      var name = document.createElement('div');
      name.className = 'shopCardName';
      name.textContent = def.effectLabel;
      var desc = document.createElement('div');
      desc.className = 'shopCardDesc';
      desc.textContent = t(def.descKey);
      var lvlRow = document.createElement('div');
      lvlRow.className = 'shopCardLevel';
      lvlRow.textContent = t('shopLevel', { n: lvl, m: def.maxLevel });
      info.appendChild(name);
      info.appendChild(desc);
      info.appendChild(lvlRow);
      var costSpan = document.createElement('div');
      costSpan.className = 'shopCardCost';
      costSpan.textContent = maxed ? 'MAX' : t('shopCost', { n: cost });
      card.appendChild(info);
      card.appendChild(costSpan);
      if (!maxed) {
        card.addEventListener('click', function () { buyShopItem(def.id); });
      }
      grid.appendChild(card);
    });
  }

  /* --- EXPORT / IMPORT --- */
  function exportSave() {
    try {
      state.lastSaveTime = Date.now();
      var json = JSON.stringify(state);
      var b64 = btoa(unescape(encodeURIComponent(json)));
      if (navigator.clipboard) {
        navigator.clipboard.writeText(b64).then(function () {
          showToast(t('exportOk'), 'info');
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = b64;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(t('exportOk'), 'info');
      }
    } catch (e) { showToast(t('importFail'), 'warn'); }
  }

  function importSave() {
    try {
      var code = prompt('Paste save code:');
      if (!code) return;
      var json = decodeURIComponent(escape(atob(code.trim())));
      var saved = JSON.parse(json);
      if (!saved.upgrades) throw new Error('invalid');
      state = Object.assign(state, saved);
      if (!state.upgrades) state.upgrades = {};
      if (!state.achievements) state.achievements = {};
      if (!state.ownedSkins) state.ownedSkins = [];
      if (!state.prestigeShop) state.prestigeShop = {};
      state.bossActive = false;
      state.firewallActive = false;
      state.eventActive = null;
      calculateStats();
      state._upgradesDirty = true;
      renderAll();
      saveGame();
      showToast(t('importOk'), 'info');
    } catch (e) { showToast(t('importFail'), 'warn'); }
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
    timerBar.style.width = '';
    timerBar.style.transition = 'none';
    timerBar.style.background = '#00ff00';
    timerBar.style.boxShadow = '0 0 6px #00ff00';

    document.getElementById('fwTimeLimit').textContent = timeLimit + 's';
    document.getElementById('fwStep').textContent = '1/' + nodeCount;
    document.getElementById('fwResult').style.display = 'none';

    overlay.classList.add('open');

    timerBar.animate([
      { width: '100%', background: '#00ff00', boxShadow: '0 0 6px #00ff00' },
      { background: '#88ff00', offset: 0.3 },
      { background: '#ffcc00', offset: 0.6 },
      { width: '50%', background: '#ff8800', offset: 0.7 },
      { width: '20%', background: '#ff4400', offset: 0.9 },
      { width: '0%', background: '#ff0000', boxShadow: '0 0 6px #ff0000' }
    ], { duration: timeLimit * 1000, easing: 'linear', fill: 'forwards' });

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
      result.textContent = t('fwSuccess', { n: formatNum(bonus) });
      result.className = 'fwResult success';
      playSound('levelup');
      calculateStats();
      renderAll();
      showToast(t('fwSuccess', { n: formatNum(bonus) }), 'info');
    } else {
      result.textContent = t('fwFail');
      result.className = 'fwResult fail';
      showToast(t('fwFail'), 'warn');
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

  /* --- AUTO-BUY (prestige shop) --- */
  var autoBuyInterval = null;

  function setupAutoBuy() {
    if (autoBuyInterval) clearInterval(autoBuyInterval);
    var active = (state.prestigeShop['autoBuy'] || 0) >= 1;
    var indicator = document.getElementById('autoBuyIndicator');
    if (indicator) indicator.classList.toggle('active', active);
    if (active) {
      autoBuyInterval = setInterval(function () {
        tryBuyCheapest();
      }, 500);
    }
  }

  /* --- GAME LOOP --- */
  function gameLoop() {
    if (state.dps > 0) {
      var gain = state.dps / 10;
      state.data += gain;
      state.totalDataEarned += gain;
      if (state.bossActive) {
        state.bossData += gain;
        var pct = Math.min(100, (state.bossData / state.bossThreshold) * 100);
        var bar = document.getElementById('bossBarInner');
        if (bar) bar.style.width = pct + '%';
        if (state.bossData >= state.bossThreshold) endBoss(true);
      }
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
        if (!state.prestigeShop) state.prestigeShop = {};
        if (state.prestigePoints == null) state.prestigePoints = 0;
        if (state.autoBuy == null) state.autoBuy = false;
        if (state.buyMode == null) state.buyMode = 1;
        calculateStats();

        var rootkitLevel = state.upgrades['rootkit'] || 0;
        if (rootkitLevel > 0 && state.lastSaveTime && state.dps > 0) {
          var elapsed = (Date.now() - state.lastSaveTime) / 1000;
          var offlineData = Math.floor(state.dps * elapsed * rootkitLevel * 0.15);
          if (offlineData > 0) {
            playSound('offline');
            state.data += offlineData;
            showToast(t('offline', { n: formatNum(offlineData) }) + t('offlineExtra'), 'info');
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
    if (bossScheduleTimeout) clearTimeout(bossScheduleTimeout);
    if (eventScheduleTimeout) clearTimeout(eventScheduleTimeout);
    state.firewallActive = false;
    state.bossActive = false;
    state.eventActive = null;
    var savedLang = state.lang;
    var savedPrestigeMult = state.prestigeMultiplier;
    var savedPrestigeCount = state.prestigeCount;
    var savedAchievements = Object.assign({}, state.achievements);
    var savedSkins = state.ownedSkins.slice();
    var savedActiveSkin = state.activeSkin;
    var savedPrestigeShop = Object.assign({}, state.prestigeShop);
    var savedPrestigePoints = state.prestigePoints || 0;
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
      prestigePoints: savedPrestigePoints,
      prestigeShop: savedPrestigeShop,
      buyMode: 1,
    };
    initUpgrades();
    calculateStats();
    state._upgradesDirty = true;
    renderAll();
    setupAutoClick();
    setupAutoBuy();
    scheduleFirewall();
    scheduleEvent();
    scheduleBoss();
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
    dom.dataBarOuter = document.getElementById('dataBarOuter');
    dom.milestoneMarkers = document.getElementById('milestoneMarkers');
    dom.milestoneInfo = document.getElementById('milestoneInfo');
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
    dom.headerPrestige = document.getElementById('headerPrestige');
    dom.headerTime = document.getElementById('headerTime');
    dom.upgradeCount = document.getElementById('upgradeCount');
    dom.prestigeShopBtn = document.getElementById('prestigeShopBtn');
    dom.exportBtn = document.getElementById('exportBtn');
    dom.importBtn = document.getElementById('importBtn');
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

    // Buy mode buttons
    document.querySelectorAll('.buyModeBtn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.buyModeBtn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        state.buyMode = btn.getAttribute('data-mode');
        if (state.buyMode === 'max') state.buyMode = 'max';
        else state.buyMode = parseInt(btn.getAttribute('data-mode'));
      });
    });

    // Prestige preview
    document.getElementById('prestigePreviewConfirm').addEventListener('click', executePrestige);
    document.getElementById('prestigePreviewCancel').addEventListener('click', function () {
      document.getElementById('prestigePreviewOverlay').classList.remove('open');
    });
    document.getElementById('prestigePreviewClose').addEventListener('click', function () {
      document.getElementById('prestigePreviewOverlay').classList.remove('open');
    });
    document.getElementById('prestigePreviewOverlay').addEventListener('click', function (e) {
      if (e.target === this) this.classList.remove('open');
    });

    // Prestige shop
    if (dom.prestigeShopBtn) {
      dom.prestigeShopBtn.addEventListener('click', togglePrestigeShop);
    }
    var prestigeShopClose = document.getElementById('prestigeShopClose');
    if (prestigeShopClose) {
      prestigeShopClose.addEventListener('click', togglePrestigeShop);
    }
    document.getElementById('prestigeShopOverlay').addEventListener('click', function (e) {
      if (e.target === this) togglePrestigeShop();
    });

    // Export / Import
    if (dom.exportBtn) {
      dom.exportBtn.addEventListener('click', exportSave);
    }
    if (dom.importBtn) {
      dom.importBtn.addEventListener('click', importSave);
    }

    // Boss overlay click to close (only on fail state)
    document.getElementById('bossOverlay').addEventListener('click', function (e) {
      if (e.target === this && !state.bossActive) {
        this.classList.remove('open');
        scheduleBoss();
      }
    });

    scheduleEvent();
    scheduleBoss();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
