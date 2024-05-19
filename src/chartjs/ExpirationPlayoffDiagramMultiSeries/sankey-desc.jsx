import React from 'react';

const SankeyDiagramInstructions = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6 , textAlign: 'left' }}>
            <h2 style={{ color: '#2c3e50' }}>Instructions for Understanding the Convertible Preferred (CP) Conversion Sankey Diagram</h2>

            <h3 style={{ color: '#3498db' }}>Why This Chart?</h3>
            <p>This chart visually represents the conversion process of Convertible Preferred (CP) shares to Common Shares (CS) across multiple series of investors. It helps stakeholders understand how different series of investors are affected during the conversion process at various firm values.</p>

            <h3 style={{ color: '#3498db' }}>What Is It For?</h3>
            <p>The chart is used to:</p>
            <ul>
                <li>Illustrate the flow and distribution of equity among different series of investors as the firm value changes.</li>
                <li>Show the prioritization and conversion sequence of CP shares to CS shares.</li>
                <li>Provide a clear visual of how equity stakes evolve over different valuation stages of the company.</li>
            </ul>

            <h3 style={{ color: '#3498db' }}>CP Conversion Theory</h3>
            <p>Convertible Preferred (CP) shares are a type of equity that gives investors the option to convert their preferred shares into a fixed number of Common Shares (CS). The conversion typically happens during events like liquidation, acquisition, or IPO. The decision to convert is based on which option is more beneficial to the investor: redeeming the CP at its redemption value (CP_RV) or converting to CS.</p>

            <h3 style={{ color: '#3498db' }}>How to Read This Chart</h3>
            <p><strong>Vertical Sections:</strong> Each vertical section represents the equity stack at a different firm value (e.g., initial value, intermediate values, final value).</p>
            <p><strong>Horizontal Links:</strong> The horizontal links show the flow of equity from one firm value to the next. The links represent either the redemption of CP shares (staying as CP_RV) or their conversion to CS.</p>
            <p><strong>Nodes:</strong> Each node represents a specific series and type of equity (e.g., Series A CP_RV, Series A CP_CS, Series B CS).</p>

            <h3 style={{ color: '#3498db' }}>Detailed Breakdown</h3>
            <p><strong>Vertical Sections:</strong></p>
            <ul>
                <li><strong>Initial Firm Value:</strong> The starting state of the company's equity stack.</li>
                <li><strong>Intermediate Firm Values:</strong> Show the equity stack after some investors might have chosen to convert their CP shares to CS at different valuation stages.</li>
                <li><strong>Final Firm Value:</strong> Final stage showing the complete conversion and redemption picture.</li>
            </ul>
            <p><strong>Horizontal Links:</strong></p>
            <p>Links connecting nodes between firm values indicate the flow of equity. For example, a link from "Series A CP_RV at the initial firm value" to "Series A CP_CS at an intermediate firm value" indicates that Series A investors have converted their CP shares into CS as the firm value changed.</p>
            <p><strong>Interpreting Links and Nodes:</strong></p>
            <ul>
                <li>The color and width of the links correspond to the series and the value of equity being transferred.</li>
                <li>The width of each link is proportional to the value of equity it represents, helping to visualize the relative amounts.</li>
            </ul>

            <h3 style={{ color: '#3498db' }}>Key Points</h3>
            <ul>
                <li><strong>Prioritization:</strong> Later series investors (e.g., Series E) usually have a higher priority in redemption or conversion than earlier series (e.g., Series A).</li>
                <li><strong>Conversion Decision:</strong> Investors decide to convert CP to CS based on the value maximization principle - choosing the option that offers higher returns.</li>
                <li><strong>Flow of Equity:</strong> The chart shows how equity is redistributed among investors as the firm value increases, reflecting the dynamic changes in ownership structure.</li>
            </ul>

            <h3 style={{ color: '#3498db' }}>Conclusion</h3>
            <p>This Sankey diagram provides a comprehensive visual tool to understand the complex process of CP conversions across different series of investors at various firm values. It aids in grasping the prioritization and value maximization decisions made by investors during significant company events like liquidation or acquisition.</p>
        </div>
    );
};

export default SankeyDiagramInstructions;