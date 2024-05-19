import React from 'react';
import ReactEcharts from 'echarts-for-react';
import * as echarts from 'echarts/core';
import {TitleComponent, TooltipComponent} from 'echarts/components';
import {SankeyChart} from 'echarts/charts';
import {CanvasRenderer} from 'echarts/renderers';


echarts.use([TitleComponent, TooltipComponent, SankeyChart, CanvasRenderer]);


const equityStacks = [
    [
        {type: 'RP', value: 15, seriesName: 'Series E'},
        {type: 'CP_RV', value: 30, seriesName: 'Series D'},
        {type: 'RP', value: 15, seriesName: 'Series C'},
        {type: 'CP_RV', value: 20, seriesName: 'Series B'},
        {type: 'CP_RV', value: 5, seriesName: 'Series A'},
        {type: 'CS', value: 5, seriesName: 'Series E'},
        {type: 'CS', value: 5, seriesName: 'Series C'},
        {type: 'CS', value: 5, seriesName: 'Founders'}
    ],
    [
        {type: 'RP', value: 15, seriesName: 'Series E'},
        {type: 'CP_RV', value: 30, seriesName: 'Series D'},
        {type: 'RP', value: 15, seriesName: 'Series C'},
        {type: 'CP_RV', value: 20, seriesName: 'Series B'},
        {type: 'CS', value: 5, seriesName: 'Series E'},
        {type: 'CS', value: 5, seriesName: 'Series C'},
        {type: 'CP_CS', value: 5, seriesName: 'Series A'},
        {type: 'CS', value: 5, seriesName: 'Founders'}
    ],
    [
        {type: 'RP', value: 15, seriesName: 'Series E'},
        {type: 'CP_RV', value: 30, seriesName: 'Series D'},
        {type: 'RP', value: 15, seriesName: 'Series C'},
        {type: 'CS', value: 5, seriesName: 'Series E'},
        {type: 'CS', value: 5, seriesName: 'Series C'},
        {type: 'CP_CS', value: 5, seriesName: 'Series B'},
        {type: 'CP_CS', value: 5, seriesName: 'Series A'},
        {type: 'CS', value: 5, seriesName: 'Founders'}
    ],
    [
        {type: 'RP', value: 15, seriesName: 'Series E'},
        {type: 'RP', value: 15, seriesName: 'Series C'},
        {type: 'CS', value: 5, seriesName: 'Series E'},
        {type: 'CP_CS', value: 5, seriesName: 'Series D'},
        {type: 'CS', value: 5, seriesName: 'Series C'},
        {type: 'CP_CS', value: 5, seriesName: 'Series B'},
        {type: 'CP_CS', value: 5, seriesName: 'Series A'},
        {type: 'CS', value: 5, seriesName: 'Founders'}
    ]
];

