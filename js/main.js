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
  dom.synergyBtn = document.getElementById('synergyBtn');
  dom.langToggle = document.getElementById('langToggle');
  dom.prestigeInfo = document.getElementById('prestigeInfo');
  dom.prestigeReq = document.getElementById('prestigeReq');
  dom.prestigeBtn = document.getElementById('prestigeBtn');
  dom.achBtn = document.getElementById('achBtn');
  dom.achClose = document.getElementById('achClose');
  dom.comboDisplay = document.getElementById('comboDisplay');
  dom.skinBtn = document.getElementById('skinBtn');
  dom.bossMeterSection = document.getElementById('bossMeterSection');
  dom.bossMeterText = document.getElementById('bossMeterText');
  dom.bossMeterLabel = document.getElementById('bossMeterLabel');
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
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    handleClick(null);
    return;
  }
  if (e.key === '1') {
    var btns = document.querySelectorAll('.buyModeBtn');
    if (btns[0]) btns[0].click();
    return;
  }
  if (e.key === '2') {
    var btns = document.querySelectorAll('.buyModeBtn');
    if (btns[1]) btns[1].click();
    return;
  }
  if (e.key === '3') {
    var btns = document.querySelectorAll('.buyModeBtn');
    if (btns[2]) btns[2].click();
    return;
  }
  if (e.key === 'b' || e.key === 'B') {
    var autoBtn = document.getElementById('autoBuyToggle');
    if (autoBtn && autoBtn.style.display !== 'none') autoBtn.click();
    return;
  }
  if (e.key === 'a' || e.key === 'A') {
    var achBtn = document.getElementById('achBtn');
    if (achBtn) achBtn.click();
    return;
  }
  if (e.key === 's' || e.key === 'S') {
    var statsBtn = document.getElementById('statsBtn');
    if (statsBtn) statsBtn.click();
    return;
  }
  if (e.key === 'Escape') {
    if (state.typingEventActive) { skipTypingEvent(); return; }
    closeTopOverlay();
    return;
  }
}

function closeTopOverlay() {
  var overlays = [
    { id: 'bossOverlay', close: function(el) { el.classList.remove('open'); } },
    { id: 'prestigePreviewOverlay', close: function(el) { el.classList.remove('open'); } },
    { id: 'settingsOverlay', close: toggleSettings },
    { id: 'synergyOverlay', close: toggleSynergies },
    { id: 'skinOverlay', close: toggleSkins },
    { id: 'achOverlay', close: toggleAchievements },
    { id: 'statsOverlay', close: toggleStats },
    { id: 'prestigeShopOverlay', close: togglePrestigeShop },
    { id: 'offlineOverlay', close: closeOfflineSummary },
  ];
  for (var i = 0; i < overlays.length; i++) {
    var el = document.getElementById(overlays[i].id);
    if (el && el.classList.contains('open')) {
      overlays[i].close(el);
      return;
    }
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
  if (dom.synergyBtn) {
    dom.synergyBtn.addEventListener('click', toggleSynergies);
  }
  var synergyClose = document.getElementById('synergyClose');
  if (synergyClose) {
    synergyClose.addEventListener('click', toggleSynergies);
  }
  var skinClose = document.getElementById('skinClose');
  if (skinClose) {
    skinClose.addEventListener('click', toggleSkins);
  }
  if (dom.achClose) {
    dom.achClose.addEventListener('click', toggleAchievements);
  }
  // Settings
  var settingsBtn = document.getElementById('settingsBtn');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', toggleSettings);
  }
  var settingsClose = document.getElementById('settingsClose');
  if (settingsClose) {
    settingsClose.addEventListener('click', toggleSettings);
  }
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
  // Export / Import
  if (dom.exportBtn) {
    dom.exportBtn.addEventListener('click', exportSave);
  }
  if (dom.importBtn) {
    dom.importBtn.addEventListener('click', importSave);
  }

  // Boss meter click — placeholder for Phase 2
  dom.bossMeterSection.addEventListener('click', function () {
    if (state.bossMeter >= CONFIG.BOSS_METER_REQUIRED) {
      startBossGauntlet();
    }
  });

  scheduleEvent();

  // Offline summary
  document.getElementById('offlineConfirm').addEventListener('click', closeOfflineSummary);
  document.getElementById('offlineClose').addEventListener('click', closeOfflineSummary);
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
  // Sequence option buttons
  document.querySelectorAll('.seqOptionBtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      submitSeqAnswer(this.dataset.value);
    });
  });
  // Simon cells
  document.querySelectorAll('.simonCell').forEach(function (cell) {
    cell.addEventListener('click', function () {
      handleSimonClick(parseInt(this.dataset.cell));
    });
  });
  scheduleTypingEvent();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
