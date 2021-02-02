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
        this.open = null;
        this.collision = false;

        if (startY + length > this.width)
            throw RangeError('snake initialized outsied of field');

        this.segments.push(new Point(startX, startY));
        for (let i = 1; i < length; i++)
            this.segments.push(new Point(startX, startY + i));
        this.open = new Point(startX, startY + length);
    }

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
