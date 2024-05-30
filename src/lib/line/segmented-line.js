import {
    LeftClosedRightOpenSegment,
    OpenClosed_TO_REMOVE,
    LineSegment,
    OpenOpen_TO_REMOVE,
    Ray,
} from "./line-segment"
import {StraightLine} from "./straight-line";

/*
    for ys, only the ys[0] and ys[xDrop] have values. all other need to be NaN or undefined
    xs = [0, 10, 20, 30]
    ys = [0, NaN, NaN, 10] => [0, 10, 30, 10]
    slopes = [1, 2, 3, 4]
* */



export class SegmentedLine {
    constructor(segments) {
        this.segments = segments
        this.eps = 1e-7
    }

    /*
    * true - continuity at x
    * false - discontinuity at x
    * */

    leftHandContinuity(x){
        let includesX = false;
        let includesLeft = false;
        this.segments.forEach(segment => {
            if (segment.includes(x)){
                includesX = true;
            }

            if (segment.includes(x - this.eps)){
                includesLeft = true
            }
        })

        if (!includesX){
            throw new Error(`${x} is not on the line.`)
        }

        if (!includesLeft){
            throw new Error(`${x - this.eps} is not on the line.`)
        }

        const yLeftLimit = this.y(x - this.eps)
        const y = this.y(x)
        const delta = Math.abs(y - yLeftLimit)

        return delta < (this.eps)
    }

    rightHandContinuity(x){
        return this.leftHandContinuity(x + this.eps);
    }

    continuityAt(x){
        return this.rightHandContinuity(x) && this.rightHandContinuity(x);
    }

    static of(xArray, yArray, kArray){
        // check the input
        if (!Array.isArray(xArray) || !Array.isArray(yArray) || !Array.isArray(kArray)){
            throw new Error("xArray, yArray, kArray should be arrays.")
        }

        if (xArray.length !== yArray.length || xArray.length !== kArray.length || xArray.length < 1){
            throw new Error("xArray, yArray, kArray should have the same number of elements and can't be empty.")
        }

        if (!Number.isFinite(yArray[0])){
            throw new Error("yArray[0] must be provided.")
        }

        const length = xArray.length
        for (let i=0; i<length; i++){
            if (!Number.isFinite(xArray[i]) || !Number.isFinite(kArray[i])){
                throw new Error("xArray and kArray should have explicit number values.")
            }
        }

        const segments = []
        for (let i=0; i < length; i++) {
            // y0 has a finite value
            // y[i] has a finite value when Left-Hand is not continuous - PCP point
            // y[i] could be undefined when Left-Hand is continuous
            const xi = xArray[i];
            const ki = kArray[i];
            const yi = Number.isFinite(yArray[i]) ? yArray[i] : segments[i-1].yEnd
            const straightLine = new StraightLine(xi, yi, ki)

            if (i === length-1){
                // (1) the last segment is a Ray
                segments.push(new Ray(xi, yi, ki))

            } else if (i === 0){
                // The first segment

                if (Number.isFinite(yArray[i+1]) && !(straightLine.contains(xArray[i+1], yArray[i+1]))){
                    // 下一个(x,y)不在同一条直线上
                    segments.push(new LeftClosedRightOpenSegment(xi, yi, ki, xArray[i+1], undefined));
                } else {
                    // 下一个(x,y)在同一条直线上
                    segments.push(new LineSegment(xi, yi, ki, xArray[i+1], undefined))
                }
            } else {
                // non-first and non-last segments
                const leftSegment = segments[i-1]

                if (straightLine.contains(leftSegment.xEnd, leftSegment.yEnd)) {
                    // Left-hand continuous

                    if (yArray[i+1] === undefined || straightLine.contains(xArray[i+1], yArray[i+1])) {
                        // Right-hand continuous
                        segments.push(new LineSegment(xi, yi, ki, xArray[i+1], undefined))
                    } else {
                        // Right-hand non-continuous
                        // PCP drop at the right end
                        segments.push(new LeftClosedRightOpenSegment(xi, yi, ki, xArray[i+1], undefined))
                    }
                } else {
                    // Left-hand non-continuous

                    if (yArray[i+1] === undefined || straightLine.contains(xArray[i+1], yArray[i+1])) {
                        // Right-hand continuous
                        // after PCP drop
                        segments.push(new OpenClosed_TO_REMOVE(xi, yi, ki, xArray[i+1], undefined))
                    } else {
                        // Right-hand non-continuous
                        // PCP drop at the left end and right end
                        segments.push(new OpenOpen_TO_REMOVE(xi, yi, ki, xArray[i+1], undefined))
                    }
                }
            }
        }

        return new SegmentedLine(segments)

    }
    // constructor(x, y, slopes) {
    //     // check the input
    //     if (!Array.isArray(x) || !Array.isArray(y) || !Array.isArray(slopes)){
    //         throw new Error("xs, ys, and slopes should be arrays.")
    //     }
    //     if (x.length !== y.length || x.length !== slopes.length || x.length < 1){
    //         throw new Error("xs, ys, and slopes should have the same number of elements and can't be empty.")
    //     }
    //     if (!Number.isFinite(y[0])){
    //         throw new Error("ys[0] must be provided.")
    //     }
    //     const length = x.length
    //     for (let i=0; i<length; i++){
    //         if (!Number.isFinite(x[i]) || !Number.isFinite(slopes[i])){
    //             throw new Error("xs and slopes should have explicit number values.")
    //         }
    //     }
    //
    //     this.segments = []
    //     for (let i=0; i < length; i++) {
    //         const yi = Number.isFinite(y[i]) ? y[i] : this.segments[i-1].yEnd
    //
    //         // (1) the last segment is a Ray
    //         if (i === length-1){
    //             this.segments.push(new Ray(x[i], yi, slopes[i]))
    //             continue
    //         }
    //
    //         // (2) non-last segments
    //         if (Number.isFinite(y[i+1])){
    //             // (2.1) HalfOpenSegment - for PCP drop at qualified event
    //             this.segments.push(new LeftClosedRightOpenSegment(x[i], yi, slopes[i], x[i+1], undefined))
    //         } else {
    //             // (2.2) LineSegment
    //             this.segments.push(new LineSegment(x[i], yi, slopes[i], x[i+1], undefined))
    //         }
    //     }
    //
    //     this.eps = 1e-9
    // }

