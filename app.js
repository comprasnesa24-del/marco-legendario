const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const startScreen = document.querySelector("#startScreen");
const messageScreen = document.querySelector("#messageScreen");
const levelLabel = document.querySelector("#levelLabel");
const coinLabel = document.querySelector("#coinLabel");
const bananaLabel = document.querySelector("#bananaLabel");
const mobileBananaLabel = document.querySelector("#mobileBananaLabel");
const boxLabel = document.querySelector("#boxLabel");
const livesLabel = document.querySelector("#livesLabel");
const messageKicker = document.querySelector("#messageKicker");
const messageTitle = document.querySelector("#messageTitle");
const messageText = document.querySelector("#messageText");
const storyVisual = document.querySelector("#storyVisual");
const endingVideo = document.querySelector("#endingVideo");
const messageCard = messageScreen.querySelector(".overlay-card");
const introMusic = document.querySelector("#introMusic");
const introMusicButton = document.querySelector("#introMusicButton");

const W = canvas.width;
const H = canvas.height;
const FLOOR = 610;
const RUN_FRAME_COUNT = 8;
const RUN_FRAME_W = 172;
const RUN_FRAME_H = 188;
const keys = { left: false, right: false, jump: false, fire: false };
let levelIndex = 0;
let lives = 3;
let infiniteLives = false;
let coins = 0;
let state = "menu";
let cameraX = 0;
let lastTime = 0;
let audioEnabled = true;
let companionUnlocked = false;
let audioContext;
let boss;
let runPhase = 0;
let nextLevelIndex = null;
let perfectLevels = [false,false,false,false];
let bananaAmmo = 0;
let bananas = [];
let bananaRefillPop = null;

const playerImage = new Image();
playerImage.src = "character.png";
const monkeyPlayerImage = new Image();
monkeyPlayerImage.src = "character-monkey.png";
const playerRun2Image = new Image();
playerRun2Image.src = "character-run2.png";
const monkeyRun2Image = new Image();
monkeyRun2Image.src = "character-monkey-run2.png";
const playerRunSheetImage = new Image();
playerRunSheetImage.src = "character-run-sheet.png";
const monkeyRunSheetImage = new Image();
monkeyRunSheetImage.src = "character-monkey-run-sheet.png";
const world3JacketRunSheetImage = new Image();
world3JacketRunSheetImage.src = "world3-jacket-run-sheet.png";
const world3JacketImage = new Image();
world3JacketImage.src = "world3-jacket.png";
const world3JacketRun2Image = new Image();
world3JacketRun2Image.src = "world3-jacket-run2.png";
const motherImage = new Image();
motherImage.src = "mother.png";
const bossImage = new Image();
bossImage.src = "francisco.png";
const monkeyPopImage = new Image();
monkeyPopImage.src = "monkey-pop.png";
const levelCompleteVideos = ["world1-complete-video.mp4","world2-complete-video.mp4",null,null];

const levels = [
  {
    name: "Italia - El comienzo", theme: "italy", width: 4500, sky: ["#68b9ef", "#ffd9a0"], ground: "#9b623c",
    platforms: [[0,610,520,110],[620,545,210,28],[920,480,180,28],[1190,555,260,28],[1540,450,190,28],[1830,535,250,28],[2200,455,180,28],[2500,560,600,80],[3180,470,190,28],[3460,560,250,28],[3810,430,190,28],[4100,540,400,80]],
    moving: [[2950,470,120,22,70],[3710,500,100,22,55]],
    coins: [[700,490],[990,425],[1270,500],[1625,395],[1920,480],[2265,400],[2640,500],[3245,415],[3540,505],[3875,375],[4240,480]],
    enemies: [[1050,442,110],[1880,497,150],[2700,522,180],[3490,522,130],[4160,502,170]], spikes: [[1460,585,90],[3080,585,90],[4005,585,90]], boxes: [[400,410,"coin"],[1280,375,"monkey"],[2260,285,"coin"],[3250,290,"coin"],[3530,380,"coin"],[4210,170,"coin"]], goal: [4380,450]
  },
  {
    name: "El gran barco", theme: "ship", width: 5100, sky: ["#2579a9", "#91d9ed"], ground: "#78482e",
    platforms: [[0,610,380,110],[480,520,180,28],[750,420,170,28],[1010,520,220,28],[1350,440,180,28],[1640,570,300,28],[2070,470,180,28],[2360,370,170,28],[2650,500,230,28],[3000,610,500,110],[3600,500,180,28],[3880,400,180,28],[4180,530,240,28],[4530,420,190,28],[4820,610,280,110]],
    moving: [[3420,520,120,22,75],[4420,480,110,22,65]],
    coins: [[555,465],[825,365],[1090,465],[1420,385],[1730,515],[2140,415],[2425,315],[2740,445],[3160,550],[3660,445],[3940,345],[4260,475],[4600,365],[4910,550]],
    enemies: [[1080,482,110],[1700,532,170],[3070,572,220],[4220,492,150],[4860,572,120]], spikes: [[390,585,75],[1950,585,100],[2890,585,100],[3505,585,90],[4725,585,90]], boxes: [[570,330,"coin"],[1140,340,"monkey"],[2720,320,"coin"],[3650,320,"coin"],[4250,350,"coin"],[4900,175,"coin"]], goal: [4980,470]
  },
  {
    name: "Brasil - Selva tropical", theme: "brazil", width: 5600, sky: ["#188c74", "#ffd35e"], ground: "#295f3c",
    platforms: [[0,610,450,110],[560,520,180,28],[850,570,250,28],[1220,450,200,28],[1530,350,180,28],[1810,500,220,28],[2160,400,210,28],[2490,550,260,28],[2870,430,190,28],[3180,530,220,28],[3510,610,390,110],[4010,480,190,28],[4300,350,170,28],[4580,520,230,28],[4920,400,190,28],[5220,610,380,110]],
    moving: [[1080,560,120,22,80],[2720,450,130,22,110],[3850,510,120,22,80],[4810,450,110,22,75]],
    coins: [[630,465],[930,515],[1300,395],[1600,295],[1895,445],[2240,345],[2580,495],[2945,375],[3260,475],[3660,550],[4080,425],[4360,295],[4660,465],[4990,345],[5360,550]],
    enemies: [[900,532,130],[1870,462,110],[3230,492,110],[4620,482,130],[5300,572,170]], spikes: [[460,585,90],[1110,585,100],[2390,585,100],[3410,585,95],[3905,585,90],[5115,585,95]], boxes: [[660,330,"coin"],[1320,270,"monkey"],[3260,350,"coin"],[4070,300,"coin"],[4640,340,"coin"],[5360,175,"coin"]], goal: [5480,470]
  },
  {
    name: "Argentina - El reencuentro", theme: "argentina", width: 6300, sky: ["#55b6ec", "#dff5ff"], ground: "#536c52",
    platforms: [[0,610,350,110],[450,530,180,28],[750,450,180,28],[1050,560,220,28],[1390,430,180,28],[1680,540,230,28],[2020,390,190,28],[2330,500,210,28],[2670,350,180,28],[2950,490,220,28],[3300,390,190,28],[3590,520,200,28],[3910,610,390,110],[4410,480,190,28],[4710,350,180,28],[5010,520,230,28],[5350,400,180,28],[5650,610,650,110]],
    moving: [[1280,520,110,22,90],[2550,490,120,22,120],[3460,470,110,22,80],[4250,520,110,22,80],[5240,470,110,22,70]],
    coins: [[520,475],[820,395],[1130,505],[1460,375],[1770,485],[2090,335],[2410,445],[2740,295],[3040,435],[3370,335],[3670,465],[4050,550],[4480,425],[4780,295],[5090,465],[5420,345],[5790,550]],
    enemies: [[1100,522,110],[1740,502,110],[3000,452,110],[5050,482,130],[5400,362,80]], spikes: [[350,585,95],[940,585,100],[1580,585,90],[2210,585,110],[3180,585,110],[4305,585,95],[5540,585,100]], boxes: [[550,340,"coin"],[1780,350,"monkey"],[3040,300,"coin"],[3650,330,"coin"],[4480,300,"coin"],[5080,340,"coin"],[5760,175,"coin"]], goal: [6170,470]
  }
];

