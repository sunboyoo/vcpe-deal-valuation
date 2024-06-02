import React from "react";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {segmentedLineToOptionPortfolio} from "../../lib/converter/option-line-converter";
import {Divider} from "antd";

export function ExpirationPayoffDiagramPvGpvLpv({
                                                    pvGpvLpv,
                                                    result = undefined,
                                                    showCombinedDiagram = true,
                                                    showIndividualDiagrams = false,
                                                    showPv = true,
                                                    showGpv = true,
                                                    showLpv = true,
                                                    showLpc = true,
                                                }) {
    const {pv, gpv, lpv, lpc} = pvGpvLpv
    const [xPv, yPv, sPv] = pv.plotPointsWithLPCAndTail(lpc)
    const [xGpv, yGpv, sGpv] = gpv.plotPointsWithTail()
    const [xLpv, yLpv, sLpv] = lpv.plotPointsWithTail()

    let subtitleTextPv
    let subtitleTextGpv=''
    let subtitleTextLpv=''
    const subtitleTextLpc = "LP Cost = " + lpc

    if (result) {
        subtitleTextPv = "PV = " + segmentedLineToOptionPortfolio(pv).text() + " = " + result.PV.toFixed(4)
        subtitleTextGpv = "GPV = " + segmentedLineToOptionPortfolio(gpv).text() + " = " + result.GPCV.toFixed(4)
        subtitleTextLpv = "LPV = " + segmentedLineToOptionPortfolio(lpv).text() + " = " + result.LPV.toFixed(4)
    } else {
        subtitleTextPv = "Partial Valuation = " + segmentedLineToOptionPortfolio(pv).text()
        subtitleTextGpv = "GP Carry Valuation = " + segmentedLineToOptionPortfolio(gpv).text()
        subtitleTextLpv = "LP Valuation = " + segmentedLineToOptionPortfolio(lpv).text()
    }

    const datasetPv = {
        label: 'PV',
        data: yPv,
        borderColor: ChartJSUtils.CHART_COLORS.green,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.green, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y",
    }
    const datasetGpv = {
        label: 'GPV',
        data: yGpv,
        borderColor: ChartJSUtils.CHART_COLORS.red,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.red, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }

    const datasetLpv = {
        label: 'LPV',
        data: yLpv,
        borderColor: ChartJSUtils.CHART_COLORS.orange,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.orange, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }

    const datasetLpc = {
        label: 'LP Cost',
        data: Array.from({length: xPv.length}, () => lpc),
        borderColor: ChartJSUtils.CHART_COLORS.grey,
        backgroundColor: "transparent",
        borderWidth: 1,
        borderDash: [3, 3],
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }

    const yMax = Math.max(...yPv)

    return (
        <>
            {showCombinedDiagram &&
                <>
                    <ExpirationPayoffDiagram3
                        datasets={[datasetPv, datasetGpv, datasetLpv, datasetLpc]}
                        labels={xGpv}
                        subtitleTexts={[subtitleTextPv, subtitleTextGpv, subtitleTextLpv, subtitleTextLpc]}
                        yMax={yMax}/>
                    <div style={{height: '10px'}}/>
                </>
            }

            {showPv && showIndividualDiagrams &&
                <>
                    <Divider/>
                    <div style={{height: '10px'}}/>
                    <ExpirationPayoffDiagram3
                        datasets={showLpc ? [datasetPv, datasetLpc] : [datasetPv]}
                        labels={xPv}
                        subtitleTexts={showLpc ? [subtitleTextPv, subtitleTextLpc] : [subtitleTextPv]}
                        yMax={yMax}/>
                    <div style={{height: '10px'}}/>
                </>
            }


            {showLpv && showIndividualDiagrams &&
                <>
                    <Divider/>
                    <div style={{height: '10px'}}/>
                    <ExpirationPayoffDiagram3
                        datasets={[datasetLpv, datasetLpc]}
                        labels={xLpv}
                        subtitleTexts={[subtitleTextLpv, subtitleTextLpc]}
                        yMax={yMax}/>
                    <div style={{height: '10px'}}/>
                </>
            }

            {showGpv && showIndividualDiagrams &&
                <>
                    <Divider/>

                    <div style={{height: '10px'}}/>
                    <ExpirationPayoffDiagram3
                        datasets={[datasetGpv, datasetLpc]}
                        labels={xGpv}
                        subtitleTexts={[subtitleTextGpv, subtitleTextLpc]}
                        yMax={yMax}/>
                    <div style={{height: '10px'}}/>
                </>
            }
        </>
    )
}