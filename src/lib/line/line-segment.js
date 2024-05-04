
export function yOnLine(x0, y0, slope, x){
    return y0 + (x - x0) * slope
}

function xOnLine(x0, y0, slope, y){
    return x0 + (y - y0) / slope
}

function slopeOf(x0, y0, x1, y1){
    return (y1 - y0) / (x1 - x0)
}


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

        return yOnLine(this.xStart, this.yStart, this.slope, x)
    }

    x(y){
        const x = xOnLine(this.xStart, this.yStart, this.slope, y)
        return this.includes(x) ? x : undefined
    }
}


export class LineSegment extends Ray{
    constructor(xStart, yStart, slope, xEnd, yEnd) {
        super(xStart, yStart, slope)
        this.xEnd = xEnd
        this.yEnd = yEnd

        if (slope===undefined && yEnd===undefined){
            throw new Error("slope and yEnd cannot be both undefined.")
        }

        if (slope === undefined){
            this.slope = slopeOf(xStart, yStart, xEnd, yEnd)
        } else if (yEnd === undefined){
            this.yEnd = yOnLine(xStart, yStart, slope, xEnd)
        } else {
            this.slope = slope
            this.yEnd = yEnd
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