import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import React from "react";
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

    csStack.forEach((cs, i) => {
        data.labels.push(cs.seriesName + ': ' + cs.type);
        data.datasets[0].data.push(cs.value);
        data.datasets[0].backgroundColor.push(ChartJSUtils.transparentize(ChartJSUtils.namedColor(i), 0.6));
    })

    const options = {
        responsive: false,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Common Stock Ownership %'
            },
            datalabels: {
                formatter: (value, context) => {
                    let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    let percentage = (value * 100 / sum).toFixed(2) + '%';
                    return percentage;
                },
                color: '#fff',
            }
        }
    }

    return (
        <Doughnut
            data={data}
            options={options}
            // specify plugins for individual chart components rather than globally registering them with ChartJS.register().
            plugins={[ChartDataLabels]}
        />
    )
}