'use strict';

/* --- PRESTIGE --- */
function getPrestigeReq() {
  return CONFIG.PRESTIGE_BASE_REQ * (state.prestigeCount + 1);
}

function showPrestigePreview() {
  var req = getPrestigeReq();
  if (state.prestigeProgress < req) return;
  var overlay = document.getElementById('prestigePreviewOverlay');
  if (!overlay) return;
  document.getElementById('previewMultCurrent').textContent = 'x' + Number(state.prestigeMultiplier).toFixed(1);
  document.getElementById('previewMultNext').textContent = 'x' + Number(state.prestigeMultiplier * CONFIG.PRESTIGE_MULT_FACTOR).toFixed(1);
  document.getElementById('previewPoints').textContent = '+' + 1;
  var startData = Math.floor(getShopBonus('startData'));
  document.getElementById('previewStartData').textContent = formatData(startData);
  overlay.classList.add('open');
}

function executePrestige() {
  document.getElementById('prestigePreviewOverlay').classList.remove('open');
  var glitch = document.getElementById('glitchOverlay');
  glitch.classList.add('active');
  document.body.classList.add('shake');

  playSound('crit');

  setTimeout(function () {
    termLines = [];
    addTermLines([
      '> SYSTEM RESET',
      '> Purge complete — all data wiped',
      '> Multiplier: x' + Number(state.prestigeMultiplier).toFixed(1) + ' → x' + Number(state.prestigeMultiplier * CONFIG.PRESTIGE_MULT_FACTOR).toFixed(1),
      '> Initializing new environment...',
    ]);

    state.prestigeMultiplier *= CONFIG.PRESTIGE_MULT_FACTOR;
    state.prestigeCount++;
    state.prestigePoints = (state.prestigePoints || 0) + 1;
    state.data = Math.floor(getShopBonus('startData'));
    state.prestigeProgress = 0;
    state.upgrades = {};
    initUpgrades();
    if (autoClickInterval) clearInterval(autoClickInterval);
    calculateStats();
    bus.emit(EVENTS.PRESTIGE_CHANGED);
    setupAutoClick();
    setupAutoBuy();
    saveGame();

    addTermLines([
      '[OK] Multiplier: x' + Number(state.prestigeMultiplier).toFixed(1),
      '[OK] Ready',
    ]);

    glitch.classList.remove('active');
    document.body.classList.remove('shake');

    playSound('levelup');
    showToast(t('prestigeLabel', { n: Number(state.prestigeMultiplier).toFixed(1) }), 'info');
  }, CONFIG.PRESTIGE_GLITCH_DELAY_MS);
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

/* --- SYNERGIES --- */
function isSynergyUnlocked(def) {
  if (def.id === 'scanner_cpu') return state.synergy;
  if (def.id === 'architect') return state.architect;
  if (def.id === 'overdrive_grid') return state.synergyOverdrive;
  if (def.id === 'cipher_keymaker') return state.synergyCipher;
  if (def.id === 'combo_master') return state.synergyCombo;
  if (def.id === 'meta_stack') return state.synergyMeta;
  return false;
}

function getSynergyReqHTML(def) {
  var html = '<div class="synergyReqsRow"><span class="synergyReqsLabel">' + t('synergyReqs') + '</span>';
  if (def.id === 'architect') {
    var archCount = state.architectCount;
    var met = archCount >= 1;
    var cls = met ? 'synergyReqItem met' : 'synergyReqItem unmet';
    html += '<span class="' + cls + '">' + t('synergyArchLabel') + ' (' + archCount + ')</span>';
  } else {
    def.reqs.forEach(function (r) {
      var lvl = state.upgrades[r.id] || 0;
      var met = lvl >= r.lvl;
      var cls = met ? 'synergyReqItem met' : 'synergyReqItem unmet';
      html += '<span class="' + cls + '">' + t('upgrade.' + r.id + '.name') + ' ' + lvl + '/' + r.lvl + '</span>';
    });
  }
  html += '</div>';
  return html;
}

function getSynergyEffectText(def) {
  if (!isSynergyUnlocked(def)) return '<span class="synergyEffectRow">' + t('synergyEffect') + ' <span style="color:var(--amber-bg)">' + t('synergyUnknown') + '</span></span>';
  if (def.id === 'scanner_cpu') {
    var n = state.upgrades['cpu'] || 0;
    return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyScannerEffect', { n: n }) + '</span>';
  }
  if (def.id === 'architect') {
    var mult = Number(1 + state.architectCount * CONFIG.ARCHITECT_BONUS).toFixed(2);
    return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyArchEffect', { n: mult }) + '</span>';
  }
  if (def.id === 'overdrive_grid') return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyOverdriveEffect') + '</span>';
  if (def.id === 'cipher_keymaker') return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyCipherEffect') + '</span>';
  if (def.id === 'combo_master') return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyComboEffect') + '</span>';
  if (def.id === 'meta_stack') return '<span class="synergyEffectRow">' + t('synergyEffect') + ' ' + t('synergyMetaEffect') + '</span>';
  return '';
}

function toggleSynergies() {
  var overlay = document.getElementById('synergyOverlay');
  if (!overlay) return;
  var isOpen = overlay.classList.toggle('open');
  if (isOpen) renderSynergies();
}

function renderSynergies() {
  var grid = document.getElementById('synergyGrid');
  if (!grid) return;
  grid.innerHTML = '';
  SYNERGY_DEFS.forEach(function (def) {
    var unlocked = isSynergyUnlocked(def);
    var card = document.createElement('div');
    card.className = 'synergyCard' + (unlocked ? ' unlocked' : ' locked');

    var nameRow = document.createElement('div');
    nameRow.className = 'synergyName';
    nameRow.innerHTML = (unlocked ? '\u2713 ' : '\u25CB ') + '<i class="fa-solid ' + def.icon + '"></i> ' + t(def.nameKey);
    card.appendChild(nameRow);
    card.insertAdjacentHTML('beforeend', getSynergyReqHTML(def));
    card.insertAdjacentHTML('beforeend', getSynergyEffectText(def));
    grid.appendChild(card);
  });
}

function achKey(id) {
  return 'ach' + id.split('_').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join('');
}

function renderAchievements() {
  var grid = document.getElementById('achGrid');
  if (!grid) return;
  grid.innerHTML = '';
  var count = 0;
  ACHIEVEMENT_DEFS.forEach(function (ach) {
    var unlocked = state.achievements[ach.id];
    if (unlocked) count++;
    var nameKey = achKey(ach.id);
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
    'synergy_master': state.synergy && state.architect && state.synergyOverdrive && state.synergyCipher && state.synergyCombo && state.synergyMeta,
  };
  var newUnlock = false;
  ACHIEVEMENT_DEFS.forEach(function (ach) {
    if (!state.achievements[ach.id] && checks[ach.id]) {
      state.achievements[ach.id] = true;
      newUnlock = true;
      var nameKey = achKey(ach.id);
      showToast(t('achUnlocked', { name: t(nameKey) }), 'ach');
      // Cosmetic skin reward
      unlockAchievementSkin(ach.id);
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
      statusRow.textContent = formatData(s.cost);
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
        bus.emit(EVENTS.SKIN_CHANGED);
      }
    });

    grid.appendChild(card);
  });
}

