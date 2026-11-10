document.addEventListener('DOMContentLoaded', () => {
  const activePage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((link) => {
    if (link.getAttribute('href') === activePage) link.classList.add('active');
  });
  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
  setupTrivia();
  setupMusic();
  setupBattle();
});

function setupTrivia() {
  const questions = {
    easy: [
      ['What is the name of the wizarding school Harry attends?', ['Beauxbatons', 'Hogwarts', 'Durmstrang', 'Ilvermorny'], 1],
      ['Who is Harry’s brilliant and loyal friend?', ['Hermione Granger', 'Luna Lovegood', 'Cho Chang', 'Ginny Weasley'], 0],
      ['How many main Harry Potter novels are there?', ['Five', 'Six', 'Seven', 'Eight'], 2],
      ['What is the name of Harry’s owl?', ['Crookshanks', 'Hedwig', 'Fawkes', 'Pigwidgeon'], 1],
      ['Which house is one of Hogwarts’ four houses?', ['Camelot', 'Gryffindor', 'Rivendell', 'Mordor'], 1]
    ],
    hard: [
      ['Who founded Hufflepuff House?', ['Helga Hufflepuff', 'Rowena Ravenclaw', 'Godric Gryffindor', 'Salazar Slytherin'], 0],
      ['What is the name of the wizarding bank?', ['Gringotts', 'The Leaky Cauldron', 'Ollivanders', 'St Mungo’s'], 0],
      ['What is the core of Harry’s wand?', ['Dragon heartstring', 'Phoenix feather', 'Unicorn hair', 'Veela hair'], 1],
      ['Which potion changes the drinker’s appearance?', ['Felix Felicis', 'Amortentia', 'Polyjuice Potion', 'Wolfsbane'], 2],
      ['Which spell summons a Patronus?', ['Lumos', 'Expecto Patronum', 'Accio', 'Obliviate'], 1],
      ['Who wrote A History of Magic?', ['Bathilda Bagshot', 'Miranda Goshawk', 'Newt Scamander', 'Gilderoy Lockhart'], 0],
      ['What is the name of the Weasley family home?', ['Shell Cottage', 'The Burrow', 'Grimmauld Place', 'Spinner’s End'], 1],
      ['Which dragon does Harry face in the Triwizard Tournament?', ['Hungarian Horntail', 'Chinese Fireball', 'Swedish Short-Snout', 'Common Welsh Green'], 0],
      ['What is the name of the house-elf who serves the Malfoys?', ['Kreacher', 'Winky', 'Dobby', 'Hokey'], 2],
      ['What does the Marauder’s Map reveal?', ['The future', 'People’s locations in Hogwarts', 'Hidden Horcruxes', 'A person’s thoughts'], 1]
    ]
  };
  ['easy', 'hard'].forEach((level) => {
    const root = document.getElementById(`${level}Quiz`);
    if (!root) return;
    const questionsForLevel = questions[level];
    const questionNode = document.getElementById(`${level}Question`);
    const optionsNode = document.getElementById(`${level}Options`);
    const scoreNode = document.getElementById(`${level}Score`);
    const wrongNode = document.getElementById(`${level}Wrong`);
    const startButton = document.getElementById(`${level}Start`);
    let index = 0;
    let score = 0;
    let missed = [];
    let answered = false;
    let nextTimer;

    const render = () => {
      if (index >= questionsForLevel.length) {
        questionNode.textContent = `Quiz complete! You scored ${score} out of ${questionsForLevel.length}.`;
        optionsNode.replaceChildren();
        wrongNode.textContent = missed.length ? `Missed: ${missed.join(' | ')}` : 'Wrong answers: none — perfect!';
        startButton.disabled = false;
        startButton.textContent = 'Play again';
        return;
      }
      const [text, choices, correct] = questionsForLevel[index];
      questionNode.textContent = `${index + 1}. ${text}`;
      optionsNode.replaceChildren();
      choices.forEach((choice, choiceIndex) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = choice;
        button.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          optionsNode.querySelectorAll('button').forEach((option, i) => {
            option.disabled = true;
            if (i === correct) option.classList.add('correct');
            if (i === choiceIndex && i !== correct) option.classList.add('incorrect');
          });
          if (choiceIndex === correct) score += 1;
          else missed.push(`${index + 1}. ${text} (answer: ${choices[correct]})`);
          scoreNode.textContent = `Score: ${score}/${questionsForLevel.length}`;
          wrongNode.textContent = missed.length ? `Missed: ${missed.join(' | ')}` : 'Missed: none';
          nextTimer = setTimeout(() => { index += 1; answered = false; render(); }, 900);
        });
        optionsNode.append(button);
      });
    };

    startButton.addEventListener('click', () => {
      clearTimeout(nextTimer);
      index = 0;
      score = 0;
      missed = [];
      answered = false;
      startButton.disabled = true;
      wrongNode.textContent = 'Missed: none';
      scoreNode.textContent = `Score: 0/${questionsForLevel.length}`;
      render();
    });
  });
}

