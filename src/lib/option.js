import jStat from 'jstat'
//
// s = stock price
// x = strike price
// sd = volatility
// r = interest rate
// T = time to expiration (for regular options)
// H = expected holding period (for RE options)
export function Call_Eur(s, x, T, r, sd) {
    if (T === 0) {
        return Math.max(s - x, 0);
    } else if (x === 0) {
        return s;
    } else if (s <= 0) {
        return 0;
    } else {
        let a = Math.log(s / x);
        let b = (r + 0.5 * sd ** 2) * T;
        let c = sd * (T ** 0.5);
        let d1 = (a + b) / c;
        let d2 = d1 - sd * (T ** 0.5);
        return s * jStat.normal.cdf(d1, 0, 1) - x * Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
    }
}

export function Put_Eur(s, x, T, r, sd) {
    return x * Math.exp(-r * T) - s + Call_Eur(s, x, T, r, sd);
}

// Binary Euro Call RandomExpirationEuropeanCallOption Price Computation
export function Call_Bin_Eur(s, x, T, r, sd) {
    if (T === 0) {
        if (s > x) {
            return 1;
        } else {
            return 0;
        }
    } else if (x === 0) {
        return Math.exp(-r * T);
    } else if (s <= 0) {
        return 0;
    } else {
        let a = Math.log(s / x);
        let b = (r - 0.5 * sd ** 2) * T;
        let c = sd * (T ** 0.5);
        let d2 = (a + b) / c;
        return Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
    }
}

// Exponential RE Analytical Solution Function
export function Exp_NormCDF_Int(p, a, b) {
    let s = Math.sqrt(b ** 2 + 2 * p);
    if (a > 0) {
        return 1 + 0.5 * ((b / s) - 1) * Math.exp(-a * (s + b));
    } else {
        return 0.5 * (1 + b / s) * Math.exp(a * (s - b));
    }
}

// Random Expiration Call RandomExpirationEuropeanCallOption - Analytical Solution
export function Call_Eur_RE(s, x, H, r, sd) {
    if (s <= 0) {
        return 0;
    } else if (x <= 0) {
        return s;
    } else {
        let Q = 1 / H;
        let a = Math.log(s / x) / sd;
        let b1 = (r + 0.5 * sd ** 2) / sd;
        let b2 = (r - 0.5 * sd ** 2) / sd;
        return s * Exp_NormCDF_Int(Q, a, b1) - x * Q / (r + Q) * Exp_NormCDF_Int(Q + r, a, b2);
    }
}

// Calculate time point at which option changes
export function tstar(rhs, fv, cdiv, sdiv) {
    let tstar;
    if (cdiv > 0) {
        tstar = Math.log(rhs / fv) / cdiv;
    } else if (sdiv > 0) {
        tstar = (rhs - fv) / (fv * sdiv);
    } else if (rhs > fv) {
        tstar = 250;
    } else {
        tstar = 0;
    }

    if (tstar < 0) {
        tstar = 0;
    }
    if (tstar > 250) {
        tstar = 250;
    }

    return tstar;
}

// Random Expiration Call RandomExpirationEuropeanCallOption with Dividends and Upper and Lower Bounds
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
export function CRE_ASCore(a, b, fa, fc, fb, s, x1, H, r, sd, x2, cdiv, sdiv) {
    // Core function for Adaptive Simpson method

    let tol = 0.0001;
    let m = b - a;
    let c = (a + b) / 2;
    let xd = (a + c) / 2;
    let xe = (c + b) / 2;
    let fd, fe;
    if (cdiv > 0) {
        fd = 1 / H * Math.exp(-xd / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * xd), xd, r, sd);
        fe = 1 / H * Math.exp(-xe / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * xe), xe, r, sd);
    } else {
        fd = 1 / H * Math.exp(-xd / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * xd), xd, r, sd);
        fe = 1 / H * Math.exp(-xe / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * xe), xe, r, sd);
    }
    let Q1 = (m / 6) * (fa + 4 * fc + fb);
    let Q2 = (m / 12) * (fa + 4 * fd + 2 * fc + 4 * fe + fb);
    let CRE_ASCore_result = Q2 + (Q2 - Q1) / 15;

    if (Math.abs(Q2 - CRE_ASCore_result) > tol) {
        let Qa = CRE_ASCore(a, c, fa, fd, fc, s, x1, H, r, sd, x2, cdiv, sdiv);
        let Qb = CRE_ASCore(c, b, fc, fe, fb, s, x1, H, r, sd, x2, cdiv, sdiv);
        CRE_ASCore_result = Qa + Qb;
    }

    return CRE_ASCore_result;
}

