import React from 'react';

const MilestoneInstruction = () => {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', lineHeight: 1.6, textAlign: 'left' }}>
            <h2 style={{ color: '#2c3e50' }}>Instructions for Understanding the Diagram</h2>

            <section>
                <h3 style={{ color: '#3498db' }}>Overview</h3>
                <p>This diagram illustrates the impact of converting Convertible Preferred (CP) stock into Common Stock (CS) on equity ownership distribution across different firm valuation stages.</p>
            </section>

            <section>
                <h3 style={{ color: '#3498db' }}>How to Read the Diagram</h3>
                <ol>
                    <li>
                        <strong>Identify the Firm Value</strong>:
                        <p>Begin by noting the firm value at the top of each pie chart. This value shows the company’s valuation at the point of conversion.</p>
                    </li>
                    <li>
                        <strong>Understand Ownership Distribution</strong>:
                        <p>Each slice of the pie chart represents the percentage ownership of common stock by different stakeholders (Series E, Series D, Series C, Series B, Series A, and Founders). The percentage values inside each slice indicate the ownership proportion for that stakeholder group.</p>
                    </li>
                    <li>
                        <strong>Analyze Changes Across Scenarios</strong>:
                        <p>Compare the pie charts from left to right to observe how ownership distribution changes as the firm’s valuation increases and different series of Convertible Preferred stock are converted into Common Stock. Note the transition in ownership percentages as more series are converted.</p>
                    </li>
                    <li>
                        <strong>Legend Reference</strong>:
                        <p>Use the legend at the bottom of the diagram to understand which color corresponds to which series or group of stockholders.</p>
                    </li>
                </ol>
            </section>

        </div>
    );
};

export default MilestoneInstruction;