/* --- SOUND --- */
function playSound(type) {
  if (!state.soundEnabled || !audioCtx) return;
  try {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (type === 'click') {
      var osc = audioCtx.createOscillator();
      var gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'crit') {
      var osc2 = audioCtx.createOscillator();
      var gain2 = audioCtx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(440, audioCtx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start();
      osc2.stop(audioCtx.currentTime + 0.15);
    } else if (type === 'buy') {
      var bufferSize = audioCtx.sampleRate * 0.05;
      var buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.06;
      }
      var noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      noise.connect(audioCtx.destination);
      noise.start();
      noise.stop(audioCtx.currentTime + 0.05);
    } else if (type === 'levelup') {
      [440, 554, 659].forEach(function (freq, idx) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.1, audioCtx.currentTime + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.1 + 0.12);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + idx * 0.1);
        o.stop(audioCtx.currentTime + idx * 0.1 + 0.12);
      });
    } else if (type === 'autoclick') {
      var osc3 = audioCtx.createOscillator();
      var gain3 = audioCtx.createGain();
      osc3.type = 'sine';
      osc3.frequency.value = 220;
      gain3.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
      osc3.connect(gain3);
      gain3.connect(audioCtx.destination);
      osc3.start();
      osc3.stop(audioCtx.currentTime + 0.03);
    } else if (type === 'offline') {
      [330, 440, 554].forEach(function (freq, idx) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'triangle';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.08, audioCtx.currentTime + idx * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.15 + 0.1);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + idx * 0.15);
        o.stop(audioCtx.currentTime + idx * 0.15 + 0.1);
      });
    } else if (type === 'event') {
      [440, 554, 440].forEach(function (freq, idx) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.07, audioCtx.currentTime + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.08 + 0.1);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + idx * 0.08);
        o.stop(audioCtx.currentTime + idx * 0.08 + 0.1);
      });
    } else if (type === 'event_bad') {
      var osc4 = audioCtx.createOscillator();
      var gain4 = audioCtx.createGain();
      osc4.type = 'sawtooth';
      osc4.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc4.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.3);
      gain4.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain4.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc4.connect(gain4);
      gain4.connect(audioCtx.destination);
      osc4.start();
      osc4.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'boss_start') {
      [220, 330, 440, 550].forEach(function (freq, idx) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'square';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.06, audioCtx.currentTime + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.15);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + idx * 0.12);
        o.stop(audioCtx.currentTime + idx * 0.12 + 0.15);
      });
    } else if (type === 'boss_end') {
      [550, 440, 330].forEach(function (freq, idx) {
        var o = audioCtx.createOscillator();
        var g = audioCtx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.05, audioCtx.currentTime + idx * 0.12);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.15);
        o.connect(g);
        g.connect(audioCtx.destination);
        o.start(audioCtx.currentTime + idx * 0.12);
        o.stop(audioCtx.currentTime + idx * 0.12 + 0.15);
      });
    }
  } catch (e) { console.error('[Sound]', e); }
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
    { label: t('statDataEarned'), value: formatData(state.totalDataEarned) },
    { label: t('statClickPower'), value: formatData(state.clickPower) },
    { label: t('statDps'), value: formatData(state.dps) + '/s' },
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
  var delay = CONFIG.EVENT_SCHEDULE_BASE_MS + Math.random() * CONFIG.EVENT_SCHEDULE_RANDOM_MS;
  eventScheduleTimeout = setTimeout(startRandomEvent, delay);
}

