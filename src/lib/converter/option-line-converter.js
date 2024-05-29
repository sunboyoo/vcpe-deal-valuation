import {
    LeftClosedRightOpenSegment,
    LineSegment, Ray,
} from "../line/line-segment";
import {OptionPortfolio} from "../option/option-portfolio";
import {OPTION_TYPES} from "../option/option";
import {SegmentedLine} from "../line/segmented-line";

export function segmentedLineToOptionPortfolio(segmentedLine){
    if (!(segmentedLine instanceof SegmentedLine)){
        throw new Error(`Expected a LineSegment, but got ${segmentedLine} `);
    }

    const portfolio = new OptionPortfolio();

    for (let i=0; i<segmentedLine.segments.length;i++) {
        const segment = segmentedLine.segments[i]

        const strike = segment.xStart;
        let quantity;
        let optionType;

        if (i === 0) {
            quantity = segment.slope;
            optionType = OPTION_TYPES.CALL_OPTION;
        } else {
            const segmentPrev = segmentedLine.segments[i - 1];
            if (segmentPrev instanceof LeftClosedRightOpenSegment){
                quantity = segment.yStart - segmentPrev.yEnd;
                optionType = OPTION_TYPES.BINARY_CALL_OPTION;
            } else if (segmentPrev instanceof LineSegment) {
                quantity = segment.slope - segmentPrev.slope;
                optionType = OPTION_TYPES.CALL_OPTION;
            } else {
                throw new Error(`Wrong data type of ${segmentPrev}`)
            }
        }

        portfolio.addPosition(optionType, strike, quantity);
    }

    return portfolio;
}

export function optionPortfolioToSegmentedLine(portfolio) {
    if (!(portfolio instanceof OptionPortfolio)){
        throw new Error(`Expected an OptionPortfolio, but got ${portfolio} `);
    }

    const segments = [];

    portfolio.positions.forEach((position, i) => {
        let xStart = position.strike;
        let xEnd;
        let yStart;
        let yEnd;
        let k;

        if (i === 0) {
            k = position.quantity;
            yStart = 0;

            if (portfolio.positions.length === 1) {
                segments.push(new Ray(xStart, yStart, k));
            }
        } else {
            const positionPrev = portfolio.positions[i - 1];
        // *********************************未写完，继续
        }



    })

    return new SegmentedLine(segments);
}