export function Call_Eur_Div_RE(s, x1, H, r, sd, lb, ub, x2, cdiv, sdiv) {
    if (ub === lb || s <= 0) {
        return 0;
    } else {
        let m = 0.13579 * (ub - lb);
        let y1 = lb;
        let y2 = lb + m;
        let y3 = lb + 2 * m;
        let y4 = (lb + ub) / 2;
        let y5 = ub - 2 * m;
        let y6 = ub - m;
        let y7 = ub;
        let f1, f2, f3, f4, f5, f6, f7;
        if (cdiv > 0) {
            f1 = 1 / H * Math.exp(-y1 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y1), y1, r, sd);
            f2 = 1 / H * Math.exp(-y2 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y2), y2, r, sd);
            f3 = 1 / H * Math.exp(-y3 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y3), y3, r, sd);
            f4 = 1 / H * Math.exp(-y4 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y4), y4, r, sd);
            f5 = 1 / H * Math.exp(-y5 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y5), y5, r, sd);
            f6 = 1 / H * Math.exp(-y6 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y6), y6, r, sd);
            f7 = 1 / H * Math.exp(-y7 / H) * Call_Eur(s, x1 + x2 * Math.exp(cdiv * y7), y7, r, sd);
        } else {
            f1 = 1 / H * Math.exp(-y1 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y1), y1, r, sd);
            f2 = 1 / H * Math.exp(-y2 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y2), y2, r, sd);
            f3 = 1 / H * Math.exp(-y3 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y3), y3, r, sd);
            f4 = 1 / H * Math.exp(-y4 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y4), y4, r, sd);
            f5 = 1 / H * Math.exp(-y5 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y5), y5, r, sd);
            f6 = 1 / H * Math.exp(-y6 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y6), y6, r, sd);
            f7 = 1 / H * Math.exp(-y7 / H) * Call_Eur(s, x1 + x2 * (1 + sdiv * y7), y7, r, sd);
        }
        let Q1 = CRE_ASCore(y1, y3, f1, f2, f3, s, x1, H, r, sd, x2, cdiv, sdiv);
        let Q2 = CRE_ASCore(y3, y5, f3, f4, f5, s, x1, H, r, sd, x2, cdiv, sdiv);
        let Q3 = CRE_ASCore(y5, y7, f5, f6, f7, s, x1, H, r, sd, x2, cdiv, sdiv);

        return Q1 + Q2 + Q3
    }
}

// Random Expiration Binary Call RandomExpirationEuropeanCallOption - Analytical Solution
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
export function Call_Bin_Eur_RE(s, x, H, r, sd) {
    let a, b, Q;

    Q = 1 / H

    if (x <= 0) {
        return Q / (r + Q);
    } else if (s <= 0) {
        return 0;
    } else {
        Q = 1 / H;
        a = Math.log(s / x) / sd;
        b = (r - 0.5 * sd ** 2) / sd;
        return Q / (r + Q) * Exp_NormCDF_Int(r + Q, a, b);
    }
}

// Random Expiration Binary Call RandomExpirationEuropeanCallOption with Dividends and Upper and Lower Bounds
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
// 这个有问题需要检查
export function BCRE_ASCore(a, b, fa, fc, fb, s, x, H, r, sd, Q1, Q2, cdiv, sdiv) {
    // Note that the BCRE assumes that 1/H > dividend rate. If this is not the case the binary
    // call does not converge

    // Core function for Adaptive Simpson method

    let tol = 0.0001;
    let m = b - a;
    let c = (a + b) / 2;
    let xd = (a + c) / 2;
    let xe = (c + b) / 2;

    let fd, fe;
    if (cdiv > 0) {
        fd = 1 / H * Math.exp(-xd / H) * (Q1 + Q2 * Math.exp(cdiv * xd)) * Call_Bin_Eur(s, x, xd, r, sd);
        fe = 1 / H * Math.exp(-xe / H) * (Q1 + Q2 * Math.exp(cdiv * xe)) * Call_Bin_Eur(s, x, xe, r, sd);
    } else {
        fd = 1 / H * Math.exp(-xd / H) * (Q1 + Q2 * (1 + sdiv * xd)) * Call_Bin_Eur(s, x, xd, r, sd);
        fe = 1 / H * Math.exp(-xe / H) * (Q1 + Q2 * (1 + sdiv * xe)) * Call_Bin_Eur(s, x, xe, r, sd);
    }

    let W1 = (m / 6) * (fa + 4 * fc + fb);
    let W2 = (m / 12) * (fa + 4 * fd + 2 * fc + 4 * fe + fb);
    let BCRE_ASCore_result = W2 + (W2 - W1) / 15;

    if (Math.abs(W2 - BCRE_ASCore_result) > tol) {
        let Wa = BCRE_ASCore(a, c, fa, fd, fc, s, x, H, r, sd, Q1, Q2, cdiv, sdiv);
        let Wb = BCRE_ASCore(c, b, fc, fe, fb, s, x, H, r, sd, Q1, Q2, cdiv, sdiv);
        BCRE_ASCore_result = Wa + Wb;
    }

    return BCRE_ASCore_result;
}