function startRandomEvent() {
  if (state.bossActive || state.firewallActive || state.typingEventActive) { scheduleEvent(); return; }
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
    var bonus = Math.floor(state.data * CONFIG.EVENT_WINDFALL_PERCENT);
    if (bonus < 1) return;
    addData(bonus);
    playSound('event');
    showToast(t('eventWindfall') + ' +' + formatData(bonus), 'info');
    document.getElementById('eventIcon').innerHTML = '<i class="fa-solid ' + evt.icon + '"></i>';
    document.getElementById('eventText').textContent = t('eventWindfall') + ' +' + formatData(bonus);
    document.getElementById('eventTimer').textContent = '';
    el.className = 'open event-info';
    addTermLines(['[+] Windfall +' + formatData(bonus)]);
    setTimeout(function () { el.classList.remove('open'); }, CONFIG.EVENT_WINDFALL_DISPLAY_MS);
    bus.emit(EVENTS.DATA_CHANGED);
    bus.emit(EVENTS.EVENT_CHANGED);
    scheduleEvent();
    return;
  }
  state.eventActive = evt.id;
  state.eventTimer = evt.dur;
  if (evt.id === 'data_leak') {
    var penalty = Math.floor(state.data * CONFIG.EVENT_LEAK_PENALTY);
    state.data = Math.max(0, state.data - penalty);
    showToast('-' + formatData(penalty) + ' | ' + t('eventLeak', { dur: evt.dur }), 'warn');
    addTermLines(['[!] Data leak — -' + formatData(penalty) + ' (' + evt.dur + 's)']);
  } else {
    showToast(t(evt.descKey, { dur: evt.dur }), 'info');
    addTermLines(['> Event: ' + evt.id + ' (' + evt.dur + 's)']);
  }
  playSound(evt.id === 'data_leak' ? 'event_bad' : 'event');
  document.getElementById('eventIcon').innerHTML = '<i class="fa-solid ' + evt.icon + '"></i>';
  document.getElementById('eventText').textContent = t(evt.descKey, { dur: evt.dur });
  document.getElementById('eventTimer').textContent = evt.dur + 's';
  el.className = 'open ' + (evt.id === 'data_leak' ? 'event-warn' : 'event-buff');
  calculateStats();
  bus.emit(EVENTS.EVENT_CHANGED);
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
        bus.emit(EVENTS.EVENT_CHANGED);
        return;
      }
      document.getElementById('eventTimer').textContent = state.eventTimer + 's';
    }
  }, 1000);
}

function getEventMultiplier() {
  if (!state.eventActive) return { click: 1, dps: 1, cost: 1 };
  var m = { click: 1, dps: 1, cost: 1 };
  if (state.eventActive === 'overclock') m.click = CONFIG.EVENT_OVERCLOCK_CLICK;
  if (state.eventActive === 'ddos_attack') m.dps = CONFIG.EVENT_DDOS_DPS;
  if (state.eventActive === 'crypto_crash') m.cost = CONFIG.EVENT_CRYPTO_CRASH_COST;
  if (state.eventActive === 'data_leak') m.dps = CONFIG.EVENT_DATA_LEAK_DPS;
  return m;
}

/* --- BOSS BATTLES --- */
var bossScheduleTimeout = null;
var bossInterval = null;

function scheduleBoss() {
  if (bossScheduleTimeout) clearTimeout(bossScheduleTimeout);
  if (state.dps < CONFIG.BOSS_SCHEDULE_MIN_DPS) { bossScheduleTimeout = setTimeout(scheduleBoss, CONFIG.BOSS_SCHEDULE_RETRY_MS); return; }
  var delay = CONFIG.BOSS_SCHEDULE_BASE_MS + Math.random() * CONFIG.BOSS_SCHEDULE_RANDOM_MS;
  bossScheduleTimeout = setTimeout(startBoss, delay);
}

function startBoss() {
  if (state.bossActive || state.firewallActive || state.eventActive || state.typingEventActive) { scheduleBoss(); return; }
  state.bossActive = true;
  state.bossData = 0;
  var timeLimit = Math.max(CONFIG.BOSS_TIME_MIN, CONFIG.BOSS_TIME_BASE - Math.floor(state.level / CONFIG.BOSS_TIME_DIVISOR));
  state.bossThreshold = Math.floor(state.dps * timeLimit * (1 + state.level * CONFIG.BOSS_LEVEL_SCALE));

  // Pick variant
  var variantRoll = Math.random();
  if (variantRoll < 0.3 && state.totalClicks > 50) {
    state.bossType = 'shield';
    state.bossShieldHp = CONFIG.BOSS_SHIELD_CLICKS_BASE + Math.floor(state.level / 3);
  } else if (variantRoll < 0.5) {
    state.bossType = 'regen';
    state.bossRegenActive = false;
    state._bossRegenTimer = 0;
  } else if (variantRoll < 0.65) {
    state.bossType = 'counter';
    state._bossCounterTimer = 0;
  } else {
    state.bossType = 'normal';
  }

  playSound('boss_start');
  var overlay = document.getElementById('bossOverlay');
  overlay.classList.add('open');

  var variantHint = document.getElementById('bossVariantHint');
  var shieldContainer = document.getElementById('bossShieldBarContainer');
  var shieldBar = document.getElementById('bossShieldBar');

  variantHint.style.display = 'block';
  shieldContainer.style.display = 'none';

  switch (state.bossType) {
    case 'shield':
      variantHint.textContent = t('bossShield', { n: state.bossShieldHp }) + ' — ' + t('bossShieldHint');
      variantHint.style.color = '#ffcc00';
      shieldContainer.style.display = 'block';
      shieldBar.style.width = '100%';
      break;
    case 'regen':
      variantHint.textContent = '⚠ ' + t('bossRegen') + ' — ' + t('bossRegenHint');
      variantHint.style.color = '#ff4400';
      break;
    case 'counter':
      variantHint.textContent = '⚠ ' + t('bossCounter') + ' — ' + t('bossCounterHint');
      variantHint.style.color = '#ff0044';
      break;
    default:
      variantHint.style.display = 'none';
      break;
  }

  document.getElementById('bossInfo').textContent = t('bossInfo', { n: formatData(state.bossThreshold), t: timeLimit + 's' });
  document.getElementById('bossBarInner').style.width = '0%';
  document.getElementById('bossReward').textContent = '';
  addTermLines(['⚠ BOSS INTRUSION — ' + state.bossType + ' — threshold ' + formatData(state.bossThreshold)]);
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

    // Regen tick
    if (state.bossType === 'regen' && state.bossActive) {
      state._bossRegenTimer = (state._bossRegenTimer || 0) + 1000;
      if (state._bossRegenTimer >= CONFIG.BOSS_REGEN_INTERVAL_MS) {
        state._bossRegenTimer = 0;
        var dataIncreased = state.bossData > (state._bossLastData || 0);
        state._bossLastData = state.bossData;
        if (!dataIncreased) {
          var regenAmount = Math.floor(state.bossThreshold * CONFIG.BOSS_REGEN_PERCENT);
          state.bossData = Math.max(0, state.bossData - regenAmount);
          var pct = Math.min(100, (state.bossData / state.bossThreshold) * 100);
          var bar = document.getElementById('bossBarInner');
          if (bar) bar.style.width = pct + '%';
          variantHint.textContent = '⚠ ' + t('bossRegen') + ' -' + formatData(regenAmount);
        }
      }
    }

    // Counter tick
    if (state.bossType === 'counter' && state.bossActive) {
      state._bossCounterTimer = (state._bossCounterTimer || 0) + 1000;
      if (state._bossCounterTimer >= CONFIG.BOSS_COUNTER_INTERVAL_MS) {
        state._bossCounterTimer = 0;
        var penalty = Math.floor(state.data * CONFIG.BOSS_COUNTER_PENALTY);
        if (penalty > 0) {
          state.data = Math.max(0, state.data - penalty);
          showToast(t('bossCounter') + ' -' + formatData(penalty), 'warn');
          bus.emit(EVENTS.DATA_CHANGED);
        }
      }
    }
  }, 1000);
}

