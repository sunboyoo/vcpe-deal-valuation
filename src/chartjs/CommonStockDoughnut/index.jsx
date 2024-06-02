import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import React from "react";
import {SECURITY_TYPES} from "../../lib/constants";
import * as ChartJSUtils from "../ExpirationPayoffDiagram/chartjs-utils";

//  the best practice is to specify plugins for individual chart components rather than
//  globally registering them with ChartJS.register().

// This is globally registering
ChartJS.register(ArcElement, Tooltip, Legend);

export default function App({csStack}){

    const data = {
        labels: [],
        datasets: [
            {
                label: 'Common Stock',
                data: [],
                backgroundColor: [],
                borderWidth: 1,
            },
        ],
    };

    csStack.forEach((cs, index) => {
        data.labels.push(cs.seriesName + '\n' + (cs.type === SECURITY_TYPES.CP_CS ? 'CP->CS' : cs.type));
        data.datasets[0].data.push(cs.value);
        data.datasets[0].backgroundColor.push(ChartJSUtils.transparentize(ChartJSUtils.namedColor(index), 0.4));
    })

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false, // Turn off the legend
                // position: 'center',
                // align: 'start',
                // labels: {
                //     boxWidth: 50,
                //     // boxHeight: 20,
                //     // padding: 20,
                //     // usePointStyle: true,
                //     // pointStyle: 'circle',
                // }
            },
            title: {
                display: true,
                text: 'Common Stock Ownership Distribution'
            },
            datalabels: {
                formatter: (value, context, i) => {
                    let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    let percentage = (value * 100 / sum).toFixed(2) + '%';
                    let label = context.chart.data.labels[context.dataIndex];
                    return `${label}\n${percentage}`;
                },
                color: '#fff',
                font: {
                    size: 8,
                }
            }
        },
    }

    return (
        <div style={{ width: '300px', height: '300px', textAlign:'center' }}> {/* Set your desired width and height */}
            <Doughnut
            data={data}
            options={options}
            // specify plugins for individual chart components rather than globally registering them with ChartJS.register().
            plugins={[ChartDataLabels]}
            />
        </div>
    )
}