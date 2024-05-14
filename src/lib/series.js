import {SegmentedLine} from "./line/segmented-line";
import {SECURITY_TYPES} from "./constants";

const example = [
    {
        seriesId: 0,
        seriesName: 'Founders',
        cs: 5, // CS Shares
        cpConvertibleCs: 0, // CP Shares
        cpOptionalValue: 0, // CP Value
        rpRv: 0, // RP Redemption Value
        rvps: null, // Redeemable Value Per Share
        cpConversionOrder: null, // Conversion Order starting from 1
        cpConversionFirmValue: null,
    }
]

/*
* RedeemableValue - theoretical value the shareholder has the option to redeem
* RedemptionValue - theoretical value if the shareholder redeems
* RedeemedValue - actual value if the shareholder redeems depending on the firm value
* */

export function addSeries(seriesArray, seriesId, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv){
    seriesArray.push({seriesId, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv, rvps: null, cpConversionOrder: null})
}

export function seriesHasCP(series){
    return series.cpOptionalValue > 0 && series.cpConvertibleCs > 0;
}

function shouldCpConvertToCs(firmValue, cpConversionFirmValue){
    return firmValue > cpConversionFirmValue;
}

/*
* Set Redeemable Value Per Share
*/
function setRvps(seriesArray){
    seriesArray.forEach(series => {
        if (seriesHasCP(series)){
            series.rvps = series.cpOptionalValue / series.cpConvertibleCs
        } else {
            series.rvps = null // Set to null if not applicable
        }
    })
}

/*
* Assign Conversion Order based on RVPS
* Adds a 'cpConversionOrder' property to each series.
*/
function assignCpConversionOrder(seriesArray){
    // Create a temporary array for sorting and determining order
    const sortable = seriesArray
        .map((series, index) => ({index, rvps: series.rvps}))
        .filter(item => item.rvps > 0)

    // Sort by RVPS
    sortable.sort((a, b) => a.rvps - b.rvps)


    // Assign conversion order starting from 1
    sortable.forEach((item, order) => {
        seriesArray[item.index].cpConversionOrder = order + 1;
    })

    // Assign null conversion order to series with no CP to indicate they don't convert
    seriesArray.forEach((series) => {
        if (!seriesHasCP(series)){
            series.cpConversionOrder = null;
        }
    })
}

/**
 * get the count of CP Shareholders
 */
function getCPCount(seriesArray){
    let count = 0
    seriesArray.forEach(series => {
        if (seriesHasCP(series)){
            count++;
        }
    })

    return count;
}

function getCsTotal(shareholders){

    // Validate input is an array
    if (!Array.isArray(shareholders)) {
        throw new TypeError("Expected an array");
    }

    // Use reduce to sum up cs and cpCs, initializing sum as 0
    return shareholders.reduce((acc, shareholder) => {
        // Safely handle undefined or missing properties with fallback to 0
        const cs = shareholder.cs || 0;
        const cpCs = shareholder.cpCs || 0;

        // Accumulate the sums
        return acc + cs + cpCs;
    }, 0);
}

function getRvTotal(shareholders){
    let rvSum = 0;
    shareholders.forEach(shareholder => {
        rvSum += shareholder.rpRv + shareholder.cpRv;
    })
    return rvSum;
}

/*
* When the firm value grows, the conversions of Convertible Preferred Shares will be triggered.
* Each CP holder has different conversion condition. I call the firm value at conversion a conversion point.
* When there are three CP holders, there will be three conversion points.
* Then there will be four shareholder table scenarios.
* The first one is before anyone converts.
* The second one is after the first CP converts.
* The third one is after the second CP converts.
* The fourth one is after the third CP converts.
* */
function getConversionScenarios(seriesArray){

    const cpCount = getCPCount(seriesArray);
    const scenarios = []

    for (let i = 0; i <= cpCount; i++){
        const scenario = []
        seriesArray.forEach(series => {
            // when CP doesn't convert
            let cpCs = 0;
            let cpRv = series.cpOptionalValue;


            // when CP converts
            if (seriesHasCP(series) && (i >= series.cpConversionOrder)){ //*******************************************>=???
                cpCs = series.cpConvertibleCs;
                cpRv = 0;
            }

            const shareholder = {
                cs: series.cs,
                cpCs,
                rpRv: series.rpRv,
                cpRv,
                series,
            }

            scenario.push(shareholder)
        })

        // add CS Percentage
        const csSum = getCsTotal(scenario);
        scenario.forEach(shareholder => {
            shareholder.csPercentage = shareholder.cs / csSum;
            shareholder.cpCsPercentage = shareholder.cpCs / csSum;
            shareholder.csPercentageTotal = (shareholder.cs + shareholder.cpCs) / csSum;

        })
        scenarios.push(scenario)
    }

    return scenarios;
}

