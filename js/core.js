'use strict';

/* --- GAME LOGIC --- */
function addData(amount) {
  if (amount <= 0) return;
  state.data += amount;
  state.totalDataEarned += amount;
  state.prestigeProgress += amount;
}

function isUpgradeUnlocked(def) {
  if (state.prestigeProgress < def.unlockAt) return false;
  if (!def.legendaryReq) return true;
  var req = def.legendaryReq;
  if (req.minPrestige && (state.prestigeCount || 0) < req.minPrestige) return false;
  if (req.achievements) {
    for (var a = 0; a < req.achievements.length; a++) {
      if (!state.achievements[req.achievements[a]]) return false;
    }
  }
  if (req.upgrades) {
    for (var b = 0; b < req.upgrades.length; b++) {
      if (!state.upgrades[req.upgrades[b]] || state.upgrades[req.upgrades[b]] < 1) return false;
    }
  }
  return true;
}

function initUpgrades() {
  UPGRADE_DEFS.forEach(function (u) {
    if (!state.upgrades[u.id]) state.upgrades[u.id] = 0;
  });
}

function getUpgradeCost(def, level) {
  if (def.maxLevel && level >= def.maxLevel) return Infinity;
  var exponent = def.maxLevel > 0 ? CONFIG.COST_EXP_LIMITED : CONFIG.COST_EXP_UNLIMITED;
  var base = def.cost * Math.pow(exponent, level);
  var discountMult = Math.max(CONFIG.COST_DISCOUNT_MIN, 1 - (state.discount || 0) / 100);
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

function calcUpgradeEffects() {
  var r = { click: 1, dps: 0, crit: 0, disc: 0, multClick: 1, multDps: 1, critDmgBonus: 0, comboBoostBonus: 0, autoSpeedMs: CONFIG.AUTO_INTERVAL_DEFAULT };
  UPGRADE_DEFS.forEach(function (u) {
    var owned = state.upgrades[u.id] || 0;
    if (owned === 0) return;
    switch (u.effect) {
      case 'click': r.click += u.value * owned; break;
      case 'dps': r.dps += u.value * owned; break;
      case 'clickDps': r.click += u.value * owned; r.dps += u.value * owned; break;
      case 'crit': r.crit += u.value * owned; break;
      case 'critDmg': r.critDmgBonus += u.value * owned; break;
      case 'discount': r.disc += u.value * owned; break;
      case 'mult_click': r.multClick *= Math.pow(u.value, owned); break;
      case 'mult_dps': r.multDps *= Math.pow(u.value, owned); break;
      case 'comboBoost': r.comboBoostBonus += u.value * owned; break;
      case 'autoSpeed': r.autoSpeedMs = Math.min(r.autoSpeedMs, CONFIG.AUTO_INTERVAL_DEFAULT - u.value * owned); break;
    }
  });
  return r;
}

function calcArchitectCount() {
  var count = 0;
  UPGRADE_DEFS.forEach(function (u) {
    if ((state.upgrades[u.id] || 0) >= 10) count++;
  });
  return count;
}

function calcAchievementBonus() {
  var r = { clickMult: 1, dpsMult: 1, critBonus: 0, discountBonus: 0 };
  ACHIEVEMENT_DEFS.forEach(function (ach) {
    if (state.achievements[ach.id]) {
      if (ach.bonus.clickPercent) r.clickMult *= (1 + ach.bonus.clickPercent / 100);
      if (ach.bonus.dpsPercent) r.dpsMult *= (1 + ach.bonus.dpsPercent / 100);
      if (ach.bonus.critPercent) r.critBonus += ach.bonus.critPercent;
      if (ach.bonus.discountFlat) r.discountBonus += ach.bonus.discountFlat;
    }
  });
  return r;
}

function checkLevelUp() {
  state.level = getLevel();
  if (state.level > lastLevel) {
    playSound('levelup');
    showToast(t('level', { n: state.level }), 'info');
    addTermLines(['> SYSTEM UPGRADE — Node level ' + state.level, '> New capabilities online']);
  }
  lastLevel = state.level;
}

function calculateStats() {
  var upg = calcUpgradeEffects();

  state.critMultiplier = CONFIG.CRIT_MULTIPLIER_BASE + upg.critDmgBonus;
  state.autoInterval = Math.max(CONFIG.AUTO_INTERVAL_MIN, upg.autoSpeedMs);
  state.maxComboMult = Math.min(CONFIG.COMBO_BOOST_LIMIT, CONFIG.MAX_COMBO_MULT + upg.comboBoostBonus);

  // Synergy (scanner + cpu)
  var scannerLvl = state.upgrades['scanner'] || 0;
  var cpuLvl = state.upgrades['cpu'] || 0;
  state.synergy = scannerLvl >= 5 && cpuLvl > 0;
  if (state.synergy) upg.dps += cpuLvl;

  // Architect
  var archCount = calcArchitectCount();
  state.architectCount = archCount;
  state.architect = archCount > 0;
  if (state.architect) upg.multDps *= (1 + archCount * CONFIG.ARCHITECT_BONUS);

  // Overdrive+Grid synergy
  state.synergyOverdrive = (state.upgrades['overdrive'] || 0) >= 1 && (state.upgrades['grid'] || 0) >= 1;
  if (state.synergyOverdrive) upg.multClick *= 1.5;

  // Cipher+Keymaker synergy
  state.synergyCipher = (state.upgrades['cipher'] || 0) >= 1 && (state.upgrades['keymaker'] || 0) >= 1;
  if (state.synergyCipher) upg.multDps *= 2;

  // Combo Master synergy
  state.synergyCombo = (state.upgrades['rhythm'] || 0) >= 5 && (state.upgrades['flow'] || 0) >= 5 && (state.upgrades['momentum'] || 0) >= 5 && (state.upgrades['adrenaline'] || 0) >= 5;
  if (state.synergyCombo) state.maxComboMult = Math.min(CONFIG.COMBO_BOOST_LIMIT, state.maxComboMult + 10);

  // Meta Stack synergy
  state.synergyMeta = (state.upgrades['backdoor'] || 0) >= 3 && (state.upgrades['wormhole'] || 0) >= 3 && (state.upgrades['turbo'] || 0) >= 3 && (state.upgrades['nexus'] || 0) >= 3;
  if (state.synergyMeta) upg.disc += 5;

  state.clickPower = Math.floor(upg.click * upg.multClick * state.prestigeMultiplier);
  state.dps = Math.floor(upg.dps * upg.multDps * state.prestigeMultiplier * 10) / 10;

  // Achievement bonuses
  var ach = calcAchievementBonus();
  state.clickPower = Math.floor(state.clickPower * ach.clickMult);
  state.dps = Math.floor(state.dps * ach.dpsMult * 10) / 10;

  // Prestige shop bonuses
  state.clickPower = Math.floor(state.clickPower * getShopBonus('clickBoost'));
  state.dps = Math.floor(state.dps * getShopBonus('dpsBoost') * 10) / 10;
  upg.crit += getShopBonus('critBoost');

  // Event multipliers
  var evtMult = getEventMultiplier();
  state.clickPower = Math.floor(state.clickPower * evtMult.click);
  state.dps = Math.floor(state.dps * evtMult.dps * 10) / 10;

  state.critChance = upg.crit + ach.critBonus;
  state.discount = upg.disc + ach.discountBonus;
  checkLevelUp();
  if (state._lastAutoInterval !== state.autoInterval) {
    state._lastAutoInterval = state.autoInterval;
    state._autoDirty = true;
  }
}

function flashUpgradeCard(id) {
  var card = dom.upgradesGrid.querySelector('.upgradeCard[data-upgrade-id="' + id + '"]');
  if (card) {
    card.classList.add('bought-anim');
    setTimeout(function () { card.classList.remove('bought-anim'); }, CONFIG.BUY_FLASH_DURATION_MS);
  }
}

function buyUpgrade(id, count) {
  var def = UPGRADE_DEFS.find(function (u) { return u.id === id; });
  if (!def) return;
  if (count == null) count = state.buyMode === 'max' ? CONFIG.BUY_MAX_THRESHOLD : state.buyMode;
  var bought = 0;
  for (var i = 0; i < count; i++) {
    var currentLevel = state.upgrades[id] || 0;
    if (def.maxLevel && currentLevel >= def.maxLevel) break;
    var cost = getUpgradeCost(def, currentLevel);
    if (state.data < cost) break;
    state.data -= cost;
    state.upgrades[id] = currentLevel + 1;
    bought++;
  }
  if (bought === 0) return;
  playSound('buy');
  calculateStats();
  bus.emit(EVENTS.UPGRADES_CHANGED);

  // Flash animation on the purchased card (after DOM rebuild)
  flashUpgradeCard(id);
}

function tryBuyCheapest() {
  var best = null;
  var bestCost = Infinity;
  UPGRADE_DEFS.forEach(function (u) {
    if (!isUpgradeUnlocked(u)) return;
    var lvl = state.upgrades[u.id] || 0;
    var cost = getUpgradeCost(u, lvl);
    if (state.data >= cost && cost < bestCost) {
      best = u;
      bestCost = cost;
    }
  });
  if (best) {
    var lvl = state.upgrades[best.id] || 0;
    var cost = getUpgradeCost(best, lvl);
    if (state.data >= cost) {
      state.data -= cost;
      state.upgrades[best.id] = lvl + 1;
      calculateStats();
      bus.emit(EVENTS.UPGRADES_CHANGED);
      flashUpgradeCard(best.id);
    }
  }
}

function trackCombo() {
  var now = Date.now();
  if (state.lastClickTime && now - state.lastClickTime < CONFIG.COMBO_TIMEOUT_MS) {
    state.combo = Math.min(CONFIG.COMBO_MAX, state.combo + 1);
  } else {
    state.combo = 1;
  }
  state.lastClickTime = now;
  if (comboTimeout) clearTimeout(comboTimeout);
  comboTimeout = setTimeout(function () {
    state.combo = 0;
    state.lastClickTime = null;
    if (dom.comboDisplay) {
      dom.comboDisplay.classList.add('comboBreak');
      setTimeout(function () {
        dom.comboDisplay.style.display = 'none';
        dom.comboDisplay.classList.remove('comboBreak');
      }, CONFIG.COMBO_BREAK_ANIM_MS);
    }
  }, CONFIG.COMBO_TIMEOUT_MS);
  return 1 + state.combo * (CONFIG.COMBO_MULT_PER_STACK + getShopBonus('comboBoost'));
}

function applyClickFx(x, y, isCrit) {
  if (isCrit) {
    state.totalCrits++;
    playSound('crit');
    spawnFloatingCrit(x, y, t('critText'));
    dom.hackBtn.animate([
      { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)' },
      { opacity: 0.2, boxShadow: '0 0 30px rgba(0,255,0,0.6)', offset: 0.25 },
      { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)', offset: 0.5 },
      { opacity: 0.3, boxShadow: '0 0 20px rgba(0,255,0,0.4)', offset: 0.75 },
      { opacity: 1, boxShadow: '0 0 8px rgba(0,255,0,0.2)' }
    ], { duration: CONFIG.CRIT_ANIM_DURATION_MS, easing: 'ease' });
  } else {
    playSound('click');
    dom.hackBtn.animate([
      { opacity: 1 },
      { opacity: 0.2, offset: 0.25 },
      { opacity: 1, offset: 0.5 },
      { opacity: 0.3, offset: 0.75 },
      { opacity: 1 }
    ], { duration: CONFIG.CRIT_ANIM_DURATION_MS, easing: 'ease' });
  }
}

function doClick(e, isAuto) {
  var rect = dom.hackBtn.getBoundingClientRect();
  var gameRect = document.getElementById('gameArea').getBoundingClientRect();
  var cx = (e ? e.clientX : rect.left + rect.width / 2) - gameRect.left;
  var cy = (e ? e.clientY : rect.top + rect.height / 2) - gameRect.top;
  if (!isAuto) spawnClickParticles(rect.left + (e ? e.clientX - rect.left : rect.width / 2), rect.top + (e ? e.clientY - rect.top : rect.height / 2));
  var gained = state.clickPower;
  var isCrit = false;

  if (!isAuto) {
    var comboMult = trackCombo();
    gained = Math.floor(gained * comboMult);
  }

  if (!isAuto && state.critChance > 0 && Math.random() * 100 < state.critChance) {
    gained *= state.critMultiplier || CONFIG.CRIT_MULTIPLIER_BASE;
    isCrit = true;
  }

  applyClickFx(cx, cy, isCrit);

  if (isAuto) {
    addTermLines(['[AUTO] exploit 0x' + Math.floor(Math.random() * 0xFFFF).toString(16), '+ ' + formatData(gained) + '  OK']);
  } else if (isCrit) {
    addTermLines(['⚠ CRITICAL — Overflow x' + state.critMultiplier, '+ ' + formatData(gained)]);
  } else {
    addTermLines(['> ./hack.exe — target 0x' + Math.floor(Math.random() * 0xFFFF).toString(16), '[' + '\u2588'.repeat(8) + '\u2592\u2592' + ']  78%', '[' + '\u2588'.repeat(10) + '] 100%', '+ ' + formatData(gained)]);
  }

  // Shield boss: clicks damage shield
  if (state.bossActive && state.bossType === 'shield' && state.bossShieldHp > 0) {
    var shieldDmg = Math.ceil(gained / state.clickPower); // each full clickPower = 1 shield dmg
    state.bossShieldHp = Math.max(0, state.bossShieldHp - shieldDmg);
    var shieldBar = document.getElementById('bossShieldBar');
    if (shieldBar) {
      var maxShield = CONFIG.BOSS_SHIELD_CLICKS_BASE + Math.floor(state.level / 3);
      shieldBar.style.width = (state.bossShieldHp / maxShield * 100) + '%';
    }
    if (state.bossShieldHp <= 0) {
      var variantHint = document.getElementById('bossVariantHint');
      if (variantHint) variantHint.textContent = '✓ SHIELD DOWN';
    }
  }

  addData(gained);
  state.totalClicks++;
  calculateStats();
  bus.emit(EVENTS.DATA_CHANGED);
  if (!isAuto) bus.emit(EVENTS.COMBO_CHANGED);

  var prefix = isAuto ? t('autoPrefix') + ' ' : '';
  spawnFloatingText(cx, cy, prefix + '+' + formatData(gained));
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
  el.style.left = x + 'px';
  el.style.top = y + 'px';
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
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  floatingContainer.appendChild(el);
  el.addEventListener('animationend', function () { el.remove(); });
}

/* --- PARTICLES --- */
function spawnClickParticles(cx, cy) {
  var count = 12;
  var skin = getSkin();
  var colors = [skin.colors.body || '#00ff66', skin.colors.shadow || '#00ff00', '#ff8800'];
  for (var i = 0; i < count; i++) {
    var angle = Math.random() * Math.PI * 2;
    var speed = 1 + Math.random() * 3;
    particles.push({
      x: cx + (Math.random() - 0.5) * 10,
      y: cy + (Math.random() - 0.5) * 10,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      life: 25 + Math.floor(Math.random() * 15),
      maxLife: 40,
      size: 2 + Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  if (particles.length > 200) particles.splice(0, particles.length - 200);
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

