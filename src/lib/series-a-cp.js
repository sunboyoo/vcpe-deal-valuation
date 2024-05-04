// so = pre-money shares outstanding
// cpsp = new cp shares purchased
// cr = conversion ratio
// invest = investment in this round
// fvRP = face of preferred at expiration
// liqPref = liquidation preference
// simDiv = simple dividend
// comDiv = compound dividend
// tv = total valuation
// vol = volatility
// r = interest rate
// H = expected holding period
// ci = carried interest
// ltfp = lifetime fee percentage
// debt = debt

import {Call_Eur_Div_RE, Call_Eur_RE, tstar} from "./option";
import goalSeek from "./goal-seek";

function getPartialV(so, cpsp, cr, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, debt){
    const cpOwnership = cpsp * cr / (cpsp * cr + so)

    return Call_Eur_RE(tv,debt,H,r,vol) + (Math.max(simDiv,comDiv) === 0 ?
        -Call_Eur_RE(tv,debt+fvRP*liqPref,H,r,vol)+cpOwnership*Call_Eur_RE(tv,debt+fvRP*liqPref/cpOwnership,H,r,vol) :
        -Call_Eur_Div_RE(tv,debt,H,r,vol,0,250,fvRP*liqPref,comDiv,simDiv)+cpOwnership*Call_Eur_Div_RE(tv,debt,H,r,vol,0,250,fvRP*liqPref/cpOwnership,comDiv,simDiv))
}

// GPCV = GP Carried Interest Valuation
function getGPCV(so, cpsp, cr, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt){
    const cpOwnership = cpsp * cr / (cpsp * cr + so)
    const LPC = invest * (1 + ltfp)
    
    let v

    if (Math.max(comDiv, simDiv) === 0) {
        if (LPC < fvRP * liqPref) {
            v = Call_Eur_RE(tv, debt + LPC, H, r, vol)
                - Call_Eur_RE(tv, debt + fvRP * liqPref, H, r, vol)
                + cpOwnership * Call_Eur_RE(tv, debt + fvRP * liqPref / cpOwnership, H, r, vol)
        } else {
            v = cpOwnership * Call_Eur_RE(tv, debt + LPC / cpOwnership, H, r, vol)
        }
    } else {
        v = cpOwnership * Call_Eur_Div_RE(tv, debt + LPC / cpOwnership, H, r, vol, 0, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 0, comDiv, simDiv)
            + Call_Eur_Div_RE(tv, debt + LPC, H, r, vol, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 250, 0, comDiv, simDiv)
            - Call_Eur_Div_RE(tv, debt, H, r, vol, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 250, fvRP * liqPref, comDiv, simDiv)
            + cpOwnership * Call_Eur_Div_RE(tv, debt, H, r, vol, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 250, liqPref * fvRP / cpOwnership, comDiv, simDiv)
    }

    return ci * v
}
export function seriesA_CP(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt){
    const LPC = inv * (1 + lfp)
    const PV = getPartialV(so, sp, cr, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, debt)
    const GPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt)
    const LPV = PV - GPCV

    // TRANSACTION VALUATION

    function getPostTxLPV(postTransactionV){
        const postTxPV = getPartialV(so, sp, cr, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, debt)
        const postTxGPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, ci, lfp, debt)
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

        const postTxPV = getPartialV(so, sp, cr, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, debt)
        const preTxV = postTxV - postTxPV
        const postTxGPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, ci, lfp, debt)
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

export function testSeriesA_CP(){
    const so = 11
    const cpsp = 5
    const cr = 1
    const invest = 6
    const fvRP = 10
    const liqPref = 1
    const simDiv = 0
    const comDiv = 0
    const tv = 20
    const vol = 0.9
    const r = 0.05
    const H = 5
    const ci = 0.2
    const ltfp = 0.25
    const debt = 0

    return seriesA_CP(so, cpsp, cr, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt)
}