let level;
let player;
let particles = [];
let monkeyPop = null;

function extendLevel(raw, index) {
  const midpoint = raw.width;
  const newWidth = raw.width * 2;
  const yPatterns = [
    [500,410,520,360,470,300,510,410,540],
    [530,390,470,310,520,400,340,500,430],
    [470,330,520,280,430,350,500,300,460],
    [520,400,300,480,350,520,390,470,330]
  ];
  const pattern = yPatterns[index];
  raw.platforms.push([midpoint-20,610,480,110]);
  raw.checkpoint = [midpoint+100,500];
  let x = midpoint + 520;
  let step = 0;
  while (x < newWidth - 700) {
    const y = pattern[step % pattern.length];
    raw.platforms.push([x,y,170 + (step%3)*30,28]);
    raw.coins.push([x+70,y-55]);
    if (step%2===0) raw.enemies.push([x+35,y-38,85]);
    if (step%3===1) raw.moving.push([x+210,Math.min(560,y+65),105,22,55+index*12]);
    if (step%4===2) raw.spikes.push([x+205,585,72]);
    if (step%3===0) raw.boxes.splice(raw.boxes.length-1,0,[x+65,y-120,"coin"]);
    x += index===1 ? 450 : 420;
    step++;
  }
  raw.platforms.push([newWidth-620,610,620,110]);
  const lastBox = raw.boxes.pop();
  raw.boxes.push([newWidth-430,175,lastBox[2]]);
  raw.goal = [newWidth-160,470];
  raw.width = newWidth;
}

function prepareBoxPlatforms(raw) {
  raw.boxes = raw.boxes.map(([x,y,type], boxIndex, boxes) => {
    const isLast = boxIndex === boxes.length - 1;
    const raisedY = isLast ? y : Math.max(185,y-55);
    if (!isLast) raw.platforms.push([x-48,raisedY+150,152,22]);
    return [x,raisedY,type];
  });
}

function ensureBasicJumpRoute(raw) {
  const safeY = [540, 500, 530, 490, 520, 550];
  let step = 0;
  for (let x = 430; x < raw.width - 320; x += 360) {
    const y = safeY[step % safeY.length];
    const covered = raw.platforms.some(([px,py,pw]) =>
      py >= 450 && py <= 610 && px <= x + 50 && px + pw >= x + 180
    );
    if (!covered) raw.platforms.push([x, y, 220, 22]);
    step++;
  }
}

function loadLevel(index) {
  levelIndex = index;
  level = structuredClone(levels[index]);
  level.moving ||= [];
  extendLevel(level,index);
  level.boxes[0][2] = "bananas";
  prepareBoxPlatforms(level);
  ensureBasicJumpRoute(level);
  const extraEnemyPlatforms = level.platforms.filter(([,y,w,h]) => h <= 30 && w >= 170 && y >= 340);
  extraEnemyPlatforms.forEach(([x,y,w], enemyIndex) => {
    if (enemyIndex % 2 === 0) level.enemies.push([x + 25, y - 38, Math.max(70,w - 90)]);
  });
  level.moving = level.moving.map((moving) => ({ data: moving, lastX: moving[0], x: moving[0] }));
  level.boxes = level.boxes.map(([x,y,type], boxIndex) => ({
    x,
    y,
    type,
    used: false,
    bump: 0,
    isLast: boxIndex === level.boxes.length - 1,
    secretJumps: 0,
    infiniteLifeJumps: 0,
    firstBananaBox: levelIndex === 0 && boxIndex === 0 && type === "bananas"
  }));
  level.coins = level.coins.map(([x,y]) => ({ x, y, taken: false, phase: Math.random() * 6 }));
  const enemyStats = [
    { type:"cockroach", speed:2.1, hp:1, w:48, h:30 },
    { type:"piranha", speed:3.5, hp:1, w:52, h:34 },
    { type:"rat", speed:1.35, hp:2, w:54, h:36 },
    { type:"spider", speed:3.8, hp:2, w:55, h:35 }
  ][index];
  level.enemies = level.enemies.map(([x,y,range]) => ({ ...enemyStats, x, y:y+(38-enemyStats.h), start:x, range, dir:1, alive:true, invulnerable:0 }));
  level.openedBoxes = 0;
  bananaAmmo = 0;
  bananas = [];
  bananaRefillPop = null;
  player = { x: 100, y: 510, w: 58, h: 78, vx: 0, vy: 0, grounded: false, facing: 1, invulnerable: 0, hasMonkey: companionUnlocked, jumpsUsed: 0 };
  cameraX = 0;
  particles = [];
  monkeyPop = null;
  level.checkpoint = { x: level.checkpoint[0], y: level.checkpoint[1], active: false };
  boss = index === levels.length - 1 ? { x: level.width-520, y: 465, w: 105, h: 145, vx: -3.5, hp: 3, invulnerable: 0, defeated: false } : null;
  updateHud();
}

