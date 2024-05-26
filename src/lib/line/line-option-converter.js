import {SecurityType} from "../generic-payoff";
import {LeftClosedRightOpenSegment, LineSegment, Ray, yOnLine} from "./line-segment";
import {SegmentedLine} from "./segmented-line";

export class OptionsUtils {
    constructor() {}
    static validate(optionArray){
        if (!Array.isArray(optionArray)){
            throw new Error("Options must be an array");
        }

        optionArray.forEach((option, index) => {
            ['securityType', 'strike', 'fraction'].forEach((key) => {
                if (!Object.keys(option).includes(key)) {
                    throw new Error(`Missing the value for ${key}`)
                }
            })

            Object.entries(option).forEach(([key, value]) => {
                if (value === undefined){
                    throw new Error(`Incorrect value for ${key}`)
                }
            })

            if (index > 0 && option.strike <= optionArray[index - 1].strike){
                throw new Error("Strike prices must be in ascending order");
            }
        })
    }
}

export function segmentedLineToOption(line){
    const options = []

    if (line.segments === undefined){
        console.log(line, line.segments)
    }

    for (let i=0; i<line.segments.length;i++) {
        const segment = line.segments[i]
        if (segment instanceof LeftClosedRightOpenSegment){
            options.push({
                securityType: SecurityType.CallOption,
                strike: segment.xStart,
                fraction: (i === 0) ? segment.slope : (segment.slope - line.segments[i-1].slope)
            })
        } else if (segment instanceof LineSegment){
            options.push({
                securityType: SecurityType.CallOption,
                strike: segment.xStart,
                fraction: (i === 0) ? segment.slope : (segment.slope - line.segments[i-1].slope)
            })
        } else if (segment instanceof Ray){
            options.push({
                securityType: SecurityType.CallOption,
                strike: segment.xStart,
                fraction: (i === 0) ? segment.slope : (segment.slope - line.segments[i-1].slope)
            })
        }
    }

    return options
}


export function callOptionsText(callOptions){
    let string = "";
    let is_first_string = true;

    for (let i = 0; i < callOptions.length; i++) {
        const { strike, fraction} = callOptions[i]

        if (fraction === 0) {
            continue;
        }

        if (fraction === 1) {
            string += is_first_string ? "" : " + ";
        } else if (fraction === -1) {
            string += is_first_string ? "-" : " - ";
        } else if (fraction > 0) {
            string += is_first_string ? `${trimNumber(fraction)} x ` : ` + ${trimNumber(fraction)} x `;
        } else if (fraction < 0) {
            string += is_first_string ? `(${trimNumber(fraction)}) x ` : ` - ${trimNumber(-fraction)} x `;
        }

        string += `C(${trimNumber(strike)})`;
        is_first_string = false;
    }

    return string;
}

export function trimNumber(n) {
    return parseFloat(n).toFixed(4).replace(/\.?0*$/, '');
}


export function optionArrayToSegmentedLine(options) {
    const segments = [];

    options.forEach((option, i) => {
        const { securityType, strike, fraction } = option;

        if (i === 0) {
            const x = strike;
            const y = 0;
            const k = fraction;
            if (options.length === 1){
                segments.push(new Ray(x, y, k));
            } else {
                // 这里只是考虑了没有跳跃的线条
                segments.push(new LineSegment(x, y, k, options[i + 1].strike, undefined));
            }
        } else if (i < options.length - 1){
            // 这里只是考虑了没有跳跃的线条
            const x = strike;
            const x0 = segments[i - 1].xStart;
            const y0 = segments[i - 1].yStart;
            const k0 = segments[i - 1].slope;
            const y = yOnLine(x0, y0, k0, x)
            segments.push(new LineSegment(x, y, segments[i-1].slope + fraction, options[i + 1].strike, undefined));
        } else if (i === options.length - 1){
            // 这里只是考虑了没有跳跃的线条
            const x = strike;
            const x0 = segments[i - 1].xStart;
            const y0 = segments[i - 1].yStart;
            const k0 = segments[i - 1].slope;
            const y = yOnLine(x0, y0, k0, x)
            segments.push(new Ray(x, y, segments[i-1].slope + fraction));
        }
    });

    return new SegmentedLine(segments);
}

export function testOptionArrayToSegmentedLine() {
    // Example usage
    const options = [
        { securityType: SecurityType.CallOption, strike: 10, fraction: 1 },
        { securityType: SecurityType.CallOption, strike: 20, fraction: 2 },
        { securityType: SecurityType.CallOption, strike: 30, fraction: 3 }
    ];

    const segmentedLine = optionArrayToSegmentedLine(options);

    const options2 = segmentedLineToOption(segmentedLine);
    const segmentedLine2 = optionArrayToSegmentedLine(options2);

    console.log(segmentedLine, segmentedLine2, options, options2);
}