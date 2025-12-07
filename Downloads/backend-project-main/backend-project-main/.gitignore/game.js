const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const API_BASE = '';
// const API_BASE = 'http://localhost:5000';
const PUMPKIN_SIZE = 80;

// Smooth scaling
ctx.imageSmoothingEnabled = true;

const welcomeBg = new Image();
welcomeBg.src = "welcome.jpg";         

const bgImg = new Image();
bgImg.src = "background.jpg";

const rabbitIdle = new Image();
rabbitIdle.src = "rabbit1.png";

const rabbitMove = new Image();
rabbitMove.src = "rabbit2.png";

const pumpkinImg = new Image();
pumpkinImg.src = "pumpkin.png";

const player = {
  x: canvas.width / 2 - 40,
  y: 0,
  width: 80,
  height: 0
};

let playerSpeed = 250;          
let obstacleSpeed = 120;        
let obstacleAccel = 4;          
const MAX_OBSTACLE_SPEED = 420; 

let obstacles = [];
let gameOver = false;
let isMoving = false;

let scoreSubmitted = false;
let keysPressed = {};

let startTime = 0;      
let elapsedTime = 0;    
let lastTimestamp = 0; 
let spawnTimer = 0;     
const SPAWN_INTERVAL = 0.9; 

let gameStarted = false; 

// Local best
let highTime = localStorage.getItem("highTime")
  ? parseFloat(localStorage.getItem("highTime"))
  : 0;

