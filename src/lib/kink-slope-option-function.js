import {OPTION_TYPES} from "./option/option";

export function kinkSlopeOptionFunction(kinkSlopeList) {
    // Sort the kinks in ascending order
    const sortedList = kinkSlopeList.slice().sort((a, b) => a[0] - b[0]);

    function f(x) {
        // The start point is (0,0)
        if (x === 0) {
            return 0;
        }

        // Walk through the kinks to find where x is
        for (let i = 0; i < sortedList.length; i++) {
            const [kink, slope] = sortedList[i];
            if (i < sortedList.length - 1) {
                // If x is between the current kink and the next kink,
                // compute the value of the function at x
                const kinkNext = sortedList[i+1][0];
                if (x >= kink && x <= kinkNext) {
                    return f(kink) + slope * (x - kink);
                }
            } else {
                // If x is greater than the last kink in the list,
                // compute the value of the function at x
                if (x >= kink) {
                    return f(kink) + slope * (x - kink);
                }
            }
        }

        // If x is not between any of the kinks (not greater than the last kink) or if the input list is empty,
        // raise an exception
        throw new Error("Error");
    }

    return f;
}

// const kinkXSlopes = [
//     {x: 0, y: 0, slope: 1},
//     {x: 10, y: undefined, slope: 0},
//     {x: 15, y: undefined, slope: 1/2}
// ]
//
// const callOptions = [
//     {securityType:"", strike: 0, fraction: 1}
// ]


// sort modifies the original array
function sortKinkSlopes(kinkSlopes){
    return kinkSlopes.sort( (a, b) => a.x - b.x)
}

// sort modifies the original array
function sortCallOptions(callOptions){
    return callOptions.sort((a, b) => a.strike - b.strike)
}
// remove the options with the fraction of 0
function filterZeroCallOptions(callOptions){
    return callOptions.filter(option => option.fraction !== 0)
}

// Here uses CallOption only, need to add BinaryCallOption in the future
export function kinkSlopesToCallOptions(kinkSlopes){
    sortKinkSlopes(kinkSlopes)

    const callOptions = [];
    for (let i = 0; i < kinkSlopes.length; i++) {
        const {x, slope} = kinkSlopes[i]
        const strike = x;
        const fraction = (i === 0) ? slope : (slope - kinkSlopes[i-1].slope);
        callOptions.push({
            securityType: OPTION_TYPES.CALL_OPTION,
            strike,
            fraction
        });
    }

    return filterZeroCallOptions(sortCallOptions(callOptions));
}

// Here uses CallOption only, need to add BinaryCallOption in the future
export function callOptionsToKinkSlopes(callOptions){
    sortCallOptions(callOptions)

    const kinkSlopes = []
    for (let i=0; i<callOptions.length; i++){
        const {strike, fraction} = callOptions[i]
        const slope = (i === 0) ? fraction : (fraction + kinkSlopes[i-1].slope)
        kinkSlopes.push({x: strike, slope})
    }

    return kinkSlopes
}

export function kinkSlopesToLinearFunction(kinkSlopes){
    sortKinkSlopes(kinkSlopes)

    function f(x) {
        // The start point is (0,0)
        if (x === 0) {
            return 0;
        }

        // Walk through the kinks to find where x is
        for (let i = 0; i < kinkSlopes.length; i++) {
            const {x: xKink, slope} = kinkSlopes[i];
            if (i < kinkSlopes.length - 1) {
                // If x is between the current kink and the next kink,
                // compute the value of the function at x
                const {x: xKinkNext} = kinkSlopes[i+1];
                if (x > xKink && x <= xKinkNext) {
                    return f(xKink) + slope * (x - xKink);
                }
            } else {
                // If x is greater than the last kink in the list,
                // compute the value of the function at x
                if (x > xKink) {
                    return f(xKink) + slope * (x - xKink);
                }
            }
        }

        // If x is not between any of the kinks (not greater than the last kink) or if the input list is empty,
        // raise an exception
        throw new Error("Error");
    }

    return f
}

export function callOptionsSubtraction(callOptionsPV, callOptionsGPCV){
    const diff = []

    // DEEP COPY - won't impact original objects
    for (let i=0; i < callOptionsPV.length; i++){
        diff.push({...callOptionsPV[i]})
    }

    // DEEP COPY - won't impact original objects
    for (let i = 0; i< callOptionsGPCV.length; i++){
        const {securityType, strike, fraction} = callOptionsGPCV[i]
        diff.push({securityType, strike, fraction: (-1)*fraction})
    }

    sortCallOptions(diff)

    const diffSimplified = []
    for (let i=0; i<diff.length; i++){
        const {securityType, strike, fraction} = diff[i]
        const option = {securityType, strike, fraction}
        for (let j=i+1; j<diff.length;j++){
            if (securityType === diff[j].securityType && strike === diff[j].strike){
                option.fraction += diff[j].fraction
                i++
            } else {
                break
            }
        }
        if (option.fraction !== 0){
            diffSimplified.push(option)
        }
    }

    return filterZeroCallOptions(sortCallOptions(diffSimplified))
}

export function allKinkXs(...args){
    const all = []
    for (let i=0; i<args.length; i++){
        for (let j=0; j<args[i].length; j++){
            all.push(args[i][j].x)
        }
    }

    // remove duplicates, and sort
    return [...new Set(all)].sort((a,b) => a-b)
}

export function trimNumber(n) {
    return parseFloat(n).toFixed(2).replace(/\.?0*$/, '');
}

export function trimNumberWithSign(n) {
    return (n > 0 ? "+" : "") + trimNumber(n);
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

export function testKinkSlopesToLinearFunction(){
    const kinkSlopesPV = [
        {
            x: 0,
            slope: 0
        },{
            x: 85,
            slope: 0.333333333
        },{
            x: 100,
            slope: 0.25
        },{
            x: 160,
            slope: 0.2
        },{
            x: 210,
            slope: 0.166666666667
        }
    ]
    const kinkSlopesGPCV = [
        {
            x: 0,
            slope: 0
        },{
            x: 85,
            slope: 0.1
        },{
            x: 100,
            slope: 0.1
        },{
            x: 160,
            slope: 0.1
        },{
            x: 210,
            slope: 0.1
        }
    ]

    const LPC = 5



    const callOptionsPV = kinkSlopesToCallOptions(kinkSlopesPV)
    const callOptionsGPCV = kinkSlopesToCallOptions(kinkSlopesGPCV)
    const callOptionsLPV = callOptionsSubtraction(callOptionsPV, callOptionsGPCV)
    const kinkSlopesLPV = callOptionsToKinkSlopes(callOptionsLPV)
    const fPV = kinkSlopesToLinearFunction(kinkSlopesPV)
    const fGPCV = kinkSlopesToLinearFunction(kinkSlopesGPCV)
    const fLPV = kinkSlopesToLinearFunction(kinkSlopesLPV)

    const allXs = allKinkXs(kinkSlopesPV, kinkSlopesGPCV, kinkSlopesLPV)
    const xTicks = [...allXs, allXs[allXs.length - 1] * 2]


}

