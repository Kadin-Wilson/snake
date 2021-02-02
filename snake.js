class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Snake {
    constructor(width, height, startX, startY, length) {
        this.width = width;
        this.height = height;
        this.segments = [];
        this.queuedDirection = 'up';
        this.currentDirection = 'up';
        this.grow = false;

        if (startY + length > this.width)
            throw RangeError('snake initialized outsied of field');

        // build snake
        this.segments.push(new Point(startX, startY));
        for (let i = 1; i < length; i++)
            this.segments.push(new Point(startX, startY + i));

        // set coin
        this.setCoin();
    }

    move() {
        let carry = new Point(this.segments[0].x, this.segments[0].y);

        // set our direction to the one that is queued
        this.currentDirection = this.queuedDirection;

        // move first segment
        if (this.currentDirection == 'up')
            this.segments[0].y -= 1;
        if (this.currentDirection == 'left')
            this.segments[0].x -= 1;
        if (this.currentDirection == 'right')
            this.segments[0].x += 1;
        if (this.currentDirection == 'down')
            this.segments[0].y += 1;

        // move remaining segments
        for (let i = 1; i < this.segments.length; i++) {
            let temp = this.segments[i];
            this.segments[i] = carry;
            carry = temp;
        }

        if (this.grow) {
            this.segments.push(carry);
            this.grow = false;
        }
    }

    changeDirection(direction) {
        // queue the direction we want to move in
        if (direction == 'left' && this.currentDirection != 'right')
            this.queuedDirection = 'left';
        if (direction == 'right' && this.currentDirection != 'left')
            this.queuedDirection = 'right';
        if (direction == 'up' && this.currentDirection != 'down')
            this.queuedDirection = 'up';
        if (direction == 'down' && this.currentDirection != 'up')
            this.queuedDirection = 'down';
    }

    checkCollision() {
        if (this.segments[0].x == this.coin.x 
            && this.segments[0].y == this.coin.y) {
            this.setCoin();
            this.grow = true;
        }
    }

    getCoin() {
        return this.coin;
    }

    setCoin() {
        do {
            this.coin = new Point(Math.floor(Math.random() * this.width),
                                  Math.floor(Math.random() * this.height));
        } while(containsPoint(this.coin, this.segments));
    }

    // ascii representation of snake
    ascii() {
        let str = '';
        for (let row = 0; row < this.height; row++) {
            for (let col = 0; col < this.width; col++) {
                if (containsPoint(new Point(col, row), this.segments))
                    str += '*';
                else
                    str += '.';
            }
            str += '\n';
        }

        return str;
    }

    [Symbol.iterator]() {
        return this.segments[Symbol.iterator]();
    }
}

function containsPoint(point, arr) {
    for (let arrPoint of arr)
        if (point.x == arrPoint.x && point.y == arrPoint.y)
            return true;

    return false;
}

export {Snake};
