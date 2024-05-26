import React from "react";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, optionArrayToSegmentedLine, segmentedLineToOption} from "../../lib/line/line-option-converter";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";

export default function ExpirationPayoffDiagramOptions({options, result = undefined}) {
    const [x, y, slopes] = optionArrayToSegmentedLine(options).plotPointsWithTail()

    let subtitleText

    if (result) {
        subtitleText = "Payoff Schedule = " + callOptionsText(options) + " = " + result.toFixed(4)
    } else {
        subtitleText = "Payoff Schedule = " + callOptionsText(options)
    }

    const dataset = {
        label: 'Payoff Schedule',
        data: y,
        borderColor: ChartJSUtils.CHART_COLORS.red,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.red, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }


    const yMax = Math.max(...y)

    return (
        <>
            <ExpirationPayoffDiagram3
                datasets={[dataset]}
                labels={x}
                subtitleTexts={[subtitleText]}
                yMax={yMax}/>
        </>
    )
}