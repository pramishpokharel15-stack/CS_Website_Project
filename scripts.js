document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  const yearNode = document.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
  }

  setupTrivia();
  setupBattleGame();
});

function setupTrivia() {
  const easyQuestions = [
    {
      question: 'What is the name of the wizarding school Harry attends?',
      options: ['Beauxbatons', 'Hogwarts', 'Durmstrang', 'Ilvermorny'],
      answer: 'Hogwarts'
    },
    {
      question: 'Who is Harry Potter\'s best friend and fellow Gryffindor?',
      options: ['Cedric Diggory', 'Hermione Granger', 'Luna Lovegood', 'Draco Malfoy'],
      answer: 'Hermione Granger'
    },
    {
      question: 'What magical creature guards the entrance to the Sorcerer\'s Stone?',
      options: ['Dragon', 'Fluffy the three-headed dog', 'Basilisk', 'Thestral'],
      answer: 'Fluffy the three-headed dog'
    },
    {
      question: 'What is the name of Harry\'s owl?',
      options: ['Crookshanks', 'Pigwidgeon', ' Hedwig', 'Fawkes'],
      answer: 'Hedwig'
    },
    {
      question: 'Which professor teaches Potions at Hogwarts?',
      options: ['Professor Flitwick', 'Professor Snape', 'Professor McGonagall', 'Professor Trelawney'],
      answer: 'Professor Snape'
    }
  ];

  const hardQuestions = [
    {
      question: 'Which house was founded by Helga Hufflepuff?',
      options: ['Slytherin', 'Ravenclaw', 'Hufflepuff', 'Gryffindor'],
      answer: 'Hufflepuff'
    },
    {
      question: 'What is the name of the wizarding bank in London?',
      options: ['The Daily Prophet', 'Gringotts', 'The Leaky Cauldron', 'Nurmengard'],
      answer: 'Gringotts'
    },
    {
      question: 'Who wrote the spellbook "The Standard Book of Spells, Grade 1"?',
      options: ['Albus Dumbledore', 'Gilderoy Lockhart', 'Miranda Goshawk', 'Ptolemy'],
      answer: 'Miranda Goshawk'
    },
    {
      question: 'What is the core of Harry\'s wand?',
      options: ['Dragon heartstring', 'Phoenix feather', 'Unicorn hair', 'Veela hair'],
      answer: 'Phoenix feather'
    },
    {
      question: 'Which potion allows the drinker to assume another person\'s appearance?',
      options: ['Polyjuice Potion', 'Felix Felicis', 'Amortentia', 'Draught of Living Death'],
      answer: 'Polyjuice Potion'
    },
    {
      question: 'What is the name of the hidden room that houses the Chamber of Secrets?',
      options: ['The Room of Requirement', 'The Forgotten Forest', 'The Greenhouses', 'The Chamber of Secrets'],
      answer: 'The Chamber of Secrets'
    },
    {
      question: 'Which spell is used to conjure a patronus?',
      options: ['Expecto Patronum', 'Lumos', 'Accio', 'Imperio'],
      answer: 'Expecto Patronum'
    },
    {
      question: 'Who is the Headmaster of Hogwarts during the first book?',
      options: ['Professor Dumbledore', 'Professor Snape', 'Professor Slughorn', 'Professor McGonagall'],
      answer: 'Professor Dumbledore'
    },
    {
      question: 'What are the names of Harry\'s parents?',
      options: ['James and Lily Potter', 'Arthur and Molly Weasley', 'Lucius and Narcissa Malfoy', 'Frank and Alice Longbottom'],
      answer: 'James and Lily Potter'
    },
    {
      question: 'What object is used to reveal hidden passages in Hogwarts?',
      options: ['The Marauder\'s Map', 'The Sorting Hat', 'The Sword of Gryffindor', 'The Elder Wand'],
      answer: 'The Marauder\'s Map'
    }
  ];

  const quizConfig = [
    {
      key: 'easy',
      title: 'Easy Difficulty',
      amount: 5,
      panel: document.getElementById('easyQuiz'),
      questionEl: document.getElementById('easyQuestion'),
      optionsEl: document.getElementById('easyOptions'),
      scoreEl: document.getElementById('easyScore'),
      wrongEl: document.getElementById('easyWrong'),
      startBtn: document.getElementById('easyStart'),
      questions: easyQuestions
    },
    {
      key: 'hard',
      title: 'Hard Difficulty',
      amount: 10,
      panel: document.getElementById('hardQuiz'),
      questionEl: document.getElementById('hardQuestion'),
      optionsEl: document.getElementById('hardOptions'),
      scoreEl: document.getElementById('hardScore'),
      wrongEl: document.getElementById('hardWrong'),
      startBtn: document.getElementById('hardStart'),
      questions: hardQuestions
    }
  ];

  quizConfig.forEach((config) => {
    if (!config.panel) return;

    let currentIndex = 0;
    let score = 0;
    let wrong = [];
    let hasAnswered = false;

    const updateStats = () => {
      config.scoreEl.textContent = `Score: ${score}/${config.questions.length}`;
      if (wrong.length) {
        config.wrongEl.innerHTML = `<strong>Missed:</strong> ${wrong.join('<br>')}`;
      } else {
        config.wrongEl.innerHTML = '<strong>Missed:</strong> None!';
      }
    };

    const renderQuestion = () => {
      const q = config.questions[currentIndex];
      if (!q) {
        config.questionEl.textContent = `Quiz complete! You scored ${score} out of ${config.questions.length}.`;
        config.optionsEl.innerHTML = '';
        config.scoreEl.textContent = `Final score: ${score}/${config.questions.length}`;
        if (wrong.length) {
          config.wrongEl.innerHTML = `<strong>Wrong answers:</strong> ${wrong.join('<br>')}`;
        } else {
          config.wrongEl.innerHTML = '<strong>Wrong answers:</strong> You nailed every question!';
        }
        config.startBtn.textContent = `Play ${config.title} again`;
        config.startBtn.disabled = false;
        hasAnswered = false;
        return;
      }

      hasAnswered = false;
      config.questionEl.textContent = `${currentIndex + 1}. ${q.question}`;
      config.optionsEl.innerHTML = q.options.map((option) => `
        <button class="answer-btn" data-option="${option}">${option}</button>
      `).join('');

      config.optionsEl.querySelectorAll('.answer-btn').forEach((button) => {
        button.addEventListener('click', () => {
          if (hasAnswered) return;
          hasAnswered = true;

          const chosen = button.dataset.option;
          const correct = q.answer;
          const allButtons = config.optionsEl.querySelectorAll('.answer-btn');

          allButtons.forEach((btn) => {
            btn.disabled = true;
            if (btn.dataset.option === correct) {
              btn.classList.add('correct');
            }
            if (btn.dataset.option === chosen && chosen !== correct) {
              btn.classList.add('incorrect');
            }
          });

          if (chosen === correct) {
            score += 1;
          } else {
            wrong.push(`${currentIndex + 1}. ${q.question} — correct answer: ${correct}`);
          }

          updateStats();
          setTimeout(() => {
            currentIndex += 1;
            renderQuestion();
          }, 1100);
        });
      });
    };

    config.startBtn.addEventListener('click', () => {
      currentIndex = 0;
      score = 0;
      wrong = [];
      config.startBtn.disabled = true;
      updateStats();
      renderQuestion();
    });

    updateStats();
  });
}

