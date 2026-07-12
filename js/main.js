'use strict';

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
  initTerminal();
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  setupBusUI();

  loadGame();
  initUpgrades();
  calculateStats();
  applyLanguage();
  applySkin();

  animId = requestAnimationFrame(terminalLoop);
  gameLoopInterval = setInterval(gameLoop, CONFIG.GAME_LOOP_TICK_MS);

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

  // Settings
  var settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', toggleSettings);
  }
  var settingsClose = document.getElementById('settingsClose');
  if (settingsClose) {
    settingsClose.addEventListener('click', toggleSettings);
  }
  document.getElementById('settingsOverlay').addEventListener('click', function (e) {
    if (e.target === this) toggleSettings();
  });
  // Settings - language
  document.getElementById('settingsLangToggle').addEventListener('click', function () {
    toggleLang();
    var btn = document.getElementById('settingsLangToggle');
    if (btn) btn.textContent = state.lang === 'es' ? 'EN' : 'ES';
  });
  // Settings - sound
  document.getElementById('settingsSoundToggle').addEventListener('click', function () {
    toggleSound();
    var btn = document.getElementById('settingsSoundToggle');
    if (btn) btn.textContent = state.soundEnabled ? '♪' : '♪̸';
  });
  // Settings - export/import
  document.getElementById('settingsExportBtn').addEventListener('click', exportSave);
  document.getElementById('settingsImportBtn').addEventListener('click', importSave);
  // Settings - reset
  document.getElementById('settingsResetBtn').addEventListener('click', function () {
    document.getElementById('settingsResetConfirm').style.display = 'block';
  });
  document.getElementById('settingsResetCancel').addEventListener('click', function () {
    document.getElementById('settingsResetConfirm').style.display = 'none';
  });
  document.getElementById('settingsResetExecute').addEventListener('click', function () {
    if (confirm(t('resetConfirm'))) {
      hardReset();
    }
  });

  window.addEventListener('resize', function () {
    resizeCanvas();
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
      bus.emit(EVENTS.GAME_RESET);
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
  var autoBuyToggle = document.getElementById('autoBuyToggle');
  if (autoBuyToggle) {
    autoBuyToggle.addEventListener('click', toggleAutoBuy);
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

  // Offline summary
  document.getElementById('offlineConfirm').addEventListener('click', closeOfflineSummary);
  document.getElementById('offlineClose').addEventListener('click', closeOfflineSummary);
  document.getElementById('offlineOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeOfflineSummary();
  });

  // Tutorial — solo se muestra una vez (controlado por localStorage)
  startTutorial();
  document.getElementById('tutorialSkip').addEventListener('click', skipTutorial);
  document.getElementById('tutorialNext').addEventListener('click', advanceTutorial);

  // Typing events
  document.getElementById('typingInput').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitTypingInput();
    }
    if (e.key === 'Escape') {
      skipTypingEvent();
    }
  });
  document.getElementById('typingIgnore').addEventListener('click', skipTypingEvent);
  document.getElementById('typingOverlay').addEventListener('click', function (e) {
    if (e.target === this) skipTypingEvent();
  });
  scheduleTypingEvent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
