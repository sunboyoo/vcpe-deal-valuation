import {Call_Eur_Div_RE, Call_Eur_RE, tstar} from "./option";
import goalSeek from "./goal-seek";

// so = pre-money shares outstanding		11
// sp = new common shares purchased		5
// invest = investment in this round		$4.00
// fvRP = face of preferred at expiration $5.00
// liqPref = liquidation preference 1
// simDiv = simple dividend
// comDiv = Compound dividend
// tv = total valuation		$18.00
// vol = volatility	σ=	90.00%
// r = interest rate	r=	5.00%
// H = expected holding period	H=	6
// ci = carried interest		20%
// ltfp = lifetime fee percentage		25% = lfmfp / (1 - lfmfp)
// debt = debt		$0.00


function getPartialV(so, sp, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, debt){
    const ownership = sp / (sp + so)

    const v1 = Call_Eur_RE(tv, debt, H, r, vol)

    const v2 = (Math.max(simDiv, comDiv)===0)?
        Call_Eur_RE(tv, debt + fvRP*liqPref, H, r, vol) :
        Call_Eur_Div_RE(tv, debt, H, r, vol, 0, 250, fvRP*liqPref, comDiv, simDiv)

    return  v1 - v2 * (1 - ownership)
}

function getGPCV(so, sp, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci,ltfp, debt){
    const ownership = sp / (sp + so)
    const LPC = invest * (1 + ltfp)

    let v
    if (Math.max(comDiv, simDiv) === 0) {
        if (LPC < liqPref * fvRP) {
            v = Call_Eur_RE(tv, debt + LPC, H, r, vol) - (1 - ownership) * Call_Eur_RE(tv, debt + liqPref * fvRP, H, r, vol);
        } else {
            v = ownership * Call_Eur_RE(tv, debt + liqPref * fvRP + (LPC - liqPref * fvRP) / (ownership), H, r, vol);
        }
    } else {
        v = Call_Eur_Div_RE(tv, debt + LPC, H, r, vol, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 250, 0, comDiv, simDiv) - (1 - ownership) * Call_Eur_Div_RE(tv, debt, H, r, vol, tstar(LPC, fvRP * liqPref, comDiv, simDiv), 250, fvRP * liqPref, comDiv, simDiv) + ownership * Call_Eur_Div_RE(tv, debt + LPC / (ownership), H, r, vol, 0, tstar(LPC, fvRP * liqPref, comDiv, simDiv), (1 - 1 / (ownership)) * fvRP * liqPref, comDiv, simDiv);
    }

    return v * ci
}

export function seriesA_RP_CS(so, sp, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt){

    const LPC = inv * (1 + lfp)
    const PV = getPartialV(so, sp, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, debt)
    const GPCV = getGPCV(so, sp, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt)
    const LPV = PV - GPCV

    // TRANSACTION VALUATION
    function getPostTxLPV(postTransactionV){
        const postTxPV = getPartialV(so, sp, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, debt)
        const postTxGPCV = getGPCV(so, sp, inv, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, ci, lfp, debt)
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

        const postTxPV = getPartialV(so, sp, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, debt)
        const preTxV = postTxV - postTxPV
        const postTxGPCV = getGPCV(so, sp, inv, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, ci, lfp, debt)
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

export function testSeriesA_RP_CS(){
    const so = 12
    const sp = 6
    const invest = 6
    const fvRP = 5
    const liqPref = 1
    const simDiv = 0
    const comDiv = 0.12
    const tv = 40
    const vol = 0.40
    const r = 0.05
    const H = 5
    const ci = 0.2
    const ltfp = 0.25
    const debt = 0

    return seriesA_RP_CS(so, sp, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt)
}