function endBoss(success) {
  state.bossActive = false;
  if (bossInterval) { clearInterval(bossInterval); bossInterval = null; }
  var reward = document.getElementById('bossReward');
  if (success) {
    var bonus = Math.floor(state.bossThreshold * CONFIG.BOSS_REWARD_FRACTION);
    addData(bonus);
    reward.textContent = t('bossSuccess', { n: formatData(bonus) });
    reward.style.color = '#00ff00';
    playSound('levelup');
    showToast(t('bossSuccess', { n: formatData(bonus) }), 'info');
    addTermLines(['[✓] Boss neutralized +' + formatData(bonus)]);
  } else {
    reward.textContent = t('bossFail');
    reward.style.color = '#ff0044';
    addTermLines(['[✗] Boss intrusion — failed']);
    playSound('boss_end');
  }
  calculateStats();
  bus.emit(EVENTS.DATA_CHANGED);
  setTimeout(function () {
    document.getElementById('bossOverlay').classList.remove('open');
    scheduleBoss();
  }, CONFIG.BOSS_DISPLAY_DELAY_MS);
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
  if (id === 'autoBuy') { state.autoBuyEnabled = true; setupAutoBuy(); }
  saveGame();
  renderPrestigeShop();
}

function getShopBonus(id) {
  var lvl = state.prestigeShop[id] || 0;
  switch (id) {
    case 'clickBoost': return 1 + lvl * CONFIG.SHOP_CLICK_BOOST;
    case 'dpsBoost': return 1 + lvl * CONFIG.SHOP_DPS_BOOST;
    case 'startData': return lvl * CONFIG.SHOP_START_DATA;
    case 'comboBoost': return lvl * CONFIG.SHOP_COMBO_BOOST;
    case 'critBoost': return lvl * CONFIG.SHOP_CRIT_BOOST;
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
  } catch (e) { showToast(t('exportFail'), 'warn'); }
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
    bus.emit(EVENTS.GAME_RESET);
    saveGame();
    showToast(t('importOk'), 'info');
  } catch (e) { showToast(t('importFail'), 'warn'); }
}

/* --- FIREWALL MINIGAME --- */
function scheduleFirewall() {
  if (firewallTimeout) clearTimeout(firewallTimeout);
  if (!state.firewallEnabled) return;
  var delay = CONFIG.FW_SCHEDULE_BASE_MS + Math.random() * CONFIG.FW_SCHEDULE_RANDOM_MS;
  firewallTimeout = setTimeout(startFirewall, delay);
}

function startFirewall() {
  if (!state.firewallEnabled || state.typingEventActive) { scheduleFirewall(); return; }
  var overlay = document.getElementById('fwOverlay');
  if (!overlay) return;
  var nodeCount = CONFIG.FW_NODE_BASE + Math.floor(state.level / CONFIG.FW_NODE_DIVISOR);
  if (nodeCount > CONFIG.FW_NODE_MAX) nodeCount = CONFIG.FW_NODE_MAX;
  var timeLimit = Math.max(CONFIG.FW_TIME_MIN, CONFIG.FW_TIME_BASE - Math.floor(state.level / CONFIG.FW_TIME_DIVISOR));

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
  addTermLines(['⚠ Firewall detected — ' + nodeCount + ' nodes (' + timeLimit + 's)']);

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
    // Ocultar nodo clickeado
    var el = document.querySelector('.fwNode[data-num="' + num + '"]');
    if (el) el.classList.add('fwNode-done');
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
    var bonus = Math.floor(state.dps * CONFIG.FW_REWARD_DPS_MULT * (1 + state.level * CONFIG.FW_REWARD_LEVEL_SCALE));
    addData(bonus);
    result.textContent = t('fwSuccess', { n: formatData(bonus) });
    result.className = 'fwResult success';
    playSound('levelup');
    calculateStats();
    bus.emit(EVENTS.DATA_CHANGED);
    showToast(t('fwSuccess', { n: formatData(bonus) }), 'info');
    addTermLines(['[✓] Firewall bypassed +' + formatData(bonus)]);
  } else {
    result.textContent = t('fwFail');
    result.className = 'fwResult fail';
    showToast(t('fwFail'), 'warn');
    addTermLines(['[✗] Firewall active — connection failed']);
  }

  setTimeout(function () {
    document.getElementById('fwOverlay').classList.remove('open');
    scheduleFirewall();
  }, CONFIG.FW_DISPLAY_DELAY_MS);
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
  var ms = Math.max(CONFIG.AUTO_INTERVAL_MIN, state.autoInterval || CONFIG.AUTO_INTERVAL_DEFAULT);
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
  }, ms);
}

