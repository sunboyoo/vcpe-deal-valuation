import {SecurityType} from "../generic-payoff";
import {LeftClosedRightOpenSegment, LineSegment, Ray} from "./line-segment";

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