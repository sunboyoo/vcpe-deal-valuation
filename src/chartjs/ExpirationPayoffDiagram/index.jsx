
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
import {populateDataByLabelsFunction} from "./populate-data-by-labels-function";
import {
    allKinkXs,
    callOptionsSubtraction, callOptionsText, callOptionsToKinkSlopes,
    kinkSlopesToCallOptions, kinkSlopesToLinearFunction
} from "../../lib/kink-slope-option-function";
import * as ChartJSUtils from "./chartjs-utils";
import {ctxDrawCoordinatesLines} from "./ctx-draw-coordinates-lines";

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

// not working. need to find out the exact cutoff point
// const isZero = (ctx, valueTrue, valueFalse) => ctx.p0.parsed.y === 0 && ctx.p1.parsed.y === 0 ? valueTrue : valueFalse;

export default function ExpirationPayoffDiagram({kinkSlopesPV, kinkSlopesGPCV, LPC}){
    const callOptionsPV = kinkSlopesToCallOptions(kinkSlopesPV)
    const callOptionsGPCV = kinkSlopesToCallOptions(kinkSlopesGPCV)
    const callOptionsLPV = callOptionsSubtraction(callOptionsPV, callOptionsGPCV)
    const kinkSlopesLPV = callOptionsToKinkSlopes(callOptionsLPV)
    const fPV = kinkSlopesToLinearFunction(kinkSlopesPV)
    const fGPCV = kinkSlopesToLinearFunction(kinkSlopesGPCV)
    const fLPV = kinkSlopesToLinearFunction(kinkSlopesLPV)

    const allXs = allKinkXs(kinkSlopesPV, kinkSlopesGPCV, kinkSlopesLPV)
    const xTicks = [...allXs, allXs[allXs.length - 1] * 2]

    const data = {
        labels: xTicks,
        datasets: [
            {
                label: 'Partial Valuation',
                func: fPV,
                data: [],
                borderColor: ChartJSUtils.CHART_COLORS.orange,
                backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.orange, 0.9),
                fill: 'origin',
                tension: 0,
                yAxisID: "y",
            },
            {
                label: 'LP Valuation',
                func: fLPV,
                data: [],
                borderColor: ChartJSUtils.CHART_COLORS.green,
                backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.green, 0.9),
                fill: 'origin',
                tension: 0,
                yAxisID: "y"
            },
            {
                label: 'GP Carry Valuation',
                func: fGPCV,
                data: [],
                borderColor: ChartJSUtils.CHART_COLORS.red,
                backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.red, 0.9),
                fill: 'origin',
                tension: 0,
                yAxisID: "y"
            },
            {
                label: 'LP Cost',
                func: x => LPC,
                data: [],
                borderColor: ChartJSUtils.CHART_COLORS.grey,
                backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.grey, 0.6),
                borderWidth: 0,
                borderDash: [3,3],
                fill: 'origin',
                tension: 0,
                yAxisID: "y"
            }
        ]
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
                text: [
                    "Partial Valuation = " + callOptionsText(callOptionsPV),
                    "LP Valuation = " + callOptionsText(callOptionsLPV),
                    "GP Carry Valuation = " + callOptionsText(callOptionsGPCV)
                ],
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
                max: fPV(xTicks[xTicks.length-1]),
                title: {display: true, text: "Payoff"},
                position: "left",
                grid: {
                    drawOnChartArea: false
                },
                ticks: {

                }
            },
            x: {
                display: true,
                type: 'linear',
                min: 0,
                max: xTicks[xTicks.length-1],
                title: {display: true, text: "Firm Value at Exit"},
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    // Keep in mind that overriding ticks.callback means that you are responsible for all formatting of the label.
                    // Depending on your use case, you may want to call the default formatter and then modify its output.
                    // https://www.chartjs.org/docs/latest/axes/labelling.html

                }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
    }

    const arbitraryLine = {
        id: 'arbitraryLine',
        beforeDatasetsDraw: (chart, args, options) => {
            const {ctx, scales: {x,y}} = chart;

            for (let i=0; i<kinkSlopesPV.length; i++){
                const xKink = kinkSlopesPV[i].x
                const yKink = fPV(xKink)
                ctxDrawCoordinatesLines(ctx, x, y, xKink, yKink)
            }
            for (let i=0; i<kinkSlopesLPV.length; i++){
                const xKink = kinkSlopesLPV[i].x
                const yKink = fLPV(xKink)
                ctxDrawCoordinatesLines(ctx, x, y, xKink, yKink)
            }
            for (let i=0; i<kinkSlopesGPCV.length; i++){
                const xKink = kinkSlopesGPCV[i].x
                const yKink = fGPCV(xKink)
                ctxDrawCoordinatesLines(ctx, x, y, xKink, yKink)
            }
        }
    };

    return (<>
            <Line
                data={data}
                options={options}
                plugins={[populateDataByLabelsFunction, arbitraryLine]}
            />
        </>
    )

}