/* --- AUTO-BUY (prestige shop) --- */
var autoBuyInterval = null;

function setupAutoBuy() {
  if (autoBuyInterval) clearInterval(autoBuyInterval);
  var owned = (state.prestigeShop['autoBuy'] || 0) >= 1;
  var enabled = state.autoBuyEnabled && owned;
  var btn = document.getElementById('autoBuyToggle');
  if (btn) {
    btn.style.display = owned ? 'inline-block' : 'none';
    btn.classList.toggle('active', enabled);
    btn.textContent = enabled ? t('autoBuyOn') : t('autoBuyOff');
  }
  if (enabled) {
    autoBuyInterval = setInterval(function () {
      tryBuyCheapest();
    }, CONFIG.AUTO_BUY_INTERVAL_MS);
  }
}

function toggleAutoBuy() {
  state.autoBuyEnabled = !state.autoBuyEnabled;
  setupAutoBuy();
  saveGame();
}

/* --- GAME LOOP --- */
var termNoiseTimer = 0;
var termNoiseLines = [
  '[UDP] 10.0.0.1:8080 › ',
  '[TCP] 45.33.32.156:22 › established',
  'wlan0: TX ',
  '[ICMP] heartbeat 127.0.0.1 › OK',
  'eth0: RX ',
  '[DNS] matrix.local › resolved 10.0.0.1',
  '[SSH] session 0x4D3 › keepalive',
];

function gameLoop() {
  if (state.dps > 0) {
    var gain = state.dps / (1000 / CONFIG.GAME_LOOP_TICK_MS);
    addData(gain);
    if (state.bossActive) {
      // Shield boss: DPS does not bypass shield
      if (state.bossType !== 'shield' || state.bossShieldHp <= 0) {
        state.bossData += gain;
      }
      var pct = Math.min(100, (state.bossData / state.bossThreshold) * 100);
      var bar = document.getElementById('bossBarInner');
      if (bar) bar.style.width = pct + '%';
      if (state.bossData >= state.bossThreshold) endBoss(true);
    }
    state.playTime += CONFIG.GAME_LOOP_TICK_MS / 1000;
    calculateStats();
    checkAchievements();
    bus.emit(EVENTS.DATA_CHANGED);
    if (state._autoDirty) { state._autoDirty = false; setupAutoClick(); }

    termNoiseTimer += CONFIG.GAME_LOOP_TICK_MS;
    if (state.dps > 0 && termNoiseTimer >= CONFIG.TERM_NOISE_INTERVAL_MS) {
      termNoiseTimer = 0;
      var line = termNoiseLines[Math.floor(Math.random() * termNoiseLines.length)];
      if (line.indexOf('TX ') !== -1 || line.indexOf('RX ') !== -1) {
        addTermLine(line + formatData(Math.floor(state.dps * 2)) + '/s');
      } else if (line.indexOf('8080') !== -1) {
        addTermLine(line + formatData(Math.floor(state.dps)));
      } else {
        addTermLine(line);
      }
    }
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
  }, CONFIG.SAVE_STATUS_DURATION_MS);
  } catch (e) { console.error('[Save]', e); }
}

function validateState(saved) {
  if (typeof saved !== 'object' || saved === null) return;
  var fields = {
    data: 0, clickPower: 1, dps: 0, level: 1,
    totalClicks: 0, critChance: 0, discount: 0,
    lastSaveTime: null, synergy: false, architect: false, architectCount: 0,
    totalCrits: 0, combo: 0, playTime: 0, prestigeProgress: 0,
    prestigeMultiplier: 1, prestigeCount: 0, totalDataEarned: 0,
    firewallEnabled: true, prestigePoints: 0,
    soundEnabled: true, autoBuyEnabled: false, buyMode: 1,
    upgrades: {}, achievements: {}, ownedSkins: [],
    prestigeShop: {}, activeSkin: 'default', lang: 'es',
    bossType: 'normal', bossShieldHp: 0,
    bossRegenActive: false, bossCounterTimer: 0,
    typingEventActive: false, typingEventData: null,
    synergyOverdrive: false, synergyCipher: false,
    synergyCombo: false, synergyMeta: false,
  };
  Object.keys(fields).forEach(function (k) {
    var v = saved[k];
    var def = fields[k];
    var defType = typeof def;
    // If field is missing, wrong type, or NaN, use default
    if (v === undefined || v === null || typeof v !== defType || (defType === 'number' && isNaN(v))) {
      saved[k] = def;
    }
    // Clamp numbers to non-negative for most numeric fields
    if (defType === 'number' && k !== 'prestigeMultiplier' && k !== 'level') {
      saved[k] = Math.max(0, saved[k]);
    }
  });
  if (typeof saved.lang !== 'string' || (saved.lang !== 'es' && saved.lang !== 'en')) saved.lang = 'es';
  if (typeof saved.activeSkin !== 'string') saved.activeSkin = 'default';
  if (saved.totalDataEarned < saved.data) saved.totalDataEarned = saved.data;
  return saved;
}

