const example = [
    {
        seriesName: 'Founders',
        css: 5, // CS Shares
        cps: 0, // CP Shares
        cpv: 0, // CP Value
        rpv: 0, // RP Value
        rvps: null, // Redeemable Value Per Share
        conversionOrder: null, // Conversion Order starting from 0
    }
]

const seriesArray = []


function addSeries(seriesArray, seriesName, css, cps, cpv, rpv){
    seriesArray.push({seriesName, css, cps, cpv, rpv, rvps: null, conversionOrder: null})
}

/*
* Set Redeemable Value Per Share
*/
function setRvps(seriesArray){
    seriesArray.forEach(series => {
        if (series.cpv > 0 && series.cps > 0){
            series.rvps = series.cpv / series.cps
        } else {
            series.rvps = null // Set to null if not applicable
        }
    })
}

/*
* Assign Conversion Order based on RVPS
* Adds a 'conversionOrder' property to each series.
*/
function assignConversionOrder(seriesArray){
    // Create a temporary array for sorting and determining order
    const sortable = seriesArray
        .map((series, index) => ({index, rvps: series.rvps}))
        .filter(series => series.rvps > 0)

    // Sort by RVPS
    sortable.sort((a, b) => a.rvps - b.rvps)


    // Assign conversion order starting from 0
    sortable.forEach((item, order) => {
        seriesArray[item.index].conversionOrder = order;
    })

    // Assign null conversion order to series with no CP to indicate they don't convert
    seriesArray.forEach((series) => {
        if (!(series.cpv > 0 && series.cps > 0)){
            series.conversionOrder = null;
        }
    })
}

