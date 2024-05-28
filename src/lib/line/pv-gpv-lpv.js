import {SegmentedLine} from "./segmented-line";
import {LeftClosedRightOpenSegment, LineSegment, Ray} from "./line-segment";
import {optionArrayToSegmentedLine} from "./line-option-converter";

export class LimitedPartnership{
    constructor(managementFee=0.02, carriedInterest=0.2, lifetimeFee=0.25) {
        // Management Fee
        this.managementFee = managementFee ? managementFee : (lifetimeFee ? lifetimeFee/(1.0+lifetimeFee)/10.0 : 0.02)
        // Carried Interest
        this.carriedInterest = carriedInterest ? carriedInterest : 0.20
        // LP's Lifetime Fee Percentage
        this.lfp = lifetimeFee ? lifetimeFee : (this.managementFee*10.)/(1 - this.managementFee*10.)
    }

    lpc(invest){
        return invest * (1 + this.lfp)
    }
}

export class PvGpvLpv{
    constructor(limitedPartnership= new LimitedPartnership(), invest, x, y, slopes) {
        this.invest = invest
        this.partnership = limitedPartnership
        this.pv = SegmentedLine.of(x, y, slopes)
        this.lpc = this.partnership.lpc(invest)
        this.carryCutoffArray = this.pv.x(this.lpc) // This is an Array [cutoff_01, cutoff_02]
        const {gpv, lpv} = this.getGpvAndLpv(this.partnership.lpc(invest), this.partnership.carriedInterest)
        this.gpv = gpv;
        this.lpv = lpv;
    }

    static ofPayoffLine(limitedPartnership= new LimitedPartnership(), invest, payoffLine){
        const [x, y, slopes] = payoffLine.plotPoints();
        return new PvGpvLpv(limitedPartnership, invest, x, y, slopes)
    }

    static ofPayoffOptions(limitedPartnership= new LimitedPartnership(), invest, optionArray){
        const [x, y, slopes] = optionArrayToSegmentedLine(optionArray).plotPoints();
        return new PvGpvLpv(limitedPartnership, invest, x, y, slopes)
    }

