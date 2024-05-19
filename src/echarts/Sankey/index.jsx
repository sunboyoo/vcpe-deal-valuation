import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {TitleComponent, TooltipComponent} from 'echarts/components';
import {SankeyChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';
import {SECURITY_LIQUIDATION_SEQUENCE} from "../../lib/constants";

echarts.use([TitleComponent, TooltipComponent, SankeyChart, CanvasRenderer]);


// Define color mapping, Assign Colors to Nodes
const colorMapping = {
    'RP': '#2ca02c',
    'CP_RV': '#ff7f0e', // Assign a single color for CP_RV
    'CS': '#1f77b4',
    'CP_CS': '#1f77b4' // Same color as CS for CP_CS
};

// Function to sort by series priority
const seriesPriority = {
    'Series E': 1,
    'Series D': 2,
    'Series C': 3,
    'Series B': 4,
    'Series A': 5,
    'Founders': 6
};

const SankeyDiagram = ({equityStacks}) => {

    const equityStacksByFirmValues = equityStacks.map((equityStack) =>
        equityStack.map(item => ({
            ...item,
            name: `${item.seriesName} ${item.type==='CP_RV' ? 'CP->Redeem' : item.type==='CP_CS' ? 'CP->CS' : item.type}=${item.value} at firm value ${item.firmValue}`,
            securityLiquidationSequence: SECURITY_LIQUIDATION_SEQUENCE[item.type],
        }))
    );

    const nodes = [];
    const links = [];

// Populate nodes with additional attributes for sorting
    equityStacksByFirmValues.forEach((stack, firmIndex) => {
        stack.forEach(item => {
            nodes.push({
                name: item.name,
                firmValue: item.firmValue,
                type: item.type,
                seriesName: item.seriesName,
                securityLiquidationSequence: item.securityLiquidationSequence,
                itemStyle: {
                    color: colorMapping[item.type]
                }
            });
        });
    });

// Sort nodes by firm value, type priority, and series priority
    nodes.sort((a, b) => {
        // Sort by Firm Value
        if (a.firmValue !== b.firmValue) {
            return a.firmValue - b.firmValue;
        }
        // Sort by Security Type
        if (a.securityLiquidationSequence !== b.securityLiquidationSequence) {
            return a.securityLiquidationSequence - b.securityLiquidationSequence;
        }

        // Sort by Series
        return seriesPriority[a.seriesName] - seriesPriority[b.seriesName];
    });


// Populate links based on the sorted nodes
    equityStacksByFirmValues.forEach((stack, firmIndex) => {
        if (firmIndex > 0) {
            stack.forEach(item => {
                const prevItem = equityStacksByFirmValues[firmIndex - 1].find(prev => (prev.seriesName === item.seriesName)
                    && (prev.type === item.type || (prev.type === 'CP_RV' && item.type === 'CP_CS')));
                if (prevItem) {
                    links.push({
                        source: prevItem.name,
                        target: item.name,
                        value: 1 //item.value
                    });
                }
            });
        }
    });

    console.log('nodes', nodes)

    // Chart options
    const option = {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
        },
        series: [
            {
                type: 'sankey',
                data: nodes,
                links: links,
                emphasis: {
                    focus: 'adjacency'
                },
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                },
                layoutIterations: 0, // Disable automatic layout iterations
                nodeAlign: 'justify' // Justify nodes
            }
        ]
    };

    return (
        <ReactEcharts
            option={option}
            style={{ minHeight: '600px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
        />
    );
};

export default SankeyDiagram;