function setupBattleGame() {
  const battlefield = document.getElementById('battlefield');
  if (!battlefield) return;

  const player = document.getElementById('player');
  const stageMessage = document.getElementById('stageMessage');
  const healthFill = document.getElementById('healthFill');
  const healthValue = document.getElementById('healthValue');
  const stageValue = document.getElementById('stageValue');
  const scoreValue = document.getElementById('scoreValue');
  const spellButtons = document.querySelectorAll('.spell-button');

  const game = {
    width: battlefield.clientWidth,
    height: battlefield.clientHeight,
    player: {
      x: battlefield.clientWidth / 2,
      y: battlefield.clientHeight / 2,
      radius: 41,
      speed: 5.4
    },
    projectiles: [],
    radius: 120,
    level: 1,
    health: 100,
    score: 0,
    running: true,
    lastSpawn: 0,
    stageTimer: 0,
    animFrame: null,
    audio: null,
    ambientLoop: null,
    projectilesThisStage: 0,
    baseStageDuration: 12000,
    keys: {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false
    }
  };

  function initAudio() {
    if (game.audio) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    game.audio = new AudioCtx();
    const createTone = (frequency, duration, volume, type = 'sine', delay = 0) => {
      const osc = game.audio.createOscillator();
      const gain = game.audio.createGain();
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.value = 0;
      osc.connect(gain);
      gain.connect(game.audio.destination);
      const startTime = game.audio.currentTime + delay;
      gain.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    };

    const ambientPattern = () => {
      if (!game.running) return;
      const root = [220, 262, 330, 392][(game.level - 1) % 4];
      const note = root / (game.level >= 4 ? 1.3 : 1);
      createTone(note, 0.65, 0.025, 'triangle', 0);
      createTone(note * 1.5, 0.75, 0.018, 'sine', 0.18);
      setTimeout(() => ambientPattern(), 650 - ((game.level - 1) * 90));
    };

    game.ambientLoop = ambientPattern;
    ambientPattern();
  }

  const updateHud = () => {
    healthFill.style.width = `${Math.max(game.health, 0)}%`;
    healthValue.textContent = `Health: ${Math.max(Math.round(game.health), 0)}`;
    stageValue.textContent = `Stage ${game.level}/5`;
    scoreValue.textContent = `Score: ${game.score}`;
  };

  function movePlayer() {
    const { keys, player } = game;
    let dx = 0;
    let dy = 0;

    if (keys.ArrowUp || keys.w) dy -= 1;
    if (keys.ArrowDown || keys.s) dy += 1;
    if (keys.ArrowLeft || keys.a) dx -= 1;
    if (keys.ArrowRight || keys.d) dx += 1;

    const length = Math.hypot(dx, dy) || 1;
    const stepX = (dx / length) * player.speed;
    const stepY = (dy / length) * player.speed;

    const maxDistanceX = (game.width * 0.7) / 2 - player.radius - 12;
    const maxDistanceY = (game.height * 0.7) / 2 - player.radius - 12;

    player.x = Math.max(game.width / 2 - maxDistanceX, Math.min(game.width / 2 + maxDistanceX, player.x + stepX));
    player.y = Math.max(game.height / 2 - maxDistanceY, Math.min(game.height / 2 + maxDistanceY, player.y + stepY));
  }

  function spawnProjectile() {
    const edge = Math.floor(Math.random() * 4);
    const pad = 18;
    let x = 0;
    let y = 0;

    if (edge === 0) {
      x = Math.random() * game.width;
      y = -pad;
    } else if (edge === 1) {
      x = game.width + pad;
      y = Math.random() * game.height;
    } else if (edge === 2) {
      x = Math.random() * game.width;
      y = game.height + pad;
    } else {
      x = -pad;
      y = Math.random() * game.height;
    }

    const targetX = game.width / 2;
    const targetY = game.height / 2;
    const dx = targetX - x;
    const dy = targetY - y;
    const length = Math.hypot(dx, dy) || 1;

    const speed = 1.2 + game.level * 0.7 + Math.random() * 0.8;
    const projectile = {
      x,
      y,
      vx: (dx / length) * speed,
      vy: (dy / length) * speed,
      size: 16 + Math.random() * 10,
      element: document.createElement('div')
    };

    projectile.element.className = 'projectile';
    projectile.element.style.width = `${projectile.size}px`;
    projectile.element.style.height = `${projectile.size}px`;
    projectile.element.style.left = `${x - projectile.size / 2}px`;
    projectile.element.style.top = `${y - projectile.size / 2}px`;
    battlefield.appendChild(projectile.element);
    game.projectiles.push(projectile);
  }

  function castSpell(name) {
    if (!game.running) return;

    const spellMap = {
      Expelliarmus: { radius: 110, damage: 30, color: 'rgba(90, 156, 255, 0.8)' },
      Protego: { radius: 130, damage: 0, color: 'rgba(125, 234, 204, 0.8)' },
      'Wingardium Leviosa': { radius: 80, damage: 18, color: 'rgba(255, 225, 120, 0.8)' },
      Lumos: { radius: 100, damage: 12, color: 'rgba(255, 251, 189, 0.8)' },
      Stupefy: { radius: 120, damage: 24, color: 'rgba(166, 52, 52, 0.8)' }
    };

    const config = spellMap[name];
    if (!config) return;

    const burst = document.createElement('div');
    burst.className = 'spell-burst';
    burst.style.left = `${game.player.x - config.radius}px`;
    burst.style.top = `${game.player.y - config.radius}px`;
    burst.style.width = `${config.radius * 2}px`;
    burst.style.height = `${config.radius * 2}px`;
    burst.style.background = `radial-gradient(circle, ${config.color}, rgba(255,255,255,0) 70%)`;
    battlefield.appendChild(burst);
    setTimeout(() => burst.remove(), 500);

    const remaining = [];
    game.projectiles.forEach((projectile) => {
      const distance = Math.hypot(projectile.x - game.player.x, projectile.y - game.player.y);
      if (distance <= config.radius) {
        game.score += 12;
        if (config.damage > 0) {
          game.health = Math.min(100, game.health + 6);
        }
      } else {
        remaining.push(projectile);
      }
    });

    game.projectiles = remaining;
    game.projectiles.forEach((projectile) => projectile.element.remove());

    if (name === 'Protego') {
      game.health = Math.min(100, game.health + 10);
    }

    updateHud();
    if (game.audio) {
      const oscillator = game.audio.createOscillator();
      const gain = game.audio.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.value = name === 'Protego' ? 300 : 440;
      gain.gain.value = 0.02;
      oscillator.connect(gain);
      gain.connect(game.audio.destination);
      oscillator.start();
      oscillator.stop(game.audio.currentTime + 0.14);
    }
  }

  function checkCollisions() {
    game.projectiles.forEach((projectile) => {
      const distance = Math.hypot(projectile.x - game.player.x, projectile.y - game.player.y);
      if (distance < projectile.size / 2 + game.player.radius) {
        game.health -= 14;
        projectile.element.remove();
        projectile.hit = true;
      }
    });
    game.projectiles = game.projectiles.filter((projectile) => !projectile.hit);
  }

  function advanceStage() {
    if (game.level >= 5) {
      stageMessage.textContent = 'You survived all five stages! The castle is safe... for now.';
      game.running = false;
      return;
    }
    game.level += 1;
    stageMessage.textContent = `Level ${game.level}: Darker magic is rising. Brace yourself!`;
    if (game.audio) {
      const oscillator = game.audio.createOscillator();
      const gain = game.audio.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.value = 220 + game.level * 48;
      gain.gain.value = 0.03;
      oscillator.connect(gain);
      gain.connect(game.audio.destination);
      oscillator.start();
      oscillator.stop(game.audio.currentTime + 0.2);
    }
    updateHud();
  }

  function gameLoop(timestamp) {
    if (!game.running) return;

    if (timestamp - game.lastSpawn > 1000 - game.level * 130) {
      spawnProjectile();
      game.lastSpawn = timestamp;
    }

    movePlayer();
    player.style.left = `${game.player.x}px`;
    player.style.top = `${game.player.y}px`;

    game.projectiles.forEach((projectile) => {
      projectile.x += projectile.vx * 2;
      projectile.y += projectile.vy * 2;
      projectile.element.style.left = `${projectile.x - projectile.size / 2}px`;
      projectile.element.style.top = `${projectile.y - projectile.size / 2}px`;
    });

    checkCollisions();
    updateHud();

    if (game.health <= 0) {
      game.running = false;
      stageMessage.textContent = 'The attacks were too much. The battle is lost — try again.';
      return;
    }

    if (timestamp - game.stageTimer > game.baseStageDuration) {
      game.stageTimer = timestamp;
      advanceStage();
    }

    if (game.level >= 5 && game.projectiles.length === 0 && timestamp - game.lastSpawn > 2500) {
      stageMessage.textContent = 'The final wave is near. Hold your ground!';
    }

    game.animFrame = requestAnimationFrame(gameLoop);
  }

  document.addEventListener('keydown', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (game.keys[key] !== undefined) {
      game.keys[key] = true;
    }
  });

  document.addEventListener('keyup', (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (game.keys[key] !== undefined) {
      game.keys[key] = false;
    }
  });

  spellButtons.forEach((button) => {
    button.addEventListener('click', () => {
      initAudio();
      castSpell(button.dataset.spell);
    });
  });

  battlefield.addEventListener('pointerdown', (event) => {
    const rect = battlefield.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    game.player.x = Math.max(48, Math.min(game.width - 48, x));
    game.player.y = Math.max(48, Math.min(game.height - 48, y));
    player.style.left = `${game.player.x}px`;
    player.style.top = `${game.player.y}px`;
  });

  initAudio();
  updateHud();
  game.stageTimer = performance.now();
  stageMessage.textContent = 'Level 1: Calm magic surrounds the castle. Stay steady.';
  game.animFrame = requestAnimationFrame(gameLoop);
}
