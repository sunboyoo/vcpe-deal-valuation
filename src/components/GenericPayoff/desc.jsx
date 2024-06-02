import React from 'react';

const GenericPayoffInstruction = () => {
    return (
        <div style={{fontFamily: 'Arial, sans-serif', lineHeight: 1.6, textAlign: 'left'}}>
            <h2 style={{color: '#3498db'}}>Usage Notes</h2>
            <ol>
                <li><p>This model can only be used for non-dividend paying securities. Thus "stochastic" strike
                    prices are not possible.</p></li>
                <li><p>Option type can either be Call Option or Binary Call Option ($1 binary call). </p></li>
                <li><p>The column Number of Options Held contains the fraction of each call option or the number of $1 binary call options.</p></li>
                <li><p>This model can be used for many purposes and is very flexible. </p></li>
            </ol>
        </div>
    );
};

export default GenericPayoffInstruction;
