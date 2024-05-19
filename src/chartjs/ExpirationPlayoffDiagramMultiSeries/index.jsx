import {Card, Space} from "antd";
import React from "react";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {addSeries, analyze} from "../../lib/series";
import {LimitedPartnership, PvGpvLpv} from "../../lib/line/pv-gpv-lpv";
import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import Milestone from "../../antd/Milestone";
import {useState, useEffect} from "react";
import CardList from "../../antd/CardList";
import {SECURITY_TYPE_TAGS} from "../../lib/constants";
import Sankey from "../../echarts/Sankey";
import SankeyDiagramInstructions from "./sankey-desc";
import SeriesListDescription from "./series-list-desc";


const initialSeriesValue = [{
    id: 0,
    seriesName: 'Founders',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 0,
},{
    id: 1,
    seriesName: 'Series A',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 5,
    rpRv: 0,
},{
    id: 2,
    seriesName: 'Series B',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 20,
    rpRv: 0,
},{
    id: 3,
    seriesName: 'Series C',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 15,
},{
    id: 4,
    seriesName: 'Series D',
    cs: 0,
    cpConvertibleCs: 5,
    cpOptionalValue: 30,
    rpRv: 0,
},{
    id: 5,
    seriesName: 'Series E',
    cs: 5,
    cpConvertibleCs: 0,
    cpOptionalValue: 0,
    rpRv: 15,
},

]

export default function ExpirationPlayoffDiagramMultiSeries() {
    const [seriesValue, setSeriesValue] = useState(initialSeriesValue);
    const [datasets, setDatasets] = useState([]);
    const [subtitleTexts, setSubtitleTexts] = useState([]);
    const [labels, setLabels] = useState([]);
    const [yMax, setYMax] = useState(0);
    const [conversionSteps, setConversionSteps] = useState([]);
    const [equityStacks, setEquityStacks] = useState([]);
    const [csStacks, setCsStacks] = useState([]);
    const [pvGpvLpv, setPvGpvLpv] = useState()

    useEffect(() => {
        if (seriesValue.length > 0) {
            const seriesArray = [];
            seriesValue.forEach((item) => {
                const { id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv } = item;
                addSeries(seriesArray, id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv);
            });

            const { lines, equityStacks, csStacks, conversionSteps, processedSeriesArray } = analyze(seriesArray);

            const xs = [];
            const ys = [];
            const newDatasets = [];
            const newSubtitleTexts = [];
            lines.forEach((line, i) => {
                const [x, y] = line.plotPointsWithTail();
                xs.push(x);
                ys.push(y);
                newDatasets.push({
                    label: i,
                    data: y,
                    borderColor: ChartJSUtils.namedColor(i),
                    backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(i), 0.9),
                    borderWidth: 1,
                    fill: 'origin',
                    tension: 0,
                    yAxisID: "y",
                });
                newSubtitleTexts.push(processedSeriesArray[i].seriesName + ": Partial Valuation = " + callOptionsText(segmentedLineToOption(line)));
            });

            const x = xs[0];
            const yMax = Math.max(...(ys.flat()));

            setDatasets(newDatasets);
            setSubtitleTexts(newSubtitleTexts);
            setLabels(x);
            setYMax(yMax);
            setConversionSteps(conversionSteps);
            setEquityStacks(equityStacks);
            setCsStacks(csStacks);


            if (lines.length > 0){
                const [x5, y5, k5] = lines[lines.length-1].plotPoints()
                setPvGpvLpv(new PvGpvLpv(new LimitedPartnership(undefined, 20/100., 25/100.), 5, x5, y5, k5))
            }
        }
    }, [seriesValue]);


    return (
        <>
            <Space direction="vertical">

                <Card>
                    <h1>The Equity Securities held by Founders and Series Investors</h1>
                    <CardList
                        initialValue={seriesValue}
                        onChange={(newValue) => {
                            console.log('onChange', newValue);
                            setSeriesValue([...newValue]);
                        }}
                    ></CardList>
                    <SeriesListDescription />
                </Card>


                <Card title='The Conversions of Convertible Preferred (CP)'>
                    <Sankey equityStacks={equityStacks}/>
                    <SankeyDiagramInstructions/>
                </Card>

                {seriesValue && seriesValue.length > 0 && (
                    <Card title="The Conversions of Convertible Preferred (CP)">
                        <Milestone
                            conversionSteps={conversionSteps}
                            equityStacks={equityStacks}
                            csStacks={csStacks}
                        />
                    </Card>
                )}
                {seriesValue && seriesValue.length > 0 && (
                    <Card>
                        <ExpirationPayoffDiagram3
                            datasets={datasets}
                            labels={labels}
                            subtitleTexts={subtitleTexts}
                            yMax={yMax}
                        />
                    </Card>
                )}
                {pvGpvLpv && (
                    <ExpirationPayoffDiagramPvGpvLpv
                        pvGpvLpv={pvGpvLpv}
                    />
                )}
            </Space>
        </>
    )
}