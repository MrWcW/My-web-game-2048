const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800; // Game width
canvas.height = 400; // Game height

// Player object
const player = {
    x: 50,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0,
    dy: 0,
};

// Gravity settings
const gravity = 0.5;
let isJumping = false;

// Key controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") player.dx = player.speed;
    if (e.key === "ArrowLeft") player.dx = -player.speed;
    if (e.key === "ArrowUp" && !isJumping) {
        player.dy = -10;
        isJumping = true;
    }
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") player.dx = 0;
});

// Update player position
function updatePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Apply gravity
    if (player.y + player.height < canvas.height) {
        player.dy += gravity;
    } else {
        player.dy = 0;
        isJumping = false;
        player.y = canvas.height - player.height; // Reset to ground level
    }

    // Prevent going out of bounds
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw the game objects
function drawPlayer() {
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updatePlayer();
    drawPlayer();
    
    requestAnimationFrame(gameLoop); // Loop the game
}

// Start the game loop
gameLoop();
