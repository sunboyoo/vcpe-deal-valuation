import {Call_Eur} from "./option";


/*
# Warrant Price Computation

# s = stock price
# x = strike price
# σ = volatility
# r = interest rate
# T = time to expiration (years)
# n = shares outstanding (millions)
# m = warrants issued (millions)
# y = conversion ratio
* */

export function Warrant(s, x, T, r, sd, m, n, y) {
    let WarrantOld = Call_Eur(s, x, T, r, sd);
    let error = 1;
    while (Math.abs(error) > 0.0001) {
        let WarrantNew = (n * y / (n + m * y)) * Call_Eur(s + (m / n) * WarrantOld, x, T, r, sd);
        error = WarrantNew - WarrantOld;
        WarrantOld = WarrantNew;
    }
    return WarrantOld;
}

export function testWarrant(){
    let s = 100
    let x = 100
    let sd = 0.90
    let r = 0.05
    let T = 6
    let n = 1
    let m = 0.1
    let y = 1

    return Warrant(s, x, T, r, sd, m, n, y)
}