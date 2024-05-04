// so = pre-money shares outstanding
// pcpsp = new pcp shares purchased
// cr = conversion ratio
// invest = investment in this round
// fvRP = face of preferred at expiration
// liqPref = liquidation peference
// simDiv = simple dividend
// comDiv = compound dividend
// tv = total valuation
// vol = volatility
// r = interest rate
// H = expected holding period
// ci = carried interest
// ltfp = lifetime fee percentage
// debt = debt
// threshold = threshold

import {Call_Bin_Eur_Div_RE, Call_Bin_Eur_RE, Call_Eur_Div_RE, Call_Eur_RE, tstar} from "./option";
import goalSeek from "./goal-seek";

function getPartialV(so, pcpsp, cr, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt, threshold){
    // const LPC = invest * (1 + ltfp)

    // No Dividends
    let vNoDiv
    if (Math.max(simDiv,comDiv) === 0) {
        vNoDiv = Call_Eur_RE(tv,debt,H,r,vol) +
            (threshold > debt + fvRP * liqPref ? -(1 - pcpsp * cr / (cr * pcpsp + so)) * Call_Eur_RE(tv,debt + fvRP * liqPref,H,r,vol) +
                (threshold > debt + fvRP * liqPref / (pcpsp * cr / (cr * pcpsp + so)) ? -(1 - pcpsp * cr / (cr * pcpsp + so)) * fvRP * liqPref * Call_Bin_Eur_RE(tv,threshold,H,r,vol) :
                    -pcpsp * cr / (cr * pcpsp + so) * (threshold - fvRP * liqPref - debt) * Call_Bin_Eur_RE(tv,threshold,H,r,vol) -
                    pcpsp * cr / (cr * pcpsp + so) * Call_Eur_RE(tv,threshold,H,r,vol) +
                    pcpsp * cr / (cr * pcpsp + so) * Call_Eur_RE(tv,fvRP*liqPref/(pcpsp*cr/(cr*pcpsp+so))+debt,H,r,vol)) :
                -Call_Eur_RE(tv,debt+fvRP*liqPref,H,r,vol)+pcpsp*cr/(pcpsp*cr+so)*Call_Eur_RE(tv,debt+fvRP*liqPref/((pcpsp*cr)/(pcpsp*cr+so)),H,r,vol));
    } else {
        vNoDiv = 0;
    }

    // Dividends
    let vDiv
    if (Math.max(comDiv, simDiv) > 0) {
        const call1 = Call_Eur_RE(tv, debt, H, r, vol);
        const call2 = Call_Eur_Div_RE(tv, debt, H, r, vol, 0, 100, fvRP * liqPref, comDiv, simDiv);
        const call3 = Call_Eur_Div_RE(tv, debt, H, r, vol, 0, tstar(threshold - debt, fvRP * liqPref, comDiv, simDiv), fvRP * liqPref, comDiv, simDiv);
        const call4 = Call_Eur_Div_RE(tv, debt, H, r, vol, tstar(pcpsp * cr / (cr * pcpsp + so) * (threshold - debt), fvRP * liqPref, comDiv, simDiv), 100, fvRP * liqPref / (pcpsp * cr / (cr * pcpsp + so)), comDiv, simDiv);
        const call5 = Call_Eur_Div_RE(tv, threshold, H, r, vol, tstar(pcpsp * cr / (cr * pcpsp + so) * (threshold - debt), fvRP * liqPref, comDiv, simDiv), tstar(threshold - debt, fvRP * liqPref, comDiv, simDiv), 0, comDiv, simDiv);
        const call6 = Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, tstar(pcpsp * cr / (cr * pcpsp + so) * (threshold - debt), fvRP * liqPref, comDiv, simDiv), tstar(threshold - debt, fvRP * liqPref, comDiv, simDiv), -pcpsp * cr / (cr * pcpsp + so) * (threshold - debt), pcpsp * cr / (cr * pcpsp + so) * fvRP * liqPref, comDiv, simDiv);
        const call7 = Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, 0, tstar(pcpsp * cr / (cr * pcpsp + so) * (threshold - debt), fvRP * liqPref, comDiv, simDiv), 0, (1 - pcpsp * cr / (cr * pcpsp + so)) * fvRP * liqPref, comDiv, simDiv);
        vDiv = call1 - call2 + pcpsp * cr / (cr * pcpsp + so) * (call3 + call4 - call5 - call6 - call7);
    } else {
        vDiv = 0;
    }

    return Math.max(vNoDiv, vDiv)
}