function updateHud() {
  const requiredBoxes = level.boxes.filter(box => box.countsForCompletion !== false);
  levelLabel.textContent = `${levelIndex + 1} / ${levels.length}`;
  coinLabel.textContent = coins;
  bananaLabel.textContent = bananaAmmo;
  mobileBananaLabel.textContent = bananaAmmo;
  boxLabel.textContent = `${level.openedBoxes} / ${requiredBoxes.length}`;
  livesLabel.innerHTML = infiniteLives
    ? `<i></i><b class="life-count">∞</b>`
    : `<i></i><b class="life-count">x${Math.max(0, lives)}</b>`;
}

async function enterGameFullscreen() {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen({ navigationUI: "hide" });
  } catch {}
  try {
    await screen.orientation?.lock?.("landscape");
  } catch {}
  syncMobileViewport();
}

function startGame() {
  enterGameFullscreen();
  endingVideo.pause();
  endingVideo.currentTime = 0;
  lives = 3; infiniteLives = false; coins = 0; companionUnlocked = false; perfectLevels=[false,false,false,false]; loadLevel(0); state = "playing";
  messageCard.classList.remove("victory");
  messageCard.classList.remove("level-video");
  startScreen.classList.remove("visible");
  messageScreen.classList.remove("visible");
}

function rectHit(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function fireBanana() {
  if (bananaAmmo <= 0 || state !== "playing") return;
  bananaAmmo--;
  bananas.push({
    x: player.x + player.w / 2 + player.facing * 28,
    y: player.y + player.h * .38,
    vx: player.facing * 7,
    vy: -7,
    rotation: 0,
    life: 150
  });
  beep(520, .06);
  updateHud();
}

function restoreMonkeyBoxAfterRespawn() {
  player.hasMonkey = false;
  companionUnlocked = false;

  if (level.checkpoint.active) {
    let recoveryBox = level.boxes.find(box => box.checkpointRecovery);
    if (!recoveryBox) {
      recoveryBox = {
        x: level.checkpoint.x + 170,
        y: 405,
        type: "monkey",
        used: false,
        bump: 0,
        isLast: false,
        secretJumps: 0,
        checkpointRecovery: true,
        countsForCompletion: false
      };
      level.boxes.push(recoveryBox);
    }
    recoveryBox.used = false;
    recoveryBox.bump = 0;
    return;
  }

  const originalMonkeyBox = level.boxes.find(box => box.type === "monkey" && !box.checkpointRecovery);
  if (originalMonkeyBox?.used) {
    originalMonkeyBox.used = false;
    originalMonkeyBox.bump = 0;
    level.openedBoxes = Math.max(0, level.openedBoxes - 1);
  }
}

function beep(frequency, duration = .08) {
  if (!audioEnabled) return;
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(.05, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + duration);
  osc.connect(gain).connect(audioContext.destination);
  osc.start(); osc.stop(audioContext.currentTime + duration);
}

function respawn() {
  if (!infiniteLives) lives--;
  beep(130, .3);
  updateHud();
  if (lives <= 0) {
    showMessage("FIN DE LA AVENTURA", "Casi lo tienes", "Mamá te espera al final del viaje.", "Volver a empezar");
    state = "gameover";
  } else {
    player.x = level.checkpoint.active ? level.checkpoint.x + 35 : 100;
    player.y = level.checkpoint.active ? level.checkpoint.y : 500;
    player.vx = 0; player.vy = 0; player.invulnerable = 90; player.jumpsUsed = 0;
    restoreMonkeyBoxAfterRespawn();
    bananaAmmo = 10;
    bananas = [];
    bananaRefillPop = { life: 90 };
    updateHud();
    beep(760,.2);
    cameraX = Math.max(0,player.x-W*.35);
  }
}

function receiveEnemyHit(sourceX) {
  if (player.invulnerable) return;
  if (player.hasMonkey) {
    player.hasMonkey = false;
    companionUnlocked = false;
    player.invulnerable = 100;
    player.vx = player.x < sourceX ? -8 : 8;
    player.vy = -10;
    beep(150,.25);
    for (let i=0;i<20;i++) particles.push({x:player.x+player.w/2,y:player.y,vx:Math.random()*10-5,vy:Math.random()*-7,life:42});
    return;
  }
  respawn();
}

function showMessage(kicker, title, text, button) {
  messageKicker.textContent = kicker;
  messageTitle.textContent = title;
  messageText.textContent = text;
  document.querySelector("#continueButton").innerHTML = `${button} <span>→</span>`;
  messageScreen.classList.add("visible");
}

function completeLevel() {
  beep(740, .35);
  const requiredBoxes = level.boxes.filter(box => box.countsForCompletion !== false);
  perfectLevels[levelIndex] = level.coins.every(coin=>coin.taken) && requiredBoxes.every(box=>box.used);
  state = levelIndex === levels.length - 1 ? "won" : "complete";
  nextLevelIndex = state === "complete" ? levelIndex + 1 : null;
  const completedName = levels[levelIndex].name;
  const perfectGame = state === "won" && perfectLevels.every(Boolean);
  const levelVideoSrc = state === "complete" ? levelCompleteVideos[levelIndex] : null;
  const levelVideo = Boolean(levelVideoSrc);
  showMessage(
    perfectGame ? "FINAL SECRETO" : state === "won" ? "POR FIN JUNTOS" : `NIVEL ${levelIndex + 1} COMPLETADO`,
    perfectGame ? "¡SOIS LOS REYES DEL JUEGO!" : state === "won" ? "¡Encontraste a mamá!" : "¡El viaje continúa!",
    perfectGame
      ? "Has recogido todos los puntos amarillos y abierto todas las cajas de los cuatro mundos. Marco, mamá y el mono celebran vuestra partida perfecta."
      : state === "won"
      ? `Has superado Argentina y derrotado a Francisco. Después de cruzar el mundo, mamá y tú volvéis a estar juntos. Recogiste ${coins} monedas.`
      : `Has superado ${completedName} al alcanzar la estrella final. Abriste ${level.openedBoxes} de ${requiredBoxes.length} cajas. Siguiente parada: ${levels[levelIndex + 1].name}.`,
    state === "won" ? "Jugar de nuevo" : "Siguiente nivel"
  );
  messageCard.classList.toggle("victory",state === "won");
  messageCard.classList.toggle("level-video",levelVideo);
  storyVisual.className = `story-visual sad-${Math.min(3,levelIndex+1)}`;
  endingVideo.pause();
  endingVideo.currentTime = 0;
  if (state === "won" || levelVideo) {
    introMusic.pause();
    introMusicButton.classList.remove("playing");
    introMusicButton.textContent = "♪ Escuchar canción";
    endingVideo.src = levelVideoSrc || (perfectGame ? "perfect-ending-video.mp4" : "ending-video.mp4");
    endingVideo.load();
    endingVideo.currentTime = 0;
    endingVideo.play().catch(() => {});
  }
}

function update(dt) {
  if (state !== "playing") return;
  const speed = player.hasMonkey ? 7.4 : 5.0;
  player.vx += ((keys.right ? speed : 0) - (keys.left ? speed : 0) - player.vx) * .22;
  if (keys.left) player.facing = -1;
  if (keys.right) player.facing = 1;
  if (keys.jump && (player.grounded || (player.hasMonkey && player.jumpsUsed < 2))) {
    player.vy = player.hasMonkey ? -18.5 : -17;
    player.grounded = false;
    player.jumpsUsed++;
    beep(player.jumpsUsed === 2 ? 620 : 360);
  }
  keys.jump = false;
  if (keys.fire) fireBanana();
  keys.fire = false;
  player.vy = Math.min(player.vy + 1.05, 22);
  player.x += player.vx;
  player.x = Math.max(0, Math.min(level.width - player.w, player.x));
  const oldBottom = player.y + player.h;
  const oldTop = player.y;
  player.y += player.vy;
  player.grounded = false;

  const movingPlatforms = level.moving.map((moving, i) => {
    const [x,y,w,h,range] = moving.data;
    moving.lastX = moving.x;
    moving.x = x + Math.sin(performance.now() / 850 + i) * range;
    return { x: moving.x, y, w, h, dx: moving.x-moving.lastX, moving: true };
  });
  let secretWarp = false;
  const platforms = [...level.platforms.map(([x,y,w,h]) => ({x,y,w,h})), ...level.boxes.map(box => ({x:box.x,y:box.y,w:56,h:56,box})), ...movingPlatforms];
  platforms.forEach((p) => {
    if (player.vy >= 0 && oldBottom <= p.y + 8 && player.y + player.h >= p.y && player.x + player.w > p.x && player.x < p.x + p.w) {
      const landedAfterJump = !player.grounded && player.jumpsUsed > 0;
      player.y = p.y - player.h; player.vy = 0; player.grounded = true; player.jumpsUsed = 0;
      if (p.moving) player.x += p.dx;
      if (p.box?.isLast && levelIndex === 0 && landedAfterJump && p.box.secretJumps < 10) {
        p.box.secretJumps++;
        beep(500+p.box.secretJumps*35,.08);
        if (p.box.secretJumps >= 10) secretWarp = true;
      }
      if (p.box?.firstBananaBox && player.hasMonkey && landedAfterJump && !infiniteLives && p.box.infiniteLifeJumps < 10) {
        p.box.infiniteLifeJumps++;
        beep(420+p.box.infiniteLifeJumps*45,.08);
        if (p.box.infiniteLifeJumps >= 10) {
          infiniteLives = true;
          lives = Math.max(lives, 3);
          bananaRefillPop = { life: 110 };
          for (let i=0;i<28;i++) particles.push({x:p.box.x+28,y:p.box.y,vx:Math.random()*10-5,vy:Math.random()*-8,life:60,type:"satchel"});
          beep(1100,.45);
          updateHud();
        }
      }
    }
  });
  if (secretWarp) {
    loadLevel(3);
    state="playing";
    return;
  }

  level.boxes.forEach((box) => {
    box.bump = Math.max(0, box.bump - 1);
    const boxBottom = box.y + 56;
    const crossesBottom = oldTop >= boxBottom - 18 && player.y <= boxBottom + 8;
    if (!box.used && player.vy < 0 && crossesBottom && player.x + player.w > box.x - 8 && player.x < box.x + 64) {
      player.y = box.y + 56; player.vy = 4; box.used = true; box.bump = 12;
      if (box.countsForCompletion !== false) level.openedBoxes++;
      if (box.type === "monkey") {
        player.hasMonkey = true; companionUnlocked = true; beep(880, .25);
        monkeyPop = {x:box.x-2,y:box.y-5,life:75};
        for (let i=0;i<18;i++) particles.push({x:box.x+28,y:box.y,vx:Math.random()*8-4,vy:Math.random()*-7,life:40});
      } else if (box.type === "bananas") {
        bananaAmmo = 10;
        beep(760,.25);
        for (let i=0;i<10;i++) particles.push({x:box.x+28,y:box.y,vx:Math.random()*8-4,vy:Math.random()*-7,life:45,type:"banana"});
      } else if (box.isLast) {
        lives++;
        beep(980,.3);
        particles.push({x:box.x+8,y:box.y-10,vx:0,vy:-4,life:55,type:"satchel"});
      } else {
        coins++;
        beep(660);
        particles.push({x:box.x+28,y:box.y,vx:0,vy:-5,life:42,type:"coin"});
      }
      updateHud();
    }
  });
  runPhase += Math.abs(player.vx) * .075;
  if (monkeyPop) { monkeyPop.y -= 1.2; monkeyPop.life--; if (monkeyPop.life<=0) monkeyPop=null; }

  if (!level.checkpoint.active && player.x > level.checkpoint.x) {
    level.checkpoint.active = true;
    beep(840,.3);
    for(let i=0;i<18;i++) particles.push({x:level.checkpoint.x,y:level.checkpoint.y,vx:Math.random()*7-3.5,vy:Math.random()*-6,life:40});
  }

  if (player.y > H + 120) respawn();
  if (player.invulnerable > 0) player.invulnerable--;

  level.coins.forEach((coin) => {
    if (!coin.taken && rectHit(player, { x: coin.x - 16, y: coin.y - 16, w: 32, h: 32 })) {
      coin.taken = true; coins++; beep(660); updateHud();
      for (let i = 0; i < 8; i++) particles.push({ x: coin.x, y: coin.y, vx: Math.random()*5-2.5, vy: Math.random()*-5, life: 30 });
    }
  });

  level.enemies.forEach((enemy) => {
    if (!enemy.alive) return;
    if (enemy.invulnerable > 0) enemy.invulnerable--;
    enemy.x += enemy.dir * enemy.speed;
    if (enemy.x > enemy.start + enemy.range || enemy.x < enemy.start) enemy.dir *= -1;
    const box = { x: enemy.x, y: enemy.y, w: enemy.w, h: enemy.h };
    if (rectHit(player, box)) {
      if (player.vy > 4 && oldBottom < enemy.y + 16 && !enemy.invulnerable) {
        enemy.hp--; enemy.invulnerable=28; player.vy=-11; beep(220);
        if(enemy.hp<=0) enemy.alive=false;
      } else if (!enemy.invulnerable) receiveEnemyHit(enemy.x);
    }
  });

  bananas.forEach(banana => {
    banana.x += banana.vx * dt;
    banana.y += banana.vy * dt;
    banana.vy += .72 * dt;
    banana.rotation += .24 * banana.vx / 10;
    banana.life -= dt;
    level.enemies.forEach(enemy => {
      if (!enemy.alive || banana.hit || !rectHit({x:banana.x-12,y:banana.y-12,w:24,h:24}, enemy)) return;
      enemy.hp--;
      enemy.invulnerable = 20;
      if (enemy.hp <= 0) enemy.alive = false;
      banana.hit = true;
      beep(250,.06);
    });
    if (boss && !boss.defeated && !banana.hit && rectHit({x:banana.x-12,y:banana.y-12,w:24,h:24}, boss)) {
      if (!boss.invulnerable) {
        boss.hp--;
        boss.invulnerable = 40;
        if (boss.hp <= 0) boss.defeated = true;
      }
      banana.hit = true;
      beep(180,.08);
    }
  });
  bananas = bananas.filter(banana => !banana.hit && banana.life > 0 && banana.y < H + 80);
  if (bananaRefillPop) {
    bananaRefillPop.life -= dt;
    if (bananaRefillPop.life <= 0) bananaRefillPop = null;
  }

  if (boss && !boss.defeated) {
    boss.x += boss.vx;
    if (boss.x < level.width-650 || boss.x > level.width-260) boss.vx *= -1;
    if (boss.invulnerable > 0) boss.invulnerable--;
    if (rectHit(player, boss)) {
      if (player.vy > 5 && oldBottom < boss.y + 35 && !boss.invulnerable) {
        boss.hp--; boss.invulnerable = 55; player.vy = player.hasMonkey ? -17 : -13; beep(180, .2);
        for (let i=0;i<20;i++) particles.push({x:boss.x+boss.w/2,y:boss.y+20,vx:Math.random()*9-4.5,vy:Math.random()*-7,life:38});
        if (boss.hp <= 0) { boss.defeated = true; beep(920,.55); }
      } else if (!boss.invulnerable) receiveEnemyHit(boss.x);
    }
  }

  level.spikes.forEach(([x,y,w]) => {
    if (!player.invulnerable && rectHit(player, {x, y, w, h: 30})) respawn();
  });

  const [gx, gy] = level.goal;
  if (rectHit(player, {x: gx, y: gy, w: 70, h: 130}) && (!boss || boss.defeated)) completeLevel();
  cameraX += (Math.max(0, Math.min(level.width - W, player.x - W * .35)) - cameraX) * .08;
  particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += .2; p.life--; });
  particles = particles.filter(p => p.life > 0);
}

