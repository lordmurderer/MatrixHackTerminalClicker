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
    var bonus = Math.floor(state.data * CONFIG.EVENT_WINDFALL_PERCENT);
    if (bonus < 1) return;
    addData(bonus);
    playSound('event');
    showToast(t('eventWindfall') + ' +' + formatData(bonus), 'info');
    document.getElementById('eventIcon').textContent = evt.icon;
    document.getElementById('eventText').textContent = t('eventWindfall') + ' +' + formatData(bonus);
    document.getElementById('eventTimer').textContent = '';
    el.className = 'open event-info';
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
  } else {
    showToast(t(evt.descKey, { dur: evt.dur }), 'info');
  }
  playSound(evt.id === 'data_leak' ? 'event_bad' : 'event');
  document.getElementById('eventIcon').textContent = evt.icon;
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
  if (state.bossActive || state.firewallActive || state.eventActive) { scheduleBoss(); return; }
  state.bossActive = true;
  state.bossData = 0;
  var timeLimit = Math.max(CONFIG.BOSS_TIME_MIN, CONFIG.BOSS_TIME_BASE - Math.floor(state.level / CONFIG.BOSS_TIME_DIVISOR));
  state.bossThreshold = Math.floor(state.dps * timeLimit * (1 + state.level * CONFIG.BOSS_LEVEL_SCALE));
  playSound('boss_start');
  var overlay = document.getElementById('bossOverlay');
  overlay.classList.add('open');
  document.getElementById('bossInfo').textContent = t('bossInfo', { n: formatData(state.bossThreshold), t: timeLimit + 's' });
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
    var bonus = Math.floor(state.bossThreshold * CONFIG.BOSS_REWARD_FRACTION);
    addData(bonus);
    reward.textContent = t('bossSuccess', { n: formatData(bonus) });
    reward.style.color = '#00ff00';
    playSound('levelup');
    showToast(t('bossSuccess', { n: formatData(bonus) }), 'info');
  } else {
    reward.textContent = t('bossFail');
    reward.style.color = '#ff0044';
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
  if (!state.firewallEnabled) return;
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
    var bonus = Math.floor(state.dps * CONFIG.FW_REWARD_DPS_MULT * (1 + state.level * CONFIG.FW_REWARD_LEVEL_SCALE));
    addData(bonus);
    result.textContent = t('fwSuccess', { n: formatData(bonus) });
    result.className = 'fwResult success';
    playSound('levelup');
    calculateStats();
    bus.emit(EVENTS.DATA_CHANGED);
    showToast(t('fwSuccess', { n: formatData(bonus) }), 'info');
  } else {
    result.textContent = t('fwFail');
    result.className = 'fwResult fail';
    showToast(t('fwFail'), 'warn');
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
function gameLoop() {
  if (state.dps > 0) {
    var gain = state.dps / (1000 / CONFIG.GAME_LOOP_TICK_MS);
    addData(gain);
    if (state.bossActive) {
      state.bossData += gain;
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
      if (rootkitLevel > 0 && state.lastSaveTime && state.dps > 0) {
        var elapsed = (Date.now() - state.lastSaveTime) / 1000;
        var offlineData = Math.floor(state.dps * elapsed * rootkitLevel * CONFIG.OFFLINE_ROOTKIT_MULT);
        if (offlineData > 0) {
          playSound('offline');
          addData(offlineData);
          showToast(t('offline', { n: formatData(offlineData) }) + t('offlineExtra'), 'info');
        }
      }
      return true;
    }
  } catch (e) { console.error('[Load]', e); }
  return false;
}

function resetGame(hard) {
  localStorage.removeItem(SAVE_KEY);
  if (autoClickInterval) clearInterval(autoClickInterval);
  if (firewallTimeout) clearTimeout(firewallTimeout);
  if (firewallTimerInterval) clearTimeout(firewallTimerInterval);
  if (bossScheduleTimeout) clearTimeout(bossScheduleTimeout);
  if (eventScheduleTimeout) clearTimeout(eventScheduleTimeout);
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
  };
  initUpgrades();
  calculateStats();
  bus.emit(EVENTS.GAME_RESET);
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