const equityStacksByFirmValues = [
    [
        { type: 'RP', value: 15, seriesName: 'Series E', firmValue: 0, name: 'Series E at Firm Value [0]' },
        { type: 'CP_RV', value: 30, seriesName: 'Series D', firmValue: 0, name: 'Series D at Firm Value [0]' },
        { type: 'RP', value: 15, seriesName: 'Series C', firmValue: 0, name: 'Series C at Firm Value [0]' },
        { type: 'CP_RV', value: 20, seriesName: 'Series B', firmValue: 0, name: 'Series B at Firm Value [0]' },
        { type: 'CP_RV', value: 5, seriesName: 'Series A', firmValue: 0, name: 'Series A at Firm Value [0]' },
        { type: 'CS', value: 5, seriesName: 'Series E', firmValue: 0, name: 'Series E at Firm Value [0]' },
        { type: 'CS', value: 5, seriesName: 'Series C', firmValue: 0, name: 'Series C at Firm Value [0]' },
        { type: 'CS', value: 5, seriesName: 'Founders', firmValue: 0, name: 'Founders at Firm Value [0]' }
    ],
    [
        { type: 'RP', value: 15, seriesName: 'Series E', firmValue: 1, name: 'Series E at Firm Value [1]' },
        { type: 'CP_RV', value: 30, seriesName: 'Series D', firmValue: 1, name: 'Series D at Firm Value [1]' },
        { type: 'RP', value: 15, seriesName: 'Series C', firmValue: 1, name: 'Series C at Firm Value [1]' },
        { type: 'CP_RV', value: 20, seriesName: 'Series B', firmValue: 1, name: 'Series B at Firm Value [1]' },
        { type: 'CS', value: 5, seriesName: 'Series E', firmValue: 1, name: 'Series E at Firm Value [1]' },
        { type: 'CS', value: 5, seriesName: 'Series C', firmValue: 1, name: 'Series C at Firm Value [1]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series A', firmValue: 1, name: 'Series A at Firm Value [1]' },
        { type: 'CS', value: 5, seriesName: 'Founders', firmValue: 1, name: 'Founders at Firm Value [1]' }
    ],
    [
        { type: 'RP', value: 15, seriesName: 'Series E', firmValue: 2, name: 'Series E at Firm Value [2]' },
        { type: 'CP_RV', value: 30, seriesName: 'Series D', firmValue: 2, name: 'Series D at Firm Value [2]' },
        { type: 'RP', value: 15, seriesName: 'Series C', firmValue: 2, name: 'Series C at Firm Value [2]' },
        { type: 'CS', value: 5, seriesName: 'Series E', firmValue: 2, name: 'Series E at Firm Value [2]' },
        { type: 'CS', value: 5, seriesName: 'Series C', firmValue: 2, name: 'Series C at Firm Value [2]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series B', firmValue: 2, name: 'Series B at Firm Value [2]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series A', firmValue: 2, name: 'Series A at Firm Value [2]' },
        { type: 'CS', value: 5, seriesName: 'Founders', firmValue: 2, name: 'Founders at Firm Value [2]' }
    ],
    [
        { type: 'RP', value: 15, seriesName: 'Series E', firmValue: 3, name: 'Series E at Firm Value [3]' },
        { type: 'RP', value: 15, seriesName: 'Series C', firmValue: 3, name: 'Series C at Firm Value [3]' },
        { type: 'CS', value: 5, seriesName: 'Series E', firmValue: 3, name: 'Series E at Firm Value [3]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series D', firmValue: 3, name: 'Series D at Firm Value [3]' },
        { type: 'CS', value: 5, seriesName: 'Series C', firmValue: 3, name: 'Series C at Firm Value [3]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series B', firmValue: 3, name: 'Series B at Firm Value [3]' },
        { type: 'CP_CS', value: 5, seriesName: 'Series A', firmValue: 3, name: 'Series A at Firm Value [3]' },
        { type: 'CS', value: 5, seriesName: 'Founders', firmValue: 3, name: 'Founders at Firm Value [3]' }
    ]
];

const nodes = [];
const links = [];

// Define color mapping, Assign Colors to Nodes
const colorMapping = {
    'RP': '#2ca02c',
    'CP_RV': '#ff7f0e', // Assign a single color for CP_RV
    'CS': '#1f77b4',
    'CP_CS': '#1f77b4' // Same color as CS for CP_CS
};

// Populate nodes and links based on equityStacksByFirmValues
equityStacksByFirmValues.forEach((stack, firmIndex) => {
    stack.forEach(item => {
        nodes.push({
            name: `${item.seriesName} ${item.type} at Firm Value [${firmIndex}]`,
            itemStyle: {
                color: colorMapping[item.type]
            }
        });
        if (firmIndex > 0) {
            const prevItem = equityStacksByFirmValues[firmIndex - 1].find(prev => (prev.seriesName === item.seriesName)
                && (prev.type === item.type || (prev.type === 'CP_RV' && item.type === 'CP_CS')));
            if (prevItem) {
                if (prevItem.type === item.type ){
                    links.push({
                        source: `${prevItem.seriesName} ${prevItem.type} at Firm Value [${firmIndex - 1}]`,
                        target: `${item.seriesName} ${item.type} at Firm Value [${firmIndex}]`,
                        value: item.value
                    });
                } else if (prevItem.type === 'CP_RV' && item.type === 'CP_CS'){
                    // Split the link into multiple smaller links to simulate the effect
                    // Create multiple links with varying offsets
                    const numLinks = 5; // Number of smaller links to create
                    const linkValue = item.value / numLinks;

                    for (let i = 0; i < numLinks; i++) {
                        links.push({
                            source: `${prevItem.seriesName} ${prevItem.type} at Firm Value [${firmIndex - 1}]`,
                            target: `${item.seriesName} ${item.type} at Firm Value [${firmIndex}]`,
                            value: linkValue,
                            lineStyle: {
                                width: linkValue, // Optional: Adjust based on your visual needs
                                curveness: 0.5 - 0.1 * i // Adjust curveness to spread links
                            },
                            emphasis: {
                                lineStyle: {
                                    color: colorMapping[item.type] // Optional: Highlight color on hover
                                }
                            }
                        });
                    }
                }
            }
        }
    });
});


const SankeyDiagram = () => {
    // Chart options
    const option = {
        title: {
            text: 'Sankey Diagram'
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
                }
            }
        ]
    };

    return (
        <ReactEcharts
            option={option}
            style={{height: '800px', width: '100%'}}
            opts={{renderer: 'canvas'}}
        />
    );
};

export default SankeyDiagram;
