import {Snake} from './snake.js'

const canvas = document.querySelector('#game');
canvas.width = Math.min(1100, window.innerWidth - (window.innerWidth % 100));
canvas.height = Math.min(800, window.innerHeight - (window.innerHeight % 100));
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const cellSize = 50;

const segmentMargin = 4;
const segmentSize = cellSize - segmentMargin * 2;
const snakeStartSize = 7;

// frames per move
const moveTick = 10;
const animationIncriment = cellSize / moveTick;

// prerender grid on offscreen canvas
const gridcvs = document.createElement('canvas');
gridcvs.width = WIDTH;
gridcvs.height = HEIGHT;
const gridctx = gridcvs.getContext('2d');
gridctx.fillStyle = 'black';
gridctx.fillRect(0, 0, WIDTH, HEIGHT);
for (let i = 0; i <= WIDTH; i += cellSize)
    for (let j = 0; j <= HEIGHT; j += cellSize) {
        gridctx.fillStyle = `hsl(${i + j}, 100%, 60%`;
        gridctx.beginPath();
        gridctx.arc(i, j, 3, 0, 7);
        gridctx.fill();
    }

// create snake
let snake = new Snake(WIDTH/cellSize, HEIGHT/cellSize, 12, 6, snakeStartSize);


// initial draw
drawGrid();
fadeBlack(0.7);
ctx.strokeStyle = 'white';
ctx.lineWidth = 6;
ctx.font = `bold ${3*cellSize}px sans-serif`;
ctx.strokeText('Press Space', WIDTH/25, HEIGHT/3);
ctx.strokeText('To Start', WIDTH/6, HEIGHT/3*2);

// gameloop variables
let tick = 0;
let nextFrame = null;

// wait for game start
document.addEventListener('keyup', start);

function start(e) {
    if (e.key == ' ') {
        // key listeners
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;

            if (keyName == 'ArrowLeft')
                snake.changeDirection('left');
            if (keyName == 'ArrowRight')
                snake.changeDirection('right');
            if (keyName == 'ArrowUp')
                snake.changeDirection('up');
            if (keyName == 'ArrowDown')
                snake.changeDirection('down');
        });

        // start gameloop
        gameLoop();
        document.removeEventListener('keyup', start);
    }
}


function gameLoop(currentTime) {
    nextFrame = requestAnimationFrame(gameLoop);
    
    ++tick;
    if (tick > moveTick) {
        snake.move();
        if (snake.checkCollision()) {
            cancelAnimationFrame(nextFrame);
            gameover();
            return;
        }
        tick = 0;
    }

    draw();
}

function draw() {
    // draw grid
    drawGrid();

    // draw coin
    const coin = snake.getCoin();
    const cx = coin.x * cellSize + cellSize/2;
    const cy = coin.y * cellSize + cellSize/2;
    ctx.strokeStyle = `hsl(${cx + cy}, 100%, 60%`;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, cellSize/2.5, 0, 7);
    ctx.stroke();

    
    // draw snake
    ctx.lineWidth = 2;
    for (let segment of snake) {
        let x = segment.x * cellSize + segmentMargin;
        let y = segment.y * cellSize + segmentMargin;
        let offset = animationIncriment * tick

        if (segment.direction == 'up')
            ctx.strokeRect(x, y + cellSize - offset, segmentSize, segmentSize);
        if (segment.direction == 'down')
            ctx.strokeRect(x, y - cellSize + offset, segmentSize, segmentSize);
        if (segment.direction == 'left')
            ctx.strokeRect(x + cellSize - offset, y, segmentSize, segmentSize);
        if (segment.direction == 'right')
            ctx.strokeRect(x - cellSize + offset, y, segmentSize, segmentSize);
    }
}

function gameover() {
    fadeBlack(0.75);

    ctx.lineWidth = 6;
    ctx.strokeStyle = 'darkred';
    ctx.font = `bold ${3*cellSize}px sans-serif`;
    ctx.strokeText('Game Over', WIDTH/12, HEIGHT/2);

    ctx.lineWidth = 3;
    ctx.strokeStyle = 'goldenrod';
    ctx.font = `bold ${1.5*cellSize}px sans-serif`;
    ctx.strokeText(`Score: ${snake.segments.length - snakeStartSize}`,
                 WIDTH/4, HEIGHT/2 + 1.5*cellSize);

    // reset snake
    snake = new Snake(WIDTH/cellSize, HEIGHT/cellSize, 12, 6, snakeStartSize);
    document.addEventListener('keyup', start);
}

function drawGrid() {
    ctx.drawImage(gridctx.canvas, 0, 0);
}

function fadeBlack(alpha) {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.globalAlpha = 1;
}
