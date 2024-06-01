export class LimitedPartnership{
    constructor(managementFee=0.02, carriedInterest=0.2, lifetimeFee=0.25) {
        if (managementFee < 0 || managementFee > 1.) {
            throw new Error(`The management fee should be between 0 and 1. Got ${managementFee}.`);
        }

        if (carriedInterest < 0 || carriedInterest > 1.) {
            throw new Error(`The Carried Interest should be between 0 and 1. Got ${carriedInterest}.`);
        }

        if (lifetimeFee < 0) {
            throw new Error(`The Lifetime Fee Percentage should be equal or bigger than zero. Got ${lifetimeFee}.`);
        }

        // Management Fee
        this.managementFee = managementFee ? managementFee : (lifetimeFee ? lifetimeFee/(1.0+lifetimeFee)/10.0 : 0.02)
        // Carried Interest
        this.carriedInterest = carriedInterest ? carriedInterest : 0.20
        // LP's Lifetime Fee Percentage
        this.lfp = lifetimeFee ? lifetimeFee : (this.managementFee*10.)/(1 - this.managementFee*10.)
    }

    lpc(invest){
        return invest * (1 + this.lfp)
    }
}
