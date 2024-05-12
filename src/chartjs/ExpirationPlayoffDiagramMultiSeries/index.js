import {Card, Space} from "antd";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {getSegmentedLinesFromSeriesArray, addSeries, getConversionConditions, seriesHasCP} from "../../lib/series";
import {LimitedPartnership, PvGpvLpv} from "../../lib/line/pv-gpv-lpv";
import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import Milestone from "../../antd/Milestone";

export default function ExpirationPlayoffDiagramMultiSeries() {
    const seriesArray = []

    addSeries(seriesArray, 0,"Founders", 5, 0,0,0 );
    addSeries(seriesArray, 1,"Series A", 0, 5,5,0 );
    addSeries(seriesArray, 2,"Series B", 0, 5,20,0 );
    addSeries(seriesArray, 3,"Series C", 5, 0,0,15 );
    addSeries(seriesArray, 4,"Series D", 0, 5,30,0 );
    addSeries(seriesArray, 5,"Series E", 5, 0,0,15 );

    const {lines, seriesArray: seriesList} = getSegmentedLinesFromSeriesArray(seriesArray);

    const xs = []
    const ys = []
    const datasets = []
    const subtitleTexts = []
    lines.forEach((line, i) => {
        const [x, y] = line.plotPointsWithTail();
        xs.push(x)
        ys.push(y)
        datasets.push(
            {
                label: i,
                data: y,
                borderColor: ChartJSUtils.namedColor(i),
                backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(i), 0.9),
                borderWidth: 1,
                fill: 'origin',
                tension: 0,
                yAxisID: "y",
            }
        )
        subtitleTexts.push(seriesList[i].seriesName + ": Partial Valuation = " + callOptionsText(segmentedLineToOption(line)))
    })

    const x = xs[0]
    const yMax = Math.max(...(ys.flat()))

    const [x5, y5, k5] = lines[1].plotPoints()
    const pvGpvLpv5 = new PvGpvLpv(new LimitedPartnership(undefined, 20/100., 25/100.), 5, x5, y5, k5)

    // seriesList.forEach((series, i) => {
    //     if (seriesHasCP(series)){
    //         subtitleTexts.push(series.seriesName + ': CP Converts to CS when the firm value is more than ' + series.cpConversionFirmValue)
    //     } else {
    //         subtitleTexts.push(series.seriesName + ": don't have CP shares.")
    //     }
    // })


    return (
        <>
            <Milestone/>
            <Card>
                <ExpirationPayoffDiagram3
                    datasets={datasets}
                    labels={x}
                    subtitleTexts={subtitleTexts}
                    yMax={yMax}/>
            </Card>
            <Card>
                <ExpirationPayoffDiagramPvGpvLpv
                    pvGpvLpv={pvGpvLpv5}
                />
            </Card>

        </>
    )
}