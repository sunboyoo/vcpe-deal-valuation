import {Card, Space} from "antd";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {addSeries, analyze} from "../../lib/series";
import {LimitedPartnership, PvGpvLpv} from "../../lib/line/pv-gpv-lpv";
import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import Milestone from "../../antd/Milestone";
import {useState} from "react";

export default function ExpirationPlayoffDiagramMultiSeries() {
    const seriesArray = []

    addSeries(seriesArray, 0,"Founders", 5, 0,0,0 );
    addSeries(seriesArray, 1,"Series A", 0, 5,5,0 );
    addSeries(seriesArray, 2,"Series B", 0, 5,20,0 );
    addSeries(seriesArray, 3,"Series C", 5, 0,0,15 );
    addSeries(seriesArray, 4,"Series D", 0, 5,30,0 );
    addSeries(seriesArray, 5,"Series E", 5, 0,0,15 );

    const {lines, equityStacks, csStacks, conversionSteps, processedSeriesArray} = analyze(seriesArray);

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
        subtitleTexts.push(processedSeriesArray[i].seriesName + ": Partial Valuation = " + callOptionsText(segmentedLineToOption(line)))
    })

    const x = xs[0]
    const yMax = Math.max(...(ys.flat()))

    const [x5, y5, k5] = lines[1].plotPoints()
    const pvGpvLpv5 = new PvGpvLpv(new LimitedPartnership(undefined, 20/100., 25/100.), 5, x5, y5, k5)

    return (
        <>
            <Space direction="vertical">
                <Card title="The Conversions of Convertible Preferred Shares">
                    <Milestone
                        conversionSteps={conversionSteps}
                        equityStacks={equityStacks}
                        csStacks={csStacks}/>
                </Card>
                <Card>
                    <ExpirationPayoffDiagram3
                        datasets={datasets}
                        labels={x}
                        subtitleTexts={subtitleTexts}
                        yMax={yMax}/>
                </Card>
                <ExpirationPayoffDiagramPvGpvLpv
                    pvGpvLpv={pvGpvLpv5}
                />
            </Space>
        </>
    )
}