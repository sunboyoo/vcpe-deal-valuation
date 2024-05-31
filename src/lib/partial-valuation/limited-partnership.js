export class LimitedPartnership{
    constructor(managementFee=0.02, carriedInterest=0.2, lifetimeFee=0.25) {
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
