const player = document.getElementById('player');
const chicken = document.getElementById('chicken');
const key = document.getElementById('key');
const door = document.getElementById('door');
const result = document.getElementById('result');
const map = document.getElementById('map');
const walls = document.querySelectorAll('.wall');

let playerPos, chickenPos, keyPos, doorPos;
let hasKey = false;
let gameEnded = false;

function getRandomPosition() {
    return {
        x: Math.floor(Math.random() * 10),
        y: Math.floor(Math.random() * 10)
    };
}

function positionsCollide(pos1, pos2) {
    return pos1.x === pos2.x && pos2.y === pos1.y;
}

function initializePositions() {
    do {
        playerPos = getRandomPosition();
        chickenPos = getRandomPosition();
        keyPos = getRandomPosition();
        doorPos = getRandomPosition();
    } while (
        positionsCollide(playerPos, chickenPos) ||
        positionsCollide(playerPos, keyPos) ||
        positionsCollide(playerPos, doorPos) ||
        positionsCollide(chickenPos, keyPos) ||
        positionsCollide(chickenPos, doorPos) ||
        positionsCollide(keyPos, doorPos) ||
        isWall(playerPos) ||
        isWall(chickenPos) ||
        isWall(keyPos) ||
        isWall(doorPos)
    );
}

function updatePosition(element, pos) {
    element.style.transform = `translate(${pos.x * 55}px, ${pos.y * 55}px)`;
}

function isWall(pos) {
    for (const wall of walls) {
        const rect = wall.getBoundingClientRect();
        const wallPos = {
            x1: (rect.left - map.offsetLeft) / 55,
            y1: (rect.top - map.offsetTop) / 55,
            x2: (rect.right - map.offsetLeft) / 55,
            y2: (rect.bottom - map.offsetTop) / 55
        };
        if (pos.x >= wallPos.x1 && pos.x < wallPos.x2 && pos.y >= wallPos.y1 && pos.y < wallPos.y2) {
            return true;
        }
    }
    return false;
}

function validMove(pos) {
    return pos.x >= 0 && pos.x < 10 && pos.y >= 0 && pos.y < 10 && !isWall(pos);
}

function moveChicken() {
    if (gameEnded) return;

    const deltaX = playerPos.x - chickenPos.x;
    const deltaY = playerPos.y - chickenPos.y;
    const newPos = { ...chickenPos };

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        newPos.x += Math.sign(deltaX);
    } else {
        newPos.y += Math.sign(deltaY);
    }

    if (validMove(newPos)) {
        chickenPos = newPos;
        updatePosition(chicken, chickenPos);
        checkCollision();
    }
}

function checkCollision() {
    if (playerPos.x === chickenPos.x && playerPos.y === chickenPos.y) {
        result.textContent = 'You were caught by the evil chicken! 🐔🔫';
        document.removeEventListener('keydown', movePlayer);
        gameEnded = true;
    } else if (playerPos.x === keyPos.x && playerPos.y === keyPos.y) {
        hasKey = true;
        key.style.display = 'none';
        result.textContent = 'You found the key! Now get to the door! 🚪';
    } else if (playerPos.x === doorPos.x && playerPos.y === doorPos.y && hasKey) {
        result.textContent = 'You escaped! 🎉';
        document.removeEventListener('keydown', movePlayer);
        gameEnded = true;
    }
}

function movePlayer(event) {
    const newPos = { ...playerPos };
    switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
            newPos.y -= 1;
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
            newPos.y += 1;
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
            newPos.x -= 1;
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
            newPos.x += 1;
            break;
    }
    if (validMove(newPos)) {
        playerPos = newPos;
        updatePosition(player, playerPos);
        checkCollision();
    }
}

function startGame() {
    initializePositions();
    updatePosition(player, playerPos);
    updatePosition(chicken, chickenPos);
    updatePosition(key, keyPos);
    updatePosition(door, doorPos);
    key.style.display = 'block';
    result.textContent = '';
    gameEnded = false;
    hasKey = false;

    document.addEventListener('keydown', movePlayer);
    setInterval(moveChicken, 500);
}

startGame();