class ShareholderPosition{
    constructor(firmValue, cs, cpCs, rpRv, cpRv){
        this.firmValue = firmValue;
        this.cs = cs;
        this.cpCs = cpCs;
        this.rpRv = rpRv;
        this.cpRv = cpRv;
        this.cpPercentage = null;
        this.cpCsPercetage = null;
        this.cpRedeemedValue = null;
        this.rpRedeemedValue = null;
        this.csPercentage = null;
        this.cpCsPercentage = null;

    }
}

function setCpConversionFirmValues(conversionScenarios){
    conversionScenarios.forEach((scenario, index) => {
        if (index > 0){
            // Use the find() method to locate the first series with the specified conversion order.
            const shareholder = scenario.find(shareholder => shareholder.series.cpConversionOrder === index);
            shareholder.series.cpConversionFirmValue = shareholder.series.cpOptionalValue / shareholder.cpCsPercentage + getRvTotal(scenario)
        }
    })
}


function setRvpsAndConversions(seriesArray){
    setRvps(seriesArray);
    assignCpConversionOrder(seriesArray);
    const conversionScenarios = getConversionScenarios(seriesArray);
    setCpConversionFirmValues(conversionScenarios)
}

/**
 * KeyFirmValues includes
 * (1) values for RP, CP redemptions
 * (2) CP conversions
 */
function getKeyFirmValues(seriesArray, tailScale=1.1){
    const firmValues = [0]

    // (1) Before CP conversions, find RP and CP values
    // redemption in a reverse order
    for (let i = seriesArray.length - 1; i >= 0; i--) {
        const series = seriesArray[i];
        // Put all the RP, CP in an array
        const numbers = []
        if (series.rpRv > 0){
            numbers.push(series.rpRv)
        }
        if (series.cpOptionalValue > 0){
            numbers.push(series.cpOptionalValue)
        }
        // sort the array
        numbers.sort((a, b) => (a - b))
        // push the array items into the firm values
        numbers.forEach((value) => {
            firmValues.push(value + firmValues[firmValues.length - 1]);
        })
    }

    // (2) During conversions, find conversion conditions
    const conversionFirmValues = []
    seriesArray.forEach((series) => {
        if (series.cpConvertibleCs > 0 && series.cpConversionFirmValue > 0){
            conversionFirmValues.push(series.cpConversionFirmValue)
        }
    })
    conversionFirmValues.sort((a,b) => (a-b))
    conversionFirmValues.forEach((value) => {
        firmValues.push(value);
    })

    firmValues.push(firmValues[firmValues.length - 1]*tailScale);

    return firmValues;
}