function loadGame() {
  try {
    var raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      var saved = JSON.parse(raw);
      if (typeof saved !== 'object' || saved === null) return false;
      validateState(saved);
      state = Object.assign(state, saved);
      calculateStats();

      var rootkitLevel = state.upgrades['rootkit'] || 0;
      var offlineElapsed = 0;
      var offlineData = 0;
      if (rootkitLevel > 0 && state.lastSaveTime && state.dps > 0) {
        offlineElapsed = (Date.now() - state.lastSaveTime) / 1000;
        offlineData = Math.floor(state.dps * offlineElapsed * rootkitLevel * CONFIG.OFFLINE_ROOTKIT_MULT);
        if (offlineData > 0) {
          addData(offlineData);
        }
      }
      // Show offline summary if there was meaningful offline time
      if (offlineElapsed > 10) {
        // Defer to ensure DOM is ready
        setTimeout(function () {
          showOfflineSummary(offlineElapsed, offlineData);
        }, 500);
      } else if (offlineData > 0) {
        showToast(t('offline', { n: formatData(offlineData) }) + t('offlineExtra'), 'info');
      }
      return true;
    }
  } catch (e) { console.error('[Load]', e); }
  return false;
}

function resetGame(hard) {
  localStorage.removeItem(SAVE_KEY);
  termLines = [];
  if (autoClickInterval) clearInterval(autoClickInterval);
  if (firewallTimeout) clearTimeout(firewallTimeout);
  if (firewallTimerInterval) clearTimeout(firewallTimerInterval);
  if (bossScheduleTimeout) clearTimeout(bossScheduleTimeout);
  if (eventScheduleTimeout) clearTimeout(eventScheduleTimeout);
  if (typingScheduleTimeout) clearTimeout(typingScheduleTimeout);
  state.firewallActive = false;
  state.bossActive = false;
  state.eventActive = null;
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
    lang: hard ? 'es' : state.lang,
    prestigeMultiplier: hard ? 1 : state.prestigeMultiplier,
    prestigeCount: hard ? 0 : state.prestigeCount,
    totalDataEarned: 0,
    achievements: hard ? {} : Object.assign({}, state.achievements),
    totalCrits: 0,
    combo: 0,
    activeSkin: hard ? 'default' : state.activeSkin,
    ownedSkins: hard ? [] : state.ownedSkins.slice(),
    soundEnabled: hard ? true : state.soundEnabled,
    playTime: 0,
    firewallEnabled: true,
    prestigePoints: hard ? 0 : (state.prestigePoints || 0),
    prestigeProgress: hard ? 0 : state.prestigeProgress,
    prestigeShop: hard ? {} : Object.assign({}, state.prestigeShop),
    buyMode: 1,
    autoBuyEnabled: hard ? false : state.autoBuyEnabled,
    bossType: 'normal',
    bossShieldHp: 0,
    bossRegenActive: false,
    bossCounterTimer: 0,
    typingEventActive: false,
    typingEventData: null,
    synergyOverdrive: false,
    synergyCipher: false,
    synergyCombo: false,
    synergyMeta: false,
  };
  initUpgrades();
  calculateStats();
  bus.emit(EVENTS.GAME_RESET);
  setupAutoClick();
  setupAutoBuy();
  scheduleFirewall();
  scheduleEvent();
  scheduleBoss();
  scheduleTypingEvent();
}

/* --- LANGUAGE TOGGLE --- */
function toggleLang() {
  state.lang = state.lang === 'es' ? 'en' : 'es';
  applyLanguage();
  saveGame();
}

/* --- SETTINGS --- */
function toggleSettings() {
  var overlay = document.getElementById('settingsOverlay');
  if (!overlay) return;
  var isOpen = overlay.classList.toggle('open');
  if (isOpen) {
    var langBtn = document.getElementById('settingsLangToggle');
    if (langBtn) langBtn.textContent = state.lang === 'es' ? 'EN' : 'ES';
    var soundBtn = document.getElementById('settingsSoundToggle');
    if (soundBtn) soundBtn.textContent = state.soundEnabled ? '♪' : '♪̸';
    var confirmEl = document.getElementById('settingsResetConfirm');
    if (confirmEl) confirmEl.style.display = 'none';
  }
}

function hardReset() {
  resetGame(true);
  saveGame();
  toggleSettings();
  showToast(t('resetDone'), 'warn');
}

/* --- OFFLINE SUMMARY --- */
function showOfflineSummary(elapsed, dataEarned) {
  var overlay = document.getElementById('offlineOverlay');
  if (!overlay) return;
  document.getElementById('offlineTime').textContent = formatTime(Math.floor(elapsed));
  document.getElementById('offlineData').textContent = '+' + formatData(dataEarned);
  overlay.classList.add('open');
  playSound('offline');
}

function closeOfflineSummary() {
  document.getElementById('offlineOverlay').classList.remove('open');
}

/* --- TUTORIAL --- */
var TUTORIAL_SEEN_KEY = 'mh_tutorial_seen';

function startTutorial() {
  if (localStorage.getItem(TUTORIAL_SEEN_KEY)) return;
  localStorage.setItem(TUTORIAL_SEEN_KEY, '1');
  var overlay = document.getElementById('tutorialOverlay');
  if (!overlay) return;
  state._tutorialSlide = 0;
  overlay.classList.add('open');
  renderTutorialStep();
}

