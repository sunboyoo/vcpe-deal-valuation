import {SegmentedLine} from "./line/segmented-line";
import {readUsedSize} from "chart.js/helpers";

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
        xyk: [
            {},
        ]
    }
]

/*
* RedeemableValue - theoretical value the shareholder has the option to redeem
* RedemptionValue - theoretical value if the shareholder redeems
* RedeemedValue - actual value if the shareholder redeems depending on the firm value
* */

function addSeries(seriesArray, seriesId, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv){
    seriesArray.push({seriesId, seriesName, cs, cpConvertibleCs, cpOptionalValue, rpRv, rvps: null, cpConversionOrder: null})
}

function seriesHasCP(series){
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

/**
 * KeyFirmValues includes
 * (1) values for RP, CP redemptions
 * (2) CP conversions
 */
function getKeyFirmValues(seriesArray){
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

    return firmValues;
}

function getScenarioAtKeyFirmValue(firmValue, seriesArray, conversionScenarios){

    const scenario = []
    seriesArray.forEach((series) => {
        scenario.push({
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

        scenario[i].cs = series.cs;
        scenario[i].cpCs = cpCs;
        scenario[i].rpRv = series.rpRv;
        scenario[i].cpRv = cpRv;
    }

    // add CS Percentage
    const csSum = getCsTotal(scenario);
    for (let i = seriesArray.length - 1; i >= 0; i--) {
        scenario[i].csPercentage = scenario[i].cs / csSum;
        scenario[i].cpCsPercentage = scenario[i].cpCs / csSum;
        scenario[i].csPercentageTotal = (scenario[i].cs + scenario[i].cpCs) / csSum;
    }

    let firmResidualValue = firmValue;

    // (1) Redeem RP and CP first
    // redemption in a reverse order
    for (let i = seriesArray.length - 1; i >= 0 && firmResidualValue > 0; i--) {

        // RP
        if (scenario[i].rpRv > 0){
            scenario[i].rpRedeemedValue = Math.max(Math.min(scenario[i].rpRv, firmResidualValue), 0);
            firmResidualValue -= scenario[i].rpRedeemedValue;
            if (firmResidualValue <= 0){
                break;
            }
        }

        // CP
        if (scenario[i].cpRv > 0){
            scenario[i].cpRedeemedValue = Math.max(Math.min(scenario[i].cpRv, firmResidualValue), 0);
            firmResidualValue -= scenario[i].cpRedeemedValue;
            if (firmResidualValue <= 0){
                break;
            }
        }
    }

    // (2) CP, CS
    // add csValue
    scenario.forEach((item) => {
        item.csValue = firmResidualValue <= 0 ? 0 : item.csPercentageTotal * firmResidualValue;
        item.value = item.csValue + item.rpRedeemedValue + item.cpRedeemedValue;
    })

    return scenario;
}

function getScenariosAtKeyFirmValues(firmValues, seriesArray, conversionScenarios) {
    const scenarios = [];
    firmValues.forEach((firmValue) => {
        scenarios.push(getScenarioAtKeyFirmValue(firmValue, seriesArray, conversionScenarios))
    })

    return scenarios;
}

function getScenariosBySeries(scenarios, seriesArray){
    const ss = []
    seriesArray.forEach((series, i) => {
        ss.push([]);
        scenarios.forEach((scenario) => {
            ss[i].push(scenario[i])
        })
    })
    return ss;
}


export function test(){
    const seriesArray = []

    addSeries(seriesArray, 0,"Founders", 5, 0,0,0 );
    addSeries(seriesArray, 1,"A", 0, 5,5,0 );
    addSeries(seriesArray, 2,"B", 0, 5,20,0 );
    addSeries(seriesArray, 3,"C", 5, 0,0,15 );
    addSeries(seriesArray, 4,"D", 0, 5,30,0 );
    addSeries(seriesArray, 5,"E", 5, 0,0,15 );

    setRvps(seriesArray);
    assignCpConversionOrder(seriesArray);
    const conversionScenarios = getConversionScenarios(seriesArray);
    setCpConversionFirmValues(conversionScenarios)

    console.log("Series", seriesArray)
    console.log("Conversion Scenarios", conversionScenarios);

    const firmValues = getKeyFirmValues(seriesArray)
    console.log("FirmValues", firmValues)

    const scenariosAtKeyFirmValues = getScenariosAtKeyFirmValues(firmValues, seriesArray, conversionScenarios)
    console.log("scenariosAtKeyFirmValues", scenariosAtKeyFirmValues)

    const scenariosBySeries = getScenariosBySeries(scenariosAtKeyFirmValues, seriesArray);
    console.log("scenariosBySeries", scenariosBySeries);

    const e = scenariosBySeries[5];
    const x = []
    const y0 = []
    const y1 = []
    const y2 = []
    const y3 = []
    const y4 = []
    const y5 = []
    const k = []
    scenariosBySeries[0].forEach((item) =>{
        x.push(item.firmValue)
        y0.push(item.value)
        k.push(item.csPercentageTotal)
    })

    scenariosBySeries[1].forEach((item) =>{
        y1.push(item.value)
    })

    scenariosBySeries[2].forEach((item) =>{
        y2.push(item.value)
    })
    scenariosBySeries[3].forEach((item) =>{
        y3.push(item.value)
    })
    scenariosBySeries[4].forEach((item) =>{
        y4.push(item.value)
    })
    scenariosBySeries[5].forEach((item) =>{
        y5.push(item.value)
    })

    console.log(x,y5,k)

    return {x, y: {y0, y1, y2, y3, y4, y5}}
    // return SegmentedLine.of(x, y, k)
}