function getGPCV(so, pcpsp, cr, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt, threshold){
    const LPC = invest * (1 + ltfp)
    const ownership = pcpsp * cr / (pcpsp * cr + so)
    const isNoDiv = Math.max(simDiv, comDiv) === 0
    const isDiv = Math.max(simDiv, comDiv) > 0


    // NO DIVIDENDS ---------------------------------------

    // 0<=V*<D+FV
    const isNoDiv01 = 0 <= threshold && threshold < debt + fvRP * liqPref
    // D+FV<=V*<D+FV/y
    const isNoDiv02 = debt + fvRP * liqPref <= threshold && threshold < debt + fvRP * liqPref / ownership
    // D+FV/y<=V*
    const isNoDiv03 = debt + fvRP * liqPref / ownership <= threshold

    let noDiv01
    if (isNoDiv && isNoDiv01) {
        if (LPC < fvRP * liqPref) {
            noDiv01 = Call_Eur_RE(tv, debt + LPC, H, r, vol) - Call_Eur_RE(tv, debt + fvRP * liqPref, H, r, vol) + ownership * Call_Eur_RE(tv, debt + fvRP * liqPref / ownership, H, r, vol);
        } else {
            noDiv01 = ownership * Call_Eur_RE(tv, debt + LPC / ownership, H, r, vol);
        }
    } else {
        noDiv01 = 0;
    }

    let noDiv02
    if (isNoDiv && isNoDiv02) {
        if (LPC < fvRP*liqPref) {
            noDiv02 = Call_Eur_RE(tv,debt+LPC,H,r,vol)-(1-ownership)*Call_Eur_RE(tv,debt+fvRP*liqPref,H,r,vol)-ownership*(threshold-debt-fvRP*liqPref)*Call_Bin_Eur_RE(tv,threshold,H,r,vol)-ownership*Call_Eur_RE(tv,threshold,H,r,vol)+ownership*Call_Eur_RE(tv,debt+fvRP*liqPref/ownership,ci,r,vol);
        } else if (LPC < fvRP*liqPref+ownership*(threshold-debt-fvRP*liqPref)) {
            noDiv02 = ownership*Call_Eur_RE(tv,debt+fvRP*liqPref+(LPC-fvRP*liqPref)/ownership,H,r,vol)-(fvRP*liqPref+ownership*(threshold-debt-fvRP*liqPref)-LPC)*Call_Bin_Eur_RE(tv,threshold,H,r,vol)-ownership*Call_Eur_RE(tv,threshold,H,r,vol)+ownership*Call_Eur_RE(tv,debt+LPC/ownership,H,r,vol);
        } else {
            noDiv02 = Call_Eur_RE(tv,threshold+(1-ownership)/ownership*fvRP*liqPref,H,r,vol);
        }
    } else {
        noDiv02 = 0;
    }

    let noDiv03
    if (isNoDiv && isNoDiv03) {
        if (LPC < fvRP * liqPref) {
            noDiv03 = Call_Eur_RE(tv, debt + LPC, H, r, vol) - (1 - ownership) * Call_Eur_RE(tv, debt + fvRP * liqPref, H, r, vol) - (1 - ownership) * fvRP * liqPref * Call_Bin_Eur_RE(tv, threshold, H, r, vol);
        } else if (LPC < ownership * (threshold - debt)) {
            noDiv03 = ownership * Call_Eur_RE(tv, debt + fvRP * liqPref + (LPC - fvRP * liqPref) / ownership, H, r, vol) - (1 - ownership) * fvRP * liqPref * Call_Bin_Eur_RE(tv, threshold, H, r, vol);
        } else if (LPC < fvRP * liqPref + ownership * (threshold - debt - fvRP * liqPref)) {
            noDiv03 = ownership * Call_Eur_RE(tv, debt + fvRP * liqPref + (LPC - fvRP * liqPref) / ownership, H, r, vol) - (fvRP * liqPref + ownership * (threshold - debt - fvRP * liqPref) - LPC) * Call_Bin_Eur_RE(tv, threshold, H, r, vol) - ownership * Call_Eur_RE(tv, threshold, H, r, vol) + ownership * Call_Eur_RE(tv, debt + LPC / ownership, H, r, vol);
        } else {
            noDiv03 = Call_Eur_RE(tv, (1 - ownership) / ownership * fvRP * liqPref, H, r, vol);
        }
    } else {
        noDiv03 = 0;
    }

    const noDiv = ci * (noDiv01 + noDiv02 + noDiv03)

    // DIVIDENDS ---------------------------------------
    //            0<=V*<D+FV
    const D33 = Math.min(tstar(threshold - debt, fvRP * liqPref, comDiv, simDiv), 250)
    const E33 = 250
    //            0<=V*<D+FV        LPC<=FV
    const D34 = tstar(LPC,fvRP*liqPref,comDiv,simDiv)
    const E34 = 250
    const F34 = (E34 > D34 && E34 > D33 && D34 < E33) ? Math.max(D33, D34) : 0
    const G34 = (E34 > D34 && E34 > D33 && D34 < E33) ? Math.min(E33, E34) : 0
    const r34 = isDiv ? Call_Eur_Div_RE(tv, debt + LPC, H, r, vol, F34, G34, 0, comDiv, simDiv) - Call_Eur_Div_RE(tv, debt, H, r, vol, F34, G34, fvRP * liqPref, comDiv, simDiv) + ownership * Call_Eur_Div_RE(tv, debt, H, r, vol, F34, G34, fvRP * liqPref / ownership, comDiv, simDiv) : 0
    //            0<=V*<D+FV       FV<LPC
    const D35 = 0
    const E35 = D34
    const F35 = (E35 > D35 && E35 > D33 && D35 < E33) ? Math.max(D33, D35) : 0
    const G35 = (E35 > D35 && E35 > D33 && D35 < E33) ? Math.min(E33, E35) : 0
    const r35 = isDiv ? ownership * Call_Eur_Div_RE(tv, debt + LPC / ownership, H, r, vol, F35, G35, 0, comDiv, simDiv) : 0

    //            D+FV<=V*<D+FV/y
    const D36 = Math.min(tstar(ownership * (threshold - debt), fvRP * liqPref, comDiv, simDiv), 250)
    const E36 = D33

    // D+FV<=V*<D+FV/y LPC<=FV
    const D37 = tstar(LPC,fvRP*liqPref,comDiv,simDiv)
    const E37 = 250
    const F37 = (E37 > D37) && (E37 > D36) && (D37 < E36) ? Math.max(D36, D37) : 0
    const G37 = (E37 > D37) && (E37 > D36) && (D37 < E36) ? Math.min(E36, E37) : 0
    const r37 = isDiv ? (
        Call_Eur_Div_RE(tv, debt+LPC, H, r, vol, F37, G37, 0, comDiv, simDiv)
        - (1-ownership)*Call_Eur_Div_RE(tv, debt, H, r, vol, F37, G37, fvRP*liqPref, comDiv, simDiv)
        - Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, F37, G37, ownership*(threshold-debt), -ownership*fvRP*liqPref, comDiv, simDiv)
        - ownership*Call_Eur_Div_RE(tv, threshold, H, r, vol, F37, G37, 0, comDiv, simDiv)
        + ownership*Call_Eur_Div_RE(tv, debt, H, r, vol, F37, G37, fvRP*liqPref/ownership, comDiv, simDiv)
    ) : 0

    // D+FV<=V*<D+FV/y FV<LPC<=FV+y*(V*-D-FV)
    const D38 = Math.min(tstar(Math.max((LPC-ownership*threshold+ownership*debt)/(1-ownership),fvRP*liqPref),fvRP*liqPref,comDiv,simDiv), 250)
    const E38 = tstar(LPC,fvRP*liqPref,comDiv,simDiv)
    const F38 = E38 > D38 && E38 > D36 && D38 < E36 ? Math.max(D36, D38) : 0
    const G38 = (E38 > D38 && E38 > D36 && D38 < E36) ? Math.min(E36, E38) : 0
    const r38 = isDiv ? ownership * Call_Eur_Div_RE(tv, debt + LPC/ownership, H, r, vol, F38, G38, (1-1/ownership)*fvRP*liqPref, comDiv, simDiv)
            - Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, F38, G38, ownership*(threshold-debt)-LPC, (1-ownership)*fvRP*liqPref, comDiv, simDiv)
            - ownership*Call_Eur_Div_RE(tv, threshold, H, r, vol, F38, G38, 0, comDiv, simDiv)
            + ownership*Call_Eur_Div_RE(tv, debt, H, r, vol, F38, G38, fvRP*liqPref/ownership, comDiv, simDiv) : 0

    // D+FV<=V*<D+FV/y  FV+y*(V*-D-FV)<=LPC
    const D39 = 0
    const E39 = D38
    const F39 = E39 > D39 && E39 > D36 && D39 < E36 ? Math.max(D36, D39) : 0
    const G39 = (E39 > D39) && (E39 > D36) && (D39 < E36) ? Math.min(E36, E39) : 0
    const r39 = isDiv ? Call_Eur_Div_RE(tv, threshold, H, r, vol, F39, G39, (1 - ownership) / ownership * fvRP * liqPref, comDiv, simDiv) : 0


    // D+FV/y<=V*
    const D40 = 0
    const E40 = D36

    // D+FV/y<=V*  LPC<=FV
    const D41 = tstar(LPC,fvRP*liqPref,comDiv,simDiv)
    const E41 = 250
    const F41 = E41 > D41 && D41 < E40 && E41 > D40 ? Math.max(D40, D41) : 0
    const G41 = E41 > D41 && D41 < E40 && E41 > D40 ? Math.min(E40, E41) : 0
    const r41 = isDiv ? Call_Eur_Div_RE(tv, debt + LPC, H, r, vol, F41, G41, 0, comDiv, simDiv)
        - (1 - ownership) * Call_Eur_Div_RE(tv, debt, H, r, vol, F41, G41, fvRP * liqPref, comDiv, simDiv)
        - Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, F41, G41, 0, (1 - ownership) * fvRP * liqPref, comDiv, simDiv) : 0

    // D+FV/y<=V* FV<LPC<=FV+y*(V*-D-FV)
    const D42 = tstar(Math.max((LPC-ownership*threshold+ownership*debt)/(1-ownership),fvRP*liqPref),fvRP*liqPref,comDiv,simDiv)
    const E42 = D41
    const F42 = E42 > D42 && D42 < E40 && E42 > D40 ? Math.max(D40, D42) : 0
    const G42 = E42 > D42 && D42 < E40 && E42 > D40 ? Math.min(E40, E42) : 0
    let r42
    if (!isDiv){
        r42 = 0
    } else {
        let call01 = Call_Eur_Div_RE(tv, debt + LPC / ownership, H, r, vol, F42, G42, (1 - 1 / ownership) * fvRP * liqPref, comDiv, simDiv);
        let call02 = Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, F42, G42, 0, (1 - ownership) * fvRP * liqPref, comDiv, simDiv);
        let option1 = ownership * call01 - call02;
        let option2 = ownership * call01 - Call_Bin_Eur_Div_RE(tv, threshold, H, r, vol, F42, G42, ownership * (threshold - debt) - LPC, (1 - ownership) * fvRP * liqPref, comDiv, simDiv);
        let option3 = ownership * call01 - Call_Eur_Div_RE(tv, threshold, H, r, vol, F42, G42, 0, comDiv, simDiv) + ownership * Call_Eur_Div_RE(tv, debt, H, r, vol, F42, G42, fvRP * liqPref / ownership, comDiv, simDiv);
        r42 = Math.max(0, Math.min(option1, option2, option3))
    }

    // D+FV/y<=V* FV+y*(V*-D-FV)<=LPC
    const D43 = 0
    const E43 = D42
    const F43 = (E43 > D43) * (D43 < E40) * (E43 > D40) ? Math.max(D40, D43) : 0
    const G43 = (E43 > D43) * (D43 < E40) * (E43 > D40) ? Math.min(E40, E43) : 0
    const r43 = isDiv ? Call_Eur_Div_RE(tv, threshold, H, r, vol, F43, G43, (1-ownership)/ownership*fvRP*liqPref, comDiv, simDiv) : 0;

    const div = ci * (r34+r35+r37+r38+r39+r41+r42+r43)

    return Math.max(noDiv, div)
}

export function seriesA_PCP(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt, threshold){
    const LPC = inv * (1 + lfp)
    const PV = getPartialV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt, threshold)
    const GPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, tv, vol, r, H, ci, lfp, debt, threshold)
    const LPV = PV - GPCV

    function getPostTxLPV(postTransactionV){
        const postTxPV = getPartialV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, ci, lfp, debt, threshold)
        const postTxGPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTransactionV, vol, r, H, ci, lfp, debt, threshold)
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

        const postTxPV = getPartialV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, ci, lfp, debt, threshold)
        const preTxV = postTxV - postTxPV
        const postTxGPCV = getGPCV(so, sp, cr, inv, fvPref, liqPref, simDiv, comDiv, postTxV, vol, r, H, ci, lfp, debt, threshold)
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


export function testSeriesA_PCP(){
    const so = 10
    const pcpsp = 5
    const cr = 1
    const invest = 6
    const fvRP = 6
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
    const threshold = 90

    return seriesA_PCP(so, pcpsp, cr, invest, fvRP, liqPref, simDiv, comDiv, tv, vol, r, H, ci, ltfp, debt, threshold)
}