    getGpv(lpc, carry){

        function getCarry(pv){
            return Math.max(0, (pv - lpc) * carry)
        }

        // if payoff > lpc, gpv = (payoff - lpc) * carry
        // if payoff <= lpc, gpv = 0
        // gpv = max(0, (payoff - lpc) * carry)

        const gpvSegments = []

        for (let i=0; i<this.pv.segments.length;i++){
            const segment = this.pv.segments[i]
            if (segment instanceof LeftClosedRightOpenSegment){
                if (lpc >= segment.yEnd){
                    // no carry
                    gpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, 0, 0, segment.xEnd, 0))
                } else if (lpc <= segment.yStart){
                    // has carry
                    gpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, getCarry(segment.yStart), segment.slope*carry, segment.xEnd, undefined))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new LeftClosedRightOpenSegment(carryCutoff, 0, segment.slope*carry, segment.xEnd, undefined)
                        )
                }
            } else if (segment instanceof LineSegment){
                if (lpc > segment.yEnd){
                    // no carry
                    gpvSegments.push(new LineSegment(segment.xStart, 0, 0, segment.xEnd, 0))
                } else if (lpc < segment.yStart){
                    // has carry
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), segment.slope*carry, segment.xEnd, undefined))
                } else if(lpc === segment.yStart && lpc === segment.yEnd){
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), segment.slope*carry, segment.xEnd, undefined))
                }  else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    //console.log(lpc, segment.xStart, segment.yStart, segment.xEnd, segment.yEnd, segment.slope,`carryCutoff: ${carryCutoff}`)
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new LineSegment(carryCutoff, 0, segment.slope*carry, segment.xEnd, undefined)
                    )
                }
            } else if (segment instanceof Ray){
                if (lpc < segment.yStart){
                    // has carry
                    gpvSegments.push(new Ray(segment.xStart, getCarry(segment.yStart), segment.slope*carry))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new Ray(carryCutoff, 0, segment.slope*carry)
                    )
                }
            }
        }

        return new SegmentedLine(gpvSegments)
    }


    getLpv(lpc, carry){

        function getDistribution(pv){
            return pv - Math.max(0, (pv - lpc) * carry)
        }

        function getLpvSlope(pv, pvSlope){
            return pv <= lpc ? pvSlope : pvSlope*(1-carry)
        }

        // if payoff > lpc, gpv = (payoff - lpc) * carry
        // if payoff <= lpc, gpv = 0
        // gpv = max(0, (payoff - lpc) * carry)

        const lpvSegments = []

        for (let i=0; i<this.pv.segments.length;i++){
            const segment = this.pv.segments[i]
            if (segment instanceof LeftClosedRightOpenSegment){
                if (lpc >= segment.yEnd){
                    // no carry
                    lpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, segment.yStart, segment.slope, segment.xEnd, segment.yEnd))
                } else if (lpc <= segment.yStart){
                    // has carry
                    lpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, getDistribution(segment.yStart), segment.slope*(1-carry), segment.xEnd, undefined))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new LeftClosedRightOpenSegment(carryCutoff, lpc, segment.slope*(1-carry), segment.xEnd, undefined)
                    )
                }
            } else if (segment instanceof LineSegment){
                if (lpc > segment.yEnd){
                    // no carry
                    lpvSegments.push(new LineSegment(segment.xStart, segment.yStart, segment.slope, segment.xEnd, segment.yEnd))
                } else if (lpc < segment.yStart){
                    // has carry
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), segment.slope*(1-carry), segment.xEnd, undefined))
                } else if(lpc === segment.yStart && lpc === segment.yEnd){
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), segment.slope*(1-carry), segment.xEnd, undefined))
                } else {

                    // no carry before cutoff, has carry after
                    //console.log(lpc, segment.xStart, segment.yStart, segment.xEnd, segment.yEnd, segment.slope,`carryCutoff: ${carryCutoff}`)
                    const carryCutoff = segment.x(lpc)

                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new LineSegment(carryCutoff, lpc, segment.slope*(1-carry), segment.xEnd, undefined)
                    )
                }
            } else if (segment instanceof Ray){
                if (lpc < segment.yStart){
                    // has carry
                    lpvSegments.push(new Ray(segment.xStart, getDistribution(segment.yStart), segment.slope*(1-carry)))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new Ray(carryCutoff, lpc, segment.slope*(1-carry))
                    )
                }
            }
        }

        return new SegmentedLine(lpvSegments)
    }


    getGpvAndLpv(lpc, carry) {
        // 计算 GPV 的函数
        // Function to calculate GPV
        function getCarry(pv) {
            return Math.max(0, (pv - lpc) * carry);
        }

        // 计算 LPV 的函数
        // Function to calculate LPV
        function getDistribution(pv) {
            return pv - getCarry(pv);
        }

        // 获取 LPV 的斜率
        // Function to get LPV slope
        function getLpvSlope(pv, pvSlope) {
            return pv <= lpc ? pvSlope : pvSlope * (1 - carry);
        }

        // 获取 GPV 的斜率
        // Function to get GPV slope
        function getGpvSlope(pv, pvSlope) {
            return pv <= lpc ? 0 : pvSlope * carry;
        }

        const gpvSegments = [];
        const lpvSegments = [];

        for (let i = 0; i < this.pv.segments.length; i++) {
            const pvSegment = this.pv.segments[i];
            //(1)
            if (pvSegment instanceof LeftClosedRightOpenSegment) {
                if (pvSegment.slope === 0){ // 水平直线
                    if (lpc < pvSegment.yStart){ // 有 GP Carry
                        gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getCarry(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                        lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                    } else {// 没有 GP Carry
                        gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                        lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, pvSegment.yStart, 0, pvSegment.xEnd, undefined));
                    }
                } else if (pvSegment.slope > 0){ // 上涨直线

                }


                if (lpc >= pvSegment.yEnd) {
                    // lpc 大于等于 segment 的 yEnd 时，没有分红 GPV
                    // If lpc is greater than or equal to segment's yEnd, no carry GPV
                    gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                    // lpc 大于等于 segment 的 yEnd 时，没有分红 LPV
                    // If lpc is greater than or equal to segment's yEnd, no carry LPV
                    lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, pvSegment.xEnd, pvSegment.yEnd));
                } else if (lpc <= pvSegment.yStart) {
                    // lpc 小于等于 segment 的 yStart 时，有分红 GPV
                    // If lpc is less than or equal to segment's yStart, has carry GPV
                    gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry, pvSegment.xEnd, undefined));
                    // lpc 小于等于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than or equal to segment's yStart, has carry LPV
                    lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined));
                } else {
                    // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                    // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                    console.log('segment instanceof LeftClosedRightOpenSegment', pvSegment)
                    const carryCutoff = pvSegment.x(lpc);
                    gpvSegments.push(
                        new LineSegment(pvSegment.xStart, 0, 0, carryCutoff, 0),
                        new LeftClosedRightOpenSegment(carryCutoff, 0, pvSegment.slope * carry, pvSegment.xEnd, undefined)
                    );
                    lpvSegments.push(
                        new LineSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, carryCutoff, lpc),
                        new LeftClosedRightOpenSegment(carryCutoff, lpc, pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined)
                    );
                }
            } else if (pvSegment instanceof LineSegment) {
                if (lpc > pvSegment.yEnd) {
                    // lpc 大于 segment 的 yEnd 时，没有分红 GPV
                    // If lpc is greater than segment's yEnd, no carry GPV
                    gpvSegments.push(new LineSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                    // lpc 大于 segment 的 yEnd 时，没有分红 LPV
                    // If lpc is greater than segment's yEnd, no carry LPV
                    lpvSegments.push(new LineSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, pvSegment.xEnd, pvSegment.yEnd));
                } else if (lpc < pvSegment.yStart) {
                    // lpc 小于 segment 的 yStart 时，有分红 GPV
                    // If lpc is less than segment's yStart, has carry GPV
                    gpvSegments.push(new LineSegment(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry, pvSegment.xEnd, undefined));
                    // lpc 小于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than segment's yStart, has carry LPV
                    lpvSegments.push(new LineSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined));
                } else if (lpc === pvSegment.yStart && pvSegment.yStart === pvSegment.yEnd) {
                    // lpc 等于 segment 的 yStart 和 yEnd 时，有分红 GPV 和 LPV
                    // If lpc equals segment's yStart and yEnd, has carry GPV and LPV
                    gpvSegments.push(new LineSegment(pvSegment.xStart, getCarry(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                    lpvSegments.push(new LineSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                } else if (lpc === pvSegment.yStart && pvSegment.yStart < pvSegment.yEnd) {
                    // lpc 等于 segment 的 yStart, yEnd > yStart 时，有分红 GPV
                    // If lpc is less than segment's yStart, has carry GPV
                    console.log('lpc === segment.yStart && segment.yStart < segment.yEnd', lpc, pvSegment.yEnd)
                    gpvSegments.push(new LineSegment(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry, pvSegment.xEnd, undefined));
                    // lpc 小于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than segment's yStart, has carry LPV
                    lpvSegments.push(new LineSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined));
                } else {
                    // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                    // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                    const carryCutoff = pvSegment.x(lpc);

                    gpvSegments.push(
                        new LineSegment(pvSegment.xStart, 0, 0, carryCutoff, 0),
                        new LineSegment(carryCutoff, 0, pvSegment.slope * carry, pvSegment.xEnd, undefined)
                    );
                    lpvSegments.push(
                        new LineSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, carryCutoff, lpc),
                        new LineSegment(carryCutoff, lpc, pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined)
                    );
                }
            } else if (pvSegment instanceof Ray) {
                if (lpc < pvSegment.yStart) {
                    // lpc 小于 segment 的 yStart 时，有分红 GPV 和 LPV
                    // If lpc is less than segment's yStart, has carry GPV and LPV
                    gpvSegments.push(new Ray(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry));
                    lpvSegments.push(new Ray(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry)));
                } else {
                    // lpc 大于等于 segment 的 yStart 时，分红截止点之前没有分红，之后有分红
                    // If lpc is greater than or equal to segment's yStart, no carry before cutoff, has carry after
                    const carryCutoff = pvSegment.x(lpc);
                    gpvSegments.push(
                        new LineSegment(pvSegment.xStart, 0, 0, carryCutoff, 0),
                        new Ray(carryCutoff, 0, pvSegment.slope * carry)
                    );
                    lpvSegments.push(
                        new LineSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, carryCutoff, lpc),
                        new Ray(carryCutoff, lpc, pvSegment.slope * (1 - carry))
                    );
                }
            }
        }

        console.log(this.pv.segments, gpvSegments, lpvSegments)
        return {
            gpv: new SegmentedLine(gpvSegments),
            lpv: new SegmentedLine(lpvSegments)
        };
    }

    getGpvAndLpvBackup(lpc, carry) {
        // 计算 GPV 的函数
        // Function to calculate GPV
        function getCarry(pv) {
            return Math.max(0, (pv - lpc) * carry);
        }

        // 计算 LPV 的函数
        // Function to calculate LPV
        function getDistribution(pv) {
            return pv - getCarry(pv);
        }

        // 获取 LPV 的斜率
        // Function to get LPV slope
        function getLpvSlope(pv, pvSlope) {
            return pv <= lpc ? pvSlope : pvSlope * (1 - carry);
        }

        // 获取 GPV 的斜率
        // Function to get GPV slope
        function getGpvSlope(pv, pvSlope) {
            return pv <= lpc ? 0 : pvSlope * carry;
        }

        const gpvSegments = [];
        const lpvSegments = [];

        for (let i = 0; i < this.pv.segments.length; i++) {
            const segment = this.pv.segments[i];
            if (segment instanceof LeftClosedRightOpenSegment) {
                if (lpc >= segment.yEnd) {
                    // lpc 大于等于 segment 的 yEnd 时，没有分红 GPV
                    // If lpc is greater than or equal to segment's yEnd, no carry GPV
                    gpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, 0, 0, segment.xEnd, 0));
                    // lpc 大于等于 segment 的 yEnd 时，没有分红 LPV
                    // If lpc is greater than or equal to segment's yEnd, no carry LPV
                    lpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, segment.yStart, segment.slope, segment.xEnd, segment.yEnd));
                } else if (lpc <= segment.yStart) {
                    // lpc 小于等于 segment 的 yStart 时，有分红 GPV
                    // If lpc is less than or equal to segment's yStart, has carry GPV
                    gpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, getCarry(segment.yStart), segment.slope * carry, segment.xEnd, undefined));
                    // lpc 小于等于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than or equal to segment's yStart, has carry LPV
                    lpvSegments.push(new LeftClosedRightOpenSegment(segment.xStart, getDistribution(segment.yStart), segment.slope * (1 - carry), segment.xEnd, undefined));
                } else {
                    // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                    // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                    console.log('segment instanceof LeftClosedRightOpenSegment', segment)
                    const carryCutoff = segment.x(lpc);
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new LeftClosedRightOpenSegment(carryCutoff, 0, segment.slope * carry, segment.xEnd, undefined)
                    );
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new LeftClosedRightOpenSegment(carryCutoff, lpc, segment.slope * (1 - carry), segment.xEnd, undefined)
                    );
                }
            } else if (segment instanceof LineSegment) {
                if (lpc > segment.yEnd) {
                    // lpc 大于 segment 的 yEnd 时，没有分红 GPV
                    // If lpc is greater than segment's yEnd, no carry GPV
                    gpvSegments.push(new LineSegment(segment.xStart, 0, 0, segment.xEnd, 0));
                    // lpc 大于 segment 的 yEnd 时，没有分红 LPV
                    // If lpc is greater than segment's yEnd, no carry LPV
                    lpvSegments.push(new LineSegment(segment.xStart, segment.yStart, segment.slope, segment.xEnd, segment.yEnd));
                } else if (lpc < segment.yStart) {
                    // lpc 小于 segment 的 yStart 时，有分红 GPV
                    // If lpc is less than segment's yStart, has carry GPV
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), segment.slope * carry, segment.xEnd, undefined));
                    // lpc 小于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than segment's yStart, has carry LPV
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), segment.slope * (1 - carry), segment.xEnd, undefined));
                } else if (lpc === segment.yStart && segment.yStart === segment.yEnd) {
                    // lpc 等于 segment 的 yStart 和 yEnd 时，有分红 GPV 和 LPV
                    // If lpc equals segment's yStart and yEnd, has carry GPV and LPV
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), 0, segment.xEnd, undefined));
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), 0, segment.xEnd, undefined));
                } else if (lpc === segment.yStart && segment.yStart < segment.yEnd) {
                    // lpc 等于 segment 的 yStart, yEnd > yStart 时，有分红 GPV
                    // If lpc is less than segment's yStart, has carry GPV
                    console.log('lpc === segment.yStart && segment.yStart < segment.yEnd', lpc, segment.yEnd)
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), segment.slope * carry, segment.xEnd, undefined));
                    // lpc 小于 segment 的 yStart 时，有分红 LPV
                    // If lpc is less than segment's yStart, has carry LPV
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), segment.slope * (1 - carry), segment.xEnd, undefined));
                } else {
                    // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                    // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc);

                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new LineSegment(carryCutoff, 0, segment.slope * carry, segment.xEnd, undefined)
                    );
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new LineSegment(carryCutoff, lpc, segment.slope * (1 - carry), segment.xEnd, undefined)
                    );
                }
            } else if (segment instanceof Ray) {
                if (lpc < segment.yStart) {
                    // lpc 小于 segment 的 yStart 时，有分红 GPV 和 LPV
                    // If lpc is less than segment's yStart, has carry GPV and LPV
                    gpvSegments.push(new Ray(segment.xStart, getCarry(segment.yStart), segment.slope * carry));
                    lpvSegments.push(new Ray(segment.xStart, getDistribution(segment.yStart), segment.slope * (1 - carry)));
                } else {
                    // lpc 大于等于 segment 的 yStart 时，分红截止点之前没有分红，之后有分红
                    // If lpc is greater than or equal to segment's yStart, no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc);
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new Ray(carryCutoff, 0, segment.slope * carry)
                    );
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new Ray(carryCutoff, lpc, segment.slope * (1 - carry))
                    );
                }
            }
        }

        console.log(this.pv.segments, gpvSegments, lpvSegments)
        return {
            gpv: new SegmentedLine(gpvSegments),
            lpv: new SegmentedLine(lpvSegments)
        };
    }

}



