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
ctx.fillStyle = 'white';
ctx.font = `bold ${3*cellSize}px serif`;
ctx.fillText('Press Space', WIDTH/25, HEIGHT/3);
ctx.fillText('To Start', WIDTH/6, HEIGHT/3*2);

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
        document.removeEventListener(start);
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
    ctx.fillStyle = `hsl(${cx + cy}, 100%, 60%`;
    ctx.beginPath();
    ctx.arc(cx, cy, cellSize/2.5, 0, 7);
    ctx.fill();

    
    // draw snake
    ctx.fillStyle = 'white';
    for (let segment of snake) {
        let x = segment.x * cellSize + segmentMargin;
        let y = segment.y * cellSize + segmentMargin;
        let offset = animationIncriment * tick

        if (segment.direction == 'up')
            ctx.fillRect(x, y + cellSize - offset, segmentSize, segmentSize);
        if (segment.direction == 'down')
            ctx.fillRect(x, y - cellSize + offset, segmentSize, segmentSize);
        if (segment.direction == 'left')
            ctx.fillRect(x + cellSize - offset, y, segmentSize, segmentSize);
        if (segment.direction == 'right')
            ctx.fillRect(x - cellSize + offset, y, segmentSize, segmentSize);
    }
}

function gameover() {
    fadeBlack(0.7);

    ctx.fillStyle = 'darkred';
    ctx.font = `bold ${3*cellSize}px serif`;
    ctx.fillText('Game Over', WIDTH/12, HEIGHT/2);

    ctx.fillStyle = 'goldenrod';
    ctx.font = `bold ${1.5*cellSize}px serif`;
    ctx.fillText(`Score: ${snake.segments.length - snakeStartSize}`,
                 WIDTH/4, HEIGHT/2 + 1.5*cellSize);
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