    // x is any number in the range
    isDownAt(x){
        const xLeft = x - this.eps
        const yLeft = this.y(xLeft)
        const y = this.y(x)
        return y < yLeft
    }

    // xEndpoint is any connecting xEndpoint between two segments. left.xEnd===right.xStart===xEndpoint.
    isDropAt(xEndpoint){
        // From the first segment to the second last segment, check if left.xEnd===right.xStart===xEndpoint
        for (let i=0; i<(this.segments.length-1);i++){
            if (this.segments[i].xEnd === xEndpoint && this.segments[i+1].xStart === xEndpoint){
                return this.segments[i].yEnd - this.segments[i+1].yStart > this.eps
            }
        }

        throw new Error("xEndpoint needs to be any connecting xEndpoint between two segments. left.xEnd===right.xStart===xEndpoint")
    }

    // return undefined is there is no drop Ray
    xDrop(){
        for (let i=0;i<this.segments.length; i++){
            const segment = this.segments[i]
            if ((segment instanceof Ray) && !(segment instanceof LineSegment) && !(segment instanceof LeftClosedRightOpenSegment)){
                return segment.xStart
            }
        }
    }

    xRightBeforeDrop(){
        return this.xDrop() - this.eps
    }

    // There is only one y value
    y(x){
        for (let i=0; i < this.segments.length; i++){
            if (this.segments[i].includes(x)){
                return this.segments[i].y(x)
            }
        }

        throw new Error(`${x} is not on the segmented line.`)
    }

    // There are one or two x values if there is a drop
    x(y){
        const xArray = []
        for (let i=0; i < this.segments.length; i++){
            const xi = this.segments[i].x(y)
            /**
             * @returns {undefined|number[]|number}
             */
            if (Number.isFinite(xi)){
                xArray.push(xi)
            } else if (Array.isArray(xi)){
                xi.forEach(x => {
                    if (Number.isFinite(x)){
                        xArray.push(x);
                    }
                })
            }
        }
        return xArray
    }

    slope(x){
        for (let i=0; i < this.segments.length; i++){
            if (this.segments[i].includes(x)){
                return this.segments[i].slope
            }
        }

        throw new Error(`${x} is not on the segmented line.`)
    }

    // This does not include the tail
    plotPoints(){
        const x = []
        const y = []
        const slopes = []
        for (let i=0; i<this.segments.length;i++){
            const segment = this.segments[i]
            if (segment instanceof LeftClosedRightOpenSegment){
                x.push(segment.xStart, segment.xEnd - this.eps)
                y.push(segment.yStart, segment.y(segment.xEnd - this.eps))
                slopes.push(segment.slope, segment.slope)
            } else if (segment instanceof OpenClosed_TO_REMOVE){
                x.push(segment.xStart + this.eps, segment.xEnd)
                y.push(segment.y(segment.xStart + this.eps), segment.y(segment.xEnd))
                slopes.push(segment.slope, segment.slope)
            } else if (segment instanceof OpenOpen_TO_REMOVE){
                x.push(segment.xStart + this.eps, segment.xEnd - this.eps)
                y.push(segment.y(segment.xStart + this.eps), segment.y(segment.xEnd - this.eps))
                slopes.push(segment.slope, segment.slope)
            } else if (segment instanceof LineSegment){
                x.push(segment.xStart)
                y.push(segment.yStart)
                slopes.push(segment.slope)
            } else if (segment instanceof Ray){
                x.push(segment.xStart)
                y.push(segment.yStart)
                slopes.push(segment.slope)
            }
        }
        return [x, y, slopes]
    }

