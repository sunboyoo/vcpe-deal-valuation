import React from 'react';

const GenericPayoffInstruction = () => {
    return (
        <div style={{fontFamily: 'Arial, sans-serif', lineHeight: 1.6, textAlign: 'left'}}>
            <h2 style={{color: '#3498db'}}>Usage Notes</h2>
            <ol>
                <li><p>This spreadsheet can only be used for non-dividend paying securities. Thus "stochastic" strike
                    prices are
                    not possible.</p></li>
                <li><p>Security type can either be "C" (call) or "BC" ($1 binary call). The column fraction contains the
                    fraction of each call option or the number of $1 binary call options.</p></li>
                <li><p>It may occur that a post transaction value cannot be solved for (the LP cannot break even) given
                    the the LP costs, the payoff schedule and the input parameters</p></li>
                <li><p>This worksheet can be used for many purposes and is very flexible. To make use of the
                    "transaction valuation" piece, please ensure that the payoff schedule contains the payoffs to the
                    LP.</p></li>
            </ol>
        </div>
    );
};

export default GenericPayoffInstruction;
