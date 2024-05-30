import {LeftClosedRightOpenSegment, LineSegment, Ray,} from "../line/line-segment";
import {OptionPortfolio} from "../option/option-portfolio";
import {BinaryCallOption, CallOption, OPTION_TYPES} from "../option/option";
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
        const option = position.option;
        const strike = option.strike;
        const quantity = position.quantity;
        const xStart = strike;
        let yStart;
        let slope;


        if (i === 0) {
            // The first Line
            slope = quantity;
            yStart = 0;

            if (portfolio.positions.length === 1) {
                // The first line is the last line
                segments.push(new Ray(xStart, yStart, slope));
            } else {
                // There are more than one lines
                const positionNext = portfolio.positions[1];
                const optionNext = positionNext.option;
                const xEnd = positionNext.option.strike;

                if (optionNext instanceof BinaryCallOption){
                    segments.push(new LeftClosedRightOpenSegment(xStart, yStart, slope, xEnd, undefined));
                } else if (optionNext instanceof CallOption){
                    segments.push(new LineSegment(xStart, yStart, slope, xEnd, undefined));
                }
            }
        } else if (i < portfolio.positions.length - 1) {
            // The middle line, not the first, not the last
            const optionNext = portfolio.positions[i + 1].option;
            const xEnd = optionNext.strike;
            const slope = getSlope(position, segments[i-1]);
            const yStart = getYStart(position, segments[i-1]);

            if (optionNext instanceof BinaryCallOption) {
                // (1) C----BC
                // (3) BC----BC
                segments.push(new LeftClosedRightOpenSegment(xStart, yStart, slope, xEnd, undefined));
            } else if (optionNext instanceof CallOption){
                // (2) BC----C
                // (4) C----C
                segments.push(new LineSegment(xStart, yStart, slope, xEnd, undefined));
            }

        } else if (i === portfolio.positions.length - 1) {
            const slope = getSlope(position, segments[i-1]);
            const yStart = getYStart(position, segments[i-1]);
            segments.push(new Ray(xStart, yStart, slope));
        }
    })

    return new SegmentedLine(segments);
}

function getSlope(position, segmentPrev) {
    const option = position.option;
    if (option instanceof CallOption){
        return segmentPrev.slope + position.quantity;
    } else if (option instanceof BinaryCallOption){
        return segmentPrev.slope;
    }
}

function getYStart(position, segmentPrev) {
    const option = position.option;
    if (option instanceof CallOption){
        return segmentPrev.yEnd;
    } else if (option instanceof BinaryCallOption){
        return segmentPrev.yEnd + position.quantity;
    }
}