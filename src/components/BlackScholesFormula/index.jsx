import React from 'react';
import {BlockMath, InlineMath} from 'react-katex';
import 'katex/dist/katex.min.css';

export default function BlackScholesFormula() {
    const formula = '\\begin{aligned} C(S_{t},t) &= N(d_{+})S_{t} - N(d_{-})Ke^{-r(T-t)}\\\\ d_{+} &= \\frac{1}{\\sigma \\sqrt{T-t}}\\left[\\ln \\left(\\frac{S_{t}}{K}\\right) + \\left(r + \\frac{\\sigma^2}{2}\\right)(T-t)\\right]\\\\ d_{-} &= d_{+} - \\sigma \\sqrt{T-t}\\\\ \\end{aligned}';

    return (
        <div>
            <h1>Black-Scholes Formula</h1>
            <div style={{textAlign: 'left'}}>
                <p>The Black–Scholes formula calculates the price of European put and call options.</p>
                <p>The value of a call option for a non-dividend-paying underlying stock is</p>
            </div>
            <BlockMath>{formula}</BlockMath>
            <div style={{textAlign: 'left'}}>
                <p><strong><InlineMath math="C(S_t, t)"/></strong> - the price of the call option at time <InlineMath
                    math="t"/> when the stock price is <InlineMath math="S_t"/>.
                </p>
                <p><strong><InlineMath math="N(d_+)"/></strong> and <strong><InlineMath math="N(d_-)"/></strong> -
                    values of the cumulative distribution function </p>
                <p> of the standard normal distribution at <InlineMath
                    math="d_+"/> and <InlineMath math="d_-"/>.
                </p>
                <p><strong><InlineMath math="S_t"/></strong> - the current stock price.</p>
                <p><strong><InlineMath math="K"/></strong> - the strike price of the option.</p>
                <p><strong><InlineMath math="r"/></strong> - the risk-free rate.</p>
                <p><strong><InlineMath math="T"/></strong> - the time to maturity of the option.</p>
                <p><strong><InlineMath math="\sigma"/></strong> - the volatility of the stock's returns.</p>
            </div>
        </div>
    );
};