document.addEventListener("keydown", (e) => {
  // Start game from welcome screen
  if (!gameStarted && e.key === "Enter") {
    gameStarted = true;
    startTime = 0;
    lastTimestamp = 0;
    requestAnimationFrame(gameLoop);
    return;
  }
  if (!gameStarted || gameOver) return;

  keysPressed[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keysPressed[e.key] = false;
});


async function submitScore(finalScore) {
  try {
    const res = await fetch(`${API_BASE}/api/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: finalScore })
    });
    if (!res.ok) throw new Error(await res.text());
    await res.json();
    await loadTopScores();
  } catch (err) {
    console.error('Failed to submit score:', err);
  }
}

async function loadTopScores() {
  try {
    const res = await fetch(`${API_BASE}/api/scores`);
    if (!res.ok) throw new Error(await res.text());
    const topScores = await res.json(); // [number, number, number]
    const listEl = document.getElementById('highscores');
    if (listEl) {
      listEl.innerHTML = topScores
        .map((s, i) => `<li>${i + 1}. ${Number(s).toFixed(1)}s</li>`)
        .join('');
    }
  } catch (err) {
    console.error('Failed to load scores:', err);
  }
}

async function clearLeaderboard() {
  try {
    const res = await fetch(`${API_BASE}/api/scores`, { method: 'DELETE' });
    if (!res.ok) throw new Error(await res.text());
    await loadTopScores();
  } catch (err) {
    console.error('Failed to clear leaderboard:', err);
  }
}

window.clearLeaderboard = clearLeaderboard;

function movePlayer(dt) {
  isMoving = false;
  if (keysPressed["ArrowLeft"] || keysPressed["a"]) {
    player.x -= playerSpeed * dt;
    isMoving = true;
  }
  if (keysPressed["ArrowRight"] || keysPressed["d"]) {
    player.x += playerSpeed * dt;
    isMoving = true;
  }

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

function createObstacle() {
  const size = PUMPKIN_SIZE
  const x = Math.random() * (canvas.width - size);
  obstacles.push({ x, y: -size, width: size, height: size });
}

function updateObstacles(dt) {
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].y += obstacleSpeed * dt;
    if (obstacles[i].y > canvas.height) {
      obstacles.splice(i, 1);
      i--;
    }
  }

  obstacleSpeed = Math.min(obstacleSpeed + obstacleAccel * dt, MAX_OBSTACLE_SPEED);
}

function maybeSpawn(dt) {
  spawnTimer += dt;
  while (spawnTimer >= SPAWN_INTERVAL) {
    createObstacle();
    spawnTimer -= SPAWN_INTERVAL;
  }
}

function circleCollide(ax, ay, ar, bx, by, br) {
  const dx = ax - bx, dy = ay - by;
  const dist2 = dx*dx + dy*dy;
  const rsum = ar + br;
  return dist2 <= rsum * rsum;
}

function checkCollision() {
  // Rabbit circle centered near the face (not ears)
  const rabbitCx = player.x + player.width * 0.5;
  const rabbitCy = player.y + player.height * 0.7;  // lower down so ears don’t count
  const rabbitR  = Math.min(player.width, player.height) * 0.32;

  for (const obs of obstacles) {
    const pumpkinCx = obs.x + obs.width * 0.5;
    const pumpkinCy = obs.y + obs.height * 0.5;
    const pumpkinR  = Math.min(obs.width, obs.height) * 0.42;

    if (circleCollide(rabbitCx, rabbitCy, rabbitR, pumpkinCx, pumpkinCy, pumpkinR)) {
      gameOver = true;
      return;
    }
  }
}


function drawPlayer() {
  const hasIdle = rabbitIdle.complete && rabbitIdle.naturalWidth > 0 && rabbitIdle.naturalHeight > 0;
  const aspectRatio = hasIdle ? (rabbitIdle.naturalWidth / rabbitIdle.naturalHeight) : 1.0; // safer default

  player.height = player.width / aspectRatio;
  player.height = Math.min(player.height, 100);            // clamp
  player.y = canvas.height - player.height - 10;

  const sprite = isMoving ? rabbitMove : rabbitIdle;
  const hasSprite = sprite.complete && sprite.naturalWidth > 0 && sprite.naturalHeight > 0;

  if (hasSprite) {
    ctx.drawImage(sprite, player.x, player.y, player.width, player.height);
  } else if (hasIdle) {
    ctx.drawImage(rabbitIdle, player.x, player.y, player.width, player.height);
  } else {
    // placeholder while images load
    ctx.fillStyle = "#ffddb3";
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    const loaded = pumpkinImg.complete && pumpkinImg.naturalWidth > 0;
    if (loaded) {
      ctx.drawImage(pumpkinImg, obs.x, obs.y, obs.width, obs.height);
    } else {
      ctx.fillStyle = "brown";
      ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
  }
}



function drawTime() {
  ctx.save();

  // Ensure no previous transformations/alphas/compositing leak into HUD
  ctx.setTransform(1, 0, 0, 1, 0, 0);        // reset any scale/translate/rotate
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  // Box placement
  const pad = 10;
  const boxX = 8;
  const boxY = 8;

  // Text style (explicit alignment!)
  ctx.font = "20px Arial";
  ctx.textAlign = "left";                    // <--- IMPORTANT
  ctx.textBaseline = "top";                  // <--- IMPORTANT

  // Measure text to compute a box that always fits
  const line1 = `Time: ${elapsedTime.toFixed(1)}s`;
  const line2 = `Longest: ${highTime.toFixed(1)}s`;
  const lineGap = 4;
  const lineHeight = 24; // roughly fits 20px font

  const w1 = ctx.measureText(line1).width;
  const w2 = ctx.measureText(line2).width;
  const textWidth = Math.max(w1, w2);
  const boxW = Math.ceil(textWidth + pad * 2);             // dynamic width
  const boxH = Math.ceil(lineHeight * 2 + lineGap + pad*2); // dynamic height

  // Draw HUD background box
  ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
  ctx.fillRect(boxX, boxY, boxW, boxH);

  // Optional subtle border
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.strokeRect(boxX, boxY, boxW, boxH);

  // Text with a soft shadow for contrast
  ctx.fillStyle = "white";
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Draw text inside the box with padding
  const textX = boxX + pad;
  let textY = boxY + pad;

  ctx.fillText(line1, textX, textY);
  textY += lineHeight + lineGap;
  ctx.fillText(line2, textX, textY);

  ctx.restore();
}

/* -----------------------------
   WELCOME SCREEN (drawn on canvas)
----------------------------- */
function drawWelcome() {
  // Background image or fallback
  if (welcomeBg.complete && welcomeBg.naturalWidth > 0) {
    ctx.drawImage(welcomeBg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#fff";

  // Title (use your game font if loaded)
  ctx.font = "48px 'Baloo 2', Arial, sans-serif";
  ctx.fillText("Welcome to Dodger Game", canvas.width / 2, canvas.height / 2 - 20);

  // Pulsing "Press Enter to Start"
  const t = performance.now() / 1000;
  const alpha = 0.6 + 0.4 * Math.sin(t * 2.5);
  ctx.globalAlpha = alpha;
  ctx.font = "24px 'Baloo 2', Arial, sans-serif";
  ctx.fillText("Press Enter to Start", canvas.width / 2, canvas.height / 2 + 28);
  ctx.globalAlpha = 1;
}

function gameLoop(timestamp) {
  // Welcome screen until Enter
  if (!gameStarted) {
    drawWelcome();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (!startTime) startTime = timestamp;
  const dt = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0;
  lastTimestamp = timestamp;
  elapsedTime = (timestamp - startTime) / 1000;

  if (gameOver) {
    // Update local best if beaten
    if (elapsedTime > highTime) {
      highTime = elapsedTime;
      localStorage.setItem("highTime", highTime);
    }

    // Show Game Over panel (below canvas)
    document.getElementById("game-over").classList.remove("hidden");
    document.getElementById("final-score").textContent = elapsedTime.toFixed(1) + "s";
    document.getElementById("high-score").textContent = highTime.toFixed(1) + "s";

    if (!scoreSubmitted) {
      scoreSubmitted = true;
      submitScore(elapsedTime);
    }
    return; // Stop the loop until Restart
  }

  // Background
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (bgImg.complete && bgImg.naturalWidth > 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#3a3a3a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  movePlayer(dt);
  drawPlayer();
  drawObstacles();
  drawTime();

  updateObstacles(dt);
  checkCollision();
  maybeSpawn(dt);

  requestAnimationFrame(gameLoop);
}

document.getElementById("restart-btn").addEventListener("click", () => {
  obstacles = [];
  gameOver = false;
  scoreSubmitted = false;
  document.getElementById("game-over").classList.add("hidden");

  // Reset timers & speeds
  startTime = 0;
  elapsedTime = 0;
  lastTimestamp = 0;
  spawnTimer = 0;
  obstacleSpeed = 120;

  requestAnimationFrame(gameLoop);
});

// Load server leaderboard on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  loadTopScores();
});

// Start render loop immediately to show the welcome screen
requestAnimationFrame(gameLoop);