function setupMusic() {
  const toggle = document.getElementById('musicToggle');
  if (!toggle) return;
  let context;
  let timer;
  let playing = false;
  const playNote = (frequency, start, duration, volume, type) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  };
  const loop = () => {
    if (!playing) return;
    const now = context.currentTime;
    const chords = [[196, 233, 294], [174, 220, 262], [146, 196, 247], [164, 207, 262]];
    const chord = chords[Math.floor(Date.now() / 4000) % chords.length];
    chord.forEach((note, i) => playNote(note, now + i * 0.04, 2.8, 0.018, 'triangle'));
    playNote(chord[2] * 2, now + 0.6, 0.16, 0.012, 'sine');
    playNote(chord[1] * 2, now + 1.5, 0.12, 0.01, 'sine');
    timer = setTimeout(loop, 4000);
  };
  toggle.addEventListener('click', async () => {
    if (!context) context = new (window.AudioContext || window.webkitAudioContext)();
    if (context.state === 'suspended') await context.resume();
    playing = !playing;
    toggle.textContent = playing ? 'Pause chill music' : 'Play chill music';
    toggle.setAttribute('aria-pressed', String(playing));
    clearTimeout(timer);
    if (playing) loop();
  });
}

function setupBattle() {
  const canvas = document.getElementById('battleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const arena = document.getElementById('arena');
  const state = {
    active: true, ended: false, last: 0, stage: 1, elapsed: 0, phase: 1,
    player: { x: 500, y: 500, radius: 32, speed: 245, hp: 100, burn: 0, stun: 0, shield: 0, slippery: 0 },
    shots: [], lasers: [], trails: [], keys: new Set(), spawn: 0, horde: 0, shop: false,
    counts: JSON.parse(localStorage.getItem('hpTokens') || '{"red":0,"blue":0,"orange":0,"fire":0,"laser":0,"stun":0}'),
    spells: JSON.parse(localStorage.getItem('hpSpells') || '[]'),
    cooldown: {}, score: 0, steam: [], audio: null, soundOn: false, musicTimer: 0
  };
  const kinds = ['red', 'blue', 'orange', 'fire', 'laser', 'stun'];
  const labels = { red: 'Stupefy', blue: 'Protego', orange: 'Accio', fire: 'Incendio', laser: 'Finite Incantatem', stun: 'Expecto Patronum' };
  const shop = document.getElementById('shopPanel');
  const pause = document.getElementById('pausePanel');
  const end = document.getElementById('endPanel');

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    ctx.setTransform(canvas.width / 1000, 0, 0, canvas.height / 1000, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function updateHud() {
    document.getElementById('stageLabel').textContent = `Stage ${state.stage} / 5`;
    document.getElementById('phaseLabel').textContent = state.stage === 5 ? `Boss phase ${state.phase} / 3` : ['The castle is quiet', 'Fire and warning beams', 'Homing curses', 'Horde incoming'][state.stage - 1];
    document.getElementById('healthLabel').textContent = `${Math.max(0, Math.ceil(state.player.hp))} HP`;
    document.getElementById('healthBar').style.width = `${Math.max(0, state.player.hp)}%`;
    document.getElementById('spellBar').replaceChildren();
    state.spells.forEach((kind, i) => {
      const button = document.createElement('button');
      button.className = 'game-button spell-slot';
      button.textContent = `${i + 1} · ${labels[kind]}`;
      button.title = `Use ${labels[kind]} (key ${i + 1})`;
      button.addEventListener('click', () => cast(kind));
      document.getElementById('spellBar').append(button);
    });
  }

  function renderShop() {
    document.getElementById('tokenCount').textContent = kinds.map((kind) => `${labels[kind]}: ${state.counts[kind]}`).join('  ·  ');
    const list = document.getElementById('shopItems');
    list.replaceChildren();
    kinds.forEach((kind) => {
      const row = document.createElement('div');
      row.className = 'shop-row';
      const description = document.createElement('span');
      description.textContent = `${labels[kind]} · 50 ${kind} tokens`;
      const button = document.createElement('button');
      button.className = 'game-button';
      button.textContent = state.spells.includes(kind) ? 'Owned' : 'Buy';
      button.disabled = state.spells.includes(kind) || state.counts[kind] < 50 || state.spells.length >= 6;
      button.addEventListener('click', () => {
        if (state.counts[kind] < 50 || state.spells.includes(kind)) return;
        state.counts[kind] -= 50;
        state.spells.push(kind);
        localStorage.setItem('hpSpells', JSON.stringify(state.spells));
        localStorage.setItem('hpTokens', JSON.stringify(state.counts));
        renderShop();
        updateHud();
      });
      row.append(description, button);
      list.append(row);
    });
  }

  function pointOnSegment(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy || 1)));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }
  function makeShot(kind, x, y, angle, speed, options = {}) {
    const shot = { kind, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, size: kind === 'red' ? 12 : 10, entered: x >= 0 && x <= 1000 && y >= 0 && y <= 1000, homing: options.homing || false, horde: options.horde || false, timer: 0, hit: false };
    state.shots.push(shot);
    return shot;
  }
  function spawn(kind) {
    const side = Math.floor(Math.random() * 4);
    let x = Math.random() * 1000, y = Math.random() * 1000;
    if (side === 0) y = -16;
    if (side === 1) x = 1016;
    if (side === 2) y = 1016;
    if (side === 3) x = -16;
    const angle = Math.atan2(500 - y, 500 - x);
    const speed = 145 + Math.min(state.stage - 1, 1) * 55 + Math.max(0, state.stage - 2) * 24;
    makeShot(kind, x, y, angle + (Math.random() - 0.5) * 0.18, speed, { homing: kind.includes('homing') || kind === 'orange' });
  }
  function spawnLaser() {
    const horizontal = Math.random() > 0.5;
    const line = horizontal ? { x1: 0, y1: 120 + Math.random() * 760, x2: 1000, y2: 120 + Math.random() * 760, warning: 1.2, live: 0.45 } :
      { x1: 120 + Math.random() * 760, y1: 0, x2: 120 + Math.random() * 760, y2: 1000, warning: 1.2, live: 0.45 };
    line.y2 = horizontal ? line.y1 : 1000;
    line.x2 = horizontal ? 1000 : line.x1;
    line.kind = 'laser';
    state.lasers.push(line);
  }
  function chooseAttack() {
    if (state.stage === 1) return ['red', 'blue', 'orange'][Math.floor(Math.random() * 3)];
    if (state.stage === 2) return ['red', 'blue', 'orange', 'fire', 'laser'][Math.floor(Math.random() * 5)];
    if (state.stage === 3) return ['blue-homing', 'fire-homing', 'stun'][Math.floor(Math.random() * 3)];
    return ['red', 'blue', 'orange', 'fire', 'stun'][Math.floor(Math.random() * 5)];
  }
  function spawnHorde() {
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 30 + Math.random() * 350;
      makeShot('red', 500 + Math.cos(angle) * radius, 500 + Math.sin(angle) * radius, Math.random() * Math.PI * 2, 220 + Math.random() * 30, { horde: true });
    }
  }

  function playGameMusic() {
    if (!state.soundOn) return;
    if (!state.active) {
      state.musicTimer = window.setTimeout(playGameMusic, 500);
      return;
    }
    const now = state.audio.currentTime;
    const notes = [196, 220, 262, 294, 330];
    const frequency = notes[state.stage - 1] * (1 + (state.stage - 1) * 0.08);
    const oscillator = state.audio.createOscillator();
    const gain = state.audio.createGain();
    oscillator.type = state.stage < 3 ? 'triangle' : 'sawtooth';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.018, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
    oscillator.connect(gain); gain.connect(state.audio.destination);
    oscillator.start(now); oscillator.stop(now + 0.55);
    state.musicTimer = window.setTimeout(playGameMusic, Math.max(300, 1150 - state.stage * 150));
  }
  async function toggleGameMusic() {
    if (!state.audio) state.audio = new (window.AudioContext || window.webkitAudioContext)();
    if (state.audio.state === 'suspended') await state.audio.resume();
    state.soundOn = !state.soundOn;
    document.getElementById('soundToggle').textContent = `Sound: ${state.soundOn ? 'on' : 'off'}`;
    window.clearTimeout(state.musicTimer);
    if (state.soundOn) playGameMusic();
  }

  function cast(kind) {
    if (!state.active || !state.spells.includes(kind) || (state.cooldown[kind] || 0) > 0) return;
    state.cooldown[kind] = 4;
    if (kind === 'red') {
      state.shots = state.shots.filter((shot) => Math.hypot(shot.x - state.player.x, shot.y - state.player.y) > 175);
    } else if (kind === 'blue') {
      state.player.shield = 2.5;
    } else if (kind === 'orange') {
      state.shots.forEach((shot) => { shot.vx *= 0.25; shot.vy *= 0.25; });
      state.player.slippery = 0;
    } else if (kind === 'fire') {
      state.player.burn = 0;
      state.player.hp = Math.min(100, state.player.hp + 20);
      state.shots = state.shots.filter((shot) => !shot.kind.startsWith('fire'));
    } else if (kind === 'laser') {
      state.lasers = [];
      state.player.shield = 1.5;
    } else if (kind === 'stun') {
      state.shots = state.shots.filter((shot) => Math.hypot(shot.x - state.player.x, shot.y - state.player.y) > 250);
    }
  }

  function startOver() {
    state.active = true; state.ended = false; state.last = 0; state.stage = 1; state.elapsed = 0; state.phase = 1;
    state.player = { x: 500, y: 500, radius: 32, speed: 245, hp: 100, burn: 0, stun: 0, shield: 0, slippery: 0 };
    state.shots = []; state.lasers = []; state.trails = []; state.spawn = 0; state.horde = 0; state.score = 0; state.cooldown = {};
    [pause, end, shop].forEach((panel) => { panel.hidden = true; });
    updateHud();
    if (state.soundOn) playGameMusic();
  }

  function finish(won) {
    state.active = false;
    state.ended = true;
    document.getElementById('endTitle').textContent = won ? 'You Win!' : 'Battle Lost';
    document.getElementById('endMessage').textContent = won ? 'You survived all five stages. Your purchased spells are saved—play again?' : 'The curses caught up with you. Your purchased spells are saved—try again?';
    document.getElementById('retryButton').textContent = won ? 'Play Again' : 'Retry';
    window.clearTimeout(state.musicTimer);
    state.soundOn = false;
    document.getElementById('soundToggle').textContent = 'Sound: off';
    end.hidden = false;
  }

  function update(dt) {
    state.elapsed += dt;
    if (state.stage < 5) {
      if (state.elapsed >= 20) {
        state.elapsed = 0;
        state.stage += 1;
      }
    } else {
      state.phase = Math.min(3, Math.floor(state.elapsed / 12) + 1);
      if (state.elapsed >= 36) { finish(true); return; }
    }
    Object.keys(state.cooldown).forEach((kind) => { state.cooldown[kind] = Math.max(0, state.cooldown[kind] - dt); });
    const player = state.player;
    player.stun = Math.max(0, player.stun - dt);
    player.shield = Math.max(0, player.shield - dt);
    player.slippery = Math.max(0, player.slippery - dt);
    player.burn = Math.max(0, player.burn - dt);
    if (player.burn > 0) player.hp -= dt;
    if (player.stun <= 0) {
      const speed = player.speed * (player.burn > 0 ? 0.8 : 1) * (player.slippery > 0 ? 0.55 : 1);
      let dx = Number(state.keys.has('ArrowRight') || state.keys.has('d')) - Number(state.keys.has('ArrowLeft') || state.keys.has('a'));
      let dy = Number(state.keys.has('ArrowDown') || state.keys.has('s')) - Number(state.keys.has('ArrowUp') || state.keys.has('w'));
      const length = Math.hypot(dx, dy) || 1;
      player.x = Math.max(35, Math.min(965, player.x + dx / length * speed * dt));
      player.y = Math.max(35, Math.min(965, player.y + dy / length * speed * dt));
    }

    state.spawn += dt;
    const boss = state.stage === 5;
    const laserPhase = boss && (state.phase === 1 || state.phase === 3);
    const nonLaserPhase = !boss || state.phase >= 2;
    const spawnEvery = state.stage === 1 ? 1.4 : state.stage === 2 ? 1.05 : state.stage === 3 ? 0.85 : 0.72;
    state.horde = Math.max(0, state.horde - dt);
    if (state.stage === 4 && !boss) {
      if (state.horde === 0 && Math.random() < dt * 0.08) {
        state.horde = 1.8;
        state.spawn = 0;
        spawnHorde();
      } else if (state.horde === 0 && state.spawn > spawnEvery) {
        state.spawn = 0;
        spawn(chooseAttack());
      }
    } else if (!boss && state.stage < 5 && state.spawn > spawnEvery) {
      state.spawn = 0;
      const kind = chooseAttack();
      if (kind === 'laser') spawnLaser(); else spawn(kind);
    } else if (boss && laserPhase && state.spawn > 1.4) {
      state.spawn = 0;
      spawnLaser();
      if (nonLaserPhase && state.phase === 3 && Math.random() < 0.75) spawn(chooseAttack());
      if (state.phase === 3 && Math.random() < dt * 0.08) spawnHorde();
    } else if (boss && state.phase === 2 && state.spawn > 0.75) {
      state.spawn = 0;
      spawn(chooseAttack());
    }
    if (boss && state.phase === 2 && Math.random() < dt * 0.08) spawnHorde();
    state.shots.forEach((shot) => {
      if (state.stage === 4 && state.horde > 0 && !shot.horde) return;
      shot.timer += dt;
      shot.trailTimer = (shot.trailTimer || 0) + dt;
      if (shot.homing && shot.timer < 2) {
        const angle = Math.atan2(player.y - shot.y, player.x - shot.x);
        const speed = Math.hypot(shot.vx, shot.vy);
        shot.vx += (Math.cos(angle) * speed - shot.vx) * dt * 1.1;
        shot.vy += (Math.sin(angle) * speed - shot.vy) * dt * 1.1;
      }
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (shot.trailTimer > 0.09) {
        const trailKind = shot.kind.startsWith('blue') ? 'blue' : shot.kind.startsWith('fire') ? 'fire' : null;
        if (trailKind) {
          const trail = { x: shot.x, y: shot.y, kind: trailKind, life: 1.5 };
          for (const other of state.trails) {
            if (other.kind !== trailKind && Math.hypot(trail.x - other.x, trail.y - other.y) < 30) {
              state.steam.push({ x: trail.x, y: trail.y, life: 1.2 });
              break;
            }
          }
          state.trails.push(trail);
          shot.trailTimer = 0;
        }
      }
      if (shot.x >= 0 && shot.x <= 1000 && shot.y >= 0 && shot.y <= 1000) shot.entered = true;
      if (shot.entered && (shot.x < -25 || shot.x > 1025 || shot.y < -25 || shot.y > 1025)) {
        const token = shot.kind.replace('-homing', '');
        if (state.counts[token] !== undefined) {
          state.counts[token] += 1;
          localStorage.setItem('hpTokens', JSON.stringify(state.counts));
        }
        shot.gone = true;
      }
      const distance = Math.hypot(shot.x - player.x, shot.y - player.y);
      if (distance < shot.size + player.radius && !shot.hit) {
        shot.hit = true;
        shot.gone = true;
        if (!player.shield) {
          if (shot.kind === 'fire' || shot.kind === 'fire-homing') player.burn = 5;
          else if (shot.kind === 'stun') player.stun = 1;
          else if (shot.kind === 'blue' || shot.kind === 'blue-homing') player.slippery = 2;
          else player.hp -= 10;
        }
      }
    });
    state.shots = state.shots.filter((shot) => !shot.gone);
    state.trails.forEach((trail) => {
      trail.life -= dt;
      if (trail.kind === 'blue' && Math.hypot(trail.x - player.x, trail.y - player.y) < 30) player.slippery = Math.max(player.slippery, 0.7);
      if (trail.kind === 'fire' && Math.hypot(trail.x - player.x, trail.y - player.y) < 30) player.burn = Math.max(player.burn, 0.7);
    });
    state.trails = state.trails.filter((trail) => trail.life > 0);
    state.lasers.forEach((laser) => {
      if (laser.warning > 0) {
        laser.warning -= dt;
        if (laser.warning <= 0) {
          const d = pointOnSegment(player.x, player.y, laser.x1, laser.y1, laser.x2, laser.y2);
          if (d < player.radius + 12 && !player.shield) player.hp = 0;
        }
      } else {
        laser.live -= dt;
        if (laser.live <= 0 && !laser.gone) {
          state.counts.laser += 1;
          localStorage.setItem('hpTokens', JSON.stringify(state.counts));
          laser.gone = true;
        }
      }
    });
    state.lasers = state.lasers.filter((laser) => !laser.gone);
    state.steam.forEach((cloud) => { cloud.life -= dt; });
    state.steam = state.steam.filter((cloud) => cloud.life > 0);
    if (player.hp <= 0) finish(false);
    updateHud();
  }

  function draw() {
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.fillStyle = '#100a19'; ctx.fillRect(0, 0, 1000, 1000);
    const gradient = ctx.createRadialGradient(500, 500, 30, 500, 500, 700);
    gradient.addColorStop(0, '#302044'); gradient.addColorStop(1, '#0c0812');
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1000, 1000);
    state.trails.forEach((trail) => {
      ctx.globalAlpha = Math.min(0.3, trail.life * 0.12);
      ctx.fillStyle = trail.kind === 'blue' ? '#54bfff' : '#ff5524';
      ctx.beginPath(); ctx.arc(trail.x, trail.y, 23, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    state.steam.forEach((cloud) => {
      ctx.globalAlpha = Math.min(0.82, cloud.life * 0.9);
      ctx.fillStyle = '#d9e3e5'; ctx.beginPath(); ctx.arc(cloud.x, cloud.y, 90, 0, Math.PI * 2); ctx.fill();
    });
    ctx.globalAlpha = 1;
    state.lasers.forEach((laser) => {
      ctx.beginPath(); ctx.moveTo(laser.x1, laser.y1); ctx.lineTo(laser.x2, laser.y2);
      ctx.lineWidth = laser.warning > 0 ? 3 : 24;
      ctx.strokeStyle = laser.warning > 0 ? 'rgba(255,60,65,.72)' : '#45ff72';
      ctx.shadowBlur = laser.warning > 0 ? 0 : 25; ctx.shadowColor = '#45ff72'; ctx.stroke(); ctx.shadowBlur = 0;
    });
    state.shots.forEach((shot) => {
      const color = shot.kind.startsWith('blue') ? '#56baff' : shot.kind.startsWith('fire') ? '#ff4f22' : shot.kind === 'orange' ? '#ff9b37' : shot.kind === 'stun' ? '#70c8ff' : '#ff3348';
      ctx.fillStyle = color; ctx.shadowBlur = 15; ctx.shadowColor = color;
      ctx.beginPath(); ctx.arc(shot.x, shot.y, shot.size, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(shot.x - 3, shot.y - 3, shot.size * 0.35, 0, Math.PI * 2); ctx.fill();
    });
    ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 3; ctx.strokeRect(12, 12, 976, 976);
    const player = state.player;
    ctx.fillStyle = player.shield ? '#70f5db' : '#f2d67b';
    ctx.shadowBlur = 24; ctx.shadowColor = ctx.fillStyle;
    ctx.beginPath(); ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    if (player.burn > 0) { ctx.strokeStyle = '#ff4f22'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(player.x, player.y, 19, 0, Math.PI * 2); ctx.stroke(); }
  }
  function frame(time) {
    if (state.active) {
      const dt = Math.min(0.04, (time - (state.last || time)) / 1000);
      state.last = time;
      update(dt);
    }
    draw();
    requestAnimationFrame(frame);
  }
  document.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) event.preventDefault();
    if (/^[1-6]$/.test(key)) cast(state.spells[Number(key) - 1]);
    if (key === 'p' && state.active) showPause();
    state.keys.add(key);
  });
  document.addEventListener('keyup', (event) => state.keys.delete(event.key.toLowerCase()));
  document.getElementById('pauseButton').addEventListener('click', showPause);
  document.getElementById('soundToggle').addEventListener('click', toggleGameMusic);
  document.getElementById('resumeButton').addEventListener('click', () => { pause.hidden = true; state.active = true; state.last = 0; });
  document.getElementById('retryButton').addEventListener('click', startOver);
  document.getElementById('shopToggle').addEventListener('click', () => { renderShop(); shop.hidden = false; state.active = false; });
  document.getElementById('closeShop').addEventListener('click', () => { shop.hidden = true; state.active = true; state.last = 0; });
  function showPause() { state.active = false; pause.hidden = false; }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && state.active) showPause();
  });
  arena.addEventListener('pointerdown', (event) => {
    if (!state.active || event.target !== canvas || state.player.stun > 0) return;
    const rect = canvas.getBoundingClientRect();
    state.player.x = Math.max(35, Math.min(965, (event.clientX - rect.left) / rect.width * 1000));
    state.player.y = Math.max(35, Math.min(965, (event.clientY - rect.top) / rect.height * 1000));
  });
  renderShop();
  updateHud();
  requestAnimationFrame(frame);
}
