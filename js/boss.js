'use strict';

/* --- BOSS GAUNTLET --- */

var bossGauntletTimeout = null;
var bossMusicInterval = null;

function startBossMusic() {
  if (!audioCtx) return;
  if (bossMusicInterval) return;

  var ctx = audioCtx;
  var bpm = 120;
  var beatMs = 60000 / bpm;

  // Bass drone (low sine)
  var bassOsc = ctx.createOscillator();
  var bassGain = ctx.createGain();
  bassOsc.type = 'sine';
  bassOsc.frequency.value = 55;
  bassGain.gain.setValueAtTime(0.08, ctx.currentTime);
  bassOsc.connect(bassGain);
  bassGain.connect(ctx.destination);
  bassOsc.start();

  // Rhythmic pulse (square, gated)
  var pulseOsc = ctx.createOscillator();
  var pulseGain = ctx.createGain();
  pulseOsc.type = 'square';
  pulseOsc.frequency.value = 220;
  pulseGain.gain.setValueAtTime(0, ctx.currentTime);
  pulseOsc.connect(pulseGain);
  pulseGain.connect(ctx.destination);
  pulseOsc.start();

  var step = 0;
  bossMusicInterval = setInterval(function () {
    // Alternating pattern: accented and unaccented pulses
    var vol = step % 2 === 0 ? 0.06 : 0.03;
    pulseGain.gain.setValueAtTime(vol, ctx.currentTime);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beatMs / 1000 * 0.4);
    step++;
  }, beatMs * 0.5);

  bossMusicNodes = { bassOsc: bassOsc, bassGain: bassGain, pulseOsc: pulseOsc, pulseGain: pulseGain };
}

function stopBossMusic() {
  if (bossMusicInterval) {
    clearInterval(bossMusicInterval);
    bossMusicInterval = null;
  }
  if (bossMusicNodes) {
    try { bossMusicNodes.bassOsc.stop(); } catch (e) { /* ignore */ }
    try { bossMusicNodes.pulseOsc.stop(); } catch (e) { /* ignore */ }
    bossMusicNodes = null;
  }
}
var bossMusicNodes = null;

function incrementBossMeter() {
  if (state.bossMeter < CONFIG.BOSS_METER_REQUIRED) {
    state.bossMeter++;
    if (dom.bossMeterSection && dom.bossMeterText && dom.bossMeterLabel) {
      if (state.bossMeter >= CONFIG.BOSS_METER_REQUIRED) {
        dom.bossMeterSection.classList.add('ready');
        dom.bossMeterLabel.textContent = '☠ JEFE LISTO — CLIC PARA PELEAR';
        dom.bossMeterText.textContent = '';
        addTermLines(['[!] Boss gauntlet ready']);
      } else {
        dom.bossMeterText.textContent = state.bossMeter + '/' + CONFIG.BOSS_METER_REQUIRED;
      }
    }
  }
}

function startBossGauntlet() {
  if (state.bossGauntletActive) return;
  if (state.bossMeter < CONFIG.BOSS_METER_REQUIRED) return;
  if (state.eventActive) return;

  state.bossGauntletActive = true;
  state.bossMeter = 0;
  state.bossGauntletStep = 0;
  state.bossGauntletVariant = 'normal';

  // Generate 3 random attack types
  var types = ['brute_force', 'command_chain', 'captcha', 'seq_num', 'seq_step', 'simon', 'firewall'];
  var steps = [];
  for (var i = 0; i < 3; i++) {
    steps.push(types[Math.floor(Math.random() * types.length)]);
  }
  state.bossGauntletSteps = steps;

  if (dom.bossMeterSection) dom.bossMeterSection.classList.remove('ready');
  if (dom.bossMeterLabel) dom.bossMeterLabel.textContent = '☠ EVENTOS PARA JEFE';
  if (dom.bossMeterText) dom.bossMeterText.textContent = '0/' + CONFIG.BOSS_METER_REQUIRED;

  startBossMusic();
  showBossOverlay();
}

