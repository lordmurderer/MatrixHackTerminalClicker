'use strict';

/* --- RENDER SECTIONS --- */
function updateHUD() {
  var prev = state._lastDisplayedData;
  var curr = Math.floor(state.data);
  dom.dataAmount.textContent = formatData(curr);
  if (curr > (prev || 0)) {
    dom.dataAmount.classList.remove('dataPulse');
    void dom.dataAmount.offsetWidth;
    dom.dataAmount.classList.add('dataPulse');
  }
  state._lastDisplayedData = curr;
  dom.clickPower.textContent = formatData(state.clickPower);
  dom.dpsValue.textContent = formatData(state.dps) + '/s';
  dom.critDisplay.textContent = state.critChance;
  dom.discountDisplay.textContent = state.discount;
  dom.playerLevel.textContent = t('level', { n: state.level });
}

function updateEventGlow() {
  var evtMult = getEventMultiplier();
  var statEls = document.querySelectorAll('#stats .stat');
  if (statEls.length >= 2) {
    statEls[0].classList.toggle('event-active', evtMult.click > 1);
    statEls[1].classList.toggle('event-active', evtMult.dps > 1);
    statEls[3].classList.toggle('event-active', evtMult.cost < 1);
  }
}

function updateLevelBar() {
  var dataFloor = Math.floor(state.data);
  var nextThreshold = LEVEL_THRESHOLDS[state.level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  var prevThreshold = LEVEL_THRESHOLDS[state.level - 1] || 0;
  var progress = (state.data - prevThreshold) / (nextThreshold - prevThreshold);
  dom.dataBarInner.style.width = Math.min(100, Math.max(0, progress * 100)) + '%';

  var nextMilestone = null;
  for (var i = 0; i < MILESTONES.length; i++) {
    if (dataFloor < MILESTONES[i]) {
      nextMilestone = MILESTONES[i];
      break;
    }
  }
  var milestoneText = nextMilestone ? t('milestoneLabel', { n: formatData(nextMilestone) }) : '\u221E';
  if (dom.milestoneInfo) dom.milestoneInfo.textContent = '>> ' + milestoneText;

  if (dom.milestoneMarkers) {
    dom.milestoneMarkers.innerHTML = '';
    for (var i = 0; i < MILESTONES.length; i++) {
      var m = MILESTONES[i];
      if (m < prevThreshold || m > nextThreshold) continue;
      var pct = ((m - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
      if (pct < 0 || pct > 100) continue;
      var marker = document.createElement('div');
      marker.className = 'milestoneMarker' + (dataFloor >= m ? ' reached' : '');
      marker.style.left = pct + '%';
      dom.milestoneMarkers.appendChild(marker);
    }
  }
}

function updateHeader() {
  if (dom.headerPrestige) {
    dom.headerPrestige.textContent = state.prestigeCount > 0
      ? 'x' + Number(state.prestigeMultiplier).toFixed(1)
      : '';
  }
  if (dom.headerTime) {
    dom.headerTime.textContent = formatTime(Math.floor(state.playTime));
  }
}

function updateSynergy() {
  if (dom.synergyDisplay) {
    var parts = [];
    if (state.synergy) parts.push(t('synergyScanner', { n: state.upgrades['cpu'] || 0 }));
    if (state.architect) parts.push(t('synergyArch', { n: Number(1 + state.architectCount * CONFIG.ARCHITECT_BONUS).toFixed(2) }));
    dom.synergyDisplay.textContent = parts.length ? '>> ' + parts.join(t('synergyDivider')) : '';
    dom.synergyDisplay.style.display = parts.length ? 'block' : 'none';
  }
}

function updatePrestige() {
  if (dom.prestigeInfo) {
    dom.prestigeInfo.textContent = t('prestigeLabel', { n: Number(state.prestigeMultiplier).toFixed(1) });
  }
  if (dom.prestigeReq) {
    var req = getPrestigeReq();
    var progress = Math.min(100, Math.floor(state.prestigeProgress / req * 100));
    dom.prestigeReq.textContent = progress + '% ▸ ' + formatData(req);
    if (dom.prestigeBtn) {
      var ready = state.prestigeProgress >= req;
      dom.prestigeBtn.disabled = !ready;
      dom.prestigeBtn.classList.toggle('ready', ready);
      dom.prestigeBtn.style.display = state.prestigeCount > 0 || state.prestigeProgress >= req * 0.3 ? 'inline-flex' : 'none';
      var btnSpan = dom.prestigeBtn.querySelector('span');
      if (btnSpan) btnSpan.textContent = ready ? t('prestigeReady') : t('prestigeBtn');
    }
  }
}

function updateCombo() {
  if (dom.comboDisplay) {
    if (state.combo > 1) {
      dom.comboDisplay.style.display = 'flex';
      var textEl = document.getElementById('comboText');
      if (textEl) textEl.textContent = t('comboLabel', { n: state.combo, m: Number(1 + state.combo * CONFIG.COMBO_MULT_PER_STACK).toFixed(1) });
      var bar = document.getElementById('comboBarInner');
      if (bar) {
        var elapsed = Date.now() - (state.lastClickTime || Date.now());
        var pct = Math.max(0, 100 - (elapsed / CONFIG.COMBO_TIMEOUT_MS) * 100);
        bar.style.width = pct + '%';
      }
    } else {
      dom.comboDisplay.style.display = 'none';
    }
  }
}

function updateAutoBuy() {
  var autoBtn = document.getElementById('autoBuyToggle');
  if (autoBtn) {
    var owned = (state.prestigeShop['autoBuy'] || 0) >= 1;
    var enabled = state.autoBuyEnabled && owned;
    autoBtn.style.display = owned ? 'inline-block' : 'none';
    autoBtn.classList.toggle('active', enabled);
    autoBtn.textContent = enabled ? t('autoBuyOn') : t('autoBuyOff');
  }
}

function renderAll() {
  if (RENDER.hud) { updateHUD(); RENDER.hud = false; }
  if (RENDER.eventGlow) { updateEventGlow(); RENDER.eventGlow = false; }
  if (RENDER.levelBar) { updateLevelBar(); RENDER.levelBar = false; }
  if (RENDER.header) { updateHeader(); RENDER.header = false; }
  if (RENDER.synergy) { updateSynergy(); RENDER.synergy = false; }
  if (RENDER.prestige) { updatePrestige(); RENDER.prestige = false; }
  if (RENDER.combo) { updateCombo(); RENDER.combo = false; }
  if (RENDER.autoBuy) { updateAutoBuy(); RENDER.autoBuy = false; }
  if (state._upgradesDirty) { renderUpgrades(); state._upgradesDirty = false; RENDER.upgradeState = false; }
  else if (RENDER.upgradeState) { refreshUpgradeState(); RENDER.upgradeState = false; }
  if (document.getElementById('achOverlay').classList.contains('open')) {
    renderAchievements();
  }
}

function getEffectText(u, owned) {
  switch (u.effect) {
    case 'click': return t('effectClick', { n: u.value * owned });
    case 'dps': return t('effectDps', { n: u.value * owned });
    case 'clickDps': return t('effectClickDps', { n: u.value * owned });
    case 'crit': return t('effectCrit', { n: u.value * owned });
    case 'critDmg': return t('effectCritDmg', { n: Number(u.value * owned).toFixed(1) });
    case 'discount': return t('effectDiscount', { n: u.value * owned });
    case 'autoclick': return t('effectAutoclick', { n: owned });
    case 'autoSpeed': return t('effectAutoSpeed', { n: u.value * owned });
    case 'comboBoost': return t('effectComboBoost', { n: Number(u.value * owned).toFixed(2) });
    case 'mult_click': return t('effectMultClick', { n: Number(Math.pow(u.value, owned)).toFixed(2) });
    case 'mult_dps': return t('effectMultDps', { n: Number(Math.pow(u.value, owned)).toFixed(2) });
    case 'offline': return t('effectOffline', { n: u.value * owned });
  }
  return '';
}

function getLegendaryReqText(u) {
  if (!u.legendaryReq) return '';
  var req = u.legendaryReq;
  var parts = [];
  if (req.minPrestige) parts.push('Prestige ' + req.minPrestige + '+');
  if (req.achievements) {
    req.achievements.forEach(function (aid) {
      var ach = ACHIEVEMENT_DEFS.find(function (a) { return a.id === aid; });
      if (ach) parts.push(t('ach' + ach.id.charAt(0).toUpperCase() + ach.id.slice(1)));
    });
  }
  if (req.upgrades) {
    req.upgrades.forEach(function (uid) {
      parts.push(t('upgrade.' + uid + '.name'));
    });
  }
  return parts.join(' + ');
}

function buildUpgradeTooltipHTML(u, owned, cost) {
  var nextEffect = getEffectText(u, owned + 1);
  var curEffect = owned > 0 ? getEffectText(u, owned) : t('upgrade.' + u.id + '.desc');
  var html = '<div class="tooltipTitle">' + t('upgrade.' + u.id + '.name') + '</div>';
  html += '<div class="tooltipDesc">' + t('upgrade.' + u.id + '.desc') + '</div>';
  var reqText = getLegendaryReqText(u);
  if (reqText) {
    html += '<div class="tooltipReq" style="color:rgb(255,140,0);font-size:0.55rem;border-top:1px solid rgba(255,140,0,0.2);padding-top:2px;margin-top:2px;">REQ: ' + reqText + '</div>';
  }
  html += '<div class="tooltipRow"><span>' + t('cardLvl') + '</span><span class="tooltipVal">' + owned + '</span></div>';
  if (owned > 0) {
    html += '<div class="tooltipRow"><span>NOW</span><span class="tooltipVal">' + curEffect + '</span></div>';
  }
  html += '<div class="tooltipRow"><span>NEXT</span><span class="tooltipVal">' + nextEffect + '</span></div>';
  html += '<div class="tooltipRow"><span>COST</span><span class="tooltipVal">' + formatData(cost) + '</span></div>';
  return html;
}

function renderUpgrades() {
  dom.upgradesGrid.innerHTML = '';
  var totalOwned = 0;

  UPGRADE_GROUPS.forEach(function (group) {
    var groupDefs = UPGRADE_DEFS.filter(function (u) { return group.ids.indexOf(u.id) !== -1 && isUpgradeUnlocked(u); });
    if (groupDefs.length === 0) return;

    var header = document.createElement('div');
    header.className = 'upgradeGroupHeader';
    header.textContent = t(group.labelKey);
    dom.upgradesGrid.appendChild(header);

    groupDefs.forEach(function (u) {
      var owned = state.upgrades[u.id] || 0;
      totalOwned += owned;
      var isMaxed = u.maxLevel > 0 && owned >= u.maxLevel;
      var cost = isMaxed ? Infinity : getUpgradeCost(u, owned);
      var card = document.createElement('div');
      card.className = 'upgradeCard';
      card.dataset.upgradeId = u.id;
      if (owned === 0) card.classList.add('unowned');
      if (owned > 0) card.classList.add('bought');
      if (state.data < cost) card.classList.add('locked');
      if (isMaxed) card.classList.add('maxed');
      if (u.rarity && u.rarity !== 'common') card.classList.add('rarity-' + u.rarity);

      var headerRow = document.createElement('div');
      headerRow.className = 'upgradeHeader';

      var iconSpan = document.createElement('span');
      iconSpan.className = 'upgradeIcon effect-' + u.effect;
      iconSpan.innerHTML = '<i class="fa-solid ' + u.icon + '"></i>';

      var nameSpan = document.createElement('span');
      nameSpan.className = 'upgradeNameText';
      nameSpan.textContent = t('upgrade.' + u.id + '.name');

      headerRow.appendChild(iconSpan);
      headerRow.appendChild(nameSpan);

      var badge = document.createElement('span');
      badge.className = 'effectBadge effect-' + u.effect;
      badge.textContent = u.effect.toUpperCase();
      headerRow.appendChild(badge);

      var descRow = document.createElement('div');
      descRow.className = 'upgradeDesc';
      descRow.textContent = t('upgrade.' + u.id + '.desc');

      var costRow = document.createElement('div');
      costRow.className = 'upgradeCost';
      costRow.textContent = isMaxed ? '\u2605 ' + t('buyMax') + ' \u2605' : formatData(cost);

      var ownedRow = document.createElement('div');
      ownedRow.className = 'upgradeOwned';
      if (isMaxed) {
        ownedRow.textContent = '\u2713 ' + t('cardLvl') + ' ' + owned + ' \u00B7 ' + getEffectText(u, owned);
        ownedRow.style.color = 'rgba(255, 204, 0, 0.65)';
      } else {
        var nextText = (u.maxLevel > 1 && owned < u.maxLevel) ? ' → ' + getEffectText(u, owned + 1) : '';
        ownedRow.textContent = t('cardLvl') + ' ' + owned + ' (' + getEffectText(u, owned) + ')' + nextText;
        ownedRow.style.color = '';
      }

      card.appendChild(headerRow);
      card.appendChild(descRow);
      card.appendChild(costRow);
      card.appendChild(ownedRow);

      if (u.maxLevel > 0) {
        var limitBar = document.createElement('div');
        limitBar.className = 'upgradeLimitBar';
        var limitInner = document.createElement('div');
        limitInner.className = 'upgradeLimitBarInner upgradeLimitRarity-' + (u.rarity || 'common');
        limitInner.style.width = (owned / u.maxLevel * 100) + '%';
        limitBar.appendChild(limitInner);
        card.appendChild(limitBar);
      }

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
    var visibleDefs = UPGRADE_DEFS.filter(function (u) { return isUpgradeUnlocked(u); });
    dom.upgradeCount.textContent = t('upgradeCount', { n: totalOwned, m: visibleDefs.length });
  }

  // Hint: next locked upgrade
  var nextLocked = null;
  var minUnlock = Infinity;
  UPGRADE_DEFS.forEach(function (u) {
    if (!isUpgradeUnlocked(u) && u.unlockAt < minUnlock) {
      minUnlock = u.unlockAt;
      nextLocked = u;
    }
  });
  var existingHint = dom.upgradesGrid.querySelector('.nextUpgradeHint');
  if (existingHint) existingHint.remove();
  if (nextLocked && dom.upgradesGrid.children.length > 0) {
    var hint = document.createElement('div');
    hint.className = 'nextUpgradeHint';
    var remaining = Math.max(0, nextLocked.unlockAt - state.prestigeProgress);
    hint.textContent = '🔒 ' + t('upgrade.' + nextLocked.id + '.name') + ' — ' + formatData(remaining);
    dom.upgradesGrid.appendChild(hint);
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
    var isMaxed = def.maxLevel > 0 && owned >= def.maxLevel;
    var cost = isMaxed ? Infinity : getUpgradeCost(def, owned);
    var costEl = card.querySelector('.upgradeCost');
    if (costEl) costEl.textContent = isMaxed ? '\u2605 ' + t('buyMax') + ' \u2605' : formatData(cost);
    card.classList.toggle('locked', !isMaxed && state.data < cost);
    card.classList.toggle('bought', owned > 0);
    card.classList.toggle('unowned', owned === 0);
    card.classList.toggle('maxed', isMaxed);
    var limitInner = card.querySelector('.upgradeLimitBarInner');
    if (limitInner && def.maxLevel > 0) {
      limitInner.style.width = (owned / def.maxLevel * 100) + '%';
    }
    var ownedRow = card.querySelector('.upgradeOwned');
    if (ownedRow) {
      if (isMaxed) {
        ownedRow.textContent = '\u2713 ' + t('cardLvl') + ' ' + owned + ' \u00B7 ' + getEffectText(def, owned);
        ownedRow.style.color = 'rgba(255, 204, 0, 0.65)';
      } else {
        var nextText = (def.maxLevel > 1 && owned < def.maxLevel) ? ' → ' + getEffectText(def, owned + 1) : '';
        ownedRow.textContent = t('cardLvl') + ' ' + owned + ' (' + getEffectText(def, owned) + ')' + nextText;
        ownedRow.style.color = '';
      }
    }
  }
}

