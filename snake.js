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
        this.direction = 'up';

        if (startY + length > this.width)
            throw RangeError('snake initialized outsied of field');

        // build snake
        this.segments.push(new Point(startX, startY));
        for (let i = 1; i < length; i++)
            this.segments.push(new Point(startX, startY + i));
    }

    move() {
        let carry = new Point(this.segments[0].x, this.segments[0].y);

        // move first segment
        if (this.direction == 'up')
            this.segments[0].y -= 1;
        if (this.direction == 'left')
            this.segments[0].x -= 1;
        if (this.direction == 'right')
            this.segments[0].x += 1;
        if (this.direction == 'down')
            this.segments[0].y += 1;

        // move remaining segments
        for (let i = 1; i < this.segments.length; i++) {
            let temp = this.segments[i];
            this.segments[i] = carry;
            carry = temp;
        }
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