function getSnapshotAtFirmValue(firmValue, seriesArray){

    const snapshot = []
    seriesArray.forEach((series) => {
        snapshot.push({
            firmValue,
            value: 0, // important

            series,
            rpRedeemedValue: 0,
            cpRedeemedValue: 0,
            csValue: 0,
            cs: 0,
            cpCs: 0,
            rpRv: 0,
            cpRv: 0,
            csPercentage: 0,
            cpCsPercentage: 0,
            csPercentageTotal: 0, // important
        })
    })

    for (let i = seriesArray.length - 1; i >= 0; i--) {
        const series = seriesArray[i];
        // when CP doesn't convert
        let cpCs = 0;
        let cpRv = series.cpOptionalValue;

        // when CP converts
        if (seriesHasCP(series) && shouldCpConvertToCs(firmValue, series.cpConversionFirmValue)){
            cpCs = series.cpConvertibleCs;
            cpRv = 0;
        }

        snapshot[i].cs = series.cs;
        snapshot[i].cpCs = cpCs;
        snapshot[i].rpRv = series.rpRv;
        snapshot[i].cpRv = cpRv;
    }

    // add CS Percentage
    const csSum = getCsTotal(snapshot);
    for (let i = seriesArray.length - 1; i >= 0; i--) {
        snapshot[i].csPercentage = snapshot[i].cs / csSum;
        snapshot[i].cpCsPercentage = snapshot[i].cpCs / csSum;
        snapshot[i].csPercentageTotal = (snapshot[i].cs + snapshot[i].cpCs) / csSum;
    }

    let firmResidualValue = firmValue;

    // (1) Redeem RP and CP first
    // redemption in a reverse order
    for (let i = seriesArray.length - 1; i >= 0 && firmResidualValue > 0; i--) {

        // RP
        if (snapshot[i].rpRv > 0){
            snapshot[i].rpRedeemedValue = Math.max(Math.min(snapshot[i].rpRv, firmResidualValue), 0);
            firmResidualValue -= snapshot[i].rpRedeemedValue;
            if (firmResidualValue <= 0){
                break;
            }
        }

        // CP
        if (snapshot[i].cpRv > 0){
            snapshot[i].cpRedeemedValue = Math.max(Math.min(snapshot[i].cpRv, firmResidualValue), 0);
            firmResidualValue -= snapshot[i].cpRedeemedValue;
            if (firmResidualValue <= 0){
                break;
            }
        }
    }

    // (2) CP, CS
    // add csValue
    snapshot.forEach((item) => {
        item.csValue = firmResidualValue <= 0 ? 0 : item.csPercentageTotal * firmResidualValue;
        item.value = item.csValue + item.rpRedeemedValue + item.cpRedeemedValue;
    })

    return snapshot;
}

function getSnapshotsAtFirmValues(firmValues, seriesArray) {
    const snapshots = [];
    firmValues.forEach((firmValue) => {
        snapshots.push(getSnapshotAtFirmValue(firmValue, seriesArray))
    })

    return snapshots;
}

function organizeSnapshotsBySeries(snapshotsAtFirmValues, seriesArray){
    const ss = []
    seriesArray.forEach((series, i) => {
        ss.push([]);
        snapshotsAtFirmValues.forEach((scenario) => {
            ss[i].push(scenario[i])
        })
    })
    return ss;
}

function snapshotsToSegmentedLines(snapshotsBySeries){
    const x = []
    const ys = []
    const ks= []
    const lines = []

    // find the common x - the firm values
    if (snapshotsBySeries.length > 0){
        snapshotsBySeries[0].forEach((snapshot) => {
            x.push(snapshot.firmValue)
        })
    }

    // find the y, and k - the payoffs and slopes
    snapshotsBySeries.forEach((snapshots, seriesId) => {
        const y = []
        const k = []
        snapshots.forEach((snapshot, i) => {
            y.push(snapshot.value)
            if (i > 0){
                k.push((y[i] - y[i-1]) / (x[i] - x[i-1]))
            }
        })
        ys.push(y)
        ks.push(k)
    })

    // The last x and y is a tail
    // The purpose of tail is to compute the slope, so it can be converted to a segmented line
    x.pop()
    ys.forEach((y) => {
        y.pop()
    })

    ys.forEach((y, i) => {
        lines.push(SegmentedLine.of(x, y, ks[i]))
    })

    return lines;
}


export function getSegmentedLinesFromSeriesArray(seriesArray){
    setRvpsAndConversions(seriesArray);
    const firmValues = getKeyFirmValues(seriesArray)
    const scenariosAtKeyFirmValues = getSnapshotsAtFirmValues(firmValues, seriesArray)
    const scenariosBySeries = organizeSnapshotsBySeries(scenariosAtKeyFirmValues, seriesArray);
    const lines = snapshotsToSegmentedLines(scenariosBySeries)

    return {lines, seriesArray}
}

export function getSeriesArray(seriesArray){
    setRvpsAndConversions(seriesArray)
    return seriesArray;
}

