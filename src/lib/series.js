const example = [
    {
        seriesName: 'Founders',
        cs: 5, // CS Shares
        cpConvertibleCs: 0, // CP Shares
        cpRedeemableValue: 0, // CP Value
        rpRv: 0, // RP Redemption Value
        rvps: null, // Redeemable Value Per Share
        cpConversionOrder: null, // Conversion Order starting from 1
        cpConversionFirmValue: null,
    }
]

function addSeries(seriesArray, seriesName, cs, cpConvertibleCs, cpRedeemableValue, rpRv){
    seriesArray.push({seriesName, cs, cpConvertibleCs, cpRedeemableValue, rpRv, rvps: null, cpConversionOrder: null})
}

function seriesHasCP(series){
    return series.cpRedeemableValue > 0 && series.cpConvertibleCs > 0;
}

/*
* Set Redeemable Value Per Share
*/
function setRvps(seriesArray){
    seriesArray.forEach(series => {
        if (seriesHasCP(series)){
            series.rvps = series.cpRedeemableValue / series.cpConvertibleCs
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
    let csSum = 0;
    shareholders.forEach(shareholder => {
        csSum += shareholder.cs + shareholder.cpCs;
    })
    return csSum;
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
            let cpRv = series.cpRedeemableValue;

            // when CP converts
            if (seriesHasCP(series) && (i >= series.cpConversionOrder)){
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
            shareholder.csPercentage = (shareholder.cs + shareholder.cpCs) / csSum;
            shareholder.cpCsPercentage = shareholder.cpCs / csSum;
        })
        scenarios.push(scenario)
    }

    return scenarios;
}


function setCpConversionFirmValues(conversionScenarios){
    conversionScenarios.forEach((scenario, index) => {
        if (index > 0){
            // Use the find() method to locate the first series with the specified conversion order.
            const shareholder = scenario.find(shareholder => shareholder.series.cpConversionOrder === index);
            shareholder.series.cpConversionFirmValue = shareholder.series.cpRedeemableValue / shareholder.cpCsPercentage + getRvTotal(scenario)
        }
    })
}

export function test(){
    const seriesArray = []

    addSeries(seriesArray, "Founders", 5, 0,0,0 );
    addSeries(seriesArray, "A", 0, 5,5,0 );
    addSeries(seriesArray, "B", 0, 5,20,0 );
    addSeries(seriesArray, "C", 5, 0,0,15 );
    addSeries(seriesArray, "D", 0, 5,30,0 );
    addSeries(seriesArray, "E", 5, 0,0,15 );

    setRvps(seriesArray);
    assignCpConversionOrder(seriesArray);
    const scenarios = getConversionScenarios(seriesArray);
    setCpConversionFirmValues(scenarios)

    console.log("Series", seriesArray)
    console.log("Conversion Scenarios", scenarios);
}