function roundedRect(x,y,w,h,r,fill) {
  ctx.beginPath(); ctx.roundRect(x,y,w,h,r); ctx.fillStyle = fill; ctx.fill();
}

function drawStar(x, y, radius, color) {
  ctx.beginPath();
  for (let i=0; i<10; i++) {
    const a = -Math.PI/2 + i*Math.PI/5;
    const r = i%2 ? radius*.45 : radius;
    ctx.lineTo(x + Math.cos(a)*r, y + Math.sin(a)*r);
  }
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}

function drawSatchel(x,y) {
  roundedRect(x,y+8,40,30,8,"#8c542f");
  roundedRect(x+5,y+13,30,19,5,"#ad7042");
  ctx.strokeStyle="#d0955f";ctx.lineWidth=4;ctx.beginPath();ctx.arc(x+20,y+10,11,Math.PI,0);ctx.stroke();
  ctx.fillStyle="#f0bd72";ctx.fillRect(x+17,y+17,6,7);
}

function drawEnemy(enemy) {
  if (enemy.invulnerable && Math.floor(enemy.invulnerable/4)%2) return;
  const x=enemy.x, y=enemy.y, w=enemy.w, h=enemy.h;
  ctx.save();ctx.translate(x+w/2,y+h/2);ctx.scale(enemy.dir,1);ctx.translate(-w/2,-h/2);
  if(enemy.type==="cockroach"){
    ctx.strokeStyle="#492318";ctx.lineWidth=3;
    for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(13+i*11,20);ctx.lineTo(5+i*12,30);ctx.stroke();ctx.beginPath();ctx.moveTo(16+i*10,20);ctx.lineTo(25+i*12,30);ctx.stroke();}
    roundedRect(8,4,w-16,h-8,15,"#713a24");ctx.fillStyle="#a7663d";ctx.fillRect(22,5,4,h-10);
    ctx.strokeStyle="#492318";ctx.beginPath();ctx.moveTo(13,8);ctx.lineTo(2,-2);ctx.moveTo(20,6);ctx.lineTo(18,-5);ctx.stroke();
  }else if(enemy.type==="piranha"){
    ctx.fillStyle="#e84c55";ctx.beginPath();ctx.ellipse(24,17,22,15,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.moveTo(42,17);ctx.lineTo(54,5);ctx.lineTo(54,29);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(12,13,5,0,Math.PI*2);ctx.fill();ctx.fillStyle="#172036";ctx.beginPath();ctx.arc(11,13,2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(3+i*6,22);ctx.lineTo(6+i*6,17);ctx.lineTo(9+i*6,22);ctx.fill();}
  }else if(enemy.type==="rat"){
    ctx.fillStyle="#77717d";ctx.beginPath();ctx.ellipse(29,21,24,14,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(10,13,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#c48fa5";ctx.beginPath();ctx.arc(7,5,5,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(8,12,3,0,Math.PI*2);ctx.fill();ctx.fillStyle="#21182a";ctx.beginPath();ctx.arc(8,12,1.5,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#c48fa5";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,22);ctx.quadraticCurveTo(62,10,66,22);ctx.stroke();
  }else{
    ctx.strokeStyle="#312044";ctx.lineWidth=4;
    for(let i=0;i<4;i++){ctx.beginPath();ctx.moveTo(22,15+i*3);ctx.lineTo(4,4+i*8);ctx.stroke();ctx.beginPath();ctx.moveTo(34,15+i*3);ctx.lineTo(52,4+i*8);ctx.stroke();}
    ctx.fillStyle="#59326f";ctx.beginPath();ctx.arc(29,19,15,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#ff6687";for(let i=0;i<4;i++){ctx.beginPath();ctx.arc(22+i*5,15+(i%2)*5,2,0,Math.PI*2);ctx.fill();}
  }
  if(enemy.hp>1){ctx.fillStyle="#ff587d";for(let i=0;i<enemy.hp;i++)ctx.fillRect(18+i*9,-8,6,4);}
  ctx.restore();
}

function drawBackdrop() {
  const drift = cameraX * .12;
  if (level.theme === "italy") {
    for (let i=0;i<10;i++) {
      const x=i*420-drift%420;
      ctx.fillStyle=i%2?"#e9895e":"#f3b569"; ctx.fillRect(x,FLOOR-245,250,245);
      ctx.fillStyle="#fff1c8"; for(let r=0;r<3;r++) for(let c=0;c<3;c++) ctx.fillRect(x+35+c*70,FLOOR-205+r*58,28,38);
      ctx.fillStyle="#a84934"; ctx.beginPath(); ctx.moveTo(x-20,FLOOR-245); ctx.lineTo(x+125,FLOOR-330); ctx.lineTo(x+270,FLOOR-245); ctx.fill();
      ctx.fillStyle="#326d45"; ctx.fillRect(x+300,FLOOR-190,22,190); ctx.beginPath(); ctx.ellipse(x+311,FLOOR-220,35,95,0,0,Math.PI*2); ctx.fill();
    }
  } else if (level.theme === "ship") {
    ctx.fillStyle="#1972a1"; ctx.fillRect(0,FLOOR-70,W,150);
    ctx.strokeStyle="#b9f4ff"; ctx.lineWidth=4; for(let x=-100;x<W+100;x+=100){ctx.beginPath();ctx.arc(x-(drift%100),FLOOR-65,55,Math.PI,0);ctx.stroke();}
    for(let i=0;i<4;i++){const x=180+i*390-drift%390;ctx.fillStyle="#eee5d7";ctx.fillRect(x,FLOOR-390,16,320);ctx.strokeStyle="#eee5d7";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,FLOOR-360);ctx.lineTo(x-150,FLOOR-160);ctx.stroke();}
  } else if (level.theme === "brazil") {
    ctx.fillStyle="#176346"; ctx.beginPath(); ctx.moveTo(0,FLOOR); for(let x=0;x<=W;x+=90)ctx.lineTo(x,FLOOR-210-Math.sin((x+drift)/120)*80);ctx.lineTo(W,FLOOR);ctx.fill();
    for(let i=0;i<12;i++){const x=i*190-drift%190;ctx.fillStyle="#22553b";ctx.fillRect(x,FLOOR-260,20,260);ctx.fillStyle=i%2?"#22a85f":"#66bd55";ctx.beginPath();ctx.arc(x+10,FLOOR-280,75,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle="#ffe24f"; ctx.beginPath(); ctx.arc(W-130,110,55,0,Math.PI*2);ctx.fill();
  } else {
    ctx.fillStyle="#b9e5f4"; ctx.beginPath();ctx.moveTo(0,FLOOR);for(let x=0;x<=W;x+=160)ctx.lineTo(x,FLOOR-190-Math.sin((x+drift)/170)*110);ctx.lineTo(W,FLOOR);ctx.fill();
    ctx.fillStyle="#78a065";ctx.fillRect(0,FLOOR-110,W,110);
    ctx.fillStyle="#fff";ctx.fillRect(W-245,70,170,10);ctx.fillStyle="#76b9e8";ctx.fillRect(W-245,80,170,36);ctx.fillStyle="#fff";ctx.fillRect(W-245,116,170,10);
    ctx.fillStyle="#f4c84e";ctx.beginPath();ctx.arc(W-160,98,12,0,Math.PI*2);ctx.fill();
  }
}

function draw() {
  if (!level) loadLevel(0);
  const gradient = ctx.createLinearGradient(0,0,0,H);
  gradient.addColorStop(0, level.sky[0]); gradient.addColorStop(1, level.sky[1]);
  ctx.fillStyle = gradient; ctx.fillRect(0,0,W,H);

  drawBackdrop();
  ctx.globalAlpha = .25;
  for (let i=0; i<28; i++) {
    const x = ((i * 223 - cameraX * .12) % (W + 100)) - 50;
    const y = 70 + (i * 97) % 390;
    drawStar(x, y, i%4===0 ? 5 : 2, "#fff");
  }
  ctx.globalAlpha = 1;

  ctx.save(); ctx.translate(-cameraX, 0);
  for (let i=0; i<level.width/300; i++) {
    ctx.fillStyle = i%2 ? "#ffffff09" : "#0000000b";
    ctx.beginPath(); ctx.moveTo(i*360, FLOOR); ctx.lineTo(i*360+190, 250+(i%3)*50); ctx.lineTo(i*360+400,FLOOR); ctx.fill();
  }

  level.platforms.forEach(([x,y,w,h]) => {
    roundedRect(x,y,w,h,14,level.ground);
    roundedRect(x,y,w,10,8,"#a276d8");
    for(let i=20;i<w;i+=55) { ctx.fillStyle="#ffffff0c"; ctx.fillRect(x+i,y+28,22,8); }
  });
  level.moving.forEach((moving) => {
    const [,y,w,h]=moving.data;
    roundedRect(moving.x,y,w,h,10,"#7257b9"); roundedRect(moving.x,y,w,7,6,"#d6a8ff");
  });

  const checkpoint = level.checkpoint;
  const checkpointGround = checkpoint.y + 110;
  ctx.fillStyle=checkpoint.active?"#ffd45c":"#e9ecff";ctx.fillRect(checkpoint.x,checkpointGround-105,7,105);
  ctx.beginPath();ctx.moveTo(checkpoint.x+7,checkpointGround-105);ctx.lineTo(checkpoint.x+70,checkpointGround-82);ctx.lineTo(checkpoint.x+7,checkpointGround-60);ctx.fillStyle=checkpoint.active?"#ff587d":"#8090b5";ctx.fill();
  if(checkpoint.active){ctx.globalAlpha=.2;ctx.beginPath();ctx.arc(checkpoint.x+25,checkpointGround-80,65,0,Math.PI*2);ctx.fillStyle="#ffd45c";ctx.fill();ctx.globalAlpha=1;}

  level.boxes.forEach((box) => {
    const by = box.y - Math.sin((box.bump / 12) * Math.PI) * 12;
    if (box.isLast && !box.used) {
      ctx.globalAlpha=.22;ctx.beginPath();ctx.arc(box.x+28,by+28,48,0,Math.PI*2);ctx.fillStyle="#ffd45c";ctx.fill();ctx.globalAlpha=1;
    }
    roundedRect(box.x,by,56,56,10,box.used ? "#5e526e" : "#f0a93b");
    roundedRect(box.x+5,by+5,46,46,7,box.used ? "#746682" : "#ffc857");
    ctx.fillStyle = box.used ? "#9587a3" : "#7b4b32";
    ctx.font = box.isLast && !box.used ? "900 21px DM Sans" : "900 34px DM Sans";
    ctx.textAlign = "center"; ctx.fillText(box.used ? "·" : box.checkpointRecovery ? "🐒" : box.type === "bananas" ? "🍌" : box.isLast ? "↑↑" : "?",box.x+28,by+40); ctx.textAlign = "left";
    if(box.isLast && levelIndex===0 && box.secretJumps>0 && box.secretJumps<10){
      ctx.fillStyle="#fff";ctx.font="800 12px DM Sans";ctx.textAlign="center";ctx.fillText(`${box.secretJumps}/10`,box.x+28,by-10);ctx.textAlign="left";
    }
    if(box.firstBananaBox && box.infiniteLifeJumps>0){
      ctx.fillStyle=infiniteLives?"#ffd45c":"#fff";
      ctx.font=infiniteLives?"900 13px DM Sans":"800 12px DM Sans";
      ctx.textAlign="center";
      ctx.fillText(infiniteLives ? "∞ VIDAS" : `${box.infiniteLifeJumps}/10`,box.x+28,by-10);
      ctx.textAlign="left";
    }
  });
  if (monkeyPop && monkeyPopImage.complete && monkeyPopImage.naturalWidth) {
    const scale=1+Math.sin((75-monkeyPop.life)*.15)*.08;
    ctx.save();ctx.translate(monkeyPop.x+30,monkeyPop.y);ctx.scale(scale,scale);ctx.drawImage(monkeyPopImage,-35,-60,70,70);ctx.restore();
  }

  level.spikes.forEach(([x,y,w]) => {
    for(let sx=x; sx<x+w; sx+=24) {
      ctx.beginPath(); ctx.moveTo(sx,y+25); ctx.lineTo(sx+12,y); ctx.lineTo(sx+24,y+25); ctx.fillStyle="#ff6687"; ctx.fill();
    }
  });

  level.coins.forEach((coin) => {
    if (coin.taken) return;
    const bob = Math.sin(performance.now()/250 + coin.phase)*6;
    ctx.beginPath(); ctx.arc(coin.x,coin.y+bob,14,0,Math.PI*2); ctx.fillStyle="#ffd45c"; ctx.fill();
    ctx.beginPath(); ctx.arc(coin.x-3,coin.y+bob-3,5,0,Math.PI*2); ctx.fillStyle="#fff1a5"; ctx.fill();
  });

  level.enemies.forEach((e) => {
    if (!e.alive) return;
    drawEnemy(e);
  });

  if (boss && !boss.defeated) {
    ctx.save();
    if (boss.invulnerable && Math.floor(boss.invulnerable/4)%2) ctx.globalAlpha=.35;
    ctx.translate(boss.x+boss.w/2,boss.y+boss.h/2);
    ctx.scale(boss.vx < 0 ? 1 : -1,1);
    if (bossImage.complete && bossImage.naturalWidth) ctx.drawImage(bossImage,-boss.w/2-20,-boss.h/2-12,boss.w+40,boss.h+24);
    else roundedRect(-boss.w/2,-boss.h/2,boss.w,boss.h,22,"#6d193c");
    ctx.restore();
  }

  bananas.forEach(banana => {
    ctx.save();
    ctx.translate(banana.x, banana.y);
    ctx.rotate(banana.rotation);
    ctx.strokeStyle="#ffd43b";
    ctx.lineWidth=8;
    ctx.lineCap="round";
    ctx.beginPath();
    ctx.arc(0,0,13,.25,Math.PI*1.35);
    ctx.stroke();
    ctx.strokeStyle="#7a4b17";
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.arc(0,0,13,.25,Math.PI*1.35);
    ctx.stroke();
    ctx.restore();
  });

  const [gx,gy] = level.goal;
  if (levelIndex === levels.length - 1 && boss?.defeated && motherImage.complete && motherImage.naturalWidth) {
    ctx.globalAlpha=.22; ctx.beginPath();ctx.arc(gx+35,gy+45,78,0,Math.PI*2);ctx.fillStyle="#ffd45c";ctx.fill();ctx.globalAlpha=1;
    ctx.drawImage(motherImage,gx-10,gy-30,95,165);
  } else {
    ctx.fillStyle="#eeeaff"; ctx.fillRect(gx+32,gy+30,8,100);
    ctx.globalAlpha=.18; ctx.beginPath(); ctx.arc(gx+35,gy+25,58,0,Math.PI*2); ctx.fillStyle="#ffd45c"; ctx.fill(); ctx.globalAlpha=1;
    drawStar(gx+35,gy+25,30,"#ffd45c");
  }

  if (!player.invulnerable || Math.floor(player.invulnerable/5)%2) drawPlayer();
  if (bananaRefillPop) {
    const lift = (90 - bananaRefillPop.life) * .45;
    ctx.save();
    ctx.translate(player.x + player.w + 28, player.y + 28 - lift);
    ctx.globalAlpha = Math.min(1, bananaRefillPop.life / 25);
    ctx.font = "900 30px DM Sans";
    ctx.textAlign = "center";
    ctx.fillText("🍌", 0, 0);
    ctx.fillStyle = "#fff";
    ctx.font = "900 15px DM Sans";
    ctx.fillText("×10", 0, 20);
    ctx.restore();
  }
  particles.forEach(p => {
    ctx.globalAlpha=Math.min(1,p.life/30);
    if (p.type === "coin") {
      ctx.beginPath();ctx.arc(p.x,p.y,12,0,Math.PI*2);ctx.fillStyle="#ffd45c";ctx.fill();
      ctx.beginPath();ctx.arc(p.x-3,p.y-3,4,0,Math.PI*2);ctx.fillStyle="#fff1a5";ctx.fill();
    } else if (p.type === "satchel") drawSatchel(p.x,p.y);
    else if (p.type === "banana") {
      ctx.strokeStyle="#ffd43b";ctx.lineWidth=6;ctx.beginPath();ctx.arc(p.x,p.y,10,.2,Math.PI*1.3);ctx.stroke();
    }
    else drawStar(p.x,p.y,5,"#ffd45c");
  });
  ctx.globalAlpha=1; ctx.restore();

  ctx.fillStyle="#ffffffbb"; ctx.font="700 12px DM Sans"; ctx.fillText(level.name.toUpperCase(),24,34);
  if (boss && !boss.defeated) {
    roundedRect(W/2-230,22,460,48,14,"#14162bcc");
    ctx.fillStyle="#fff";ctx.font="800 13px DM Sans";ctx.textAlign="center";ctx.fillText("FRANCISCO MERELLI",W/2,42);
    roundedRect(W/2-170,50,340,9,5,"#ffffff22");
    roundedRect(W/2-170,50,340*(boss.hp/3),9,5,"#ff587d");
    ctx.textAlign="left";
  }
}

function drawPlayer() {
  const {x,y,w,h,facing}=player;
  const running = player.grounded && Math.abs(player.vx) > 1;
  const bob = running ? Math.abs(Math.sin(runPhase)) * 4 : 0;
  ctx.save(); ctx.translate(x+w/2,y+h/2-bob); ctx.scale(facing,1);
  ctx.rotate(running ? Math.sin(runPhase) * .035 : 0);
  const wearsJacket = levelIndex === 2;
  const runSheet = wearsJacket
    ? world3JacketRunSheetImage
    : player.hasMonkey
      ? monkeyRunSheetImage
      : playerRunSheetImage;
  const activeImage = wearsJacket
    ? (running ? world3JacketRun2Image : world3JacketImage)
    : player.hasMonkey
      ? (running ? monkeyRun2Image : monkeyPlayerImage)
      : (running ? playerRun2Image : playerImage);
  if (running && runSheet.complete && runSheet.naturalWidth) {
    const frame = Math.floor(runPhase * .55) % RUN_FRAME_COUNT;
    ctx.drawImage(runSheet,frame*RUN_FRAME_W,0,RUN_FRAME_W,RUN_FRAME_H,-w/2-14,-h/2-8,w+28,h+16);
    if (wearsJacket && player.hasMonkey) {
      ctx.save();
      ctx.translate(-18,-h/2-1-Math.sin(runPhase)*2);
      ctx.rotate(Math.sin(runPhase)*.05);
      ctx.drawImage(monkeyPopImage,-23,-31,46,46);
      ctx.restore();
    }
  } else if (activeImage.complete && activeImage.naturalWidth) {
      ctx.drawImage(activeImage,-w/2-14,-h/2-8,w+28,h+16);
    if (wearsJacket && player.hasMonkey) {
      ctx.save();
      ctx.translate(-18,-h/2-1-Math.sin(runPhase)*2);
      ctx.rotate(running ? Math.sin(runPhase)*.05 : -.04);
      ctx.drawImage(monkeyPopImage,-23,-31,46,46);
      ctx.restore();
    }
  } else {
    ctx.shadowColor="#7557ff"; ctx.shadowBlur=18;
    roundedRect(-w/2,-h/2+8,w,h-8,17,"#7658ff");
    ctx.shadowBlur=0;
    ctx.beginPath(); ctx.arc(0,-h/2+10,21,0,Math.PI*2); ctx.fillStyle="#ffc8a9"; ctx.fill();
    ctx.fillStyle="#221832"; ctx.fillRect(5,-h/2+6,5,6); ctx.fillRect(16,-h/2+6,5,6);
    ctx.fillStyle="#ff587d"; ctx.fillRect(-w/2-5,h/2-10,24,10); ctx.fillRect(8,h/2-10,24,10);
  }
  ctx.restore();
}

function loop(time) {
  const dt = Math.min(2, (time-lastTime)/16.67 || 1); lastTime=time;
  update(dt); draw(); requestAnimationFrame(loop);
}

function setKey(event, pressed) {
  if (["ArrowLeft","KeyA"].includes(event.code)) keys.left=pressed;
  if (["ArrowRight","KeyD"].includes(event.code)) keys.right=pressed;
  if (["ArrowUp","KeyW","Space"].includes(event.code)) { if (pressed && !event.repeat) keys.jump=true; event.preventDefault(); }
  if (["KeyF","KeyX"].includes(event.code)) { if (pressed && !event.repeat) keys.fire=true; event.preventDefault(); }
}

function syncMobileViewport() {
  const viewport = window.visualViewport;
  const width = Math.max(viewport?.width || 0, document.documentElement.clientWidth, window.innerWidth);
  const height = Math.max(viewport?.height || 0, document.documentElement.clientHeight, window.innerHeight);
  document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`);
}

syncMobileViewport();
addEventListener("resize", syncMobileViewport);
addEventListener("orientationchange", syncMobileViewport);
window.visualViewport?.addEventListener("resize", syncMobileViewport);
document.addEventListener("fullscreenchange", syncMobileViewport);

document.addEventListener("contextmenu", event => event.preventDefault());
document.addEventListener("selectstart", event => event.preventDefault());
document.addEventListener("dragstart", event => event.preventDefault());

addEventListener("keydown", e => setKey(e,true));
addEventListener("keyup", e => setKey(e,false));
document.querySelectorAll("[data-control]").forEach(button => {
  const control=button.dataset.control;
  button.addEventListener("pointerdown", e => { e.preventDefault(); keys[control]=true; });
  button.addEventListener("pointerup", () => keys[control]=false);
  button.addEventListener("pointercancel", () => keys[control]=false);
});
document.addEventListener("pointerdown", e => {
  if (e.pointerType === "mouse" || e.target.closest("button") || state !== "playing") return;
  e.preventDefault();
  keys.jump = true;
});
document.querySelector("#startButton").addEventListener("click", startGame);
introMusicButton.addEventListener("click", async () => {
  if (!audioEnabled) {
    audioEnabled = true;
    document.querySelector("#soundButton").textContent = "♪";
  }
  if (introMusic.paused) {
    try {
      await introMusic.play();
      introMusicButton.classList.add("playing");
      introMusicButton.textContent = "❚❚ Pausar canción";
    } catch {}
  } else {
    introMusic.pause();
    introMusicButton.classList.remove("playing");
    introMusicButton.textContent = "♪ Escuchar canción";
  }
});
document.querySelector("#restartButton").addEventListener("click", () => {
  endingVideo.pause();
  endingVideo.currentTime = 0;
  messageCard.classList.remove("level-video","victory");
  loadLevel(levelIndex); state="playing"; messageScreen.classList.remove("visible");
});
document.querySelector("#continueButton").addEventListener("click", () => {
  endingVideo.pause();
  endingVideo.currentTime = 0;
  messageCard.classList.remove("level-video","victory");
  messageScreen.classList.remove("visible");
  if (nextLevelIndex !== null) {
    loadLevel(nextLevelIndex);
    nextLevelIndex = null;
    state="playing";
    return;
  }
  startGame();
});
document.querySelector("#soundButton").addEventListener("click", e => {
  audioEnabled=!audioEnabled; e.currentTarget.textContent=audioEnabled ? "♪" : "×";
  if (!audioEnabled) {
    introMusic.pause();
    introMusicButton.classList.remove("playing");
    introMusicButton.textContent = "♪ Escuchar canción";
  }
});

loadLevel(0);
requestAnimationFrame(loop);
