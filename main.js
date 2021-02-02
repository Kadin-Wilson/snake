import {Snake} from './snake.js'

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - (window.innerWidth % 100);
canvas.height = window.innerHeight - (window.innerHeight % 100);

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const cellSize = 50;

for (let i = 0; i <= WIDTH; i += cellSize)
    for (let j = 0; j <= HEIGHT; j += cellSize) {
        ctx.beginPath();
        ctx.arc(i, j, 3, 0, 7);
        ctx.fill();
    }