export function getEquityStack(conversionScenario){
    const equityStack = [];

    // (1) RP and CP_RV, sorted by Series Index
    for (let i=conversionScenario.length - 1; i >= 0; i--){
        const shareholder = conversionScenario[i];
        if (shareholder.rpRv > 0){
            equityStack.push({
                type: SECURITY_TYPES.RP.code,
                value: shareholder.rpRv,
                seriesName: shareholder.series.seriesName,
            })
        }

        if (shareholder.cpRv > 0){
            equityStack.push({
                type: SECURITY_TYPES.CP_RV.code,
                value: shareholder.cpRv,
                seriesName: shareholder.series.seriesName,
            })
        }
    }

    // (2) CS and CP_CS, sorted by Series Index
    for (let i=conversionScenario.length - 1; i >= 0; i--){
        const shareholder = conversionScenario[i];
        if (shareholder.cpCs > 0){
            equityStack.push({
                type: SECURITY_TYPES.CP_CS.code,
                value: shareholder.cpCs,
                seriesName: shareholder.series.seriesName,
            })
        }

        if (shareholder.cs > 0){
            equityStack.push({
                type: SECURITY_TYPES.CS.code,
                value: shareholder.cs,
                seriesName: shareholder.series.seriesName,
            })
        }
    }

    return equityStack;
}

export function getEquityStacks(conversionScenarios){
    const equityStacks = [];
    conversionScenarios.forEach((scenario) => {
        equityStacks.push(getEquityStack(scenario));
    })
    return equityStacks
}

export function getCsStacks(equityStacks){
    const csStacks = [];
    equityStacks.forEach((equityStack) => {
        const csStack = []
        equityStack.forEach((equity) => {
            if (equity.type === SECURITY_TYPES.CS.code || equity.type === SECURITY_TYPES.CP_CS.code){
                csStack.push({...equity})
            }
        })
        csStacks.push(csStack);
    })
    return csStacks;
}

export function getConversionSteps(seriesArray){
    const steps = []
    for (let i = 0; i < seriesArray.length; i++) {
        seriesArray.forEach((series) => {
            if (series.cpConversionOrder === i+1){
                steps.push({
                    firmValue: series.cpConversionFirmValue,
                    seriesName: series.seriesName,
                })
            }
        })
    }

    return steps;
}

export function analyze(seriesArray){
    setRvps(seriesArray);
    assignCpConversionOrder(seriesArray);
    const conversionScenarios = getConversionScenarios(seriesArray);
    setCpConversionFirmValues(conversionScenarios);

    const firmValues = getKeyFirmValues(seriesArray)
    const scenariosAtKeyFirmValues = getSnapshotsAtFirmValues(firmValues, seriesArray)
    const scenariosBySeries = organizeSnapshotsBySeries(scenariosAtKeyFirmValues, seriesArray);
    const lines = snapshotsToSegmentedLines(scenariosBySeries)

    const equityStacks = getEquityStacks(conversionScenarios)
    const csStacks = getCsStacks(equityStacks);
    const conversionSteps = getConversionSteps(seriesArray)

    return {lines, equityStacks, csStacks, conversionSteps, processedSeriesArray: seriesArray}
}


export function test(){
    const seriesArray = []

    addSeries(seriesArray, 0,"Founders", 5, 0,0,0 );
    addSeries(seriesArray, 1,"Series A", 0, 5,5,0 );
    addSeries(seriesArray, 2,"Series B", 0, 5,20,0 );
    addSeries(seriesArray, 3,"Series C", 5, 0,0,15 );
    addSeries(seriesArray, 4,"Series D", 0, 5,30,0 );
    addSeries(seriesArray, 5,"Series E", 5, 0,0,15 );

    setRvps(seriesArray);
    assignCpConversionOrder(seriesArray);
    const conversionScenarios = getConversionScenarios(seriesArray);
    setCpConversionFirmValues(conversionScenarios)

    const firmValues = getKeyFirmValues(seriesArray)

    const scenariosAtKeyFirmValues = getSnapshotsAtFirmValues(firmValues, seriesArray)

    const scenariosBySeries = organizeSnapshotsBySeries(scenariosAtKeyFirmValues, seriesArray);

    const lines = snapshotsToSegmentedLines(scenariosBySeries)

    const equityStacks = getEquityStacks(conversionScenarios)
    const csStacks = getCsStacks(equityStacks);
    const conversionSteps = getConversionSteps(seriesArray)
    console.log(conversionSteps)

    return {equityStacks, csStacks, conversionSteps}
}
