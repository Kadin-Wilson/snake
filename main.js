import {Snake} from './snake.js'

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - (window.innerWidth % 100);
canvas.height = window.innerHeight - (window.innerHeight % 100);

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const cellSize = 50;
const segmentMargin = 4;
const segmentSize = cellSize - segmentMargin * 2;

// create snake
let snake = new Snake(WIDTH/cellSize, HEIGHT/cellSize, 12, 8, 4);


let previousTime = 0;
// frames per move
let moveTick = 15;
let tick = 0;

let nextFrame = null;

// initial draw
draw();
// start game loop
gameLoop();


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

function gameLoop(currentTime) {
    nextFrame = requestAnimationFrame(gameLoop);

    // convert to seconds
    currentTime *= 0.001;
    // time passed since last frame
    const deltaTime = currentTime - previousTime;
    // remeber time for next frame
    previousTime = currentTime;

    ++tick;
    if (tick > moveTick) {
        snake.move();
        if (snake.checkCollision()) {
            cancelAnimationFrame(nextFrame);
            gameover();
            return;
        }
        tick = 0;
        draw(); // only draw when snake moves
    }
}

function draw() {
    // clear canvas
    ctx.fillStyle = 'darkcyan';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // draw grid
    ctx.fillStyle = 'black';
    for (let i = 0; i <= WIDTH; i += cellSize)
        for (let j = 0; j <= HEIGHT; j += cellSize) {
            ctx.beginPath();
            ctx.arc(i, j, 3, 0, 7);
            ctx.fill();
        }

    // draw coin
    const coin = snake.getCoin();
    ctx.fillStyle = 'goldenrod';
    ctx.beginPath();
    ctx.arc(coin.x * cellSize + cellSize/2,
            coin.y * cellSize + cellSize/2, cellSize/2.5, 0, 7);
    ctx.fill();

    
    // draw snake
    ctx.fillStyle = 'white';
    for (let segment of snake)
        ctx.fillRect(segment.x * cellSize + segmentMargin,
                     segment.y * cellSize + segmentMargin,
                     segmentSize, segmentSize);
}

function gameover() {
    ctx.fillStyle = 'red';
    ctx.font = `bold ${3*cellSize}px serif`;
    ctx.fillText('Game Over', WIDTH/7, HEIGHT/2);
}