function renderTutorialStep() {
  var slide = state._tutorialSlide || 0;
  if (slide < 0 || slide >= TUTORIAL_STEPS) return;
  var text = document.getElementById('tutorialText');
  var step = document.getElementById('tutorialStep');
  var progress = document.getElementById('tutorialProgressInner');
  var nextBtn = document.getElementById('tutorialNext');
  if (text) text.textContent = t('tutorialStep' + slide);
  if (step) step.textContent = (slide + 1) + '/' + TUTORIAL_STEPS;
  if (progress) progress.style.width = ((slide + 1) / TUTORIAL_STEPS * 100) + '%';
  if (nextBtn) {
    if (slide >= TUTORIAL_STEPS - 1) {
      nextBtn.textContent = t('tutorialDone');
    } else {
      nextBtn.textContent = '→';
    }
  }
}

function advanceTutorial() {
  var slide = (state._tutorialSlide || 0) + 1;
  if (slide >= TUTORIAL_STEPS) {
    closeTutorial();
    return;
  }
  state._tutorialSlide = slide;
  renderTutorialStep();
}

function closeTutorial() {
  document.getElementById('tutorialOverlay').classList.remove('open');
  delete state._tutorialSlide;
  saveGame();
}

function skipTutorial() {
  closeTutorial();
}

/* --- TYPING EVENTS --- */
var typingScheduleTimeout = null;
var typingTimerInterval = null;

