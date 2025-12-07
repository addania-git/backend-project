const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Enable smoothing for better image quality
ctx.imageSmoothingEnabled = true;

// Load images
const bgImg = new Image();
bgImg.src = "background.jpg";

const rabbitIdle = new Image();
rabbitIdle.src = "rabbit1.png";

const rabbitMove = new Image();
rabbitMove.src = "rabbit2.png";

const pumpkinImg = new Image();
pumpkinImg.src = "pumpkin.png";

// Player setup
const player = {
    x: canvas.width / 2 - 40,
    y: 0,
    width: 80,
    height: 0,
    speed: 7
};

let obstacles = [];
let gameOver = false;
let obstacleSpeed = 3;
let isMoving = false;

// Track keys for smooth movement
let keysPressed = {};

// Time tracking
let startTime = 0;
let elapsedTime = 0;

// High time from localStorage
let highTime = localStorage.getItem("highTime") ? parseFloat(localStorage.getItem("highTime")) : 0;

// Key listeners
document.addEventListener("keydown", (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener("keyup", (e) => {
    keysPressed[e.key] = false;
});

// Movement logic
function movePlayer() {
    isMoving = false;
    if (keysPressed["ArrowLeft"] || keysPressed["a"]) {
        player.x -= player.speed;
        isMoving = true;
    }
    if (keysPressed["ArrowRight"] || keysPressed["d"]) {
        player.x += player.speed;
        isMoving = true;
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Create obstacles
function createObstacle() {
    const size = Math.random() * 40 + 20;
    const x = Math.random() * (canvas.width - size);
    obstacles.push({ x, y: -size, width: size, height: size, color: "brown" });
}

// Update obstacles
function updateObstacles() {
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }
}

// Collision detection
function checkCollision() {
    for (let obs of obstacles) {
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver = true;
        }
    }
}

// Draw player
function drawPlayer() {
    const aspectRatio = rabbitIdle.width / rabbitIdle.height;
    player.height = player.width / aspectRatio;
    if (player.height > 100) player.height = 100;
    player.y = canvas.height - player.height - 10;

    if (isMoving) {
        ctx.drawImage(rabbitMove, player.x, player.y, player.width, player.height);
    } else {
        ctx.drawImage(rabbitIdle, player.x, player.y, player.width, player.height);
    }
}

// Draw obstacles
function drawObstacles() {
    for (let obs of obstacles) {
        ctx.drawImage(pumpkinImg, obs.x, obs.y, obs.width, obs.height);
    }
}

// Draw time
function drawTime() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Time: " + elapsedTime.toFixed(1) + "s", 10, 30);
    ctx.fillText("Longest: " + highTime.toFixed(1) + "s", 10, 60);
}

// Game loop
function gameLoop(timestamp) {
    if (!startTime) startTime = timestamp;
    elapsedTime = (timestamp - startTime) / 1000;

    if (gameOver) {
        if (elapsedTime > highTime) {
            highTime = elapsedTime;
            localStorage.setItem("highTime", highTime);
        }
        document.getElementById("game-over").classList.remove("hidden");
        document.getElementById("final-score").textContent = elapsedTime.toFixed(1) + "s";
        document.getElementById("high-score").textContent = highTime.toFixed(1) + "s";
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawObstacles();
    drawTime();

    updateObstacles();
    checkCollision();

    if (Math.random() < 0.02) createObstacle();
    obstacleSpeed += 0.0005;

    requestAnimationFrame(gameLoop);
}

// Restart button
document.getElementById("restart-btn").addEventListener("click", () => {
    obstacles = [];
    gameOver = false;
    obstacleSpeed = 3;
    startTime = 0;
    elapsedTime = 0;
    document.getElementById("game-over").classList.add("hidden");
    requestAnimationFrame(gameLoop);
});

// Speed increase every 10 seconds
setInterval(() => {
    obstacleSpeed += 1;
}, 10000);

// Start game after background loads
bgImg.onload = function() {
    requestAnimationFrame(gameLoop);
};