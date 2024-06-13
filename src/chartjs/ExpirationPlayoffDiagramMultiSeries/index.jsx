import {Card, Space} from "antd";
import React, {useState} from "react";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {addSeries, analyze} from "../../lib/series";
import {PvGpvLpv} from "../../lib/partial-valuation/pv-gpv-lpv";
import {LimitedPartnership} from "../../lib/partial-valuation/limited-partnership"

import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import Milestone from "../../antd/Milestone";
import CardList from "../../antd/CardList";
import Sankey from "../../echarts/Sankey";
import SankeyDiagramInstructions from "./sankey-desc";
import SeriesListDescription from "./series-list-desc";
import MilestoneInstruction from "./milestone-desc";
import ExpirationPayoffDiagramPvGpvLpvWithInput from "../ExpirationPayoffDiagramPvGpvLpvWithInput";
import {segmentedLineToOptionPortfolio} from "../../lib/converter/option-line-converter";

const initialSeriesValue = [{
    id: 0,
    seriesName: 'Founders',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 0,
}, {
    id: 1,
    seriesName: 'Series A',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 5,
    rpRv: 0,
}, {
    id: 2,
    seriesName: 'Series B',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 20,
    rpRv: 0,
}, {
    id: 3,
    seriesName: 'Series C',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 15,
}, {
    id: 4,
    seriesName: 'Series D',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 30,
    rpRv: 0,
}, {
    id: 5,
    seriesName: 'Series E',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 15,
},
]

const initialInvests = [0, 5, 10, 15, 30, 15]

export default function ExpirationPlayoffDiagramMultiSeries() {
    const [seriesValue, setSeriesValue] = useState(initialSeriesValue);

    const seriesArray = [];
    seriesValue.forEach((item) => {
        const {id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv} = item;
        addSeries(seriesArray, id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv);
    });

    const {lines, equityStacks, csStacks, conversionSteps,  processedSeriesArray} = analyze(seriesArray);

    const xs = [];
    const ys = [];
    const datasets = [];
    const subtitleTexts = [];
    lines.forEach((line, i) => {
        const [x, y] = line.plotPointsWithTail();
        xs.push(x);
        ys.push(y);
        datasets.push({
            label: seriesArray[i].seriesName,
            data: y,
            borderColor: ChartJSUtils.namedColor(i),
            backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(i), 0.9),
            borderWidth: 1,
            fill: 'origin',
            tension: 0,
            yAxisID: "y",
        });
        subtitleTexts.push(processedSeriesArray[i].seriesName + ": Partial Valuation = " + segmentedLineToOptionPortfolio(line).text());
    });

    const x = xs[0];
    const yMax = Math.max(...(ys.flat()));

    const labels = x;

    const pvGpvLpvArray = [];
    if (Array.isArray(lines) && lines.length > 0) {
        lines.forEach((line, i) => {
            // Series.js already generated lines with tails. so here no need to plotPoints with tails.
            const [x, y, k] = line.plotPoints();
            pvGpvLpvArray.push(new PvGpvLpv(new LimitedPartnership(undefined, 20 / 100., 25 / 100.), 5, x, y, k))
        })
    }

    return (
        <>
            <Space direction={'vertical'}>
                <Card>
                    <h1>The Equity Securities held by Founders and Series Investors</h1>
                    <CardList
                        initialValue={seriesValue}
                        onChange={(newValue) => {
                            setSeriesValue([...newValue]);
                        }}
                    ></CardList>
                </Card>
                <Card>
                    <SeriesListDescription/>
                </Card>

                {seriesValue && seriesValue.length > 0 && equityStacks && equityStacks.length > 0 && (
                    <>
                        <div style={{margin: '100px'}}/>

                        <Card>
                            <h2>Convertible Preferred (CP) Conversion Sankey Diagram</h2>
                            <Sankey equityStacks={equityStacks}/>
                        </Card>
                        <Card>
                            <SankeyDiagramInstructions/>
                        </Card>

                        <div style={{margin: '10px'}}/>

                        <Card>
                            <Milestone
                                conversionSteps={conversionSteps}
                                csStacks={csStacks}
                            />
                        </Card>
                        <Card>
                            <MilestoneInstruction/>
                        </Card>

                    </>
                )
                }

                {seriesValue && seriesValue.length > 0 && (
                    <>
                        <div style={{margin: '10px'}}/>

                        <Card>
                            <h2>Expiration Payoff Diagram for All Series</h2>
                            <ExpirationPayoffDiagram3
                                datasets={datasets}
                                labels={labels}
                                subtitleTexts={subtitleTexts}
                                yMax={yMax}
                            />
                        </Card>
                    </>
                )}

                {seriesValue && seriesValue.length > 0 &&
                    pvGpvLpvArray.map((pvGpvLpv, i) => (
                        i === 0 ?
                            <div key={i}>
                                <div style={{height: '10px'}}/>
                                <Card>
                                    <h1>{processedSeriesArray[i].seriesName}</h1>
                                    <ExpirationPayoffDiagramPvGpvLpv
                                        pvGpvLpv={pvGpvLpv}
                                        showCombinedDiagram={false}
                                        showIndividualDiagrams={true}
                                        showPv={true}
                                        showGpv={false}
                                        showLpv={false}
                                        showLpc={false}
                                    />
                                </Card>
                            </div> :
                            <div key={i}>
                                <div style={{height: '10px'}}/>
                                <Card>
                                    <h1>{processedSeriesArray[i].seriesName}</h1>
                                    <ExpirationPayoffDiagramPvGpvLpvWithInput
                                        xs={lines[i].plotPoints()[0]}
                                        ys={lines[i].plotPoints()[1]}
                                        slopes={lines[i].plotPoints()[2]}
                                        invDefault={Number.isFinite(initialInvests[i]) ? initialInvests[i] : 1}
                                    />
                                </Card>
                            </div>

                    ))
                }
            </Space>
        </>
    )
}