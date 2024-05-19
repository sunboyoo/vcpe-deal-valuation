import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    SubTitle,
} from "chart.js";

import {Line} from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    SubTitle
)

export default function ExpirationPayoffDiagram3({labels, datasets,  subtitleTexts, yMax}){

    const data = {
        labels,
        datasets,
    }

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top"
            },
            title: {
                display: true,
                text: "Expiration Payoff Diagram",
            },
            subtitle: {
                display: true,
                text: subtitleTexts,
                position: "top",
                align: "center"
                //
                // padding: {
                //     bottom: 10
                // }
            },
            tooltip:{
                callbacks: {
                    // beforeTitle(tooltipItems) {
                    //
                    // }
                }
            }
        },
        maintainAspectRatio: true,
        scales: {
            y: {
                display: true,
                type: 'linear',
                min: 0,
                max: yMax,
                title: {display: true, text: "Payoff"},
                position: "left",
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    callback: function (value, index, values) {
                        return Number(value).toFixed(2); // Format the value to at most 2 decimal places
                    },
                }
            },
            x: {
                display: true,
                type: 'linear',
                min: 0,
                max: labels[labels.length-1],
                title: {display: true, text: "Firm Value at Exit"},
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    // Keep in mind that overriding ticks.callback means that you are responsible for all formatting of the label.
                    // Depending on your use case, you may want to call the default formatter and then modify its output.
                    // https://www.chartjs.org/docs/latest/axes/labelling.html
                    // This callback function formats the x-axis values
                    callback: function (value, index, values) {
                        return Number(value).toFixed(2); // Format the value to at most 2 decimal places
                    },
                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
    }

    return (<>
            <Line
                data={data}
                options={options}
                // plugins={[populateDataByLabelsFunction, arbitraryLine]}
            />
        </>
    )

}