function showBossOverlay() {
  var overlay = document.getElementById('bossOverlay');
  var skull = document.getElementById('bossSkull');
  var info = document.getElementById('bossInfo');
  var timer = document.getElementById('bossTimer');
  var barInner = document.getElementById('bossBarInner');
  var reward = document.getElementById('bossReward');

  skull.textContent = getBossSkull();
  info.textContent = 'BOSS GAUNTLET — ' + state.bossGauntletVariant.toUpperCase();
  timer.textContent = 'Attack ' + (state.bossGauntletStep + 1) + '/' + state.bossGauntletSteps.length;
  reward.textContent = '';
  barInner.style.width = ((state.bossGauntletStep) / state.bossGauntletSteps.length * 100) + '%';

  overlay.classList.add('open');

  if (bossGauntletTimeout) clearTimeout(bossGauntletTimeout);
  bossGauntletTimeout = setTimeout(startNextBossAttack, 500);
}

function startNextBossAttack() {
  if (!state.bossGauntletActive) return;
  document.getElementById('bossOverlay').classList.remove('open');

  var step = state.bossGauntletStep;
  var type = state.bossGauntletSteps[step];

  // Find the TYPEVENT_DEF for this type
  var def = TYPEVENT_DEFS.find(function (d) { return d.id === type; });
  if (!def) { failBossGauntlet(); return; }

  // Generate typing event data with boss flag
  var data = generateTypingEventData(type);
  if (!data) { failBossGauntlet(); return; }
  data._isBossAttack = true;

  state.typingEventActive = true;
  state.typingEventData = data;

  showTypingEventUI(data, type);
}

function showTypingEventUI(data, type) {
  var overlay = document.getElementById('typingOverlay');
  var prompt = document.getElementById('typingPrompt');
  var hint = document.getElementById('typingHint');
  var display = document.getElementById('typingDisplay');
  var input = document.getElementById('typingInput');
  var timer = document.getElementById('typingTimer');
  var title = document.getElementById('typingTitle');
  var seqOptions = document.getElementById('seqOptions');
  var simonGrid = document.getElementById('simonGrid');

  // Set boss context title
  title.textContent = '☠ BOSS ATTACK ' + (state.bossGauntletStep + 1) + '/' + state.bossGauntletSteps.length;

  var result = document.getElementById('typingResult');
  result.style.display = 'none';
  input.value = '';
  input.style.display = 'block';
  input.disabled = false;
  if (seqOptions) seqOptions.style.display = 'none';
  if (simonGrid) simonGrid.style.display = 'none';

  var footEl = document.getElementById('typingFooter');
  if (footEl) footEl.style.display = 'flex';

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
      data._simonPlaying = true;
      playSimonSequence(data);
      break;
    case 'firewall':
      input.style.display = 'none';
      prompt.textContent = t('wallPrompt');
      hint.textContent = t('wallHint');
      display.innerHTML = '';
      display.className = 'typingDisplay firewall';
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
      endBossAttack(false);
      return;
    }
    timer.textContent = data._remaining + 's';
    if (type === 'simon' && data._simonState === 'play') {
      prompt.textContent = t('simonGo') + ' (' + data._remaining + 's)';
    }
  }, 1000);

  // Real-time character feedback (only for typing types)
  if (type !== 'seq_num' && type !== 'seq_step' && type !== 'simon' && type !== 'firewall') {
    display.dataset.expected = data.word;
    var inputHandler = function () {
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
    };
    data._inputHandler = inputHandler;
    input.addEventListener('input', inputHandler);
  }
}

function endBossAttack(success) {
  if (!state.typingEventActive) return;
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

  display.style.fontSize = '1.6rem';
  display.style.padding = '15px 10px';

  if (success) {
    display.textContent = '✔ ATTACK REPELLED';
    display.style.color = '#00ff00';
    display.style.textShadow = '0 0 20px rgba(0,255,0,0.5)';
    display.style.borderColor = '#00ff00';
    display.style.background = 'rgba(0,40,0,0.5)';
    result.textContent = '';
    playSound('levelup');
    addTermLines(['[✓] Boss attack ' + (state.bossGauntletStep + 1) + ' repelled']);
  } else {
    display.textContent = '✘ ATTACK HITS YOU';
    display.style.color = '#ff0044';
    display.style.textShadow = '0 0 20px rgba(255,0,68,0.5)';
    display.style.borderColor = '#ff0044';
    display.style.background = 'rgba(40,0,0,0.5)';
    result.textContent = '';
    playSound('event_bad');
    addTermLines(['[✗] Boss attack ' + (state.bossGauntletStep + 1) + ' hit']);
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

    if (success) {
      advanceBossGauntlet();
    } else {
      failBossGauntlet();
    }
  }, 1500);
}

