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

export function optionArrayToOptionPortfolio(optionArray){
    const portfolio = new OptionPortfolio();
    optionArray.forEach(({securityType, strike, fraction}) => {
        portfolio.addPosition(securityType, strike, fraction);
    })
    return portfolio;
}

export function optionPortfolioToOptionArray(optionPortfolio){
    const arr = []
    optionPortfolio.positions.forEach((position) => {
        arr.push({
            securityType: position.option.type,
            strike: position.option.strike,
            fraction: position.quantity,
        });
    })

    return arr;
}

export function areSegmentedLinesEqual(line1, line2) {
    if (line1.segments.length !== line2.segments.length) {
        return false;
    }

    for (let i = 0; i < line1.segments.length; i++) {
        const seg1 = line1.segments[i];
        const seg2 = line2.segments[i];

        if (seg1.constructor !== seg2.constructor || seg1.xStart !== seg2.xStart || seg1.yStart !== seg2.yStart || seg1.slope !== seg2.slope) {
            return false;
        }

        if (seg1 instanceof LineSegment || seg1 instanceof LeftClosedRightOpenSegment) {
            if (seg1.xEnd !== seg2.xEnd || seg1.yEnd !== seg2.yEnd) {
                return false;
            }
        }
    }

    return true;
}

export function areOptionPortfoliosEqual(portfolio1, portfolio2) {
    if (portfolio1.positions.length !== portfolio2.positions.length) {
        return false;
    }

    for (let i = 0; i < portfolio1.positions.length; i++) {
        const pos1 = portfolio1.positions[i];
        const pos2 = portfolio2.positions[i];

        if (pos1.option.constructor !== pos2.option.constructor || pos1.option.strike !== pos2.option.strike || pos1.quantity !== pos2.quantity) {
            return false;
        }
    }

    return true;
}

export function testPortfolioConversionFunctions() {
    // Create an OptionPortfolio
    const portfolio = new OptionPortfolio();
    portfolio.addPosition(OPTION_TYPES.CALL_OPTION, 10, 1);
    portfolio.addPosition(OPTION_TYPES.CALL_OPTION, 20, -1);
    portfolio.addPosition(OPTION_TYPES.CALL_OPTION, 30, 0.5);
    portfolio.addPosition(OPTION_TYPES.BINARY_CALL_OPTION, 50, -5);
    portfolio.addPosition(OPTION_TYPES.BINARY_CALL_OPTION, 70, 5);

    // Convert OptionPortfolio to SegmentedLine
    const segmentedLine = optionPortfolioToSegmentedLine(portfolio);

    // Convert SegmentedLine back to OptionPortfolio
    const newPortfolio = segmentedLineToOptionPortfolio(segmentedLine);

    // Check if the new OptionPortfolio equals the original OptionPortfolio
    const isEqual = areOptionPortfoliosEqual(portfolio, newPortfolio);
    console.log(newPortfolio.text())
    console.log(segmentedLine)

    console.assert(isEqual, 'The new OptionPortfolio should be equal to the original OptionPortfolio');
    if (isEqual) {
        console.log('Test passed: The new OptionPortfolio is equal to the original OptionPortfolio');
    } else {
        console.log('Test failed: The new OptionPortfolio is not equal to the original OptionPortfolio');
    }
}

export function testConversionFunctions() {
    // Create a SegmentedLine
    const segments = [
        new LineSegment(0, 0, 1, 10, undefined),
        new LeftClosedRightOpenSegment(10, 10, 0, 20, undefined),
        new LineSegment(20, 5, 0, 30, undefined),
        new Ray(30, 5, 1)
    ];
    const originalSegmentedLine = new SegmentedLine(segments);

    // Convert SegmentedLine to OptionPortfolio
    const portfolio = segmentedLineToOptionPortfolio(originalSegmentedLine);

    // Convert OptionPortfolio back to SegmentedLine
    const newSegmentedLine = optionPortfolioToSegmentedLine(portfolio);

    // Check if the new SegmentedLine equals the original SegmentedLine
    const isEqual = areSegmentedLinesEqual(originalSegmentedLine, newSegmentedLine);
    console.log(portfolio.text())
    console.log(newSegmentedLine.segments)

    console.assert(isEqual, 'The new SegmentedLine should be equal to the original SegmentedLine');
    if (isEqual) {
        console.log('Test passed: The new SegmentedLine is equal to the original SegmentedLine');
    } else {
        console.log('Test failed: The new SegmentedLine is not equal to the original SegmentedLine');
    }
}
