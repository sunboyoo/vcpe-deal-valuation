import {SegmentedLine} from "./segmented-line";
import {LeftClosedRightOpenSegment, LineSegment, Ray} from "./line-segment";

export class LimitedPartnership{
    constructor(mFee=0.02, carry=0.2, lifetimeFee=0.25) {
        // Management Fee
        this.mFee = mFee ? mFee : (lifetimeFee ? lifetimeFee/(1+lifetimeFee)/10.0 : 0.02)
        // Carried Interest
        this.carry = carry ? carry : 0.20
        // LP's Lifetime Fee Percentage
        this.lfp = lifetimeFee ? lifetimeFee : (this.mFee*10)/(1-this.mFee*10)
    }

    lpc(invest){
        return invest * (1+this.lfp)
    }
}


export class PvGpvLpv{
    constructor(limitedPartnership= new LimitedPartnership(), invest, x, y, slopes) {
        this.partnership = limitedPartnership
        this.pv = SegmentedLine.of(x, y, slopes)
        this.gpv = this.getGpv(this.partnership.lpc(invest), this.partnership.carry)
        this.lpv = this.getLpv(this.partnership.lpc(invest), this.partnership.carry)
        this.invest = invest
        this.lpc = this.partnership.lpc(invest)
        this.carryCutoff = this.pv.x(this.lpc)
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
                if (lpc >= segment.yEnd){
                    // no carry
                    gpvSegments.push(new LineSegment(segment.xStart, 0, 0, segment.xEnd, 0))
                } else if (lpc <= segment.yStart){
                    // has carry
                    gpvSegments.push(new LineSegment(segment.xStart, getCarry(segment.yStart), segment.slope*carry, segment.xEnd, undefined))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    //console.log(lpc, segment.xStart, segment.yStart, segment.xEnd, segment.yEnd, segment.slope,`carryCutoff: ${carryCutoff}`)
                    gpvSegments.push(
                        new LineSegment(segment.xStart, 0, 0, carryCutoff, 0),
                        new LineSegment(carryCutoff, 0, segment.slope*carry, segment.xEnd, undefined)
                    )
                }
            } else if (segment instanceof Ray){
                if (lpc <= segment.yStart){
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
                if (lpc >= segment.yEnd){
                    // no carry
                    lpvSegments.push(new LineSegment(segment.xStart, segment.yStart, segment.slope, segment.xEnd, segment.yEnd))
                } else if (lpc <= segment.yStart){
                    // has carry
                    lpvSegments.push(new LineSegment(segment.xStart, getDistribution(segment.yStart), segment.slope*(1-carry), segment.xEnd, undefined))
                } else {
                    // no carry before cutoff, has carry after
                    const carryCutoff = segment.x(lpc)
                    //console.log(lpc, segment.xStart, segment.yStart, segment.xEnd, segment.yEnd, segment.slope,`carryCutoff: ${carryCutoff}`)
                    lpvSegments.push(
                        new LineSegment(segment.xStart, segment.yStart, segment.slope, carryCutoff, lpc),
                        new LineSegment(carryCutoff, lpc, segment.slope*(1-carry), segment.xEnd, undefined)
                    )
                }
            } else if (segment instanceof Ray){
                if (lpc <= segment.yStart){
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