function advanceBossGauntlet() {
  if (!state.bossGauntletActive) return;
  state.bossGauntletStep++;

  if (state.bossGauntletStep >= state.bossGauntletSteps.length) {
    completeBossGauntlet();
    return;
  }

  showBossOverlay();
}

function failBossGauntlet() {
  state.bossGauntletActive = false;
  state.typingEventActive = false;
  state.bossMeter = 0;
  state.bossGauntletSteps = [];
  state.bossGauntletStep = 0;
  stopBossMusic();
  document.getElementById('typingOverlay').classList.remove('open');
  if (typingTimerInterval) { clearInterval(typingTimerInterval); typingTimerInterval = null; }

  var overlay = document.getElementById('bossOverlay');
  var skull = document.getElementById('bossSkull');
  var info = document.getElementById('bossInfo');
  var reward = document.getElementById('bossReward');

  skull.textContent = getBossSkull();
  info.textContent = 'YOU HAVE BEEN DEFEATED';
  info.style.color = '#ff0044';
  reward.textContent = '';
  overlay.classList.add('open');

  var penalty = Math.floor(state.data * 0.2);
  state.data -= penalty;
  if (state.data < 0) state.data = 0;
  reward.textContent = '-' + formatData(penalty);
  reward.style.color = '#ff4444';

  if (dom.bossMeterLabel) dom.bossMeterLabel.textContent = '☠ EVENTOS PARA JEFE';
  if (dom.bossMeterText) dom.bossMeterText.textContent = '0/' + CONFIG.BOSS_METER_REQUIRED;

  addTermLines(['[✗] Boss gauntlet — defeated']);
  calculateStats();
  bus.emit(EVENTS.DATA_CHANGED);
}

function completeBossGauntlet() {
  state.bossGauntletActive = false;
  state.bossMeter = 0;
  state.bossGauntletSteps = [];
  state.bossGauntletStep = 0;
  state.totalBossGauntletWins++;
  stopBossMusic();

  // Mark variant as defeated
  var variant = state.bossGauntletVariant;
  if (!state.bossVariantsDefeated) state.bossVariantsDefeated = {};
  state.bossVariantsDefeated[variant] = true;

  var reward = Math.floor(state.dps * 50 * (1 + state.level * 0.1));
  if (reward < 1) reward = 1;
  addData(reward);

  var overlay = document.getElementById('bossOverlay');
  var skull = document.getElementById('bossSkull');
  var info = document.getElementById('bossInfo');
  var rewardEl = document.getElementById('bossReward');

  skull.textContent = getBossSkull();
  info.textContent = 'BOSS DESTROYED';
  info.style.color = '#00ff00';
  rewardEl.textContent = '+' + formatData(reward);
  rewardEl.style.color = '#00ff00';
  overlay.classList.add('open');

  playSound('levelup');
  showToast(t('bossSuccess', { n: formatData(reward) }), 'info');
  addTermLines(['[✓] Boss destroyed — +' + formatData(reward) + ' data']);
  calculateStats();
  bus.emit(EVENTS.DATA_CHANGED);

  if (dom.bossMeterLabel) dom.bossMeterLabel.textContent = '☠ EVENTOS PARA JEFE';
  if (dom.bossMeterText) dom.bossMeterText.textContent = '0/' + CONFIG.BOSS_METER_REQUIRED;
}

function getBossSkull() {
  return [
    '    ╔═══╗    ',
    '   ║ ╦ ╦ ║   ',
    '   ║ ║ ║ ║   ',
    '   ║ ╩ ╩ ║   ',
    '   ║     ║   ',
    '   ║ ═══ ║   ',
    '   ╚═╤═╤═╝   ',
    '  ══╪═╪══    ',
    '    ╚═╝      ',
  ].join('\n');
}