function generateTypingEventData(type) {
  var def = TYPEVENT_DEFS.find(function (d) { return d.id === type; });
  if (!def) return null;
  switch (type) {
    case 'sql_inject': {
      var target = Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase();
      var words = ['UNION SELECT * FROM users', 'DROP TABLE logs', 'SELECT password FROM admins', 'INSERT INTO root VALUES(1)', 'UPDATE config SET level=99'];
      var word = words[Math.floor(Math.random() * words.length)];
      return { type: type, dur: def.dur, word: word, target: target, display: word, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'brute_force': {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      var len = 4 + Math.floor(Math.random() * 3);
      var key = '';
      for (var i = 0; i < len; i++) key += chars[Math.floor(Math.random() * chars.length)];
      return { type: type, dur: def.dur, word: key, display: key, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'decode': {
      var decodedWords = ['HACK', 'DATA', 'CODE', 'ROOT', 'SHELL', 'MATRIX', 'CYBER', 'BYTE'];
      var word = decodedWords[Math.floor(Math.random() * decodedWords.length)];
      var binary = '';
      for (var i = 0; i < word.length; i++) {
        var bin = word.charCodeAt(i).toString(2);
        while (bin.length < 8) bin = '0' + bin;
        if (i > 0) binary += ' ';
        binary += bin;
      }
      return { type: type, dur: def.dur, word: word, display: binary, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'command_chain': {
      var allCmds = ['ls', 'grep', 'awk', 'sort', 'cat', 'tail', 'find', 'chmod', 'ssh', 'ping', 'curl', 'wget'];
      var count = 3 + Math.floor(state.level / 5);
      if (count > 6) count = 6;
      var cmds = [];
      var used = {};
      for (var i = 0; i < count; i++) {
        var cmd;
        do { cmd = allCmds[Math.floor(Math.random() * allCmds.length)]; } while (used[cmd]);
        used[cmd] = true;
        cmds.push(cmd);
      }
      return { type: type, dur: def.dur, word: cmds[0], chain: cmds, chainStep: 0, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'captcha': {
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
      var len = 4 + Math.floor(Math.random() * 3);
      var captcha = '';
      for (var i = 0; i < len; i++) captcha += chars[Math.floor(Math.random() * chars.length)];
      return { type: type, dur: def.dur, word: captcha, display: captcha, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
  }
  return null;
}

function scheduleTypingEvent(urgent) {
  if (typingScheduleTimeout) clearTimeout(typingScheduleTimeout);
  var delay = urgent ? (5000 + Math.random() * 10000) : (60000 + Math.random() * 60000);
  typingScheduleTimeout = setTimeout(startRandomTypingEvent, delay);
}

function startRandomTypingEvent() {
  if (state.bossActive || state.firewallActive || state.typingEventActive) { scheduleTypingEvent(true); return; }
  var types = ['sql_inject', 'brute_force', 'decode', 'command_chain'];
  if (Math.random() < 0.15) {
    startTypingEvent('captcha');
  } else {
    var type = types[Math.floor(Math.random() * types.length)];
    startTypingEvent(type);
  }
}

var typingCaptchaActive = false;

function startTypingEvent(type) {
  var data = generateTypingEventData(type);
  if (!data) { scheduleTypingEvent(); return; }
  state.typingEventActive = true;
  state.typingEventData = data;
  if (type === 'captcha') typingCaptchaActive = true;

  var overlay = document.getElementById('typingOverlay');
  var prompt = document.getElementById('typingPrompt');
  var hint = document.getElementById('typingHint');
  var display = document.getElementById('typingDisplay');
  var input = document.getElementById('typingInput');
  var timer = document.getElementById('typingTimer');
  var result = document.getElementById('typingResult');

  result.style.display = 'none';
  input.value = '';
  input.style.display = 'block';
  input.disabled = false;

  switch (type) {
    case 'sql_inject':
      prompt.textContent = t('sqlInjectTarget', { target: data.target });
      hint.textContent = t('sqlInjectWord', { word: data.word }) + ' [Enter]';
      display.textContent = '> ' + '_'.repeat(data.word.length);
      break;
    case 'brute_force':
      prompt.textContent = t('bruteForceKey', { key: data.word });
      hint.textContent = t('bruteForceHint') + ' [Enter]';
      display.textContent = data.word;
      break;
    case 'decode':
      prompt.textContent = t('decodePrompt');
      hint.textContent = t('decodeHint') + ' [Enter]';
      display.textContent = data.display;
      break;
    case 'command_chain':
      prompt.textContent = t('commandChainPrompt', { n: data.chain.length - data.chainStep });
      hint.textContent = t('commandChainHint', { cmd: data.word }) + ' [Enter]';
      display.textContent = '> ' + data.word;
      break;
    case 'captcha':
      prompt.textContent = t('captchaPrompt');
      hint.textContent = t('captchaHint') + ' [Enter]';
      display.textContent = data.display;
      break;
  }

  timer.textContent = data.dur + 's';
  overlay.classList.add('open');
  addTermLines(['> Typing hack: ' + type]);

  setTimeout(function () { input.focus(); }, 100);

  data._remaining = data.dur;
  if (typingTimerInterval) clearInterval(typingTimerInterval);
  typingTimerInterval = setInterval(function () {
    if (!state.typingEventActive) { clearInterval(typingTimerInterval); return; }
    data._remaining--;
    if (data._remaining <= 0) {
      clearInterval(typingTimerInterval);
      endTypingEvent(false);
      return;
    }
    timer.textContent = data._remaining + 's';
  }, 1000);

}

function submitTypingInput() {
  if (!state.typingEventActive || !state.typingEventData) return;
  var data = state.typingEventData;
  var input = document.getElementById('typingInput');
  var val = input.value.trim();

  if (data.type === 'command_chain') {
    if (val.toLowerCase() === data.word.toLowerCase()) {
      data.chainStep++;
      if (data.chainStep >= data.chain.length) {
        endTypingEvent(true);
      } else {
        data.word = data.chain[data.chainStep];
        var prompt = document.getElementById('typingPrompt');
        var hint = document.getElementById('typingHint');
        var display = document.getElementById('typingDisplay');
        prompt.textContent = t('commandChainPrompt', { n: data.chain.length - data.chainStep });
        hint.textContent = t('commandChainHint', { cmd: data.word });
        display.textContent = '> ' + data.word;
        input.value = '';
        input.focus();
      }
    } else {
      endTypingEvent(false);
    }
  } else {
    if (val.toUpperCase() === data.word.toUpperCase()) {
      endTypingEvent(true);
    } else {
      endTypingEvent(false);
    }
  }
}

function endTypingEvent(success) {
  if (!state.typingEventActive) return;
  state.typingEventActive = false;
  var data = state.typingEventData;
  var input = document.getElementById('typingInput');
  var display = document.getElementById('typingDisplay');
  var result = document.getElementById('typingResult');
  var overlay = document.getElementById('typingOverlay');

  input.disabled = true;
  if (typingTimerInterval) { clearInterval(typingTimerInterval); typingTimerInterval = null; }

  // Show result prominently in the display area
  display.style.fontSize = '1.6rem';
  display.style.padding = '15px 10px';

  if (success) {
    var bonus = Math.floor(state.dps * data.rewardMult);
    if (bonus < 1) bonus = 1;
    addData(bonus);
    display.textContent = '✔ ' + t('typingSuccess', { n: formatData(bonus) });
    display.style.color = '#00ff00';
    display.style.textShadow = '0 0 20px rgba(0,255,0,0.5)';
    display.style.borderColor = '#00ff00';
    display.style.background = 'rgba(0,40,0,0.5)';
    result.textContent = '';
    playSound('levelup');
    showToast(t('typingSuccess', { n: formatData(bonus) }), 'info');
    addTermLines(['[✓] Typing hack success +' + formatData(bonus)]);
    calculateStats();
    bus.emit(EVENTS.DATA_CHANGED);
  } else {
    var penalty = data.penaltyMult > 0 ? Math.floor(state.data * data.penaltyMult) : 0;
    if (penalty > 0) {
      state.data = Math.max(0, state.data - penalty);
      display.textContent = '✘ ' + t('typingPenalty', { n: formatData(penalty) });
      bus.emit(EVENTS.DATA_CHANGED);
    } else {
      display.textContent = '✘ ' + t('typingFail');
    }
    display.style.color = '#ff4400';
    display.style.textShadow = '0 0 20px rgba(255,68,0,0.5)';
    display.style.borderColor = '#ff4400';
    display.style.background = 'rgba(40,0,0,0.5)';
    result.textContent = '';
    playSound('event_bad');
    addTermLines(['[✗] Typing hack — failed']);
  }

  scheduleTypingEvent();

  setTimeout(function () {
    overlay.classList.remove('open');
    typingCaptchaActive = false;
    state.typingEventData = null;
    display.style.fontSize = '';
    display.style.padding = '';
    display.style.color = '';
    display.style.textShadow = '';
    display.style.borderColor = '';
    display.style.background = '';
  }, 2000);
}

function skipTypingEvent() {
  if (state.typingEventActive) {
    endTypingEvent(false);
  } else {
    document.getElementById('typingOverlay').classList.remove('open');
    typingCaptchaActive = false;
  }
  scheduleTypingEvent();
}

/* --- COSMETIC ACHIEVEMENT REWARDS --- */
function unlockAchievementSkin(achId) {
  var skinId = ACHIEVEMENT_SKIN_REWARDS[achId];
  if (!skinId) return;
  if (state.ownedSkins.indexOf(skinId) !== -1) return;
  state.ownedSkins.push(skinId);
  var key = 'skin' + skinId.charAt(0).toUpperCase() + skinId.slice(1);
  showToast('✦ ' + t(key), 'ach');
}

