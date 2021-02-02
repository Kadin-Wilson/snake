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

let snake = new Snake(WIDTH/cellSize, HEIGHT/cellSize, 12, 8, 4);

// draw grid
for (let i = 0; i <= WIDTH; i += cellSize)
    for (let j = 0; j <= HEIGHT; j += cellSize) {
        ctx.beginPath();
        ctx.arc(i, j, 3, 0, 7);
        ctx.fill();
    }

drawSnake();

function drawSnake() {
    ctx.fillStyle = 'white';
    for (let segment of snake)
        ctx.fillRect(segment.x * cellSize + segmentMargin,
                     segment.y * cellSize + segmentMargin,
                     segmentSize, segmentSize);
}