export function testPvGpvLpv(){
    const xs = [0, 10, 20, 30]
    // ys = [0, 10, 30, 10]
    const ys = [0, NaN, NaN, 10]
    const slopes = [1, 2, 3, 4]
    // const line = SegmentedLine.of(xs, ys, slopes)

    console.log("INPUT:")
    for (let i=0; i<xs.length;i++){
        console.log(`(${xs[i]}, ${ys[i]}), slope=${slopes[i]}`)
    }

    console.log("OUTPUT:")

    const LPCs = [5, 15, 25, 35, 40, 60]
    for (let i=0; i < LPCs.length; i++){
        const LPC = LPCs[i]
        console.log(`\nLPC = ${LPC}`)

        const pvGpvLpv = new PvGpvLpv(new LimitedPartnership(), LPC/1.25, xs, ys, slopes)
        const {pv, gpv, lpv} = pvGpvLpv
        const [xPv, yPv, sPv] = pv.plotPointsWithLPCAndTail(LPC)
        const [xGpv, yGpv, sGpv] = gpv.plotPointsWithTail()
        const [xLpv, yLpv, sLpv] = lpv.plotPointsWithTail()
        for (let i=0; i<xPv.length; i++){
            const p = yPv[i]
            const g = yGpv[i]
            const l = yLpv[i]
            console.log(`${(p-g-l)**2<1e-10}, ${(sPv[i]-sGpv[i]-sLpv[i])**2<1e-10}, ${p>LPC? (g/(p-LPC)-0.2)**2<1e-10 : g<1e-10 }, (${xPv[i]},${p}=${g}+${l}), ${(g/(p-LPC)*100).toFixed(0)}%), slopes=${sPv[i]}=${sGpv[i]}+${sLpv[i]}`)
        }
    }
}