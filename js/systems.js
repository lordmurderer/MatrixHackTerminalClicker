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
  if (state.typingEventActive) { scheduleEvent(); return; }
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

function triggerEventFlash(type) {
  var flash = document.getElementById('eventFlash');
  if (!flash) return;
  flash.className = 'flash-' + type;
  setTimeout(function () { flash.className = ''; }, 450);
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
    triggerEventFlash('info');
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
  triggerEventFlash(evt.id === 'data_leak' ? 'warn' : 'buff');
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

/* --- BOSS GAUNTLET (placeholder for Phase 2) --- */

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
    state.firewallActive = false;
    state.eventActive = null;
    calculateStats();
    bus.emit(EVENTS.GAME_RESET);
    saveGame();
    showToast(t('importOk'), 'info');
  } catch (e) { showToast(t('importFail'), 'warn'); }
}

/* --- FIREWALL MINIGAME (moved to typing events) --- */
// Firewall is now handled as a typing event type in generateTypingEventData/startTypingEvent/handleFirewallClick

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
    state.playTime += CONFIG.GAME_LOOP_TICK_MS / 1000;
    if (state.combo > 1 && state.lastClickTime) {
      var bar = document.getElementById('comboBarInner');
      if (bar) {
        var elapsed = Date.now() - state.lastClickTime;
        var pct = Math.max(0, 100 - (elapsed / CONFIG.COMBO_TIMEOUT_MS) * 100);
        bar.style.width = pct + '%';
      }
    }
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
    prestigePoints: 0,
    soundEnabled: true, autoBuyEnabled: false, buyMode: 1,
    upgrades: {}, achievements: {}, ownedSkins: [],
    prestigeShop: {}, activeSkin: 'default', lang: 'es',
    bossMeter: 0,
    bossGauntletActive: false, bossGauntletSteps: [], bossGauntletStep: 0,
    bossGauntletVariant: 'normal', totalBossGauntletWins: 0, bossVariantsDefeated: {},
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
      // Clear any stuck typing/blocking/boss state from a previous session
      state.typingEventActive = false;
      state.typingEventData = null;
      state.bossGauntletActive = false;
      stopBossMusic();
      if (typeof bossGauntletTimeout !== 'undefined') { clearTimeout(bossGauntletTimeout); bossGauntletTimeout = null; }
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
  _cardLockState = {};
  stopBossMusic();
  if (bossGauntletTimeout) { clearTimeout(bossGauntletTimeout); bossGauntletTimeout = null; }
  termLines = [];
  if (autoClickInterval) clearInterval(autoClickInterval);
  if (eventScheduleTimeout) clearTimeout(eventScheduleTimeout);
  if (typingScheduleTimeout) clearTimeout(typingScheduleTimeout);
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
    prestigePoints: hard ? 0 : (state.prestigePoints || 0),
    prestigeProgress: hard ? 0 : state.prestigeProgress,
    prestigeShop: hard ? {} : Object.assign({}, state.prestigeShop),
    buyMode: 1,
    autoBuyEnabled: hard ? false : state.autoBuyEnabled,
    bossMeter: 0,
    bossGauntletActive: false,
    bossGauntletSteps: [],
    bossGauntletStep: 0,
    bossGauntletVariant: 'normal',
    totalBossGauntletWins: hard ? 0 : (state.totalBossGauntletWins || 0),
    bossVariantsDefeated: hard ? {} : Object.assign({}, state.bossVariantsDefeated || {}),
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
  scheduleEvent();
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
    case 'brute_force': {
      var chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
      var len = 3 + Math.floor(Math.random() * 3);
      var key = '';
      for (var i = 0; i < len; i++) key += chars[Math.floor(Math.random() * chars.length)];
      return { type: type, dur: def.dur, word: key, display: key, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'command_chain': {
      var allCmds = ['ls', 'grep', 'awk', 'sort', 'cat', 'tail', 'find', 'chmod', 'ssh', 'ping', 'curl', 'wget'];
      var count = 3 + Math.floor(state.level / 5);
      if (count > 5) count = 5;
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
      var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      var len = 3 + Math.floor(Math.random() * 3);
      var captcha = '';
      for (var i = 0; i < len; i++) captcha += chars[Math.floor(Math.random() * chars.length)];
      return { type: type, dur: def.dur, word: captcha, display: captcha, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'seq_num': {
      var start = 1 + Math.floor(Math.random() * 50);
      var step = 1 + Math.floor(Math.random() * 10);
      var seq = [];
      for (var i = 0; i < 4; i++) seq.push(start + i * step);
      var missingIdx = Math.floor(Math.random() * 4);
      var correct = seq[missingIdx];
      seq[missingIdx] = '___';
      var wrong1 = correct + (Math.random() < 0.5 ? step : -step);
      var wrong2 = correct + step * 2;
      var opts = [correct, wrong1, wrong2].sort(function () { return Math.random() - 0.5; });
      return { type: type, dur: def.dur, word: String(correct), display: seq.join(', '), options: opts, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'seq_step': {
      var start = 1 + Math.floor(Math.random() * 20);
      var step = 1 + Math.floor(Math.random() * 5);
      var seq = [];
      for (var i = 0; i < 3; i++) seq.push(start + i * step);
      var correct = start + 3 * step;
      var wrong1 = correct + step;
      var wrong2 = correct - (Math.random() < 0.5 ? step : step * 2);
      var opts = [correct, wrong1, wrong2].sort(function () { return Math.random() - 0.5; });
      return { type: type, dur: def.dur, word: String(correct), display: seq.join(', ') + ', ?', options: opts, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'simon': {
      var simonLen = 3 + Math.floor(state.level / 10);
      if (simonLen > 6) simonLen = 6;
      var simonSeq = [];
      for (var i = 0; i < simonLen; i++) simonSeq.push(1 + Math.floor(Math.random() * 4));
      return { type: type, dur: def.dur, word: simonSeq.join(''), simonSeq: simonSeq, simonStep: 0, rewardMult: def.rewardMult, penaltyMult: def.penaltyMult };
    }
    case 'firewall': {
      var nodeCount = CONFIG.FW_NODE_BASE + Math.floor(state.level / CONFIG.FW_NODE_DIVISOR);
      if (nodeCount > CONFIG.FW_NODE_MAX) nodeCount = CONFIG.FW_NODE_MAX;
      var timeLimit = Math.max(5, 15 - Math.floor(state.level / 10));
      var nodes = [];
      for (var i = 1; i <= nodeCount; i++) {
        nodes.push({
          num: i,
          x: 10 + Math.random() * 70,
          y: 10 + Math.random() * 70,
        });
      }
      var bonusMult = def.rewardMult * (1 + state.level * CONFIG.FW_REWARD_LEVEL_SCALE);
      return { type: type, dur: timeLimit, word: String(nodeCount), nodes: nodes, nodeStep: 0, rewardMult: bonusMult, penaltyMult: def.penaltyMult };
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
  if (state.typingEventActive) { scheduleTypingEvent(true); return; }
  var types = ['brute_force', 'command_chain', 'seq_num', 'seq_step', 'simon', 'firewall'];
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
  var seqOptions = document.getElementById('seqOptions');
  var simonGrid = document.getElementById('simonGrid');

  // Hide alternate UIs by default
  result.style.display = 'none';
  input.value = '';
  input.style.display = 'block';
  input.disabled = false;
  if (seqOptions) seqOptions.style.display = 'none';
  if (simonGrid) simonGrid.style.display = 'none';

  // Reset simon cells
  if (simonGrid) {
    var cells = simonGrid.querySelectorAll('.simonCell');
    for (var ci = 0; ci < cells.length; ci++) {
      cells[ci].classList.remove('active', 'lit', 'wrong');
    }
  }

  switch (type) {
    case 'brute_force':
      prompt.textContent = t('bruteForceKey', { key: data.word });
      hint.textContent = t('bruteForceHint') + ' [Enter]';
      display.textContent = data.word;
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
    case 'seq_num':
      input.style.display = 'none';
      prompt.textContent = t('seqNumTarget');
      hint.textContent = t('seqNumHint');
      display.textContent = data.display;
      if (seqOptions) {
        seqOptions.style.display = 'flex';
        var btns = seqOptions.querySelectorAll('.seqOptionBtn');
        for (var bi = 0; bi < btns.length && bi < data.options.length; bi++) {
          btns[bi].textContent = data.options[bi];
          btns[bi].dataset.value = data.options[bi];
        }
      }
      break;
    case 'seq_step':
      input.style.display = 'none';
      prompt.textContent = t('seqStepTarget');
      hint.textContent = t('seqStepHint');
      display.textContent = data.display;
      if (seqOptions) {
        seqOptions.style.display = 'flex';
        var btns2 = seqOptions.querySelectorAll('.seqOptionBtn');
        for (var bj = 0; bj < btns2.length && bj < data.options.length; bj++) {
          btns2[bj].textContent = data.options[bj];
          btns2[bj].dataset.value = data.options[bj];
        }
      }
      break;
    case 'simon':
      input.style.display = 'none';
      prompt.textContent = t('simonPrompt', { n: data.simonSeq.length });
      hint.textContent = '';
      display.textContent = '';
      if (simonGrid) simonGrid.style.display = 'grid';
      // Show sequence to player
      data._simonPlaying = true;
      playSimonSequence(data);
      break;
    case 'firewall':
      input.style.display = 'none';
      prompt.textContent = t('wallPrompt');
      hint.textContent = t('wallHint');
      display.className = 'typingDisplay firewall';
      display.textContent = '';
      // Render nodes inside display
      display.innerHTML = '';
      data.nodes.forEach(function (n) {
        var el = document.createElement('div');
        el.className = 'fwNode';
        el.textContent = n.num;
        el.style.left = n.x + '%';
        el.style.top = n.y + '%';
        el.setAttribute('data-num', n.num);
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          handleFirewallClick(parseInt(el.getAttribute('data-num')));
        });
        display.appendChild(el);
      });
      var stepEl = document.createElement('div');
      stepEl.className = 'wallStep';
      stepEl.id = 'wallStep';
      stepEl.textContent = t('wallStep', { n: 1, m: data.nodes.length });
      display.appendChild(stepEl);
      break;
  }

  timer.textContent = data.dur + 's';
  overlay.classList.add('open');
  addTermLines(['> Typing hack: ' + type]);

  if (type !== 'seq_num' && type !== 'seq_step' && type !== 'simon' && type !== 'firewall') {
    setTimeout(function () { input.focus(); }, 100);
  }

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
    // Simon timer update
    if (type === 'simon' && data._simonPlaying && data._simonState === 'play') {
      prompt.textContent = t('simonGo') + ' (' + data._remaining + 's)';
    }
  }, 1000);

  // Real-time character feedback (only for typing types)
  if (type !== 'seq_num' && type !== 'seq_step' && type !== 'simon' && type !== 'firewall') {
    display.dataset.expected = data.word;
    function onInput() {
      var val = input.value;
      var word = display.dataset.expected || '';
      var html = '';
      for (var i = 0; i < word.length; i++) {
        if (i < val.length) {
          if (val[i].toUpperCase() === word[i].toUpperCase()) {
            html += '<span style="color:#00ff00;text-shadow:0 0 4px #00ff00">' + word[i] + '</span>';
          } else {
            html += '<span style="color:#ff4400;text-shadow:0 0 4px #ff4400">' + word[i] + '</span>';
          }
        } else {
          html += '<span style="color:#666">' + word[i] + '</span>';
        }
      }
      display.innerHTML = html;
    }
    data._inputHandler = onInput;
    input.addEventListener('input', onInput);
  }
}

function playSimonSequence(data) {
  var cells = document.querySelectorAll('.simonCell');
  data._simonState = 'showing';
  data._simonIndex = 0;
  var prompt = document.getElementById('typingPrompt');

  function showNext() {
    if (data._simonIndex >= data.simonSeq.length) {
      // Done showing, let player play
      data._simonState = 'play';
      data._simonPlaying = false;
      data._simonStep = 0;
      prompt.textContent = t('simonGo');
      return;
    }
    var cellNum = data.simonSeq[data._simonIndex];
    // Turn off all
    for (var i = 0; i < cells.length; i++) cells[i].classList.remove('lit');
    // Light up current
    var cell = cells[cellNum - 1];
    if (cell) {
      cell.classList.add('lit');
      playSound('click');
    }
    data._simonIndex++;
    setTimeout(function () {
      for (var i = 0; i < cells.length; i++) cells[i].classList.remove('lit');
      setTimeout(showNext, 250);
    }, 500);
  }
  showNext();
}

function handleFirewallClick(num) {
  if (!state.typingEventActive || !state.typingEventData) return;
  var data = state.typingEventData;
  if (data.type !== 'firewall') return;

  if (num === data.nodeStep + 1) {
    data.nodeStep++;
    // Hide clicked node
    var el = document.querySelector('.fwNode[data-num="' + num + '"]');
    if (el) el.classList.add('fwNode-done');
    var stepEl = document.getElementById('wallStep');
    if (stepEl) stepEl.textContent = t('wallStep', { n: data.nodeStep + 1, m: data.nodes.length });
    playSound('click');
    if (data.nodeStep >= data.nodes.length) {
      endTypingEvent(true);
    }
  } else {
    // Flash nodes red briefly before failing
    var allNodes = document.querySelectorAll('.fwNode');
    for (var i = 0; i < allNodes.length; i++) {
      allNodes[i].style.borderColor = '#ff0044';
      allNodes[i].style.color = '#ff0044';
    }
    setTimeout(function () {
      endTypingEvent(false);
    }, 300);
  }
}

function submitSeqAnswer(answer) {
  if (!state.typingEventActive || !state.typingEventData) return;
  var data = state.typingEventData;
  var correct = data.word;
  if (String(answer) === correct) {
    endTypingEvent(true);
  } else {
    // Flash buttons red briefly before ending
    var btns = document.querySelectorAll('.seqOptionBtn');
    for (var i = 0; i < btns.length; i++) {
      btns[i].style.borderColor = '#ff0044';
      btns[i].style.color = '#ff0044';
    }
    setTimeout(function () {
      endTypingEvent(false);
    }, 300);
  }
}

function handleSimonClick(cellNum) {
  if (!state.typingEventActive || !state.typingEventData) return;
  var data = state.typingEventData;
  if (data._simonState !== 'play') return;
  if (data.type !== 'simon') return;

  var expected = data.simonSeq[data._simonStep];
  var cells = document.querySelectorAll('.simonCell');

  // Flash cell
  var cell = cells[cellNum - 1];
  if (cell) {
    cell.classList.add('active');
    setTimeout(function () { cell.classList.remove('active'); }, 200);
    playSound('click');
  }

  if (cellNum === expected) {
    data._simonStep++;
    if (data._simonStep >= data.simonSeq.length) {
      endTypingEvent(true);
    }
  } else {
    // Wrong cell
    if (cell) {
      cell.classList.add('wrong');
      playSound('event_bad');
    }
    setTimeout(function () {
      endTypingEvent(false);
    }, 400);
  }
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
        display.dataset.expected = data.word;
        input.value = '';
        input.focus();
      }
    } else {
      input.value = '';
      input.focus();
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
  if (state.bossGauntletActive) {
    endBossAttack(success);
    return;
  }
  state.typingEventActive = false;
  var data = state.typingEventData;
  var input = document.getElementById('typingInput');
  var display = document.getElementById('typingDisplay');
  var result = document.getElementById('typingResult');
  var overlay = document.getElementById('typingOverlay');
  var seqOptions = document.getElementById('seqOptions');
  var simonGrid = document.getElementById('simonGrid');

  input.disabled = true;
  input.style.display = 'block';
  if (typingTimerInterval) { clearInterval(typingTimerInterval); typingTimerInterval = null; }
  if (data && data._inputHandler) { input.removeEventListener('input', data._inputHandler); }
  display.dataset.expected = '';
  if (seqOptions) seqOptions.style.display = 'none';
  if (simonGrid) simonGrid.style.display = 'none';

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
    if (!data || !data._isBossAttack) {
      incrementBossMeter();
    }
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

  if (!state.bossGauntletActive) {
    scheduleTypingEvent();
  }

  setTimeout(function () {
    overlay.classList.remove('open');
    typingCaptchaActive = false;
    state.typingEventData = null;
    display.className = 'typingDisplay';
    display.style.fontSize = '';
    display.style.padding = '';
    display.style.color = '';
    display.style.textShadow = '';
    display.style.borderColor = '';
    display.style.background = '';
  }, 2000);
}

function skipTypingEvent() {
  if (state.bossGauntletActive) {
    failBossGauntlet();
    return;
  }
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