    // to add Carried Interest Cutoff points
    addPoints(x, y, slopes, xNew, yNew){
        for(let i=0; i<xNew.length; i++){
            let indexToInsert = x.findIndex((e) => e > xNew[i])
            if (indexToInsert === -1){
                x.push(xNew[i])
                y.push(yNew[i])
                slopes.push(slopes[slopes.length-1])
            } else {
                x.splice(indexToInsert, 0, xNew[i])
                y.splice(indexToInsert, 0, yNew[i])
                slopes.splice(indexToInsert, 0, slopes[indexToInsert-1])
            }
        }
    }

    // to add the tail. this is after adding the carried interest cutoff points
    addTail(x, y, slopes, scale=0.1){
        let deltaX;
        // if there is only one point on the line.
        if (x.length === 1){
            deltaX = 1;
        } else{
            deltaX = (x[x.length - 1] - x[0]) * scale;
        }

        x.push(x[x.length-1] + deltaX)
        y.push(this.y(x[x.length-1]))
        slopes.push(slopes[slopes.length-1])
    }

    plotPointsWithTail(){
        const [x, y, slopes] = this.plotPoints()
        this.addTail(x, y, slopes)
        return [x, y, slopes]
    }

    plotPointsWithLPC(LPC){
        const [x, y, slopes] = this.plotPoints()
        const xCutoffs = this.x(LPC)
        const yCutoffs = Array.from({length: xCutoffs.length}, () => LPC)
        this.addPoints(x, y, slopes, xCutoffs, yCutoffs)
        return [x, y, slopes]
    }

    plotPointsWithLPCAndTail(LPC, scale=0.1){
        const [x, y, slopes] = this.plotPointsWithLPC(LPC)
        this.addTail(x, y, slopes, scale)
        return [x, y, slopes]
    }

    setEps(eps){
        this.eps = eps
    }
}

export function testSegmentedLine(){
    const xs = [0, 10, 20, 30]
    // ys = [0, 10, 30, 10]
    const ys = [0, NaN, NaN, 10]
    const slopes = [1, 2, 3, 4]
    const line = SegmentedLine.of(xs, ys, slopes)

    let debug = false

    if (debug){
        console.log(line)
        // console.log("line.continuityAt(0.1)", line.continuityAt(0.1))
        // console.log("line.continuityAt(10)", line.continuityAt(10))
        // console.log("line.continuityAt(20)", line.continuityAt(20))
        // console.log("line.continuityAt(30)", line.continuityAt(30))
        console.log("line.isDownAt(0.1)", line.isDownAt(0.1))
        console.log("line.isDownAt(10)", line.isDownAt(10))
        console.log("line.isDownAt(10.1)", line.isDownAt(10.1))
        console.log("line.isDownAt(20)", line.isDownAt(20))
        console.log("line.isDownAt(20.1)", line.isDownAt(20.1))
        console.log("line.isDownAt(30)", line.isDownAt(30))
        console.log("line.isDownAt(30.1)", line.isDownAt(30.1))

        // console.log("line.isDropAt(0)", line.isDropAt(0))
        console.log("line.isDropAt(10)", line.isDropAt(10))
        console.log("line.isDropAt(20)", line.isDropAt(20))
        console.log("line.isDropAt(30)", line.isDropAt(30))

        console.log("line.getDropX() = ", line.xDrop(), line.y(line.xDrop()))
        console.log("line.xRightBeforeDrop() = ", line.xRightBeforeDrop(), line.y(line.xRightBeforeDrop()))
    }


    console.log("INPUT:")
    for (let i=0; i<xs.length;i++){
        console.log(`(${xs[i]}, ${ys[i]}), slope=${slopes[i]}`)
    }

    console.log("OUTPUT:")

    const LPCs = [5, 15, 25, 35, 40, 60]
    for (let i=0; i < LPCs.length; i++){
        const LPC = LPCs[i]
        console.log(`\nLPC = ${LPC}`)
        const [xPlot, yPlot, s] = line.plotPointsWithLPCAndTail(LPC)
        for (let i=0; i<xPlot.length; i++){
            console.log(`(${xPlot[i]}, ${yPlot[i]}), slope=${s[i]}`)
        }
    }
}
