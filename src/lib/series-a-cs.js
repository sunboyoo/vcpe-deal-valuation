// so = pre-money shares outstanding		11
// sp = new common shares purchased		5
// inv = investment in this round		$4.00
// tv = total valuation		$18.00
// sd = volatility	σ=	90.00%
// r = interest rate	r=	5.00%
// H = expected holding period	H=	6
// ci = carried interest		20%
// lfp = lifetime fee percentage
// debt = debt		$0.00

import {Call_Eur_RE} from "./option";
import goalSeek from "./goal-seek";

export function lifetimeFeePercentage(lifetimeManagementFeePercentage){
    return lifetimeManagementFeePercentage / (1 - lifetimeManagementFeePercentage)
}

export function seriesA_CS(so, sp, inv, tv, sd, r, H, ci, lfp, debt){
    const ownership = sp / (sp + so)
    const LPC = inv * (1 + lfp)


    const PV = ownership * Call_Eur_RE(tv, debt, H, r, sd)
    const GPCV = ownership * ci * Call_Eur_RE(tv, debt + LPC/ownership, H, r, sd)
    const LPV = PV - GPCV

    // TRANSACTION VALUATION
    function getPostTxLPV(postTransactionV){
        let postTxPV = ownership * Call_Eur_RE(postTransactionV, debt, H, r, sd)
        let postTxGPCV = ownership * ci * Call_Eur_RE(postTransactionV, debt + LPC/ownership, H, r, sd)
        return postTxPV - postTxGPCV
    }

    try {
        const postTxV = goalSeek({
            fn: getPostTxLPV,
            fnParams: [tv],
            percentTolerance: 0.01,
            maxIterations: 1000,
            maxStep: 1,
            goal: LPC,
            independentVariableIdx: 0
        })

        const postTxPV = ownership * Call_Eur_RE(postTxV, debt, H, r, sd)
        const preTxV = postTxV - postTxPV
        const postTxGPCV = ownership * ci * Call_Eur_RE(postTxV, debt + LPC/ownership, H, r, sd)
        const postTxLPV = postTxPV - postTxGPCV

        return {
            LPC,
            PV,
            GPCV,
            LPV,
            transactionValuation: {
                postTransactionValuation: postTxV,
                postTransactionPV: postTxPV,
                preTransactionValuation: preTxV,
                postTransactionGPCV: postTxGPCV,
                postTransactionLPV: postTxLPV
            }
        }
    }catch (e) {
        console.log('error', e);

        return {
            LPC,
            PV,
            GPCV,
            LPV,
            transactionValuation: {
                postTransactionValuation: 'Error',
                postTransactionPV: 'Error',
                preTransactionValuation: 'Error',
                postTransactionGPCV: 'Error',
                postTransactionLPV: 'Error'
            }
        }
    }
}

export function testSeriesA_CS(){
    const so = 11
    const sp = 5
    const inv = 4.00
    const tv = 18.00
    const sd = 0.90
    const r = 0.05
    const H = 6
    const ci = 0.20
    const lfp = 0.25
    const debt = 0.00

    return seriesA_CS(so, sp, inv, tv, sd, r, H, ci, lfp, debt)
}
