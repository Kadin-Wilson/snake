class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class Segment extends Point {
    constructor(x, y, direction) {
        super(x, y);
        this.direction = direction;
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
        this.segments.push(new Segment(startX, startY, 'up'));
        for (let i = 1; i < length; i++)
            this.segments.push(new Segment(startX, startY + i, 'up'));

        // set coin
        this.setCoin();
    }

    move() {
        let carry = new Segment(this.segments[0].x, this.segments[0].y, 
                                this.segments[0].direction);

        // set our direction to the one that is queued
        this.currentDirection = this.queuedDirection;

        // move first segment
        if (this.currentDirection == 'up') {
            this.segments[0].y -= 1;
            this.segments[0].direction = 'up';
        }
        if (this.currentDirection == 'left') {
            this.segments[0].x -= 1;
            this.segments[0].direction = 'left';
        }
        if (this.currentDirection == 'right') {
            this.segments[0].x += 1;
            this.segments[0].direction = 'right';
        }
        if (this.currentDirection == 'down') {
            this.segments[0].y += 1;
            this.segments[0].direction = 'down';
        }

        // move remaining segments
        for (let i = 1; i < this.segments.length; i++) {
            let temp = this.segments[i];
            this.segments[i] = carry;
            carry = temp;
        }

        // push final carry to grow the snake
        if (this.grow) {
            this.segments.push(carry);
            this.grow = false;
        }
    }

    changeDirection(direction) {
        // queue the direction we want to move in
        // direction queue prevents 180 turns
        if (direction == 'left' && this.currentDirection != 'right')
            this.queuedDirection = 'left';
        if (direction == 'right' && this.currentDirection != 'left')
            this.queuedDirection = 'right';
        if (direction == 'up' && this.currentDirection != 'down')
            this.queuedDirection = 'up';
        if (direction == 'down' && this.currentDirection != 'up')
            this.queuedDirection = 'down';
    }

    // returns true if we collide with something we shouldn't
    checkCollision() {
        // check if we hit coin
        if (this.segments[0].x == this.coin.x 
            && this.segments[0].y == this.coin.y) {
            this.setCoin(); // place new coin
            this.grow = true; // flag the snake to grow on next move cycle
            return false; // the coin point is known safe
        }

        // check wall collisions
        if (this.segments[0].x < 0 || this.segments[0].x >= this.width
            || this.segments[0].y < 0 || this.segments[0].y >= this.height)
            return true;

        // check collisions with other segments
        for (let i = 1; i < this.segments.length; i++)
            if (this.segments[0].x == this.segments[i].x
                && this.segments[0].y == this.segments[i].y)
                return true;
    }

    getCoin() {
        return this.coin;
    }

    setCoin() {
        // prevent coin from spawning on snake
        do {
            this.coin = new Point(Math.floor(Math.random() * this.width),
                                  Math.floor(Math.random() * this.height));
        } while(containsPoint(this.coin, this.segments));
    }

    // ascii representation of the snake
    // usefull for debugging
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

    // pass segments iterator forward to make drawing snake easier
    [Symbol.iterator]() {
        return this.segments[Symbol.iterator]();
    }
}

// utility that checks a point/segment against an
// array of points/segments
function containsPoint(point, arr) {
    for (let arrPoint of arr)
        if (point.x == arrPoint.x && point.y == arrPoint.y)
            return true;

    return false;
}

export {Snake};
