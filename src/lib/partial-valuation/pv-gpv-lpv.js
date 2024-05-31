import {SegmentedLine} from "../line/segmented-line";
import {LeftClosedRightOpenSegment, LineSegment, Ray} from "../line/line-segment";
import {optionArrayToOptionPortfolio, optionPortfolioToSegmentedLine} from "../converter/option-line-converter";
import {LimitedPartnership} from "./limited-partnership"

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
        const [x, y, slopes] = optionPortfolioToSegmentedLine(optionArrayToOptionPortfolio(optionArray)).plotPoints();
        return new PvGpvLpv(limitedPartnership, invest, x, y, slopes)
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
                // (1)-------------------------------------------------------------------------------------
                if (pvSegment.slope === 0){ // 水平直线
                    if (lpc < pvSegment.yStart){ // 有 GP Carry
                        gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getCarry(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                        lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                    } else {// 没有 GP Carry
                        gpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                        lpvSegments.push(new LeftClosedRightOpenSegment(pvSegment.xStart, pvSegment.yStart, 0, pvSegment.xEnd, pvSegment.yEnd));
                    }
                } else if (pvSegment.slope > 0){ // 上涨直线
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
                    } else if (lpc > pvSegment.yStart && lpc <= pvSegment.yEnd)  {
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
                } else if (pvSegment.slope < 0){
                    throw new Error('pvSegment.slope < 0, 该功能还没有实现*******************************************')
                }
            } else if (pvSegment instanceof LineSegment) {
                // (2)-------------------------------------------------------------------------------------
                if (pvSegment.slope === 0){ // 水平直线
                    if (lpc < pvSegment.yStart){ // 有 GP Carry
                        gpvSegments.push(new LineSegment(pvSegment.xStart, getCarry(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                        lpvSegments.push(new LineSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), 0, pvSegment.xEnd, undefined));
                    } else {// 没有 GP Carry
                        gpvSegments.push(new LineSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                        lpvSegments.push(new LineSegment(pvSegment.xStart, pvSegment.yStart, 0, pvSegment.xEnd, pvSegment.yEnd));
                    }
                } else if (pvSegment.slope > 0){ // 上涨直线
                    if (lpc >= pvSegment.yEnd) {
                        // lpc 大于等于 segment 的 yEnd 时，没有分红 GPV
                        // If lpc is greater than or equal to segment's yEnd, no carry GPV
                        gpvSegments.push(new LineSegment(pvSegment.xStart, 0, 0, pvSegment.xEnd, 0));
                        // lpc 大于等于 segment 的 yEnd 时，没有分红 LPV
                        // If lpc is greater than or equal to segment's yEnd, no carry LPV
                        lpvSegments.push(new LineSegment(pvSegment.xStart, pvSegment.yStart, pvSegment.slope, pvSegment.xEnd, pvSegment.yEnd));
                    } else if (lpc <= pvSegment.yStart) {
                        // lpc 小于等于 segment 的 yStart 时，有分红 GPV
                        // If lpc is less than or equal to segment's yStart, has carry GPV
                        gpvSegments.push(new LineSegment(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry, pvSegment.xEnd, undefined));
                        // lpc 小于等于 segment 的 yStart 时，有分红 LPV
                        // If lpc is less than or equal to segment's yStart, has carry LPV
                        lpvSegments.push(new LineSegment(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry), pvSegment.xEnd, undefined));
                    } else if (lpc > pvSegment.yStart && lpc <= pvSegment.yEnd)  {
                        // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                        // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                        console.log('segment instanceof LeftClosedRightOpenSegment', pvSegment)
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
                } else if (pvSegment.slope < 0){
                    throw new Error('pvSegment.slope < 0, 该功能还没有实现*******************************************')
                }

            } else if (pvSegment instanceof Ray) {
                // (3)-------------------------------------------------------------------------------------
                // Ray.yEnd is INFINITE or constant
                if (pvSegment.slope === 0){ // 水平直线
                    if (lpc < pvSegment.yStart){ // 有 GP Carry
                        gpvSegments.push(new Ray(pvSegment.xStart, getCarry(pvSegment.yStart), 0));
                        lpvSegments.push(new Ray(pvSegment.xStart, getDistribution(pvSegment.yStart), 0));
                    } else {// 没有 GP Carry
                        gpvSegments.push(new Ray(pvSegment.xStart, 0, 0));
                        lpvSegments.push(new Ray(pvSegment.xStart, pvSegment.yStart, 0));
                    }
                } else if (pvSegment.slope > 0){ // 上涨直线
                    // Ray.yEnd is INFINITE or constant
                    if (lpc <= pvSegment.yStart) {
                        // lpc 小于等于 segment 的 yStart 时，有分红 GPV
                        // If lpc is less than or equal to segment's yStart, has carry GPV
                        gpvSegments.push(new Ray(pvSegment.xStart, getCarry(pvSegment.yStart), pvSegment.slope * carry));
                        // lpc 小于等于 segment 的 yStart 时，有分红 LPV
                        // If lpc is less than or equal to segment's yStart, has carry LPV
                        lpvSegments.push(new Ray(pvSegment.xStart, getDistribution(pvSegment.yStart), pvSegment.slope * (1 - carry)));
                    } else if (lpc > pvSegment.yStart)  {
                        // lpc 在 segment 的 yStart 和 yEnd 之间时，分红截止点之前没有分红，之后有分红
                        // If lpc is between segment's yStart and yEnd, no carry before cutoff, has carry after
                        console.log('segment instanceof LeftClosedRightOpenSegment', pvSegment)
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
                } else if (pvSegment.slope < 0){
                    throw new Error('pvSegment.slope < 0, 该功能还没有实现*******************************************')
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