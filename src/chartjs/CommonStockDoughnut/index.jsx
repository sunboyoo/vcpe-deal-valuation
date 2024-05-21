import { Chart as ChartJS, ArcElement, Tooltip, Legend, } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Doughnut } from 'react-chartjs-2';
import React from "react";
import {SECURITY_TYPE_COLORS, SECURITY_TYPES} from "../../lib/constants";

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

    csStack.forEach((cs) => {
        data.labels.push(cs.seriesName + ': ' + (cs.type === SECURITY_TYPES.CP_CS ? 'CP->CS' : cs.type));
        data.datasets[0].data.push(cs.value);
        data.datasets[0].backgroundColor.push(SECURITY_TYPE_COLORS[cs.type]['backgroundColor']);
    })

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Common Stock Ownership Distribution'
            },
            datalabels: {
                formatter: (value, context) => {
                    let sum = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    let percentage = (value * 100 / sum).toFixed(2) + '%';
                    return percentage;
                },
                color: '#fff',
            }
        },
        width: 600, // Set your desired width
        height: 600, // Set your desired height
    }

    return (
        <div style={{ width: '300px', height: '300px' }}> {/* Set your desired width and height */}
            <Doughnut
            data={data}
            options={options}
            // specify plugins for individual chart components rather than globally registering them with ChartJS.register().
            plugins={[ChartDataLabels]}
            />
        </div>
    )
}