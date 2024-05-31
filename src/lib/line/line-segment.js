import {StraightLine} from "./straight-line";

export class Ray{
    constructor(xStart, yStart, slope) {
        this.xStart = xStart
        this.yStart = yStart
        this.slope = slope
        // creat a (xEnd, yEnd) to make codes work in case Ray.xEnd, Ray.yEnd is called by other functions.
        // for example,
        this.xEnd = Number.POSITIVE_INFINITY
        this.yEnd = slope === 0 ? yStart : slope > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY
    }
    includes(x){
        return x >= this.xStart
    }

    excludes(x){
        return !this.includes(x)
    }

    y(x){
        if (this.excludes(x)){
            throw new Error(`${x} is not on this line.`)
        }

        return new StraightLine(this.xStart, this.yStart, this.slope).y(x);
    }

    x(y){
        const x = new StraightLine(this.xStart, this.yStart, this.slope).x(y);

        if (Number.isFinite(x)){
            return this.includes(x) ? x : undefined
        } else if (x === undefined) {
            return undefined
        } else if (Array.isArray(x) && x.length === 2 &&
            x[0] === Number.NEGATIVE_INFINITY &&
            x[1] === Number.POSITIVE_INFINITY){
            return [this.xStart, Number.POSITIVE_INFINITY];
        } else {
            throw new Error(`Error with Ray.x(${x})`)
        }
    }

    text() {
        return `Ray[(${this.xStart}, ${this.yStart}), ->) (k=${this.slope})`
    }
}


export class LineSegment extends Ray{
    constructor(xStart, yStart, slope, xEnd, yEnd) {
        super(xStart, yStart, slope)
        this.xEnd = xEnd
        this.yEnd = yEnd

        if (!Number.isFinite(slope) && !Number.isFinite(yEnd)){
            throw new Error("slope and yEnd cannot be both undefined.")
        }

        if (!Number.isFinite(slope)){
            this.slope = StraightLine.slopeFor(xStart, yStart, xEnd, yEnd);
        } else if (!Number.isFinite(yEnd)){
            this.yEnd = new StraightLine(xStart, yStart, slope).y(xEnd);
        } else {
            this.slope = slope
            this.yEnd = yEnd
        }
    }

    x(y){
        const x = new StraightLine(this.xStart, this.yStart, this.slope).x(y);

        if (Number.isFinite(x)){
            return this.includes(x) ? x : undefined
        } else if (x === undefined) {
            return undefined
        } else if (Array.isArray(x) && x.length === 2 &&
            x[0] === Number.NEGATIVE_INFINITY &&
            x[1] === Number.POSITIVE_INFINITY){
            return [this.xStart, this.xEnd];
        } else {
            throw new Error(`Error with Ray.x(${x})`)
        }
    }

    includes(x){
        return x >= this.xStart && x <= this.xEnd
    }

    text() {
        return `[(${this.xStart}, ${this.yStart}), (${this.xStart}, ${this.yStart})] (k=${this.slope})`
    }
}


// xEnd and yEnd is valid on LeftClosedRightOpenSegment.
// LeftClosedRightOpenSegment.includes(xEnd) is false.
// LeftClosedRightOpenSegment.y(xEnd) raise Error.
// LeftClosedRightOpenSegment.y(xEnd - Number.EPSILON) is valid.
export class LeftClosedRightOpenSegment extends LineSegment{
    includes(x){
        return x >= this.xStart && x < this.xEnd
    }

    text() {
        return `LeftOpen((${this.xStart}, ${this.yStart}), (${this.xStart}, ${this.yStart})] (k=${this.slope})`
    }
}