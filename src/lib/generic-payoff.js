// invest = investment in this round		$12.00
// tv = total valuation		$50.00
// r = interest rate	r=	5.00%
// sd = standard deviation (annualized)	σ=	90.00%
// H =  expected holding period (for RE options) (years)	H=	4
// lfp = lifetime fee percentage		25%

import {Call_Bin_Eur_RE, Call_Eur_RE} from "./option";
import goalSeek from "./goal-seek";
import {OPTION_TYPES} from "./option/option";


// s = stock price
// x = strike price
// payoff() can compute the payoff for PartialValuation, GP Carry Valuation, and LPV
// Partial Valuation = payoff (PV_options, ...)
// GP Carry Valuation = payoff (GP_options, ...)
// LPV = payoff (LP_options, ...)
export function payoff(options, s, H, r, vol){
    let v = 0
    for (let i=0; i < options.length; i++) {
        const {securityType, strike, quantity} = options[i]
        if (securityType === OPTION_TYPES.CALL_OPTION){
            v += quantity * Call_Eur_RE(s, strike, H, r, vol)
        } else if (securityType === OPTION_TYPES.BINARY_CALL_OPTION){
            v += quantity * Call_Bin_Eur_RE(s, strike, H, r, vol)
        }
    }
    return v;
}

// Transaction Valuation
// Find the transaction value to make LPV === LPC with the payoff() function.
// Post Transaction Valuation is defined for the investors break even
// Pre/Post Transaction Method <=> Pre/Post Money Method
export function postTransactionValuation(lpOptions, s, H, r, vol, lfp, inv){
    const LPC = inv * (1 + lfp)
    const LPV = payoff(lpOptions, s, H, r, vol)

    try {
        const postTxV = goalSeek({
            fn: payoff,
            fnParams: [lpOptions, s, H, r, vol],
            percentTolerance: 0.01,
            maxIterations: 1000,
            maxStep: 1,
            goal: LPC,
            independentVariableIdx: 1
        })

        const postTxLPV = payoff(lpOptions, postTxV, H, r, vol)

        return {
            LPC,
            LPV,
            transactionValuation: {
                postTransactionValuation: postTxV,
                postTransactionLPV: postTxLPV
            }
        }
    }catch (e) {
        console.log('error', e);

        return {
            LPC,
            LPV,
            transactionValuation: {
                postTransactionValuation: "Error",
                postTransactionLPV: "Error"
            }
        }
    }

}

export function testPayoff(){
    const tv = 50.00
    const r = 0.05
    const sd = 0.90
    const H = 4

    const options = [
        {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 0,
            quantity: 1
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 10,
            quantity: -1
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 16,
            quantity: 1/4
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 36,
            quantity: -1/20
        }, {
            securityType: OPTION_TYPES.BINARY_CALL_OPTION,
            strike: 130,
            quantity: 1.2
        }
    ]

    return payoff(options, tv, H, r, sd)
}

export function testTransactionValuation(){

    const invest = 12.00
    const tv = 50.00
    const r = 0.05
    const sd = 0.90
    const H = 4
    const lfp = 0.25

    const options = [
        {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 0,
            quantity: 1
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 10,
            quantity: -1
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 16,
            quantity: 1/4
        }, {
            securityType: OPTION_TYPES.CALL_OPTION,
            strike: 36,
            quantity: -1/20
        }, {
            securityType: OPTION_TYPES.BINARY_CALL_OPTION,
            strike: 130,
            quantity: 1.2
        }
    ]

    return postTransactionValuation(options, tv, H, r, sd, lfp, invest)
}