export function Call_Bin_Eur_Div_RE(s, x, H, r, sd, lb, ub, Q1, Q2, cdiv, sdiv) {
    if (ub === lb) {
        return 0;
    } else if (s <= 0) {
        return 0;
    } else {
        const m = 0.13579 * (ub - lb);
        const y1 = lb;
        const y2 = lb + m;
        const y3 = lb + 2 * m;
        const y4 = (lb + ub) / 2;
        const y5 = ub - 2 * m;
        const y6 = ub - m;
        const y7 = ub;
        let f1, f2, f3, f4, f5, f6, f7;
        if (cdiv > 0) {
            f1 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y1)) * Call_Bin_Eur(s, x, y1, r, sd);
            f2 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y2)) * Call_Bin_Eur(s, x, y2, r, sd);
            f3 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y3)) * Call_Bin_Eur(s, x, y3, r, sd);
            f4 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y4)) * Call_Bin_Eur(s, x, y4, r, sd);
            f5 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y5)) * Call_Bin_Eur(s, x, y5, r, sd);
            f6 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y6)) * Call_Bin_Eur(s, x, y6, r, sd);
            f7 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * Math.exp(cdiv * y7)) * Call_Bin_Eur(s, x, y7, r, sd);
        } else {
            f1 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y1)) * Call_Bin_Eur(s, x, y1, r, sd);
            f2 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y2)) * Call_Bin_Eur(s, x, y2, r, sd);
            f3 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y3)) * Call_Bin_Eur(s, x, y3, r, sd);
            f4 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y4)) * Call_Bin_Eur(s, x, y4, r, sd);
            f5 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y5)) * Call_Bin_Eur(s, x, y5, r, sd);
            f6 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y6)) * Call_Bin_Eur(s, x, y6, r, sd);
            f7 = 1 / H * Math.exp(-y1 / H) * (Q1 + Q2 * (1 + sdiv * y7)) * Call_Bin_Eur(s, x, y7, r, sd);
        }
        const W1 = BCRE_ASCore(y1, y3, f1, f2, f3, s, x, H, r, sd, Q1, Q2, cdiv, sdiv)
        const W2 = BCRE_ASCore(y3, y5, f3, f4, f5, s, x, H, r, sd, Q1, Q2, cdiv, sdiv)
        const W3 = BCRE_ASCore(y5, y7, f5, f6, f7, s, x, H, r, sd, Q1, Q2, cdiv, sdiv)

        return W1 + W2 + W3
    }
}

export function test_Call_Eur_Put_Eur_Call_Eur_RE(){
    let s=100.00
    let x=100.00
    let sd=0.90
    let r=0.05
    let T=5
    let H=5

    return {
        Call_Eur: Call_Eur(s,x,T,r,sd),
        Put_Eur: Put_Eur(s, x, T, r, sd),
        Call_Eur_RE: Call_Eur_RE(s, x, H, r, sd)
    }
}

export function test_Call_Bin_Eur_Call_Bin_Eur_RE(){
    const s=40.00
    const x=200.00
    const sd=0.90
    const r=0.05
    const T=5
    const H=5

    return {
        Call_Bin_Eur: Call_Bin_Eur(s, x, T, r, sd),
        Call_Bin_Eur_RE: Call_Bin_Eur_RE(s, x, H, r, sd)
    }
}