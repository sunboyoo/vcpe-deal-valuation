import {Card, Space} from "antd";
import ExpirationPayoffDiagram3 from "../ExpirationPayoffDiagram3";
import {addSeries, analyze} from "../../lib/series";
import {LimitedPartnership, PvGpvLpv} from "../../lib/line/pv-gpv-lpv";
import {ExpirationPayoffDiagramPvGpvLpv} from "../ExpirationPayoffDiagramPvGpvLpv";
import * as ChartJSUtils from "../ExpirationPayoffDiagram3/chartjs-utils";
import {callOptionsText, segmentedLineToOption} from "../../lib/line/line-option-converter";
import Milestone from "../../antd/Milestone";
import {useState, useEffect} from "react";
import CardList from "../../antd/CardList";

export default function ExpirationPlayoffDiagramMultiSeries() {
    const [seriesValue, setSeriesValue] = useState([]);
    const [datasets, setDatasets] = useState([]);
    const [subtitleTexts, setSubtitleTexts] = useState([]);
    const [labels, setLabels] = useState([]);
    const [yMax, setYMax] = useState(0);
    const [conversionSteps, setConversionSteps] = useState([]);
    const [equityStacks, setEquityStacks] = useState([]);
    const [csStacks, setCsStacks] = useState([]);

    useEffect(() => {
        if (seriesValue.length >= 2) {
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
        }
    }, [seriesValue]);

    // const seriesArray = []

    // if (seriesValue.length <2) {
    //     return (
    //         <CardList
    //             initialValue={seriesValue}
    //             onChange={(newValue) => {
    //             console.log('onChange', newValue); setSeriesValue([...newValue])}}>
    //
    //         </CardList>
    //     )
    // }
    //
    //
    // seriesValue.forEach((item) => {
    //     const {id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv} = item;
    //     addSeries(seriesArray, id, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv)
    // })

    // addSeries(seriesArray, "Founders", 5, 0,0,0 );
    // addSeries(seriesArray, "Series A", 0, 5,5,0 );
    // addSeries(seriesArray, "Series B", 0, 5,20,0 );
    // addSeries(seriesArray, "Series C", 5, 0,0,15 );
    // addSeries(seriesArray, "Series D", 0, 5,30,0 );
    // addSeries(seriesArray, "Series E", 5, 0,0,15 );

    // const {lines, equityStacks, csStacks, conversionSteps, processedSeriesArray} = analyze(seriesArray);
    //
    // const xs = []
    // const ys = []
    // const datasets = []
    // const subtitleTexts = []
    // lines.forEach((line, i) => {
    //     const [x, y] = line.plotPointsWithTail();
    //     xs.push(x)
    //     ys.push(y)
    //     datasets.push(
    //         {
    //             label: i,
    //             data: y,
    //             borderColor: ChartJSUtils.namedColor(i),
    //             backgroundColor: ChartJSUtils.transparentize(ChartJSUtils.namedColor(i), 0.9),
    //             borderWidth: 1,
    //             fill: 'origin',
    //             tension: 0,
    //             yAxisID: "y",
    //         }
    //     )
    //     subtitleTexts.push(processedSeriesArray[i].seriesName + ": Partial Valuation = " + callOptionsText(segmentedLineToOption(line)))
    // })
    //
    // const x = xs[0]
    // const yMax = Math.max(...(ys.flat()))

    // const [x5, y5, k5] = lines[1].plotPoints()
    // const pvGpvLpv5 = new PvGpvLpv(new LimitedPartnership(undefined, 20/100., 25/100.), 5, x5, y5, k5)

    return (
        <>
            <Space direction="vertical">
                <CardList
                    initialValue={seriesValue}
                    onChange={(newValue) => {
                        console.log('onChange', newValue);
                        setSeriesValue([...newValue]);
                    }}
                ></CardList>

                {seriesValue && seriesValue.length > 0 && (
                    <Card title="The Conversions of Convertible Preferred Shares">
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
                {/* {seriesValue && seriesValue.length > 0 && (
                    <ExpirationPayoffDiagramPvGpvLpv
                        pvGpvLpv={pvGpvLpv5}
                    />
                )} */}
            </Space>
        </>
    )
}