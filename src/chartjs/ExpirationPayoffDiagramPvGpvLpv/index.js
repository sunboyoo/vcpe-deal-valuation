import {Card, Space} from "antd";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";

export function ExpirationPayoffDiagramPvGpvLpv({pvGpvLpv, result}){
    const {pv, gpv, lpv, lpc} = pvGpvLpv
    const [xPv, yPv, sPv] = pv.plotPointsWithLPCAndTail(lpc)
    const [xGpv, yGpv, sGpv] = gpv.plotPointsWithTail()
    const [xLpv, yLpv, sLpv] = lpv.plotPointsWithTail()
    const subtitleTextPv  =  "Partial Valuation = " + callOptionsText(segmentedLineToOption(pv)) + " = " + result.PV.toFixed(2)
    const subtitleTextGpv = "GP Carry Valuation = " + callOptionsText(segmentedLineToOption(gpv)) + " = " + result.GPCV.toFixed(2)
    const subtitleTextLpv = "LP Valuation = " +  callOptionsText(segmentedLineToOption(lpv)) + " = " + result.LPV.toFixed(2)
    const subtitleTextLpc = "LP Cost = " + lpc

    const datasetPv = {
        label: 'Partial Valuation',
        data: yPv,
        borderColor: ChartJSUtils.CHART_COLORS.green,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.green, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y",
    }
    const datasetGpv = {
        label: 'GP Carry Valuation',
        data: yGpv,
        borderColor: ChartJSUtils.CHART_COLORS.red,
        backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.CHART_COLORS.red, 0.9),
        borderWidth: 1,
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }

    const datasetLpv = {
        label: 'LP Valuation',
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
        borderDash: [3,3],
        fill: 'origin',
        tension: 0,
        yAxisID: "y"
    }

    const yMax = Math.max(...yPv)

    return (
        <>
            <Card>
                <ExpirationPayoffDiagram3
                    datasets={[datasetPv, datasetLpc]}
                    labels={xPv}
                    subtitleTexts={[subtitleTextPv, subtitleTextLpc]}
                    yMax={yMax}/>
            </Card>
            <Space><p/></Space>
            <Card>
                <ExpirationPayoffDiagram3
                    datasets={[datasetGpv, datasetLpc]}
                    labels={xGpv}
                    subtitleTexts={[subtitleTextGpv, subtitleTextLpc]}
                    yMax={yMax}/>
            </Card>
            <Space><p/></Space>
            <Card>
                <ExpirationPayoffDiagram3
                    datasets={[datasetLpv, datasetLpc]}
                    labels={xLpv}
                    subtitleTexts={[subtitleTextLpv, subtitleTextLpc]}
                    yMax={yMax}/>
            </Card>
            <Space><p/></Space>
            <Card>
                <ExpirationPayoffDiagram3
                    datasets={[datasetPv, datasetGpv, datasetLpv, datasetLpc]}
                    labels={xPv}
                    subtitleTexts={[subtitleTextPv, subtitleTextGpv, subtitleTextLpv, subtitleTextLpc]}
                    yMax={yMax}/>
            </Card>
        </>
    )
}