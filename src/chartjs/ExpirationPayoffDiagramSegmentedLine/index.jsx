import React from "react";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";

export default function ExpirationPayoffDiagramSegmentedLine({segmentedLine, result = undefined}) {
    const [x, y, slopes] = segmentedLine.plotPointsWithTail()

    let subtitleText

    if (result) {
        subtitleText = "Payoff Schedule = " + callOptionsText(segmentedLineToOption(segmentedLine)) + " = " + result.toFixed(4)
    } else {
        subtitleText = "Payoff Schedule = " + callOptionsText(segmentedLineToOption(segmentedLine))
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