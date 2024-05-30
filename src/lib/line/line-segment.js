import {StraightLine} from "./straight-line";

export class Ray{
    constructor(xStart, yStart, slope) {
        this.xStart = xStart
        this.yStart = yStart
        this.slope = slope
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
}

// xEnd and yEnd is valid on LeftClosedRightOpenSegment.
// LeftClosedRightOpenSegment.includes(xEnd) is false.
// LeftClosedRightOpenSegment.y(xEnd) raise Error.
// LeftClosedRightOpenSegment.y(xEnd - Number.EPSILON) is valid.
export class LeftClosedRightOpenSegment extends LineSegment{
    includes(x){
        return x >= this.xStart && x < this.xEnd
    }
}

export class OpenClosed_TO_REMOVE extends LineSegment{
    includes(x){
        return x > this.xStart && x <= this.xEnd
    }
}

// (xStart, yStart, and (xEnd, yEnd) are valid on OpenLineSegment.
// LeftClosedRightOpenSegment.includes(xEnd) is false.
// OpenLineSegment.y(xStart) raise Error.
// OpenLineSegment.y(xEnd) raise Error.
// OpenLineSegment.y(xStart + Number.EPSILON) is valid.
// OpenLineSegment.y(xEnd - Number.EPSILON) is valid.
export class OpenOpen_TO_REMOVE extends LineSegment{
    includes(x){
        return x > this.xStart && x < this.xEnd;
    }
}