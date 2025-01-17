import Player from './player.js';
import BulletController from './bulletcontroller.js';
import Enemy from './enemy.js';
import PowerUpGate from './powerup.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 550;
canvas.height = 600;

const bulletController = new BulletController(canvas);
const enemies = [];
const player = new Player(canvas.width / 2.2, canvas.height / 1.3, bulletController);

let powerUpGates = [];
let clone_counter = 0;

let gameStarted = false;
let frameCount = 0;
let enemySpawnRate = 60;
let score = 0;
let gameOverTriggered = false;

//  Function to spawn a power-up gate
function spawnPowerUpGate() {
    const xPosition = Math.random() * (canvas.width - 50);  // Ensure power-up stays within canvas width
    const yPosition = 0;  // Start at the top

    const powerUpTypes = [" +1", " -1", " x2", " /2"];
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    powerUpGates.push(new PowerUpGate(xPosition, yPosition, randomType));
}

//  Function to handle power-up effects
function applyPowerUp(powerUp) {
    if (powerUp.type === " +1") {
        makeClone();
    } else if (powerUp.type === " -1" && player.clones.length > 0) {
        player.clones.pop();  // Remove a clone
    } else if (powerUp.type === " x2") {
        const initialLength = player.clones.length;
        for (let i = 0; i <= initialLength; i++) {
            makeClone();
        }
    } else if (powerUp.type === " /2") {
        const totalClones = Math.floor((player.clones.length + 1) / 2);
        for (let i = player.clones.length; i > totalClones; i--) {
            player.clones.pop();
        }
    } else if (powerUp.type === "gun") {
        //  Fix: Increase bullet damage for the player
        bulletController.damage += 1;
        console.log("Gun power-up collected! Bullet damage increased to:", bulletController.damage);
    }
}

//  Function to spawn enemies
function spawnEnemy() {
    const xPosition = Math.random() * (canvas.width - 50);
    const baseSpeed = 0.3 + Math.random() * 0.5;  // Random speed between 0.3 and 0.8

    // Spawn more enemies if there are clones
    const numEnemies = player.clones.length > 0 ? Math.floor(Math.random() * 3) + 1 : 1;

    for (let i = 0; i < numEnemies; i++) {
        const isBoss = player.clones.length > 0 && Math.random() < 0.1;  // 10% chance to spawn a boss
        const health = isBoss ? 250 : Math.floor(Math.random() * 10) + 1;
        const speed = isBoss ? baseSpeed * 0.5 : baseSpeed;  // Bosses move slower
        enemies.push(new Enemy(xPosition, 0, health, speed, isBoss));
    }
}

//  Main game loop
function gameLoop() {
    if (gameOverTriggered) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setCommonStyle();

    // Draw bullets and the player
    bulletController.draw(ctx);
    player.draw(ctx);

    // Update and draw enemies
    enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw(ctx);

        // Check if bullets collide with the enemy
        if (bulletController.collideWith(enemy)) {
            if (enemy.health <= 0) {
                enemies.splice(index, 1);  // Remove the enemy if its health is 0
            }
        }

        // Check for collision with player
        if (player.isColliding(enemy)) {
            console.log("Collision detected! Game over.");
            gameOver();
            return;
        }

        // Check if enemy reaches the bottom of the canvas
        if (enemy.y >= canvas.height - enemy.height) {
            console.log("Enemy reached the bottom! Game over.");
            gameOver();
            return;
        }
    });

    // Update and draw power-up gates
    powerUpGates.forEach((gate, index) => {
        gate.update();
        gate.draw(ctx);

        // Check if player collides with a power-up gate
        if (gate.collideWith(player)) {
            applyPowerUp(gate);
            powerUpGates.splice(index, 1);
        }
    });

    // Update score
    score++;
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 20, 30);

    // Spawn enemies at regular intervals
    frameCount++;
    if (frameCount >= enemySpawnRate) {
        spawnEnemy();
        frameCount = 0;
    }

    // Spawn power-up gates occasionally
    if (Math.random() < 0.001) {
        spawnPowerUpGate();
    }

    // Keep the game loop running
    requestAnimationFrame(gameLoop);
}

//  Function to end the game
function gameOver() {
    if (gameOverTriggered) return;

    gameOverTriggered = true;
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 80, canvas.height / 2);

    console.log("Game Over. Final score:", score);

    transferScoreToDB(score);
    clearInterval(gameInterval);
}

//  Function to send the score to the backend
function transferScoreToDB(score) {
    fetch("/add_score", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ score: score })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            console.log(data.message);
        }
        window.location.href = "/leaderboard";
    })
    .catch(error => {
        console.error("Error saving score:", error);
    });
}

//  Function to set common canvas styles
function setCommonStyle() {
    ctx.shadowColor = "#d53";
    ctx.shadowBlur = 20;
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 5;
}

//  Function to create a clone of the player
function makeClone() {
    console.log("Clone made!");

    // Random angle and distance for the offset
    const angle = Math.random() * Math.PI * 2;
    const distance = 50 + Math.random() * 50;

    // Calculate the fixed offset for the clone
    const offsetX = Math.cos(angle) * distance;
    const offsetY = Math.sin(angle) * distance;

    // Clone size is 80% of the original player size
    const cloneWidth = player.width * 0.5;
    const cloneHeight = player.height * 0.5;

    // Create the clone with a fixed offset
    const clonedPlayer = new Player(player.x, player.y, bulletController, cloneWidth, cloneHeight);
    clonedPlayer.offsetX = offsetX;
    clonedPlayer.offsetY = offsetY;

    // Add the clone to the player's clones array
    player.clones.push(clonedPlayer);
}


//  Start the game loop
gameLoop();
