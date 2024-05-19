import React from 'react';
import {SECURITY_TYPE_TAGS} from "../../lib/constants";

const SeriesListDescription = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 , textAlign: "left" }}>
            <h2 style={{ color: '#2c3e50' }}>Understanding the Equity Securities</h2>

            <h3 style={{ color: '#3498db' }}>Security Type Illustrations</h3>
            <p>{SECURITY_TYPE_TAGS.CS}: Common Stock</p>
            <p>{SECURITY_TYPE_TAGS.RP}: Redeemable Preferred</p>
            <p>{SECURITY_TYPE_TAGS.CP}: Convertible Preferred</p>
            <p>{SECURITY_TYPE_TAGS.CP_CS}: Common Stock that Convertible Preferred can be converted into</p>
            <p>{SECURITY_TYPE_TAGS.CP_RV}: Redeemable Value of Convertible Preferred</p>

            <h3 style={{ color: '#3498db' }}>Investor Payback Order</h3>
            <p>In the event of a company exit or liquidation, the order in which investors are paid back is determined by the investment agreement. This order can prioritize different series of investors based on the terms agreed upon. A common structure prioritizes later series investors first.</p>

            <h3 style={{ color: '#3498db' }}>Example Scenario</h3>
            <p>For example, in the event of an exit or liquidation, usually the Series E investors are redeemed first, followed by Series D, then Series C, then Series B, and finally Series A, as specified in the investment agreement.</p>
        </div>
    );
};

export default SeriesListDescription;
